import express from 'express';
import * as distOfferController from '../controllers/distOfferController.js';

const distOfferRouter = express.Router();

// Routes for Distributor Offer
distOfferRouter.route('/')   
    .get(distOfferController.search)
    .post(distOfferController.post);

distOfferRouter.route('/:id')
    .put(distOfferController.put);
   
export default distOfferRouter;