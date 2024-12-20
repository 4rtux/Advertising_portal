import { Sequelize } from 'sequelize';
import { config as dbConfig } from '../config/db.config';

const DBStorage = dbConfig[process.env.NODE_ENV || 'development']
// Create Sequelize instance
const con = new Sequelize({
    dialect: 'sqlite',            // Set dialect to 'sqlite'
    storage: DBStorage,  // Path to SQLite database file
    logging: false                 // Optional: disable logging for cleaner output
});

interface IDatabase {
    Sequelize: any,
    con: any,
    Administrator?: any,
    Category?: any,
    Listing?: any,
    ListingFavorite?: any,
    ListingView?: any,
    Plan?: any,
    Promotion?: any,
    Report?: any,
    Review?: any,
    User?: any
}
 
const db: IDatabase = {
    Sequelize: Sequelize,
    con: con
}

// db.Sequelize = Sequelize;
// db.con = con;


// Import all models
db.Administrator = require("./Administrator")(con,Sequelize)
db.Category = require("./Category")(con,Sequelize)
db.Listing = require("./Listing")(con,Sequelize)
db.ListingFavorite = require("./ListingFavorite")(con,Sequelize)
db.ListingView = require("./ListingView")(con,Sequelize)
db.Plan = require("./Plan")(con,Sequelize)
db.Promotion = require("./Promotion")(con,Sequelize)
db.Report = require("./Report")(con,Sequelize)
db.Review = require("./Review")(con,Sequelize)
db.User = require("./User")(con,Sequelize)

// // Define relationships
// // User to Listing relationships
// db.User.hasMany(db.Listing, { as: 'listings', foreignKey: 'user_id' });
// db.Listing.belongsTo(db.User, { as: 'owner', foreignKey: 'user_id' });

// // User to ListingFavorite relationships
// db.User.hasMany(db.ListingFavorite, { as: 'favoriteListings', foreignKey: 'user_id' });
// db.ListingFavorite.belongsTo(db.User, { as: 'favoritedBy', foreignKey: 'user_id' });

// // User to ListingView relationships
// db.User.hasMany(db.ListingView, { as: 'viewedListings', foreignKey: 'user_id' });
// db.ListingView.belongsTo(db.User, { as: 'viewer', foreignKey: 'user_id' });

// // User to Category relationships
// db.User.hasMany(db.Category, { as: 'addedCategories', foreignKey: 'added_by' });
// db.Category.belongsTo(db.User, { as: 'addedByUser', foreignKey: 'added_by' });

// // Administrator to Category relationships
// db.Administrator.hasMany(db.Category, { as: 'approvedCategories', foreignKey: 'approved_by' });
// db.Category.belongsTo(db.Administrator, { as: 'approvedByAdmin', foreignKey: 'approved_by' });

// // Listing to ListingFavorite relationships
// db.Listing.hasMany(db.ListingFavorite, { as: 'favorites', foreignKey: 'listing_id' });
// db.ListingFavorite.belongsTo(db.Listing, { as: 'favoritedListing', foreignKey: 'listing_id' });

// // Listing to ListingView relationships
// db.Listing.hasMany(db.ListingView, { as: 'views', foreignKey: 'listing_id' });
// db.ListingView.belongsTo(db.Listing, { as: 'viewedListing', foreignKey: 'listing_id' });

// // Plan to Promotion relationships
// db.Plan.hasMany(db.Promotion, { as: 'promotions', foreignKey: 'plan_id' });
// db.Promotion.belongsTo(db.Plan, { as: 'planDetails', foreignKey: 'plan_id' });

// // User to Promotion relationships
// db.User.hasMany(db.Promotion, { as: 'userPromotions', foreignKey: 'user_id' });
// db.Promotion.belongsTo(db.User, { as: 'promotionOwner', foreignKey: 'user_id' });

// // Listing to Promotion relationships
// db.Listing.hasMany(db.Promotion, { as: 'listingPromotions', foreignKey: 'listing_id' });
// db.Promotion.belongsTo(db.Listing, { as: 'promotedListing', foreignKey: 'listing_id' });

// // User to Report relationships
// db.User.hasMany(db.Report, { as: 'authoredReports', foreignKey: 'made_by' });
// db.Report.belongsTo(db.User, { as: 'reportAuthor', foreignKey: 'made_by' });

// db.User.hasMany(db.Report, { as: 'reportedIssues', foreignKey: 'culprit_id' });
// db.Report.belongsTo(db.User, { as: 'reportedUser', foreignKey: 'culprit_id' });

// // Administrator to Report relationships
// db.Administrator.hasMany(db.Report, { as: 'resolvedReports', foreignKey: 'resolved_by' });
// db.Report.belongsTo(db.Administrator, { as: 'reportResolver', foreignKey: 'resolved_by' });

// // Listing to Report relationships
// // db.Listing.hasMany(db.Report, { as: 'relatedReports', foreignKey: 'listing_id' });
// // db.Report.belongsTo(db.Listing, { as: 'reportedListing', foreignKey: 'listing_id' });

// // User to Review relationships
// db.User.hasMany(db.Review, { as: 'receivedReviews', foreignKey: 'user_id' });
// db.Review.belongsTo(db.User, { as: 'reviewedUser', foreignKey: 'user_id' });

// db.User.hasMany(db.Review, { as: 'authoredReviews', foreignKey: 'reviewer_id' });
// db.Review.belongsTo(db.User, { as: 'reviewAuthor', foreignKey: 'reviewer_id' });


// con.query('PRAGMA foreign_keys = OFF;')
// .then(() => {
//     return con.sync({ alter: true })
// })
// .then(() => {
//     return con.query('PRAGMA foreign_keys = ON;')
// })


// con.sync({ force: true }) // Drops and recreates tables instead of altering them
// .then(() => {
//     console.log('Table created successfully');
// })
// .catch((error) => {
//     console.error('Error creating table:', error);
// });
// alter will make sure that the table is updated with the new changes
con.sync({ alter: true })
.then(() => {
    console.log('Table altered successfully');
})
.catch((error) => {
    console.error('Error altering table:', error);
});

// con.query('DROP TABLE IF EXISTS users_backup;')
// .then(() => {
//     console.log('Table dropped successfully');
// })
// .catch((error) => {
//     console.error('Error dropping table:', error);
// });

// export default db;
export { db }