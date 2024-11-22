import { db } from '../models/index';

export type ProductType = 'new' | 'used' | 'refurbished';

export type IListingOptional = Partial<IListing>;
export interface IListing {
    id: number;
    name: string;
    pictures: string[];
    type: ProductType;
    user_id: number;
    status: number;
}

export interface IListingRepository {
    create(data: IListingOptional): Promise<IListing>;
    update(updateVal: IListingOptional, search: IListingOptional): Promise<boolean>;
    delete(search: IListingOptional): Promise<boolean>;
    findAll(): Promise<IListing[]>;
    findByVal(val:IListingOptional): Promise<IListing[]>; 
}

export class ListingRepository implements IListingRepository {
    private Listing;

    constructor() {
        this.Listing = db.Listing
    }

    async create(listing: IListingOptional): Promise<IListing> {
        try {
            const newListing = await this.Listing.create(listing)
            return newListing.dataValues
        }
        catch (err: any) {
            throw new Error(err)
        }
    }

    async update(updateVal: IListingOptional, search: IListingOptional): Promise<boolean> {
        try{
            const update = await this.Listing.update(updateVal, { where: search})
            if(update[0] == 0){
                throw new Error("Listing account not updated")
            }
            return true
        }
        catch(err:any){
            throw new Error(err)
        }
    }

    async delete(search: IListingOptional): Promise<boolean> {
        try{
            await this.Listing.destroy({where:search})
            return true
        }
        catch(err:any){
            throw new Error(err)
        }
    }

    async findAll(): Promise<IListing[]> {
        try{
            let listings = await this.Listing.findAll()
            listings = listings.map((listing:any)=>listing.dataValues)
            return listings
        }
        catch(err:any){
            throw new Error(err)
        }
    }

    async findByVal(search:IListingOptional): Promise<IListing[]> {
        try{
            let listings = await this.Listing.findAll({where:search})
            if(listings){
                listings = listings.map((listing:any)=>listing.dataValues)
                return listings
            }
            else{
                throw new Error("No listing found")
            }
        }
        catch(err:any){
            throw new Error(err)
        }
    }
}