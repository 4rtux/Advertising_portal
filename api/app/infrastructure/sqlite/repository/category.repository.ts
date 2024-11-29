import { db } from '../models/index';

export type ICategoryOptional = Partial<ICategory>;
export interface ICategory {
    id: number;
    name: string;
    added_by: number;
    approved_by: number;
    status: number;
}

export interface ICategoryRepository {
    create(data: ICategoryOptional): Promise<ICategory>;
    update(updateVal: ICategoryOptional, search: ICategoryOptional): Promise<boolean>;
    delete(search: ICategoryOptional): Promise<boolean>;
    findAll(): Promise<ICategory[]>;
    findByVal(val:ICategoryOptional): Promise<ICategory[]>; 
}

export class CategoryRepository implements ICategoryRepository {
    private Category;

    constructor() {
        this.Category = db.Category
    }

    async create(category: ICategoryOptional): Promise<ICategory> {
        try {
            const newCategory = await this.Category.create(category)
            return newCategory.dataValues
        }
        catch (err: any) {
            throw new Error(err)
        }
    }

    async update(updateVal: ICategoryOptional, search: ICategoryOptional): Promise<boolean> {
        try{
            const update = await this.Category.update(updateVal, { where: search})
            if(update[0] == 0){
                throw new Error("Category account not updated")
            }
            return true
        }
        catch(err:any){
            throw new Error(err)
        }
    }

    async delete(search: ICategoryOptional): Promise<boolean> {
        try{
            await this.Category.destroy({where:search})
            return true
        }
        catch(err:any){
            throw new Error(err)
        }
    }

    async findAll(): Promise<ICategory[]> {
        try{
            let categories = await this.Category.findAll()
            categories = categories.map((category:any)=>category.dataValues)
            return categories
        }
        catch(err:any){
            throw new Error(err)
        }
    }

    async findByVal(search:ICategoryOptional): Promise<ICategory[]> {
        try{
            let categories = await this.Category.findAll({where:search})
            if(categories){
                categories = categories.map((category:any)=>category.dataValues)
                return categories
            }
            else{
                throw new Error("No category found")
            }
        }
        catch(err:any){
            throw new Error(err)
        }
    }
}