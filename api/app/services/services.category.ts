import {ICategoryRepository, CategoryRepository, ICategory, ICategoryOptional} from "../infrastructure/sqlite/repository/category.repository";


export interface IMessge{
    status:boolean;
    data?:any;
    message?:string;
}
export default class CategoryService {
    private repo: ICategoryRepository;

    private categoryUIDFormat = {static:2,number:2,alphabet:1,isNew:true,isRandom:true,staticVal:'_alpha_',prevID:''};

    constructor(){
        this.repo = new CategoryRepository();
    }

    
    async createCategory(category: ICategory): Promise<IMessge>{
        try{
            const create = await this.repo.create(category)
            if(create){
                return {'status':true,data:{'message':'Category added successfully','category':create}}             
            }
            else{
                return {'status':false,data:{'message':'Failed to add Category'}}
            }
        }
        catch(err:any){
            throw new Error(err)
        }
    }

    async updateCategory(categoryID:number, category: ICategory): Promise<IMessge>{
        try{
            const update = await this.repo.update(category,{id:categoryID})
            if(update){
                return {'status':true,data:{'message':'Category updated successfully'}}             
            }
            else{
                return {'status':false,data:{'message':'Failed to update Category'}}
            }
        }
        catch(err:any){
            throw new Error(err)
        }
    }

    async categoryDetails(val:ICategoryOptional): Promise<ICategory>{
        try{
            const categorys = await this.repo.findByVal(val)
            if (categorys.length == 1) {
                return categorys[0]
            }
            else{
                throw new Error("Category not found or category exists more than once")
            }
        }
        catch(err:any){
            throw new Error(err)
        }
    }

    async categorysDetail(val:ICategoryOptional): Promise<ICategory[]>{
        try{
            let categorys = await this.repo.findByVal(val)
            categorys = categorys.map((category)=>{
                // category = category.dataValues
                // category.date = moment(category.createdAt).format('ddd, DD MMM YYYY @ HH:mm');
                return category
            })
            return categorys
        }
        catch(err:any){
            throw new Error(err)
        }
    }

    async categoryList(): Promise<ICategory[]>{
        try{
            const categorys = await this.repo.findAll()
            return categorys
        }
        catch(err:any){
            throw new Error(err)
        }
    }
}