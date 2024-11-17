import {IStaffCourseRepository, StaffCourseRepository, IStaffCourse} from "../infrastructure/mysql/repository/staff_course.repository";
import moment from 'moment';

export interface IMessge{
    status:boolean;
    data?:any;
    message?:string;
}
export default class StaffCourseService {
    private repo: IStaffCourseRepository;

    private staffCourseUIDFormat = {static:2,number:2,alphabet:1,isNew:true,isRandom:true,staticVal:'_alpha_',prevID:''};

    constructor(){
        this.repo = new StaffCourseRepository();
    }

    
    async createStaffCourse(staffCourse: IStaffCourse): Promise<IMessge>{
        try{
            const timestamp = Math.floor(moment().valueOf()/1000)+''
            // Check if staff already has the course
            const staffCourseExists = await this.repo.findByVal({staff_id:staffCourse.staff_id,course_id:staffCourse.course_id})
            if(staffCourseExists.length > 0){
                return {'status':false,data:{'message':'Staff already has the course assigned'}}
            }
            staffCourse.date_enrolled = timestamp
            const create = await this.repo.create(staffCourse)
            if(create){
                return {'status':true,data:{'message':'Course assigned to Staff successfully','staff_course':staffCourse}}             
            }
            else{
                return {'status':false,data:{'message':'Failed to assign staff to the course'}}
            }
        }
        catch(err:any){
            console.log({err})
            throw new Error(err)
        }
    }

    async deleteStaffCourse(staffCourse: IStaffCourse): Promise<IMessge>{
        try{
            const deleteStaffCourse = await this.repo.delete(staffCourse)
            if(deleteStaffCourse){
                return {'status':true,data:{'message':'Staff removed from course successfully'}}
            }
            else{
                return {'status':false,data:{'message':'Failed to remove staff from course'}}
            }
        }
        catch(err:any){
            console.log({err})
            throw new Error(err)
        }
    }

    async staffCourseDetails(val:IStaffCourse): Promise<IStaffCourse>{
        try{
            const staffCourses = await this.repo.findByVal(val)
            if (staffCourses.length == 1) {
                return staffCourses[0]
            }
            else{
                throw new Error("Staff course not found or staff course exists more than once")
            }
        }
        catch(err:any){
            throw new Error(err)
        }
    }

    async staffCoursesDetail(val:IStaffCourse): Promise<IStaffCourse[]>{
        try{
            const staffCourses = await this.repo.findByVal(val)
            return staffCourses
        }
        catch(err:any){
            throw new Error(err)
        }
    }

    async staffDashboard(val:IStaffCourse,date:string): Promise<any>{
        try{
            const staffCourses = await this.repo.find4Dashboard(val,date)
            return staffCourses
        }
        catch(err:any){
            throw new Error(err)
        }
    }

    async courseAbsentRequests(val:IStaffCourse): Promise<any[]>{
        try{
            const absentRequests = await this.repo.findAbsentRequests(val)
            return absentRequests
        }
        catch(err:any){
            throw new Error(err)
        }
    }

    async staffCourseList(): Promise<IStaffCourse[]>{
        try{
            const staffCourses = await this.repo.findAll()
            return staffCourses
        }
        catch(err:any){
            throw new Error(err)
        }
    }
}