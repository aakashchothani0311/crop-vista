import express from 'express';
import dotenv from 'dotenv';
import initApp from './app/app.js';

dotenv.config();                                    // loading the environment variables from .env file

const app = express();                              // creating an Express application instance
const PORT = process.env.PORT;                      // getting the port number from environment variable
initApp(app);                                       // initializing the app with middleware and routes
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));      //starting the server