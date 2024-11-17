import {IScheduleRepository, ScheduleRepository, ISchedule} from "../infrastructure/mysql/repository/schedule.repository";


export interface IMessge{
    status:boolean;
    data?:any;
    message?:string;
}
export default class ScheduleService {
    private repo: IScheduleRepository;

    private scheduleUIDFormat = {static:2,number:2,alphabet:1,isNew:true,isRandom:true,staticVal:'_alpha_',prevID:''};

    constructor(){
        this.repo = new ScheduleRepository();
    }

    
    async createSchedule(schedule: ISchedule): Promise<IMessge>{
        try{
            const create = await this.repo.create(schedule)
            if(create){
                return {'status':true,data:{'message':'Schedule added successfully','schedule':create}}             
            }
            else{
                return {'status':false,data:{'message':'Failed to add Schedule'}}
            }
        }
        catch(err:any){
            throw new Error(err)
        }
    }

    async updateSchedule(scheduleID:number, schedule: ISchedule): Promise<IMessge>{
        try{
            const update = await this.repo.update(schedule,{id:scheduleID})
            if(update){
                return {'status':true,data:{'message':'Schedule updated successfully'}}             
            }
            else{
                return {'status':false,data:{'message':'Failed to update Schedule'}}
            }
        }
        catch(err:any){
            throw new Error(err)
        }
    }

    async scheduleDetails(val:ISchedule): Promise<ISchedule>{
        try{
            const schedules = await this.repo.findByVal(val)
            if (schedules.length == 1) {
                return schedules[0]
            }
            else{
                throw new Error("Schedule not found or schedule exists more than once")
            }
        }
        catch(err:any){
            throw new Error(err)
        }
    }

    async schedulesDetail(val:ISchedule): Promise<ISchedule[]>{
        try{
            const schedules = await this.repo.findByVal(val)
            return schedules
        }
        catch(err:any){
            throw new Error(err)
        }
    }

    async scheduleList(): Promise<ISchedule[]>{
        try{
            const schedules = await this.repo.findAll()
            return schedules
        }
        catch(err:any){
            throw new Error(err)
        }
    }

    async deleteSchedule(scheduleID:number): Promise<IMessge>{
        try{
            const del = await this.repo.delete(scheduleID)
            if(del){
                return {'status':true,data:{'message':'Schedule deleted successfully'}}             
            }
            else{
                return {'status':false,data:{'message':'Failed to delete Schedule'}}
            }
        }
        catch(err:any){
            throw new Error(err)
        }
    }
}