import { db } from '../models/index';


export interface IAdministrator {
    id?: number;
    first_name?: string;
    last_name?: string;
    email?: string;
    phone?: string;
    password?: string;
    last_seen?: Date;
    status?: number;
    createdAt?: string;
    updatedAt?: string;
}

export interface IAdministratorRepository {
    create(data: IAdministrator): Promise<IAdministrator>;
    update(updateVal: IAdministrator, search: IAdministrator): Promise<boolean>;
    delete(search: IAdministrator): Promise<boolean>;
    findAll(): Promise<IAdministrator[]>;
    findByVal(val:IAdministrator): Promise<IAdministrator[]>; 
}

export class AdministratorRepository implements IAdministratorRepository {
    private Administrator;

    constructor() {
        this.Administrator = db.Administrator
    }

    async create(administrator: IAdministrator): Promise<IAdministrator> {
        try {
            const newAdministrator = await this.Administrator.create(administrator)
            return newAdministrator.dataValues
        }
        catch (err: any) {
            throw new Error(err)
        }
    }

    async update(updateVal: IAdministrator, search: IAdministrator): Promise<boolean> {
        try{
            const update = await this.Administrator.update(updateVal, { where: search})
            if(update[0] == 0){
                throw new Error("Administrator account not updated")
            }
            return true
        }
        catch(err:any){
            throw new Error(err)
        }
    }

    async delete(search: IAdministrator): Promise<boolean> {
        try{
            await this.Administrator.destroy({where:search})
            return true
        }
        catch(err:any){
            throw new Error(err)
        }
    }

    async findAll(): Promise<IAdministrator[]> {
        try{
            let administrators = await this.Administrator.findAll()
            administrators = administrators.map((administrator:any)=>administrator.dataValues)
            return administrators
        }
        catch(err:any){
            throw new Error(err)
        }
    }

    async findByVal(search:IAdministrator): Promise<IAdministrator[]> {
        try{
            let administrators = await this.Administrator.findAll({where:search})
            if(administrators){
                administrators = administrators.map((administrator:any)=>administrator.dataValues)
                return administrators
            }
            else{
                throw new Error("No administrator found")
            }
        }
        catch(err:any){
            throw new Error(err)
        }
    }
}