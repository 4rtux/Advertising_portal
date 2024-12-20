import {IReportRepository, ReportRepository, IReport, IReportOptional} from "../infrastructure/sqlite/repository/report.repository";
import { TIMESTAMP, uploadFile } from "../utils/helpers";
import Identity from '../utils/Identity';


export interface IMessge{
    status:boolean;
    data?:any;
    message?:string;
}

interface IReportExtended extends IReport {
    from?: string;
    to?: string;
}

export default class ReportService {
    private repo: IReportRepository;

    private reportUIDFormat = {static:2,number:2,alphabet:1,isNew:true,isRandom:true,staticVal:'_alpha_',prevID:''};

    constructor(){
        this.repo = new ReportRepository();
    }


    async createReport(report: IReportOptional): Promise<IMessge>{
        try{
            // if(report.proof){
            //     const id = new Identity()
            //     const filename = id.generateID(4,"alpha")+TIMESTAMP
            //     try{
            //         const uploadProof = uploadFile(filename,"reports/",report.proof)
            //         if(uploadProof.status){
            //             report.proof = uploadProof.filename
            //         }
            //         else{
            //             return {'status':false,data:{'message':'Failed to upload proof file'}}
            //         }
            //     }
            //     catch(err:any){
            //         console.log({err})
            //         return {'status':false,data:{'message':'Failed to upload proof file'}}
            //     }
            // }

            const create = await this.repo.create(report)
            if(create){
                return {'status':true,data:{'message':'Report submitted successfully','report':create}}             
            }
            else{
                return {'status':false,data:{'message':'Failed to submit Report'}}
            }
        }
        catch(err:any){
            throw new Error(err)
        }
    }

    async updateReport(reportID:number, report: IReport): Promise<IMessge>{
        try{
            const update = await this.repo.update(report,{id:reportID})
            if(update){
                return {'status':true,data:{'message':'Report updated successfully'}}             
            }
            else{
                return {'status':false,data:{'message':'Failed to update Report'}}
            }
        }
        catch(err:any){
            throw new Error(err)
        }
    }

    async reportDetails(val:IReport): Promise<IReport>{
        try{
            const reports = await this.repo.findByVal(val)
            if (reports.length == 1) {
                return reports[0]
            }
            else{
                throw new Error("Report not found or report exists more than once")
            }
        }
        catch(err:any){
            throw new Error(err)
        }
    }

    async reportsDetail(val:IReport): Promise<IReport[]>{
        try{
            const reports = await this.repo.findByVal(val)
            return reports
        }
        catch(err:any){
            throw new Error(err)
        }
    }

    async reportList(): Promise<IReport[]>{
        try{
            const reports = await this.repo.findAll()
            return reports
        }
        catch(err:any){
            throw new Error(err)
        }
    }
}