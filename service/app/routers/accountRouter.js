import express from 'express';
import * as accountController from '../controllers/accountController.js';

const accountRouter = express.Router();

// Routes for Account
accountRouter.route('/')
    .get(accountController.search)           // Get by username
    .post(accountController.post);
   
export default accountRouter;