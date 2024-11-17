import {IStaffRepository, StaffRepository, IStaff} from "../infrastructure/mysql/repository/staff.repository";
import { SMTP_SETTINGS_1, createToken, sendMail, updateObject } from "../utils/helpers";
import fs from 'fs';
import bcrypt from 'bcrypt';
import moment from 'moment';
import crypto from "crypto";
import Identity from '../utils/Identity';

export interface IMessge{
    status:boolean;
    data?:any;
    message?:string;
}
export default class StaffService {
    private repo: IStaffRepository;

    private staffUIDFormat = {static:2,number:2,alphabet:1,isNew:true,isRandom:true,staticVal:'_alpha_',prevID:''};

    constructor(){
        this.repo = new StaffRepository();
    }

    
    async createStaff(staff: IStaff): Promise<IMessge>{
        try{
            //Verify if staff exists
            let staffs = await this.repo.findByVal({email:staff.email})
            if(staffs.length > 0){
                return {'status':false,data:{'message':'Email already exists'}}
            }
            // Check if phone exists
            if(staff.phone){
                staffs = await this.repo.findByVal({phone:staff.phone})
                if(staffs.length > 0){
                    return {'status':false,data:{'message':'Phone already exists'}}
                }
            }

            const id = new Identity()
            // staff.password = crypto.createHash('md5').update(staff.password+"").digest('hex');
            const salt = await bcrypt.genSalt();
            staff.password = await bcrypt.hash(staff.password,salt);
            // let newUID = false
            // // Recursively generate a new uid if the uid already exists
            // while(!newUID){
            //     const uid  = id.get(this.staffUIDFormat)
            //     const staffs = await this.repo.findByVal({uid})
            //     if(staffs.length == 0){
            //         staff.uid = uid
            //         newUID = true
            //     }
            // }
            const timestamp = Math.floor(moment().valueOf()/1000)
            staff.status = 1
            staff.data = {}
            staff.data.last_ip = ""
            staff.data.registered_at = ""
            staff.data.registered_on = timestamp
            staff.data.last_seen = timestamp
            staff.data.last_login = timestamp
            staff.data.last_login_device = ""
            
            const createdStaff = await this.repo.create(staff)
            if(createdStaff){
                const token = createToken("auth",{userID: createdStaff, role: "staff"})
                return {'status':true,data:{'message':'Staff created successfully','staff':staff,'token':token}}             
            }
            else{
                return {'status':false,data:{'message':'Staff creation failed'}}
            }
        }
        catch(err:any){
            throw new Error(err)
        }
    }


    async resetPassword(user: string): Promise<IMessge>{
        try{
            const staffs = await this.repo.findByVal({email:user})
            if(staffs.length !== 1){
                return {'status':false,data:{'message':'User not found'}}
            }
            const staff = staffs[0]
            const id = new Identity()
            const newPassword = id.generateID(10,"mix")
            // console.log({newPassword})
            // const password = crypto.createHash('md5').update(password).digest('hex');
            const salt = await bcrypt.genSalt();
            const password = await bcrypt.hash(newPassword,salt);

            const update  = await this.repo.update({password},{id:staff.id})
            if(update){
                const message = `Dear ${staff.first_name}, <br/><br/> Your password has been reset to: ${newPassword}<br/>Thanks`
                let contents = fs.readFileSync('./app/data/mail.html').toString()
                // let contents = fs.readFileSync('../data/mail.html').toString()
                contents = contents.replace(/==mail-title==/gi,"Password Reset")
                const html = contents.replace(/==mail-body==/gi,message)
                sendMail({settings:SMTP_SETTINGS_1,subject:`SignedIn: Password Reset`,html,to:staff.email,callback:function(error, info){
                    if (error) {
                        console.log({error});
                        return {'status':false,data:{'message':'Password reset successful but mail not sent'}}
                    }
                }})
                return {'status':true,data:{'message':'New password has been sent to your email address successfully'}}
            }
            else{
                return {'status':false,data:{'message':'Password reset failed'}}
            }
        }
        catch(err:any){
            throw new Error(err)
        }
    }
    
    async staffLogin(user: string,password:string): Promise<IMessge>{
        try{
            // password = crypto.createHash('md5').update(password).digest('hex');
            let staffs = await this.repo.findByVal({email:user})
            if(staffs.length < 1){
                staffs = await this.repo.findByVal({phone:user})
            }
            if(staffs.length == 1){
                const staff =  staffs[0]
                const auth = await bcrypt.compare(password,staff.password)
                if(auth){
                    const timestamp = Math.floor(moment().valueOf()/1000)
                    const id = new Identity()
                    const token = createToken("auth",{userID: staff.id, role: "staff"})
                    return {'status':true,data:{'message':'Staff logged in successfully','staff':staff,'token':token}} 
                }
                else{
                    return {'status':false,data:{'message':'Invalid login details'}}
                }
            }
            else{   
                return {'status':false,data:{'message':'Invalid login details'}}
            }
        }
        catch(err:any){
            throw new Error(err)
        }
    }
    

    async createStaffToken(staffs:IStaff[],userAgent:any): Promise<IMessge>{
        try{
            if(staffs.length == 0){
                return {'status':false,data:{'message':'Invalid login details'}}
            }
            else if(staffs.length == 1){
                const staff =  staffs[0]

                // const loginRepo = new LoginRepository(this.mysgwid)
                // const timestamp = Math.floor(moment().valueOf()/1000)
                // const loginID = await loginRepo.create({user_type:"staff",uid:staff.uid,...userAgent,timestamp,status:true})
                // const auth = {schoolID: this.mysgwid, userID: staff.id, role: "staff", loginID}
                // const token = createToken("auth",auth)
                // return {'status':true,'data':{token:token,"privileges": sortPrivileges(staff.privileges,token,true)}}
                return {'status':true,'data':{token:"token","privileges": "sortPrivileges(staff.privileges,token,true)"}}
            }
            else{
                throw new Error("Staff exists more than once")
            }
        }
        catch(err:any){
            throw new Error(err)
        }
    }

    async changePassword(data:any): Promise<IMessge>{
        try{
            let {id,confirm_password:confirmPassword,password,old_password:oldPassword} = data
            // password = crypto.createHash('md5').update(password).digest('hex');
            // confirmPassword = crypto.createHash('md5').update(confirmPassword).digest('hex');
            //Compare the hashed password and confirm password to verify if they are the same
            // oldPassword = crypto.createHash('md5').update(oldPassword).digest('hex');
            if(password === confirmPassword){
                const salt = await bcrypt.genSalt();
                password = await bcrypt.hash(password,salt);
                confirmPassword = bcrypt.hash(confirmPassword,salt);
                // const staffs = await this.repo.findByVal({id, password:oldPassword})
                const staffs = await this.repo.findByVal({id})
                if(staffs.length === 1){
                    const staff = staffs[0]
                    const auth = await bcrypt.compare(oldPassword,staff.password)
                    if(auth){
                        const update  = await this.repo.update({password},{id})
                        if(update){
                            return {'status':true,data:{'message':'Password changed successfully'}}
                        }
                        else{
                            return {'status':false,data:{'message':'Password change failed'}}
                        }
                    }
                    else{
                        return {'status':false,data:{'message':'Invalid old password'}}
                    }
                }
                else{
                    return {'status':false,data:{'message':'User not found'}}
                }
            }
            else{
                return {'status':false,data:{'message':'Password mismatch'}}
            }
        }
        catch(err:any){
            throw new Error(err)
        }
    }
    
    async updateProfile(id:number,update:IStaff): Promise<IMessge>{
        try{
            //Verify if email exists
            let staffs = await this.repo.findByVal({email:update.email})
            if(staffs.length > 0 && staffs[0].id != id){
                return {'status':false,data:{'message':'Email already exists'}}
            }
            // Check if phone exists
            if(update.phone){
                staffs = await this.repo.findByVal({phone:update.phone,c_code:update.c_code})
                if(staffs.length > 0 && staffs[0].id != id){
                    return {'status':false,data:{'message':'Phone already exists'}}
                }
            }
            const staff = await this.staffDetails({id})
            const updatedStaff = updateObject(staff,update)
            delete updatedStaff.data
            delete updatedStaff.third_party
            const updateStaff = await this.repo.update(updatedStaff,{id})
            if(updateStaff){
                return {'status':true,data:{'message':'Profile updated successfully'}}
            }
            else{
                return {'status':false,data:{'message':'Profile update failed'}}
            }
        }
        catch(err:any){
            throw new Error(err)
        }
    }

    // async uploadFile(uid:string,maxSize:number,folder:string,file:any,type:string): Promise<IMessge>{
    //     if(file){
    //         // check file size
    //         const fileSize = file.size
    //         if(fileSize > maxSize){
    //             return {status:false,message:"Photo size is too large, photo size should not be more than 1MB"}
    //         }
    //         else{
    //             const timestamp = Math.floor(moment().valueOf()/1000)
    //             // img_uid_timestamp = `img_${uid}_${timestamp}`
    //             // doc_uid_timestamp = `doc_${uid}_${timestamp}`
    //             let filename = `img_${uid}_${timestamp}`
    //             const fileExt = file.name.split(".").pop()
    //             filename = `${filename}.${fileExt}`
    //             const staff = await this.staffDetails({uid})
    //             const prevFile = staff.data[type]
    //             const isUploaded = uploadPhoto(filename,folder,file,prevFile)
    //             if(isUploaded.status){
    //                 staff.storage = staff.storage + fileSize - isUploaded.prevFileSize
    //                 staff.data[type] = filename
    //                 const update = await this.updateProfile(uid,staff)
    //                 if(update.status){
    //                     return {status:true,message:"Photo uploaded successfully"}
    //                 }
    //                 else{
    //                     return {status:false,message:"Photo upload failed"}
    //                 }
    //             }
    //             else{
    //                 return {status:false,message:"Photo upload failed"}
    //             }

    //         }
    //     }
    //     else{
    //         return {status:false,message:"No photo uploaded"}
    //     }
    // }

    async staffDetails(val:IStaff): Promise<IStaff>{
        try{
            const staffs = await this.repo.findByVal(val)
            if (staffs.length == 1) {
                let staff = staffs[0]
                staff.data = JSON.parse(staff.data)
                return staff
            }
            else{
                throw new Error("Staff not found or staff exists more than once")
            }
        }
        catch(err:any){
            throw new Error(err)
        } 
    }

    async staffList(): Promise<IStaff[]>{
        try{
            const staffs = await this.repo.findAll()
            return staffs
        }
        catch(err:any){
            throw new Error(err)
        }
    }
}
// class ClassService {
//     constructor(private id: number) { }

//     // getStaffs() {
//     //     return this.http.get('/api/staffs')
//     //         .map((response: Response) => response.json());
//     // }
    
// }