module.exports = (con,Sequelize) =>{
    const {STRING,INTEGER} = Sequelize
    const Plan = con.define("plan",{
        id: {
            type: INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name:{
            type:STRING,
            required: true
        },
        description:{
            type:STRING,
            required: true,
            Comment: "Description of the plan"
        },
        days:{
            type:STRING,
            required: true,
            Comment: "Number of days the plan is valid for"
        },
        status:{
            type:INTEGER,
            defaultValue:0,
            required: true,
            comment: "(0:deleted,1:active)"
        }
    }, {
        charset: 'latin1',
        collate: 'latin1_swedish_ci'
    })

    
    return Plan
}

