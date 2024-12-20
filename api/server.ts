import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import requestIp from 'request-ip';
import Sequelize from 'sequelize';
import busboyBodyParser  from 'busboy-body-parser';
import path from 'path';

import { db } from './app/infrastructure/sqlite/models/index';

const Op = db.Sequelize.Op;


dotenv.config();

const port = process.env.PORT || 4000
const app = express()
// Middleware to get client's IP address
app.use(requestIp.mw());


// Serve the 'uploads' folder as a static folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(cors({
    origin: ['http://localhost:3000'] // or an array of allowed origins
}));
// Use busboy-body-parser to handle multipart/form-data requests
// app.use(busboyBodyParser({ limit: '50mb' }));
// app.use(busboyBodyParser());
app.use(busboyBodyParser({ multi: true }));
// parser requests of content-type - application/json
app.use(bodyParser.json())
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended:true}));


require("./app/routes/routes.main")(app)
require("./app/routes/routes.user")(app)
require("./app/routes/routes.administrator")(app)

// 404 Error Handler
app.use((req, res, next) => {
    res.status(404).send('404 - Route not found');
});

app.listen(port, () => {
    console.log(`listening to port ${port}`);
})
