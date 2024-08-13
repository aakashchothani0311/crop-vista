import express from 'express';
import * as distProcController from '../controllers/distProcController.js';

const distProcRouter = express.Router();

// Routes for Distributor Procurements
distProcRouter.route('/')   
    .get(distProcController.search)
    .post(distProcController.post);

distProcRouter.route('/:id')
    .put(distProcController.put);
   
export default distProcRouter;