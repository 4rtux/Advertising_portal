module.exports = (con,Sequelize) =>{
    const {STRING,INTEGER} = Sequelize
    const Category = con.define("category",{
        id: {
            type: INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name:{
            type:STRING,
            required: true
        },
        added_by:{
            type:INTEGER,
            defaultValue:0,
            required: true,
            comment: "id of the user/admin that added the category"
        },
        approved_by:{
            type:INTEGER,
            defaultValue:0,
            required: true,
            comment: "Id of the admin that approved the category"
        },
        status:{
            type:INTEGER,
            defaultValue:0,
            required: true,
            comment: "(0:new,1:approved)"
        }
    }, {
        charset: 'latin1',
        collate: 'latin1_swedish_ci'
    })

    
    return Category
}

