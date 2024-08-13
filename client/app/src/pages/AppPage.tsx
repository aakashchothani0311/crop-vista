import { Outlet, useLocation } from 'react-router-dom';
import AppBarComp from '../components/common/AppBarComp';
import Chatbot from '../components/fugu-chatbot/Chatbot';
import { ThemeProvider } from '@emotion/react';
import { useEffect, useState } from 'react';
import { lookInSession } from '../session/session';
import farmerTheme from '../assets/themes/farmerTheme';
import distributorTheme from '../assets/themes/distributorTheme';
import companyTheme from '../assets/themes/companyTheme';

const AppPage = () => {
    /* State to manage the current theme */
    const [theme, setTheme] = useState(farmerTheme);

    useEffect(() => {
        /* Retrieve account information from session */
        const accountString: string | null = lookInSession('account');

        if (accountString != null) {
            /* Parse the account information */
            const account = JSON.parse(accountString);

            /* Set theme based on user role */
            if (account.role === 'distributor')
                setTheme(distributorTheme);
            else if (account.role === 'company')
                setTheme(companyTheme);
        }
    }, [])

    const location = useLocation();
    
    const showChatbotRoutes = [
        '/app',
        '/app/marketview',
        '/app/supplies',
        '/app/demands',
        '/app/contracts',
        '/app/procnegotiations',
        '/app/offernegotiations',
        '/app/profile'
    ];
    
    const shouldShowChatbot = showChatbotRoutes.includes(location.pathname);
    
    return (
        <>
            {/* Apply the current theme to the application */}
            <ThemeProvider theme={theme}>
                {/* Render the AppBar component */}
                <AppBarComp />
                {/* Main content area with dynamic margin and width */}
                <div style={{ marginTop: "1rem", marginInline: "auto", width: "90%" }}>
                    {/* Render the child routes */}
                    <Outlet />
                </div>
                {shouldShowChatbot && <Chatbot />} 
            </ThemeProvider>
        </>
    );
};

export default AppPage;
