import {IListingViewRepository, ListingViewRepository, IListingView, IListingViewOptional} from "../infrastructure/sqlite/repository/listing_view.repository";


export interface IMessge{
    status:boolean;
    data?:any;
    message?:string;
}
export default class ListingViewService {
    private repo: IListingViewRepository;

    private listingViewUIDFormat = {static:2,number:2,alphabet:1,isNew:true,isRandom:true,staticVal:'_alpha_',prevID:''};

    constructor(){
        this.repo = new ListingViewRepository();
    }

    
    async createListingView(listingView: IListingViewOptional): Promise<IMessge>{
        try{
            const create = await this.repo.create(listingView)
            if(create){
                return {'status':true,data:{'message':'ListingView added successfully','listingView':create}}             
            }
            else{
                return {'status':false,data:{'message':'Failed to add ListingView'}}
            }
        }
        catch(err:any){
            throw new Error(err)
        }
    }

    async updateListingView(listingViewID:number, listingView: IListingView): Promise<IMessge>{
        try{
            const update = await this.repo.update(listingView,{id:listingViewID})
            if(update){
                return {'status':true,data:{'message':'ListingView updated successfully'}}             
            }
            else{
                return {'status':false,data:{'message':'Failed to update ListingView'}}
            }
        }
        catch(err:any){
            throw new Error(err)
        }
    }

    async listingViewDetails(val:IListingView): Promise<IListingView>{
        try{
            const listingViews = await this.repo.findByVal(val)
            if (listingViews.length == 1) {
                return listingViews[0]
            }
            else{
                throw new Error("ListingView not found or listingView exists more than once")
            }
        }
        catch(err:any){
            throw new Error(err)
        }
    }

    async listingViewsDetail(val:IListingViewOptional): Promise<IListingView[]>{
        try{
            let listingViews = await this.repo.findByVal(val)
            listingViews = listingViews.map((listingView)=>{
                // listingView = listingView.dataValues
                // listingView.date = moment(listingView.createdAt).format('ddd, DD MMM YYYY @ HH:mm');
                return listingView
            })
            return listingViews
        }
        catch(err:any){
            throw new Error(err)
        }
    }

    async listingViewList(): Promise<IListingView[]>{
        try{
            const listingViews = await this.repo.findAll()
            return listingViews
        }
        catch(err:any){
            throw new Error(err)
        }
    }
}