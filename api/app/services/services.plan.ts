import {IPlanRepository, PlanRepository, IPlan, IPlanOptional} from "../infrastructure/sqlite/repository/plan.repository";


export interface IMessge{
    status:boolean;
    data?:any;
    message?:string;
}
export default class PlanService {
    private repo: IPlanRepository;

    private planUIDFormat = {static:2,number:2,alphabet:1,isNew:true,isRandom:true,staticVal:'_alpha_',prevID:''};

    constructor(){
        this.repo = new PlanRepository();
    }

    
    async createPlan(plan: IPlan): Promise<IMessge>{
        try{
            const create = await this.repo.create(plan)
            if(create){
                return {'status':true,data:{'message':'Plan added successfully','plan':create}}             
            }
            else{
                return {'status':false,data:{'message':'Failed to add Plan'}}
            }
        }
        catch(err:any){
            throw new Error(err)
        }
    }

    async updatePlan(planID:number, plan: IPlan): Promise<IMessge>{
        try{
            const update = await this.repo.update(plan,{id:planID})
            if(update){
                return {'status':true,data:{'message':'Plan updated successfully'}}             
            }
            else{
                return {'status':false,data:{'message':'Failed to update Plan'}}
            }
        }
        catch(err:any){
            throw new Error(err)
        }
    }

    async planDetails(val:IPlan): Promise<IPlan>{
        try{
            const plans = await this.repo.findByVal(val)
            if (plans.length == 1) {
                return plans[0]
            }
            else{
                throw new Error("Plan not found or plan exists more than once")
            }
        }
        catch(err:any){
            throw new Error(err)
        }
    }

    async plansDetail(val:IPlanOptional): Promise<IPlan[]>{
        try{
            let plans = await this.repo.findByVal(val)
            plans = plans.map((plan)=>{
                // plan = plan.dataValues
                // plan.date = moment(plan.createdAt).format('ddd, DD MMM YYYY @ HH:mm');
                return plan
            })
            return plans
        }
        catch(err:any){
            throw new Error(err)
        }
    }

    async planList(): Promise<IPlan[]>{
        try{
            const plans = await this.repo.findAll()
            return plans
        }
        catch(err:any){
            throw new Error(err)
        }
    }
}