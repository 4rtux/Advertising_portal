import { db } from '../models/index';


export interface IUser {
    id?: number;
    first_name?: string;
    last_name?: string;
    email?: string;
    username?: string;
    phone?: string;
    password?: string;
    last_seen?: Date;
    status?: number;
    createdAt?: string;
    updatedAt?: string;
}

export interface IUserRepository {
    create(data: IUser): Promise<IUser>;
    update(updateVal: IUser, search: IUser): Promise<boolean>;
    delete(search: IUser): Promise<boolean>;
    findAll(): Promise<IUser[]>;
    findByVal(val:IUser): Promise<IUser[]>; 
}

export class UserRepository implements IUserRepository {
    private User;

    constructor() {
        this.User = db.User
    }

    async create(user: IUser): Promise<IUser> {
        try {
            const newUser = await this.User.create(user)
            return newUser.dataValues
        }
        catch (err: any) {
            throw new Error(err)
        }
    }

    async update(updateVal: IUser, search: IUser): Promise<boolean> {
        try{
            const update = await this.User.update(updateVal, { where: search})
            if(update[0] == 0){
                throw new Error("User account not updated")
            }
            return true
        }
        catch(err:any){
            throw new Error(err)
        }
    }

    async delete(search: IUser): Promise<boolean> {
        try{
            await this.User.destroy({where:search})
            return true
        }
        catch(err:any){
            throw new Error(err)
        }
    }

    async findAll(): Promise<IUser[]> {
        try{
            let users = await this.User.findAll()
            users = users.map((user:any)=>user.dataValues)
            return users
        }
        catch(err:any){
            throw new Error(err)
        }
    }

    async findByVal(search:IUser): Promise<IUser[]> {
        try{
            let users = await this.User.findAll({where:search})
            if(users){
                users = users.map((user:any)=>user.dataValues)
                return users
            }
            else{
                throw new Error("No user found")
            }
        }
        catch(err:any){
            throw new Error(err)
        }
    }
}