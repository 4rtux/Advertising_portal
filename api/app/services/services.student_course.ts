import {IStudentCourseRepository, StudentCourseRepository, IStudentCourse} from "../infrastructure/mysql/repository/student_course.repository";
import moment from 'moment';

export interface IMessge{
    status:boolean;
    data?:any;
    message?:string;
}
export default class StudentCourseService {
    private repo: IStudentCourseRepository;

    private studentCourseUIDFormat = {static:2,number:2,alphabet:1,isNew:true,isRandom:true,staticVal:'_alpha_',prevID:''};

    constructor(){
        this.repo = new StudentCourseRepository();
    }

    
    async createStudentCourse(studentCourse: IStudentCourse): Promise<IMessge>{
        try{
            // const timestamp = Math.floor(moment().valueOf()/1000)+''
            // Check if student already has the course
            const studentCourseExists = await this.repo.findByVal({student_id:studentCourse.student_id,course_id:studentCourse.course_id})
            if(studentCourseExists.length > 0){
                return {'status':false,data:{'message':'Student already has the course assigned'}}
            }
            // studentCourse.date_enrolled = timestamp
            const create = await this.repo.create(studentCourse)
            if(create){
                return {'status':true,data:{'message':'Course enrollment requested successfully','student_course':studentCourse}}             
            }
            else{
                return {'status':false,data:{'message':'Failed to request enrollment to the course'}}
            }
        }
        catch(err:any){
            console.log({err})
            throw new Error(err)
        }
    }

    async deleteStudentCourse(studentCourse: IStudentCourse): Promise<IMessge>{
        try{
            const deleteStudentCourse = await this.repo.delete(studentCourse)
            if(deleteStudentCourse){
                return {'status':true,data:{'message':'Student removed from course successfully'}}
            }
            else{
                return {'status':false,data:{'message':'Failed to remove student from course'}}
            }
        }
        catch(err:any){
            console.log({err})
            throw new Error(err)
        }
    }

    async updateStudentCourse(studentCourse: IStudentCourse): Promise<IMessge>{
        try{
            const {id, ...update} = studentCourse 
            const updateStudentCourse = await this.repo.update(update,{id})
            if(updateStudentCourse){
                return {'status':true,data:{'message':'Updated student course status'}}
            }
            else{
                return {'status':false,data:{'message':'Failed to update student course status'}}
            }
        }
        catch(err:any){
            console.log({err})
            throw new Error(err)
        }
    }

    async studentCourseDetails(val:IStudentCourse): Promise<IMessge>{
        try{
            const studentCourses = await this.repo.findByVal(val)
            if (studentCourses.length == 1) {
                return {'status':true,data:{courseStatus:studentCourses[0]}}
            }
            else{
                return {'status':true,data:{courseStatus:"Not Enrolled"}}
            }
        }
        catch(err:any){
            throw new Error(err)
        }
    }

    async studentCoursesDetail(val:IStudentCourse): Promise<IStudentCourse[]>{
        try{
            let studentCourses = await this.repo.findByVal(val)
            studentCourses = studentCourses.map((studentCourse:IStudentCourse)=>{
                let course = studentCourse.course
                return course
            })
            return studentCourses
        }
        catch(err:any){
            throw new Error(err)
        }
    }

    async studentsInCourse(val:IStudentCourse): Promise<IStudentCourse[]>{
        try{
            let studentCourses = await this.repo.find4Staff(val)
            studentCourses = studentCourses.map((studentCourse:any)=>{
                const student = studentCourse.student
                student.courseStatus = studentCourse.status
                student.tb_id = studentCourse.id
                return student
            })
            return studentCourses
        }
        catch(err:any){
            throw new Error(err)
        }
    }

    async studentCoursesAbsoluteDetail(val:IStudentCourse): Promise<IStudentCourse[]>{
        try{
            let studentCourses = await this.repo.findAbsolute(val)
            studentCourses = studentCourses.map((studentCourse:IStudentCourse)=>{
                let course = studentCourse.course
                return course
            })
            return studentCourses
        }
        catch(err:any){
            throw new Error(err)
        }
    }

    async studentCourseList(): Promise<IStudentCourse[]>{
        try{
            const studentCourses = await this.repo.findAll()
            return studentCourses
        }
        catch(err:any){
            throw new Error(err)
        }
    }
}