import { db } from '../models/index';

export interface IListingView {
    id?: number;
    listing_id?: number;
    user_id?: number;
}

export interface IListingViewRepository {
    create(data: IListingView): Promise<IListingView>;
    update(updateVal: IListingView, search: IListingView): Promise<boolean>;
    delete(search: IListingView): Promise<boolean>;
    findAll(): Promise<IListingView[]>;
    findByVal(val:IListingView): Promise<IListingView[]>; 
}

export class ListingViewRepository implements IListingViewRepository {
    private ListingView;

    constructor() {
        this.ListingView = db.ListingView
    }

    async create(listingView: IListingView): Promise<IListingView> {
        try {
            const newListingView = await this.ListingView.create(listingView)
            return newListingView.dataValues
        }
        catch (err: any) {
            throw new Error(err)
        }
    }

    async update(updateVal: IListingView, search: IListingView): Promise<boolean> {
        try{
            const update = await this.ListingView.update(updateVal, { where: search})
            if(update[0] == 0){
                throw new Error("Listing view account not updated")
            }
            return true
        }
        catch(err:any){
            throw new Error(err)
        }
    }

    async delete(search: IListingView): Promise<boolean> {
        try{
            await this.ListingView.destroy({where:search})
            return true
        }
        catch(err:any){
            throw new Error(err)
        }
    }

    async findAll(): Promise<IListingView[]> {
        try{
            let listingViews = await this.ListingView.findAll()
            listingViews = listingViews.map((listingView:any)=>listingView.dataValues)
            return listingViews
        }
        catch(err:any){
            throw new Error(err)
        }
    }

    async findByVal(search:IListingView): Promise<IListingView[]> {
        try{
            let listingViews = await this.ListingView.findAll({where:search})
            if(listingViews){
                listingViews = listingViews.map((listingView:any)=>listingView.dataValues)
                return listingViews
            }
            else{
                throw new Error("No listing view found")
            }
        }
        catch(err:any){
            throw new Error(err)
        }
    }
}