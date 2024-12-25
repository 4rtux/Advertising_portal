import { db } from '../models/index';

export type IPromotionOptional = Partial<IPromotion>;
export interface IPromotion {
    id: number;
    listing_id: number;
    user_id: number;
    plan_id: number;
    paid: boolean;
    from: number;
    to: number;
    status?: number;
}

export interface IPromotionRepository {
    create(data: IPromotionOptional): Promise<IPromotion>;
    update(updateVal: IPromotionOptional, search: IPromotionOptional): Promise<boolean>;
    delete(search: IPromotionOptional): Promise<boolean>;
    findAll(): Promise<IPromotion[]>;
    findByVal(val:IPromotionOptional): Promise<IPromotion[]>; 
}

export class PromotionRepository implements IPromotionRepository {
    private Promotion;

    constructor() {
        this.Promotion = db.Promotion
    }

    async create(promotion: IPromotionOptional): Promise<IPromotion> {
        try {
            const newPromotion = await this.Promotion.create(promotion)
            return newPromotion.dataValues
        }
        catch (err: any) {
            throw new Error(err)
        }
    }

    async update(updateVal: IPromotionOptional, search: IPromotionOptional): Promise<boolean> {
        try{
            const update = await this.Promotion.update(updateVal, { where: search})
            if(update[0] == 0){
                throw new Error("Promotion account not updated")
            }
            return true
        }
        catch(err:any){
            throw new Error(err)
        }
    }

    async delete(search: IPromotionOptional): Promise<boolean> {
        try{
            await this.Promotion.destroy({where:search})
            return true
        }
        catch(err:any){
            throw new Error(err)
        }
    }

    async findAll(): Promise<IPromotion[]> {
        try{
            let promotions = await this.Promotion.findAll()
            promotions = promotions.map((promotion:any)=>promotion.dataValues)
            return promotions
        }
        catch(err:any){
            throw new Error(err)
        }
    }

    async findByVal(search:IPromotionOptional): Promise<IPromotion[]> {
        try{
            let promotions = await this.Promotion.findAll({where:search})
            if(promotions){
                promotions = promotions.map((promotion:any)=>promotion.dataValues)
                return promotions
            }
            else{
                throw new Error("No promotion found")
            }
        }
        catch(err:any){
            throw new Error(err)
        }
    }
}