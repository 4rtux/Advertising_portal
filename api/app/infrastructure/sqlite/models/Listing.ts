module.exports = (con,Sequelize) =>{
    const {STRING,INTEGER,JSON,ENUM,TEXT} = Sequelize
    const Listing = con.define("listing",{
        id: {
            type: INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name:{
            type:STRING,
            required: true
        },
        pictures:{
            type:JSON,
            required: true,
            comment: "Array of pictures of the listing [filename1,filename2]"
        },
        type: {
            type: ENUM('new', 'used', 'refurbished'),
            allowNull: false,
        },
        price:{
            type:STRING,
            required: false
        },
        user_id:{
            type:INTEGER,
            defaultValue:0,
            required: true,
            comment: "id of the user that added the listing"
        },
        description:{
            type:TEXT,
            required: true
        },
        category_id:{
            type:STRING,
            required: true
        },
        status:{
            type:INTEGER,
            defaultValue:1,
            required: true,
            comment: "(-1:hidden,0:sold,1:active,2:removed by admin)"
        }
    }, {
        charset: 'latin1',
        collate: 'latin1_swedish_ci'
    })

    
    return Listing
}

