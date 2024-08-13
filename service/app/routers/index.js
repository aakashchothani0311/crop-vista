import accountsRouter from './accountRouter.js';
import farmerRouter from './farmerRouter.js';
import companyRouter from './companyRouter.js';
import distributorRouter from './distributorRouter.js';
import demandRouter from './demandRouter.js';
import supplyRouter from './supplyRouter.js';
import cropRouter from './cropRouter.js';
import distProcRouter from './distProcRouter.js';    // between Farmer and Distributor
import distOfferRouter from './distOfferRouter.js';   // between Company and Distributor

// initial routes for each API
const initRoutes = (app) => {
    app.use('/accounts', accountsRouter);
    app.use('/farmers',farmerRouter);
    app.use('/companies',companyRouter);
    app.use('/distributors',distributorRouter);
    app.use('/demands',demandRouter);
    app.use('/supplies',supplyRouter);
    app.use('/distprocs',distProcRouter);      // between Farmer and Distributor
    app.use('/distoffers',distOfferRouter);    // between Company and Distributor
    app.use('/crops',cropRouter);
};

export default initRoutes;