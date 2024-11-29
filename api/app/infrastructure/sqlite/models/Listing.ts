module.exports = (con,Sequelize) =>{
    const {STRING,INTEGER,JSON,ENUM} = Sequelize
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
        user_id:{
            type:INTEGER,
            defaultValue:0,
            required: true,
            comment: "id of the user that added the listing"
        },
        status:{
            type:INTEGER,
            defaultValue:0,
            required: true,
            comment: "(-1:deleted,0:hidden,1:active,2:removed by admin)"
        }
    }, {
        charset: 'latin1',
        collate: 'latin1_swedish_ci'
    })

    
    return Listing
}

