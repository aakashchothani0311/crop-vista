import express from 'express';
import * as demandController from '../controllers/demandController.js';

const demandRouter = express.Router();

// Routes for Demand
demandRouter.route('/')   
    .get(demandController.search)
    .post(demandController.post);
   
export default demandRouter;