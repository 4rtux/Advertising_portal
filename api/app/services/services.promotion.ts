import moment from "moment";
import {IPromotionRepository, PromotionRepository, IPromotion, IPromotionOptional} from "../infrastructure/sqlite/repository/promotion.repository";


export interface IMessge{
    status:boolean;
    data?:any;
    message?:string;
}
export default class PromotionService {
    private repo: IPromotionRepository;

    private promotionUIDFormat = {static:2,number:2,alphabet:1,isNew:true,isRandom:true,staticVal:'_alpha_',prevID:''};

    constructor(){
        this.repo = new PromotionRepository();
    }

    
    async createPromotion(promotion: IPromotionOptional): Promise<IMessge>{
        try{
            const create = await this.repo.create(promotion)
            if(create){
                return {'status':true,data:{'message':'Promotion added successfully','promotion':create}}             
            }
            else{
                return {'status':false,data:{'message':'Failed to add Promotion'}}
            }
        }
        catch(err:any){
            throw new Error(err)
        }
    }

    async updatePromotion(promotionID:number, promotion: IPromotion): Promise<IMessge>{
        try{
            const update = await this.repo.update(promotion,{id:promotionID})
            if(update){
                return {'status':true,data:{'message':'Promotion updated successfully'}}             
            }
            else{
                return {'status':false,data:{'message':'Failed to update Promotion'}}
            }
        }
        catch(err:any){
            throw new Error(err)
        }
    }

    async promotionDetails(val:IPromotionOptional): Promise<IPromotion | boolean>{
        try{
            const promotions = await this.repo.findByVal(val)
            if (promotions.length > 0) {
                return promotions[promotions.length-1]
            }
            else{
                // throw new Error("Promotion not found or promotion exists more than once")
                return false
            }
        }
        catch(err:any){
            throw new Error(err)
        }
    }

    async promotionsDetail(val:IPromotionOptional): Promise<IPromotion[]>{
        try{
            let promotions = await this.repo.findByVal(val)
            promotions = promotions.map((promotion)=>{
                // promotion = promotion.dataValues
                // promotion.date = moment(promotion.createdAt).format('ddd, DD MMM YYYY @ HH:mm');
                return promotion
            })
            return promotions
        }
        catch(err:any){
            throw new Error(err)
        }
    }

    async promotionList(): Promise<IPromotion[]>{
        try{
            const promotions = await this.repo.findAll()
            return promotions
        }
        catch(err:any){
            throw new Error(err)
        }
    }
}