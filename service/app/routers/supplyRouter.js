import express from 'express';
import * as supplyController from '../controllers/supplyController.js';

const supplyRouter = express.Router();

// Routes for supply 
supplyRouter.route('/')   
    .get(supplyController.search)
    .post(supplyController.post);
   
export default supplyRouter;