import React from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { CssBaseline } from '@mui/material';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import { Suspense } from 'react';
import Spinner from './components/common/Spinner';

/* Sets up the main application with Styling, Internationalization, State Management, and Routing. */
const App = () => {
    return (
        <>
            <CssBaseline />
            <I18nextProvider i18n={i18n}>
                <Provider store={store}>
                    <Suspense fallback={<Spinner open={true} />}>
                        <RouterProvider router={router}/>
                    </Suspense>
                </Provider>
            </I18nextProvider>
        </>
    )
}

export default App;
