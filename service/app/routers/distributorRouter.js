import express from 'express';
import * as distributorController from '../controllers/distributorController.js';

const distributorRouter = express.Router();

// Routes for Distributor
distributorRouter.route('/')   
    .post(distributorController.post);

distributorRouter.route('/:id')
    .get(distributorController.get)
    .put(distributorController.put);
   
export default distributorRouter;