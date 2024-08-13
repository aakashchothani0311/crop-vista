import express from 'express';
import * as companyController from '../controllers/companyController.js';

const companyRouter = express.Router();

// Routes for Company
companyRouter.route('/')   
    .post(companyController.post);

companyRouter.route('/:id')
    .get(companyController.get)
    .put(companyController.put);
   
export default companyRouter;