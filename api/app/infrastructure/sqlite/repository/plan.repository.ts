import { db } from '../models/index';

export interface IPlan {
    id?: number;
    name?: string;
    description?: string;
    days?: string;
    status?: number;
}

export interface IPlanRepository {
    create(data: IPlan): Promise<IPlan>;
    update(updateVal: IPlan, search: IPlan): Promise<boolean>;
    delete(search: IPlan): Promise<boolean>;
    findAll(): Promise<IPlan[]>;
    findByVal(val:IPlan): Promise<IPlan[]>; 
}

export class PlanRepository implements IPlanRepository {
    private Plan;

    constructor() {
        this.Plan = db.Plan
    }

    async create(plan: IPlan): Promise<IPlan> {
        try {
            const newPlan = await this.Plan.create(plan)
            return newPlan.dataValues
        }
        catch (err: any) {
            throw new Error(err)
        }
    }

    async update(updateVal: IPlan, search: IPlan): Promise<boolean> {
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

    async delete(search: IPlan): Promise<boolean> {
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

    async findByVal(search:IPlan): Promise<IPlan[]> {
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