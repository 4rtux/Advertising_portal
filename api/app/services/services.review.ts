import {IReviewRepository, ReviewRepository, IReview, IReviewOptional} from "../infrastructure/sqlite/repository/review.repository";
import { TIMESTAMP, uploadFile } from "../utils/helpers";
import Identity from '../utils/Identity';


export interface IMessge{
    status:boolean;
    data?:any;
    message?:string;
}

interface IReviewExtended extends IReview {
    from?: string;
    to?: string;
}

export default class ReviewService {
    private repo: IReviewRepository;

    private reviewUIDFormat = {static:2,number:2,alphabet:1,isNew:true,isRandom:true,staticVal:'_alpha_',prevID:''};

    constructor(){
        this.repo = new ReviewRepository();
    }


    async createReview(review: IReviewExtended): Promise<IMessge>{
        try{
            const create = await this.repo.create(review)
            if(create){
                return {'status':true,data:{'message':'Review added successfully','review':create}}             
            }
            else{
                return {'status':false,data:{'message':'Failed to add Review'}}
            }
        }
        catch(err:any){
            throw new Error(err)
        }
    }

    async updateReview(reviewID:number, review: IReview): Promise<IMessge>{
        try{
            const update = await this.repo.update(review,{id:reviewID})
            if(update){
                return {'status':true,data:{'message':'Review updated successfully'}}             
            }
            else{
                return {'status':false,data:{'message':'Failed to update Review'}}
            }
        }
        catch(err:any){
            throw new Error(err)
        }
    }

    async reviewDetails(val:IReview): Promise<IReview>{
        try{
            const reviews = await this.repo.findByVal(val)
            if (reviews.length == 1) {
                return reviews[0]
            }
            else{
                throw new Error("Review not found or review exists more than once")
            }
        }
        catch(err:any){
            throw new Error(err)
        }
    }

    async reviewsDetail(val:IReviewOptional): Promise<IReview[]>{
        try{
            const reviews = await this.repo.findByVal(val)
            return reviews
        }
        catch(err:any){
            throw new Error(err)
        }
    }

    async reviewList(): Promise<IReview[]>{
        try{
            const reviews = await this.repo.findAll()
            return reviews
        }
        catch(err:any){
            throw new Error(err)
        }
    }
}