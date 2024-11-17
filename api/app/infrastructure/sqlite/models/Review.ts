module.exports = (con,Sequelize) =>{
    const {INTEGER,REAL,TEXT} = Sequelize
    const Review = con.define("review",{
        id: {
            type: INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        user_id:{
            type:INTEGER,
            required: true,
            comment: "id of the user that is being reviewed"
        },
        reviewed_by:{
            type:INTEGER,
            required: true,
            comment: "id of the user that wrote the review"
        },
        message:{
            type:TEXT,
            required: true,
            comment: "The review message"
        },
        star:{
            type:REAL,
            required: true,
            comment: "eg 4,3.5"
        }
    }, {
        charset: 'latin1',
        collate: 'latin1_swedish_ci'
    })

    
    return Review
}

