import jwt from "jsonwebtoken";
import {IAdministratorRepository, AdministratorRepository,IAdministratorOptional, IAdministrator} from "../infrastructure/sqlite/repository/administrator.repository";
import { JWT_SECRET, SMTP_SETTINGS_1, createToken, sendMail, updateObject } from "../utils/helpers";
import moment from 'moment';
import fs from 'fs';
// const moment = require('moment');

import crypto from "crypto";
import Identity from '../utils/Identity';

export interface IMessge{
    status:boolean;
    data?:any;
    message?:string;
}
export default class AdministratorService {
    private repo: IAdministratorRepository;

    constructor(){
        this.repo = new AdministratorRepository();
    }

    
    async createAdministrator(administrator: IAdministratorOptional): Promise<IMessge>{
        try{
            // Verify if email already exists
            let administrators = await this.repo.findByVal({email:administrator.email})
            if(administrators.length > 0){
                return {'status':false,data:{'message':'Email already exists'}}
            }
            // Verify if phone already exists
            administrators = await this.repo.findByVal({phone:administrator.phone})
            if(administrators.length > 0){
                return {'status':false,data:{'message':'Phone number already exists'}}
            }


            const id = new Identity()
            administrator.password = crypto.createHash('md5').update(administrator.password+"").digest('hex');
            const timestamp = Math.floor(moment().valueOf()/1000)
            administrator.status = 1
            administrator.last_seen = new Date()
            
            const createdAdministrator = await this.repo.create(administrator)
            if(createdAdministrator){
                const token = createToken("auth",{administratorID: createdAdministrator.id, role: "administrator"})
                const dayToken = createToken("dayToken",{timestamp, token: id.generateID(5,"alpha")+timestamp})
                return {'status':true,data:{'message':'Administrator created successfully','administrator':administrator,'token':token,dayToken}}             
            }
            else{
                return {'status':false,data:{'message':'Administrator creation failed'}}
            }
        }
        catch(err:any){
            throw new Error(err)
        }
    }

    async resetPassword(administratorIdentifier: string): Promise<IMessge>{
        try{
            const administrators = await this.repo.findByVal({email:administratorIdentifier})
            if(administrators.length !== 1){
                return {'status':false,data:{'message':'Administrator not found'}}
            }
            const administrator = administrators[0]
            const id = new Identity()
            // const timestamp = Math.floor(moment().valueOf()/1000)
            const password = id.generateID(10,"mix")
            const hashedPassword = crypto.createHash('md5').update(password).digest('hex');

            const update  = await this.repo.update({password:hashedPassword},{id:administrator.id})
            if(update){
                const message = `Dear ${administrator.first_name}, <br/><br/> Your password has been reset to ${password}.<br/>Thanks`
                let contents = fs.readFileSync('./app/data/mail.html').toString()
                // let contents = fs.readFileSync('../data/mail.html').toString()
                contents = contents.replace(/==mail-title==/gi,"Password Reset")
                const html = contents.replace(/==mail-body==/gi,message)
                sendMail({settings:SMTP_SETTINGS_1,subject:`SignedIn: Password Reset`,html,to:administrator.email,callback:function(error, info){
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



    async administratorLogin(Identifier: string,password:string): Promise<IMessge>{
        try{
            password = crypto.createHash('md5').update(password).digest('hex');
            let administrators = await this.repo.findByVal({email:Identifier, password})
            if(administrators.length < 1){
                administrators = await this.repo.findByVal({phone:Identifier, password})
            }

            if(administrators.length == 1){
                const administrator =  administrators[0]
                const timestamp = Math.floor(moment().valueOf()/1000)
                const id = new Identity()
                const token = createToken("auth",{administratorID: administrator.id, role: "administrator"})
                const dayToken = createToken("dayToken",{timestamp, token: id.generateID(5,"alpha")+timestamp})
                return {'status':true,data:{'message':'Administrator signed in successfully','administrator':administrator,'token':token,dayToken}}
            }
            else{  
                return {'status':false,data:{'message':'Invalid login details'}}
            }
        }
        catch(err:any){
            throw new Error(err)
        }
    }
    

    async changePassword(data:any): Promise<IMessge>{
        try{
            let {confirm_password:confirmPassword,password,old_password:oldPassword} = data
            const id = data.id
            password = crypto.createHash('md5').update(password).digest('hex');
            confirmPassword = crypto.createHash('md5').update(confirmPassword).digest('hex');
            oldPassword = crypto.createHash('md5').update(oldPassword).digest('hex');
            if(password === confirmPassword){
                const administrator = await this.repo.findByVal({id, password:oldPassword})
                if(administrator.length === 1){
                    const administrator0 = administrator[0]
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
                return {'status':false,data:{'message':'Password mismatch'}}
            }
        }
        catch(err:any){
            throw new Error(err)
        }
    }
    
    async updateProfile(id:number,update:IAdministratorOptional): Promise<IMessge>{
        try{
            //Verify if email exists
            let administrator = await this.repo.findByVal({email:update.email})
            if(administrator.length > 0 && administrator[0].id != id){
                return {'status':false,data:{'message':'Email already exists'}}
            }
            // Check if phone exists
            if(update.phone){
                administrator = await this.repo.findByVal({phone:update.phone})
                if(administrator.length > 0 && administrator[0].id != id){
                    return {'status':false,data:{'message':'Phone already exists'}}
                }
            }
            const administratorDetail = await this.administratorDetails({id})
            const updatedAdministrator = updateObject(administratorDetail,update)
            delete updatedAdministrator.data
            delete updatedAdministrator.third_party
            const updateAdministrator = await this.repo.update(updatedAdministrator,{id})
            if(updateAdministrator){
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

    async administratorDetails(val:IAdministratorOptional): Promise<IAdministrator>{
        try{
            const administrators = await this.repo.findByVal(val)
            if (administrators.length == 1) {
                return administrators[0]
            }
            else{
                throw new Error("Administrator not found or administrator exists more than once")
            }
        }
        catch(err:any){
            throw new Error(err)
        }
    }

}