import { db } from '../models/index';


export type IAdministratorOptional = Partial<IAdministrator>;
export interface IAdministrator {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    password: string;
    last_seen: Date;
    status: number;
    createdAt: string;
    updatedAt: string;
}

export interface IAdministratorRepository {
    create(data: IAdministratorOptional): Promise<IAdministrator>;
    update(updateVal: IAdministratorOptional, search: IAdministratorOptional): Promise<boolean>;
    delete(search: IAdministratorOptional): Promise<boolean>;
    findAll(): Promise<IAdministrator[]>;
    findByVal(val:IAdministratorOptional): Promise<IAdministrator[]>; 
}

export class AdministratorRepository implements IAdministratorRepository {
    private Administrator;

    constructor() {
        this.Administrator = db.Administrator
    }

    async create(administrator: IAdministratorOptional): Promise<IAdministrator> {
        try {
            const newAdministrator = await this.Administrator.create(administrator)
            return newAdministrator.dataValues
        }
        catch (err: any) {
            throw new Error(err)
        }
    }

    async update(updateVal: IAdministratorOptional, search: IAdministratorOptional): Promise<boolean> {
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

    async delete(search: IAdministratorOptional): Promise<boolean> {
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

    async findByVal(search:IAdministratorOptional): Promise<IAdministrator[]> {
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