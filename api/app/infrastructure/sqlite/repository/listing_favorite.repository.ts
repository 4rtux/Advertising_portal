import { db } from '../models/index';

export interface IListingFavorite {
    id?: number;
    listing_id?: number;
    user_id?: number;
}

export interface IListingFavoriteRepository {
    create(data: IListingFavorite): Promise<IListingFavorite>;
    update(updateVal: IListingFavorite, search: IListingFavorite): Promise<boolean>;
    delete(search: IListingFavorite): Promise<boolean>;
    findAll(): Promise<IListingFavorite[]>;
    findByVal(val:IListingFavorite): Promise<IListingFavorite[]>; 
}

export class ListingFavoriteRepository implements IListingFavoriteRepository {
    private ListingFavorite;

    constructor() {
        this.ListingFavorite = db.ListingFavorite
    }

    async create(listingFavorite: IListingFavorite): Promise<IListingFavorite> {
        try {
            const newListingFavorite = await this.ListingFavorite.create(listingFavorite)
            return newListingFavorite.dataValues
        }
        catch (err: any) {
            throw new Error(err)
        }
    }

    async update(updateVal: IListingFavorite, search: IListingFavorite): Promise<boolean> {
        try{
            const update = await this.ListingFavorite.update(updateVal, { where: search})
            if(update[0] == 0){
                throw new Error("Listing favorite account not updated")
            }
            return true
        }
        catch(err:any){
            throw new Error(err)
        }
    }

    async delete(search: IListingFavorite): Promise<boolean> {
        try{
            await this.ListingFavorite.destroy({where:search})
            return true
        }
        catch(err:any){
            throw new Error(err)
        }
    }

    async findAll(): Promise<IListingFavorite[]> {
        try{
            let listingFavorites = await this.ListingFavorite.findAll()
            listingFavorites = listingFavorites.map((listingFavorite:any)=>listingFavorite.dataValues)
            return listingFavorites
        }
        catch(err:any){
            throw new Error(err)
        }
    }

    async findByVal(search:IListingFavorite): Promise<IListingFavorite[]> {
        try{
            let listingFavorites = await this.ListingFavorite.findAll({where:search})
            if(listingFavorites){
                listingFavorites = listingFavorites.map((listingFavorite:any)=>listingFavorite.dataValues)
                return listingFavorites
            }
            else{
                throw new Error("No listing favorite found")
            }
        }
        catch(err:any){
            throw new Error(err)
        }
    }
}