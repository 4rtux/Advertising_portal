module.exports = (con,Sequelize) =>{
    const {STRING,INTEGER,BOOLEAN,DATE} = Sequelize
    const Promotion = con.define("promotion",{
        id: {
            type: INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        listing_id:{
            type:INTEGER,
            required: true
        },
        user_id:{
            type:INTEGER,
            required: true
        },
        plan_id:{
            type:INTEGER,
            required: true
        },
        paid:{
            type:BOOLEAN,
            required: true
        },
        from:{
            type:STRING,
            required: true
        },
        to:{
            type:STRING,
            required: true
        },
        status:{
            type:INTEGER,
            defaultValue:0,
            required: true,
            comment: "(-1:restricted,0:new,1:active)"
        }
    }, {
        charset: 'latin1',
        collate: 'latin1_swedish_ci'
      }) 

    return Promotion
}

