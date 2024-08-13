import { FC, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Box, Button, Grid, TextField, Typography } from '@mui/material';
import { Account } from '../../models/account';
import { useTranslation } from 'react-i18next';
import { getAccount } from '../../services/user-auth-service';
import { Toaster, toast } from 'react-hot-toast';
import { storeInSession } from '../../session/session';

/* Define the type for form data, where keys are strings and values are either strings or undefined */
type FormData = {
    [key: string]: string | undefined;
}

const SignIn: FC = () => {
    const navigate = useNavigate();

    const { t } = useTranslation('signin');
    
    /* Handle form submission */
    const handleSubmit = (formJson: FormData = {}) => {
        const params = {
            username: formJson.username,
            password: formJson.password
        };

        /* Call the getAccount function to fetch account data based on the provided username and password */
        getAccount(params)
        .then((response: Account) => {
            /* If account data is returned, store account data in session storage */
            if(response){
                storeInSession('account', JSON.stringify(response));
                navigate('/app');
            } else 
                /* If no account data is returned, display an error toast notification */
                toast.error('Incorrect username/ password.');
        })
        .catch((error: Error) => console.log('Error fetching account', error))
    }

    return (
        <>
            <Toaster position="bottom-right" />
            <Typography component="h5" variant="h5">{t("signin.title")}</Typography>
            <Box component="form" onSubmit={(event: FormEvent<HTMLFormElement>) => {
                    event.preventDefault();
                    const formData = new FormData(event.currentTarget);
                    const formJson = Object.fromEntries((formData as any).entries());
                    handleSubmit(formJson);
                }}
            >
                {/* Input fields for Username and Password and submit button */}
                <TextField id="uname" name="username" label={t("signin.label.username")} required margin="dense" variant="standard" fullWidth autoFocus />
                <TextField id="password" name="password" label={t("signin.label.password")} type="password" required margin="dense" variant="standard" fullWidth />
                <Button type="submit" fullWidth variant="contained" sx={{ mt: 5, mb: 5 }}>{t("signin.button.label")}</Button>

                {/* Links to sign-up and password reset pages */}
                <Grid container textAlign="center">
                    <Grid item xs={12}>
                        <Link to="signup">{t("signin.signup.label")}</Link>
                    </Grid>
                </Grid>
            </Box>
        </>
    )
}

export default SignIn;
