import express from 'express';
import * as cropController from '../controllers/cropController.js';

const cropRouter = express.Router();

// Routes for Crop
cropRouter.route('/')   
    .get(cropController.search)
   
export default cropRouter;