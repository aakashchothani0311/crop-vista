import { FC, FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Box, Button, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import Spinner from '../common/Spinner';
import { Farmer } from '../../models/farmer';
import { createFarmer } from '../../services/farmer-service';
import toast, { Toaster } from 'react-hot-toast';
import { Account, Profile } from '../../models/account';
import { createAccount } from '../../services/user-auth-service';
import { AppDispatch } from '../../store';
import { useDispatch } from 'react-redux';
import { storeInSession } from '../../session/session';
import { Distributor } from '../../models/distributor';
import { Company } from '../../models/company';
import { createCompany } from '../../services/company-service';
import { createDistributor } from '../../services/distributor-service';

/* type for form data, where keys are strings and values are strings */
type FormData = {
    [key: string]: string;
}

/* Regular expression for password validation */
const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;

const SignUp: FC = () => {
     /* State for the profile type (farmer, company, or distributor) and spinner for loading state */
    const [formProfile, setFormProfile] = useState<string>('farmer');
    const [spinner, setSpinner] = useState<boolean>(false);

    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    
    const { t } = useTranslation('signup');

    /* Handle form submission */
    const handleSubmit = (formJson: FormData): void => {
        /* Validate password using the regular expression */
        if (!passwordRegex.test(formJson.password))
            toast.error("Password should be 6 to 20 characters long with a numeric, 1 lowercase and 1 uppercase letter")
        else {
            setSpinner(true);
    
            const profile: Profile = {
                name: formJson.name,
                email: formJson.email
            }
            
            /* Create the profile based on selected profile type */
            if(formProfile === 'farmer'){
                createFarmer({ profile })
                .then((response: Farmer | Company | Distributor) => generateAccount(response.id, formJson))
                .catch((error: Error) => {
                    toast.error('Some error occured. Please refresh and try again.');
                    console.log('Error creating farmer record', error);
                })
            } else if (formProfile === 'company') {
                createCompany({ profile })
                .then((response: Company) => generateAccount(response.id, formJson))
                .catch((error: Error) => {
                    toast.error('Some error occured. Please refresh and try again.');
                    console.log('Error creating farmer record', error);
                })
            } else if (formProfile === 'distributor') {
                createDistributor({ profile })
                .then((response: Distributor) => generateAccount(response.id, formJson))
                .catch((error: Error) => {
                    toast.error('Some error occured. Please refresh and try again.');
                    console.log('Error creating farmer record', error);
                })
            }
        }
    }

    /* Generate an account after creating the profile */
    const generateAccount = (childId: string, formJson: FormData): void => {
        const account: FormData = {
            username: formJson.username,
            password: formJson.password,
            role: formProfile,
            child: childId
        }

        /* Call createAccount to generate an account */
        createAccount(account)
        .then((response: Account) => {
            storeInSession('account', JSON.stringify(response));
            navigate('/app');
            setSpinner(false);
        })
        .catch((error: Error) => {
            setSpinner(false);
            toast.error('Some error occured. Please refresh and try again.');
            console.log('Error creating account record', error);
        })
    }

    return (
        <>  
            <Typography component="h5" variant="h5" gutterBottom>{t("signup.title")}</Typography>
            <Box component="form" onSubmit={(event: FormEvent<HTMLFormElement>) => {
                    event.preventDefault();
                    const formData = new FormData(event.currentTarget);
                    const formJson = Object.fromEntries((formData as any).entries());
                    handleSubmit(formJson);
                }}
            >
                <Grid container>
                    {/* Input fields for Name, Email, Username and Password */}
                    <Grid item xs={12}>
                        <TextField id="name" name="name" label={t("signup.name")} required margin="dense" variant="standard" fullWidth />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField id="email" name="email" label={t("signup.email.address")} type="email" required margin="dense" variant="standard" fullWidth />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField id="username" name="username" label={t("signup.username")} required margin="dense" variant="standard" fullWidth />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField id="password" name="password" label={t("signup.txtfield.label.password")} type="password" required margin="dense" variant="standard" fullWidth />
                    </Grid>
                    {/* Menu for selecting Profile type */}
                    <Grid item xs={12}>
                        <FormControl required margin="dense" variant="standard" fullWidth>
                            <InputLabel id="profile-label">{t("signup.menu.label")}</InputLabel>
                            <Select id="profile" labelId="profile-label" value={formProfile} onChange={(event) => setFormProfile(event.target.value)}>
                                <MenuItem value="farmer">{t("signup.menu.farmer")}</MenuItem>
                                <MenuItem value="distributor">{t("signup.menu.distributor")}</MenuItem>
                                <MenuItem value="company">{t("signup.menu.company")}</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    {/* Submit button */}
                    <Grid item xs={12}>
                        <Button type="submit" fullWidth variant="contained" sx={{ mt: 5, mb: 5 }}>{t("signup.button.label")}</Button>  
                    </Grid>
                </Grid>
            </Box>
            {/* Link to sign in page */}
            <Grid container textAlign="center">
                <Grid item xs={12}>
                    <Link to="/">{t("signup.signin.label")}</Link>
                </Grid>
            </Grid>
            
            <Toaster />

            <Spinner open={spinner} />
        </>
    )
}

export default SignUp;