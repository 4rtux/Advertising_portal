module.exports = (con,Sequelize) =>{
    const {STRING,INTEGER} = Sequelize
    const ListingFavorite = con.define("listing_favorite",{
        id: {
            type: INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        listing_id:{
            type:INTEGER,
            required: true,
            comment: "id of the loved listing"
        },
        user_id:{
            type:INTEGER,
            required: true,
            comment: "id of the user that loved the listing"
        }
    }, {
        charset: 'latin1',
        collate: 'latin1_swedish_ci'
    })

    
    return ListingFavorite
}

