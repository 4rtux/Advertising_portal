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

// Define relationships

db.User.hasMany(db.Listing,{as:'listings',foreignKey:'user_id'})
db.Listing.belongsTo(db.User, {as:'user',foreignKey:'user_id'});
db.User.hasMany(db.ListingFavorite,{as:'favorites',foreignKey:'user_id'})
db.ListingFavorite.belongsTo(db.User, {as:'user',foreignKey:'user_id'});
db.User.hasMany(db.ListingView,{as:'views',foreignKey:'user_id'})
db.ListingView.belongsTo(db.User, {as:'user',foreignKey:'user_id'});
db.User.hasMany(db.Category,{as:'categories',foreignKey:'added_by'})
db.Category.belongsTo(db.User, {as:'author',foreignKey:'added_by'});
db.Administrator.hasMany(db.Category,{as:'categories',foreignKey:'approved_by'})
db.Category.belongsTo(db.Administrator, {as:'author',foreignKey:'added_by'});
db.Category.belongsTo(db.Administrator, {as:'approved_by',foreignKey:'approved_by'});

db.Listing.hasMany(db.ListingFavorite,{as:'favorites',foreignKey:'listing_id'})
db.ListingFavorite.belongsTo(db.Listing, {as:'listing',foreignKey:'listing_id'});
db.Listing.hasMany(db.ListingView,{as:'views',foreignKey:'listing_id'})
db.ListingView.belongsTo(db.Listing, {as:'listing',foreignKey:'listing_id'});

db.Plan.hasMany(db.Promotion,{as:'promotions',foreignKey:'plan_id'})
db.Promotion.belongsTo(db.Plan, {as:'plan',foreignKey:'plan_id'});
db.User.hasMany(db.Promotion,{as:'promotions',foreignKey:'user_id'})
db.Promotion.belongsTo(db.User, {as:'user',foreignKey:'user_id'});
db.Listing.hasMany(db.Promotion,{as:'promotions',foreignKey:'listing_id'})
db.Promotion.belongsTo(db.Listing, {as:'listing',foreignKey:'listing_id'});

db.User.hasMany(db.Report,{as:'authored_reports',foreignKey:'made_by'})
db.Report.belongsTo(db.User, {as:'author',foreignKey:'made_by'});
db.User.hasMany(db.Report,{as:'reports',foreignKey:'culprit_id'})
db.Report.belongsTo(db.User, {as:'culprit',foreignKey:'culprit_id'});
db.Administrator.hasMany(db.Report,{as:'resolved_reports',foreignKey:'resolved_by'})
db.Report.belongsTo(db.Administrator, {as:'resolver',foreignKey:'resolved_by'});
db.Listing.hasMany(db.Report,{as:'reports',foreignKey:'listing_id'})
db.Report.belongsTo(db.Listing, {as:'listing',foreignKey:'listing_id'});

db.User.hasMany(db.Review,{as:'reviews',foreignKey:'user_id'})
db.Review.belongsTo(db.User, {as:'user',foreignKey:'user_id'});
db.User.hasMany(db.Review,{as:'authored_reviews',foreignKey:'reviewer_id'})
db.Review.belongsTo(db.User, {as:'reviewer',foreignKey:'reviewer_id'});



//alter will make sure that the table is updated with the new changes
con.sync({ alter: true })
.then(() => {
    console.log('Table created successfully');
})
.catch((error) => {
    console.error('Error creating table:', error);
});

// export default db;
export { db }