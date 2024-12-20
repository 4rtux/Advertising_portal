
module.exports = (con,Sequelize) =>{
    const {STRING,INTEGER,TEXT} = Sequelize
    const Report = con.define("report",{
        id: {
            type: INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        made_by:{
            type:INTEGER,
            required: true,
            comment: "id of the user that made the report"
        },
        description:{
            type:TEXT,
            required: true,
            comment: "Description of the report ie reason for reporting"
        },
        culprit_id:{
            type:INTEGER,
            required: true,
            comment: "id of the user being reported"
        },
        resolved_by:{
            type:INTEGER,
            // defaultValue:0,
            required: false,
            comment: "Id of the admin that resolved the report"
        },
        status:{
            type:INTEGER,
            defaultValue:0,
            required: true,
            comment: "(0:new,1:seen,2:resolved)"
        }
    }, {
        charset: 'latin1',
        collate: 'latin1_swedish_ci'
    })

    
    return Report
}

