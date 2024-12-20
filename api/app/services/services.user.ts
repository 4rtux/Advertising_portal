import jwt from "jsonwebtoken";
import {IUserRepository, UserRepository,IUserOptional, IUser} from "../infrastructure/sqlite/repository/user.repository";
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
export default class UserService {
    private repo: IUserRepository;

    constructor(){
        this.repo = new UserRepository();
    }

    
    async createUser(user: IUserOptional): Promise<IMessge>{
        try{
            //Verify if username exists
            let users = await this.repo.findByVal({username:user.username})
            if(users.length > 0){
                return {'status':false,data:{'message':'Username already exists'}}
            }
            // Verify if email already exists
            users = await this.repo.findByVal({email:user.email})
            if(users.length > 0){
                return {'status':false,data:{'message':'Email already exists'}}
            }
            // Verify if phone already exists
            users = await this.repo.findByVal({phone:user.phone})
            if(users.length > 0){
                return {'status':false,data:{'message':'Phone number already exists'}}
            }


            const id = new Identity()
            user.password = crypto.createHash('md5').update(user.password+"").digest('hex');
            const timestamp = Math.floor(moment().valueOf()/1000)
            user.status = 1
            user.last_seen = new Date()
            
            const createdUser = await this.repo.create(user)
            if(createdUser){
                const token = createToken("auth",{userID: createdUser.id, role: "user"})
                const dayToken = createToken("dayToken",{timestamp, token: id.generateID(5,"alpha")+timestamp})
                return {'status':true,data:{'message':'User created successfully','user':user,'token':token,dayToken}}             
            }
            else{
                return {'status':false,data:{'message':'User creation failed'}}
            }
        }
        catch(err:any){
            throw new Error(err)
        }
    }

    async resetPassword(userIdentifier: string): Promise<IMessge>{
        try{
            let users = await this.repo.findByVal({username:userIdentifier})
            if(users.length < 1){
                users = await this.repo.findByVal({email:userIdentifier})
            }
            if(users.length !== 1){
                return {'status':false,data:{'message':'User not found'}}
            }
            const user = users[0]
            const id = new Identity()
            // const timestamp = Math.floor(moment().valueOf()/1000)
            const password = id.generateID(10,"mix")
            const hashedPassword = crypto.createHash('md5').update(password).digest('hex');

            const update  = await this.repo.update({password:hashedPassword},{id:user.id})
            if(update){
                const message = `Dear ${user.first_name}, <br/><br/> Your password has been reset to ${password}.<br/>Thanks`
                let contents = fs.readFileSync('./app/data/mail.html').toString()
                // let contents = fs.readFileSync('../data/mail.html').toString()
                contents = contents.replace(/==mail-title==/gi,"Password Reset")
                const html = contents.replace(/==mail-body==/gi,message)
                sendMail({settings:SMTP_SETTINGS_1,subject:`SignedIn: Password Reset`,html,to:user.email,callback:function(error, info){
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



    async userLogin(Identifier: string,password:string): Promise<IMessge>{
        try{
            password = crypto.createHash('md5').update(password).digest('hex');
            let users = await this.repo.findByVal({username:Identifier, password})
            if(users.length < 1){
                users = await this.repo.findByVal({email:Identifier, password})
            }
            if(users.length < 1){
                users = await this.repo.findByVal({phone:Identifier, password})
            }

            if(users.length == 1){
                const user =  users[0]
                const timestamp = Math.floor(moment().valueOf()/1000)
                const id = new Identity()
                const token = createToken("auth",{userID: user.id, role: "user"})
                const dayToken = createToken("dayToken",{timestamp, token: id.generateID(5,"alpha")+timestamp})
                return {'status':true,data:{'message':'User signed in successfully','user':user,'token':token,dayToken}}
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
            let {confirmPassword, password,oldPassword } = data
            const id = data.id
            password = crypto.createHash('md5').update(password).digest('hex');
            confirmPassword = crypto.createHash('md5').update(confirmPassword).digest('hex');
            oldPassword = crypto.createHash('md5').update(oldPassword).digest('hex');
            if(password === confirmPassword){
                const user = await this.repo.findByVal({id, password:oldPassword})
                if(user.length === 1){
                    const user0 = user[0]
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
    
    async updateProfile(id:number,update:IUserOptional): Promise<IMessge>{
        try{
            //Verify if email exists
            let user = await this.repo.findByVal({email:update.email})
            if(user.length > 0 && user[0].id != id){
                return {'status':false,data:{'message':'Email already exists'}}
            }
            //Verify if email exists
            user = await this.repo.findByVal({username:update.username})
            if(user.length > 0 && user[0].id != id){
                return {'status':false,data:{'message':'Username already exists'}}
            }
            // Check if phone exists
            if(update.phone){
                user = await this.repo.findByVal({phone:update.phone})
                if(user.length > 0 && user[0].id != id){
                    return {'status':false,data:{'message':'Phone already exists'}}
                }
            }
            const userDetail = await this.userDetails({id})
            const updatedUser = updateObject(userDetail,update)
            delete updatedUser.data
            delete updatedUser.third_party
            const updateUser = await this.repo.update(updatedUser,{id})
            if(updateUser){
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

    async userDetails(val:IUserOptional): Promise<IUser>{
        try{
            const users = await this.repo.findByVal(val)
            if (users.length == 1) {
                return users[0]
            }
            else{
                throw new Error("User not found or user exists more than once")
            }
        }
        catch(err:any){
            throw new Error(err)
        }
    }

    async userList(): Promise<IUser[]>{
        try{
            const users = await this.repo.findAll()
            return users
        }
        catch(err:any){
            throw new Error(err)
        }
    }

}