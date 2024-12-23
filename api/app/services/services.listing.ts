import {IListingRepository, ListingRepository, IListing, IListingOptional} from "../infrastructure/sqlite/repository/listing.repository";


export interface IMessge{
    status:boolean;
    data?:any;
    message?:string;
}
export default class ListingService {
    private repo: IListingRepository;

    private listingUIDFormat = {static:2,number:2,alphabet:1,isNew:true,isRandom:true,staticVal:'_alpha_',prevID:''};

    constructor(){
        this.repo = new ListingRepository();
    }

    
    async createListing(listing: IListing): Promise<IMessge>{
        try{
            const create = await this.repo.create(listing)
            if(create){
                return {'status':true,data:{'message':'Listing added successfully','listing':create}}             
            }
            else{
                return {'status':false,data:{'message':'Failed to add Listing'}}
            }
        }
        catch(err:any){
            throw new Error(err)
        }
    }

    async updateListing(listingID:number, listing: IListingOptional): Promise<IMessge>{
        try{
            const update = await this.repo.update(listing,{id:listingID})
            if(update){
                return {'status':true,data:{'message':'Listing updated successfully'}}             
            }
            else{
                return {'status':false,data:{'message':'Failed to update Listing'}}
            }
        }
        catch(err:any){
            throw new Error(err)
        }
    }

    async listingDetails(val:IListingOptional): Promise<IListing>{
        try{
            const listings = await this.repo.findByVal(val)
            if (listings.length == 1) {
                return listings[0]
            }
            else{
                throw new Error("Listing not found or listing exists more than once")
            }
        }
        catch(err:any){
            throw new Error(err)
        }
    }

    async listingsDetail(val:IListingOptional): Promise<IListing[]>{
        try{
            let listings = await this.repo.findByVal(val)
            listings = listings.map((listing)=>{
                // listing = listing.dataValues
                // listing.date = moment(listing.createdAt).format('ddd, DD MMM YYYY @ HH:mm');
                return listing
            })
            return listings
        }
        catch(err:any){
            throw new Error(err)
        }
    }

    async listingsSearch(keyword:string, type:string, category:string): Promise<IListing[]>{
        try{
            const listings = await this.repo.wildCardSearch(keyword,type,category)
            return listings
        }
        catch(err:any){
            throw new Error(err)
        }
    }

    async listingList(): Promise<IListing[]>{
        try{
            const listings = await this.repo.findAll()
            return listings
        }
        catch(err:any){
            throw new Error(err)
        }
    }

    async deleteListing(val:IListingOptional): Promise<IMessge>{
        try{
            const deleteListing = await this.repo.delete(val)
            if(deleteListing){
                return {'status':true,data:{'message':'Listing deleted successfully'}}             
            }
            else{
                return {'status':false,data:{'message':'Failed to delete Listing'}}
            }
        }
        catch(err:any){
            throw new Error(err)
        }
    }
}