import {IRoomRepository, RoomRepository, IRoom} from "../infrastructure/mysql/repository/room.repository";


export interface IMessge{
    status:boolean;
    data?:any;
    message?:string;
}
export default class RoomService {
    private repo: IRoomRepository;

    private roomUIDFormat = {static:2,number:2,alphabet:1,isNew:true,isRandom:true,staticVal:'_alpha_',prevID:''};

    constructor(){
        this.repo = new RoomRepository();
    }

    
    async createRoom(room: IRoom): Promise<IMessge>{
        try{
            const create = await this.repo.create(room)
            if(create){
                return {'status':true,data:{'message':'Room added successfully','room':create}}             
            }
            else{
                return {'status':false,data:{'message':'Failed to add Room'}}
            }
        }
        catch(err:any){
            throw new Error(err)
        }
    }

    async updateRoom(roomID:number, room: IRoom): Promise<IMessge>{
        try{
            const update = await this.repo.update(room,{id:roomID})
            if(update){
                return {'status':true,data:{'message':'Room updated successfully'}}             
            }
            else{
                return {'status':false,data:{'message':'Failed to update Room'}}
            }
        }
        catch(err:any){
            throw new Error(err)
        }
    }

    async roomDetails(val:IRoom): Promise<IRoom>{
        try{
            const rooms = await this.repo.findByVal(val)
            if (rooms.length == 1) {
                return rooms[0]
            }
            else{
                throw new Error("Room not found or room exists more than once")
            }
        }
        catch(err:any){
            throw new Error(err)
        }
    }

    async roomsDetail(val:IRoom): Promise<IRoom[]>{
        try{
            const rooms = await this.repo.findByVal(val)
            return rooms
        }
        catch(err:any){
            throw new Error(err)
        }
    }

    async roomList(): Promise<IRoom[]>{
        try{
            const rooms = await this.repo.findAll()
            return rooms
        }
        catch(err:any){
            throw new Error(err)
        }
    }
}