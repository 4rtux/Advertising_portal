import {IListingFavoriteRepository, ListingFavoriteRepository, IListingFavorite, IListingFavoriteOptional} from "../infrastructure/sqlite/repository/listing_favorite.repository";


export interface IMessge{
    status:boolean;
    data?:any;
    message?:string;
}
export default class ListingFavoriteService {
    private repo: IListingFavoriteRepository;

    private listingFavoriteUIDFormat = {static:2,number:2,alphabet:1,isNew:true,isRandom:true,staticVal:'_alpha_',prevID:''};

    constructor(){
        this.repo = new ListingFavoriteRepository();
    }

    
    async createListingFavorite(listingFavorite: IListingFavorite): Promise<IMessge>{
        try{
            const create = await this.repo.create(listingFavorite)
            if(create){
                return {'status':true,data:{'message':'ListingFavorite added successfully','listingFavorite':create}}             
            }
            else{
                return {'status':false,data:{'message':'Failed to add ListingFavorite'}}
            }
        }
        catch(err:any){
            throw new Error(err)
        }
    }

    async updateListingFavorite(listingFavoriteID:number, listingFavorite: IListingFavorite): Promise<IMessge>{
        try{
            const update = await this.repo.update(listingFavorite,{id:listingFavoriteID})
            if(update){
                return {'status':true,data:{'message':'ListingFavorite updated successfully'}}             
            }
            else{
                return {'status':false,data:{'message':'Failed to update ListingFavorite'}}
            }
        }
        catch(err:any){
            throw new Error(err)
        }
    }

    async listingFavoriteDetails(val:IListingFavorite): Promise<IListingFavorite>{
        try{
            const listingFavorites = await this.repo.findByVal(val)
            if (listingFavorites.length == 1) {
                return listingFavorites[0]
            }
            else{
                throw new Error("ListingFavorite not found or listingFavorite exists more than once")
            }
        }
        catch(err:any){
            throw new Error(err)
        }
    }

    async listingFavoritesDetail(val:IListingFavoriteOptional): Promise<IListingFavorite[]>{
        try{
            let listingFavorites = await this.repo.findByVal(val)
            listingFavorites = listingFavorites.map((listingFavorite)=>{
                // listingFavorite = listingFavorite.dataValues
                // listingFavorite.date = moment(listingFavorite.createdAt).format('ddd, DD MMM YYYY @ HH:mm');
                return listingFavorite
            })
            return listingFavorites
        }
        catch(err:any){
            throw new Error(err)
        }
    }

    async listingFavoriteList(): Promise<IListingFavorite[]>{
        try{
            const listingFavorites = await this.repo.findAll()
            return listingFavorites
        }
        catch(err:any){
            throw new Error(err)
        }
    }
}