import { db } from '../models/index';

export interface IReview {
    id?: number;
    user_id?: number;
    reviewed_by?: number;
    message?: string;
    star?: number;
}

export interface IReviewRepository {
    create(data: IReview): Promise<IReview>;
    update(updateVal: IReview, search: IReview): Promise<boolean>;
    delete(search: IReview): Promise<boolean>;
    findAll(): Promise<IReview[]>;
    findByVal(val:IReview): Promise<IReview[]>; 
}

export class ReviewRepository implements IReviewRepository {
    private Review;

    constructor() {
        this.Review = db.Review
    }

    async create(review: IReview): Promise<IReview> {
        try {
            const newReview = await this.Review.create(review)
            return newReview.dataValues
        }
        catch (err: any) {
            throw new Error(err)
        }
    }

    async update(updateVal: IReview, search: IReview): Promise<boolean> {
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

    async delete(search: IReview): Promise<boolean> {
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

    async findByVal(search:IReview): Promise<IReview[]> {
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