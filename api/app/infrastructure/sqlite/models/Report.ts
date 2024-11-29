
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
        type:{
            type:STRING,
            required: true,
            comment: "Type of the report eg listing or user"
        },
        description:{
            type:TEXT,
            required: true,
            comment: "Description of the report ie reason for reporting"
        },
        listing_id:{
            type:INTEGER,
            comment: "id of the listing being reported"
        },
        culprit_id:{
            type:INTEGER,
            comment: "id of the user being reported"
        },
        resolved_by:{
            type:INTEGER,
            defaultValue:0,
            required: true,
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

