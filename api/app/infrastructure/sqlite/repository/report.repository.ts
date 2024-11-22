import { db } from '../models/index';

export type IReportOptional = Partial<IReport>;
export interface IReport {
    id: number;
    made_by: number;
    type: string;
    description: string;
    proof: string;
    listing_id: number;
    culprit_id: number;
    resolved_by: number;
    status: number;
}

export interface IReportRepository {
    create(data: IReportOptional): Promise<IReport>;
    update(updateVal: IReportOptional, search: IReportOptional): Promise<boolean>;
    delete(search: IReportOptional): Promise<boolean>;
    findAll(): Promise<IReport[]>;
    findByVal(val:IReportOptional): Promise<IReport[]>; 
}

export class ReportRepository implements IReportRepository {
    private Report;

    constructor() {
        this.Report = db.Report
    }

    async create(report: IReportOptional): Promise<IReport> {
        try {
            const newReport = await this.Report.create(report)
            return newReport.dataValues
        }
        catch (err: any) {
            throw new Error(err)
        }
    }

    async update(updateVal: IReportOptional, search: IReportOptional): Promise<boolean> {
        try{
            const update = await this.Report.update(updateVal, { where: search})
            if(update[0] == 0){
                throw new Error("Report account not updated")
            }
            return true
        }
        catch(err:any){
            throw new Error(err)
        }
    }

    async delete(search: IReportOptional): Promise<boolean> {
        try{
            await this.Report.destroy({where:search})
            return true
        }
        catch(err:any){
            throw new Error(err)
        }
    }

    async findAll(): Promise<IReport[]> {
        try{
            let reports = await this.Report.findAll()
            reports = reports.map((report:any)=>report.dataValues)
            return reports
        }
        catch(err:any){
            throw new Error(err)
        }
    }

    async findByVal(search:IReportOptional): Promise<IReport[]> {
        try{
            let reports = await this.Report.findAll({where:search})
            if(reports){
                reports = reports.map((report:any)=>report.dataValues)
                return reports
            }
            else{
                throw new Error("No report found")
            }
        }
        catch(err:any){
            throw new Error(err)
        }
    }
}