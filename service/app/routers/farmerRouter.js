import express from 'express';
import * as farmerController from '../controllers/farmerController.js';

const farmerRouter = express.Router();

// Routes for farmer
farmerRouter.route('/')   
    .post(farmerController.post);

farmerRouter.route('/:id')
    .get(farmerController.get)
    .put(farmerController.put);
   
export default farmerRouter;