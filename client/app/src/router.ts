import { createBrowserRouter } from 'react-router-dom';

import LandingPage from './pages/LandingPage';
import SignIn from './components/userauth/SignIn';
import SignUp from './components/userauth/SignUp';
import PasswordReset from './components/userauth/PasswordReset';

import AppPage from './pages/AppPage';
import MarketView from './components/views/MarketView';
import SupplyView from './components/views/SupplyView';
import DemandView from './components/views/DemandView';
import ContractView from './components/views/ContractView';
import ProfileView from './components/views/ProfileView';
import ProcNegotiationsView from './components/views/ProcNegotiationsView';
import OfferNegotiationsView from './components/views/OfferNegotiationsView';

/* Routing structure with paths and associated components */
export const router = createBrowserRouter([
    {
        path: '/',
        Component: LandingPage,
        children: [ 
            {
                path: '',
                Component: SignIn
            },
            {
                path: 'signup',
                Component: SignUp
            },
            {
                path: 'resetpassword',
                Component: PasswordReset
            }
        ]
    },
    {
        path: '/app',
        Component: AppPage,
        children: [ 
            {
                index: true,
                Component: MarketView
            },
            {
                path: 'marketview',
                Component: MarketView
            },
            {
                path: 'supplies',
                Component: SupplyView
            },
            {
                path: 'demands',
                Component: DemandView
            },
            {
                path: 'contracts',
                Component: ContractView
            },
            {
                path: 'procnegotiations',
                Component: ProcNegotiationsView
            },
            {
                path: 'offernegotiations',
                Component: OfferNegotiationsView
            },
            {
                path: 'profile',
                Component: ProfileView
            }
        ]
    }
]);
