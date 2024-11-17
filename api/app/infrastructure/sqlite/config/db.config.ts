import dotenv from 'dotenv'
dotenv.config();

const config = {
    "testing":"./database-test.sqlite",
    "development":"./database-dev.sqlite",
    "production":"./database-prod.sqlite"
}
// config = config[process.env.NODE_ENV || 'development']
export {config}