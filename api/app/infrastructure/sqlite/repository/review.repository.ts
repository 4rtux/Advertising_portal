import { db } from '../models/index';

export type IReviewOptional = Partial<IReview>;
export interface IReview {
    id: number;
    user_id: number;
    reviewed_by: number;
    message: string;
    star: number;
}

export interface IReviewRepository {
    create(data: IReviewOptional): Promise<IReview>;
    update(updateVal: IReviewOptional, search: IReviewOptional): Promise<boolean>;
    delete(search: IReviewOptional): Promise<boolean>;
    findAll(): Promise<IReview[]>;
    findByVal(val:IReviewOptional): Promise<IReview[]>; 
}

export class ReviewRepository implements IReviewRepository {
    private Review;

    constructor() {
        this.Review = db.Review
    }

    async create(review: IReviewOptional): Promise<IReview> {
        try {
            const newReview = await this.Review.create(review)
            return newReview.dataValues
        }
        catch (err: any) {
            throw new Error(err)
        }
    }

    async update(updateVal: IReviewOptional, search: IReviewOptional): Promise<boolean> {
        try{
            const update = await this.Review.update(updateVal, { where: search})
            if(update[0] == 0){
                throw new Error("Review account not updated")
            }
            return true
        }
        catch(err:any){
            throw new Error(err)
        }
    }

    async delete(search: IReviewOptional): Promise<boolean> {
        try{
            await this.Review.destroy({where:search})
            return true
        }
        catch(err:any){
            throw new Error(err)
        }
    }

    async findAll(): Promise<IReview[]> {
        try{
            let reviews = await this.Review.findAll()
            reviews = reviews.map((review:any)=>review.dataValues)
            return reviews
        }
        catch(err:any){
            throw new Error(err)
        }
    }

    async findByVal(search:IReviewOptional): Promise<IReview[]> {
        try{
            let reviews = await this.Review.findAll({where:search})
            if(reviews){
                reviews = reviews.map((review:any)=>review.dataValues)
                return reviews
            }
            else{
                throw new Error("No review found")
            }
        }
        catch(err:any){
            throw new Error(err)
        }
    }
}