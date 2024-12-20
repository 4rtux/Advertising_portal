module.exports = (con,Sequelize) =>{
    const {INTEGER} = Sequelize
    const ListingView = con.define("listing_view",{
        id: {
            type: INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        listing_id:{
            type:INTEGER,
            required: true,
            comment: "id of the viewed listing"
        },
        user_id:{
            type:INTEGER,
            required: true,
            comment: "id of the user that viewed the listing or 0 if not logged in"
        }
    }, {
        charset: 'latin1',
        collate: 'latin1_swedish_ci'
    })

    
    return ListingView
}

