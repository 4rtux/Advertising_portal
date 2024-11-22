import { db } from '../models/index';

export type IPlanOptional = Partial<IPlan>;
export interface IPlan {
    id: number;
    name: string;
    description: string;
    days: string;
    status: number;
}

export interface IPlanRepository {
    create(data: IPlanOptional): Promise<IPlan>;
    update(updateVal: IPlanOptional, search: IPlanOptional): Promise<boolean>;
    delete(search: IPlanOptional): Promise<boolean>;
    findAll(): Promise<IPlan[]>;
    findByVal(val:IPlanOptional): Promise<IPlan[]>; 
}

export class PlanRepository implements IPlanRepository {
    private Plan;

    constructor() {
        this.Plan = db.Plan
    }

    async create(plan: IPlanOptional): Promise<IPlan> {
        try {
            const newPlan = await this.Plan.create(plan)
            return newPlan.dataValues
        }
        catch (err: any) {
            throw new Error(err)
        }
    }

    async update(updateVal: IPlanOptional, search: IPlanOptional): Promise<boolean> {
        try{
            const update = await this.Plan.update(updateVal, { where: search})
            if(update[0] == 0){
                throw new Error("Plan account not updated")
            }
            return true
        }
        catch(err:any){
            throw new Error(err)
        }
    }

    async delete(search: IPlanOptional): Promise<boolean> {
        try{
            await this.Plan.destroy({where:search})
            return true
        }
        catch(err:any){
            throw new Error(err)
        }
    }

    async findAll(): Promise<IPlan[]> {
        try{
            let plans = await this.Plan.findAll()
            plans = plans.map((plan:any)=>plan.dataValues)
            return plans
        }
        catch(err:any){
            throw new Error(err)
        }
    }

    async findByVal(search:IPlanOptional): Promise<IPlan[]> {
        try{
            let plans = await this.Plan.findAll({where:search})
            if(plans){
                plans = plans.map((plan:any)=>plan.dataValues)
                return plans
            }
            else{
                throw new Error("No plan found")
            }
        }
        catch(err:any){
            throw new Error(err)
        }
    }
}