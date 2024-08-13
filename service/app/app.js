import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';

import initRoutes from './routers/index.js';

const init = (app) => {
    app.use(cors());                    // Using the CORS middleware to allow cross-origin requests
    app.use(express.json());            // Middleware to parse JSON request bodies
    app.use(express.urlencoded());      // Middleware to parse URL-encoded request bodies

    mongoose.connect(process.env.MONGO_CONNECTION);      // Connecting to MongoDB using connection string from env. var
    initRoutes(app);                    // Initializing routes by passing the app instance
}

export default init;