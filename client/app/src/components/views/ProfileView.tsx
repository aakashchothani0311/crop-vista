// ProfileView.tsx
import { Box, Button, Grid, TextField, Link } from '@mui/material';
import { FC, FormEvent, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { loadProfile, getProfile } from '../../store/profile-slice';
import { useTranslation } from 'react-i18next';
import { Account, Address } from '../../models/account';
import { lookInSession } from '../../session/session';
import { getCompanyById, updateCompany } from '../../services/company-service';
import { getFarmerById, updateFarmer } from '../../services/farmer-service';
import { getDistributorById, updateDist } from '../../services/distributor-service';
import { Company } from '../../models/company';
import { Farmer } from '../../models/farmer';
import { Distributor } from '../../models/distributor';
import Spinner from '../common/Spinner';
import { useTheme } from '@emotion/react';
import toast, { Toaster } from 'react-hot-toast';

type FormData = {
    [key: string]: string;
}

const ProfileView: FC = () => {

    const { t } = useTranslation('profileview');
    const dispatch = useDispatch();
    const [spinner, setSpinner] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(true);
    const account: Account = JSON.parse(lookInSession('account') as string);
    const profile = useSelector(getProfile);

    const theme = useTheme();
 
    useEffect(() => {
        console.log(profile);
        if (Object.keys(profile).length > 0) {
            setLoading(false);
            setSpinner(false);
        }
        else {
            if (account.role === 'farmer') {
                getFarmerById(account.child)
                .then((response: Farmer) => { 
                    dispatch(loadProfile(response));
                    setLoading(false);
                    setSpinner(false);
                    console.log('response', response);
                })
                .catch((error: Error) => {
                    setLoading(false);
                    setSpinner(false);
                    console.log('Error in getting farmer profile details', error);
                });
            } else if (account.role === 'company') {
                getCompanyById(account.child)
                .then((response: Company) => { 
                    dispatch(loadProfile(response));
                    setLoading(false);
                    setSpinner(false);
                })
                .catch((error: Error) => {
                    setLoading(false);
                    setSpinner(false);
                    console.log('Error in getting company profile details', error);
                });
            } else if (account.role === 'distributor') {
                getDistributorById(account.child)
                .then((response: Distributor) => { 
                    dispatch(loadProfile(response));
                    setLoading(false);
                    setSpinner(false);
                })
                .catch((error: Error) => {
                    console.log('Error in getting distributor profile details', error);
                    setLoading(false);
                    setSpinner(false);
                });
            }
        }
    }, []);

    const handleUpdate = (formJson: FormData): void => {
        const tempProfile = JSON.parse(JSON.stringify(profile));

        tempProfile.profile.address = {
            street1: formJson.street1 as string,
            street2: formJson?.street2,
            city: formJson.city,
            state: formJson.state,
            zip: formJson.zip,
            country: formJson.country
        }
    
        if (account.role === 'farmer') {
            updateFarmer(profile.id, tempProfile)
            .then((response: Farmer) => {
                console.log('response', response);
                dispatch(loadProfile(response));
                setSpinner(false);
                toast.success('Account updated successfully!');
            })
            .catch((error: Error) => {
                setSpinner(false);
                toast.error('Account could not be updated.');
            });
        } else if (account.role === 'company') {
            updateCompany(profile.id as string, tempProfile)
            .then((response: Company) => {
                dispatch(loadProfile(response));
                setSpinner(false);
                toast.success('Account updated successfully!');
            })
            .catch((error: Error) => {
                setSpinner(false);
                toast.error('Account could not be updated.');
            });
        } else if (account.role === 'distributor') {
            updateDist(profile.id, tempProfile)
            .then((response: Distributor) => {
                dispatch(loadProfile(response));
                setSpinner(false);
                toast.success('Account updated successfully!');
            })
            .catch((error: Error) => {
                setSpinner(false);
                toast.error('Account could not be updated.');
            });
        }
    };        

    return (
        <>
            {!loading && 
                <Box
                    borderColor={theme.palette.primary.main}
                    component="form" 
                    onSubmit={(event: FormEvent<HTMLFormElement>) => {
                        event.preventDefault();
                        const formData = new FormData(event.currentTarget);
                        const formJson = Object.fromEntries((formData as any).entries());
                        handleUpdate(formJson);
                    }}       
                    sx={{
                        width: '60%',
                        margin: 'auto',
                        borderWidth: 2,
                        borderStyle: 'solid',
                        borderRadius: 1,
                        padding: '1rem',
                        align: 'center'                                               
                    }}
                >
                    <Grid container spacing={1}>
                        <Grid item xs={12}>
                            <TextField
                                id="name" name="name" label={t("profileview.grid.txtfield.label.name")} value={profile.profile.name} margin="dense" variant="standard" fullWidth disabled
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                id="username" name="username" label={t("profileview.grid.txtfield.label.username")} value={account.username} margin="dense" variant="standard" fullWidth disabled
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                id="email" name="email" label={t("profileview.grid.txtfield.label.email")} value={profile.profile.email} margin="dense" variant="standard" fullWidth disabled
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                id="street1" name="street1" label={t("profileview.grid.txtfield.label.street1")} defaultValue={profile.profile.address?.street1} required margin="dense" variant="standard" fullWidth
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                id="street2" name="street2" label={t("profileview.grid.txtfield.label.street2")} defaultValue={profile.profile.address?.street2} margin="dense" variant="standard" fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                id="city" name="city" label={t("profileview.grid.txtfield.label.city")} defaultValue={profile.profile.address?.city} required margin="dense" variant="standard" fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                id="state" name="state" label={t("profileview.grid.txtfield.label.state")} defaultValue={profile.profile.address?.state} required margin="dense" variant="standard" fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                id="zip" name="zip" label={t("profileview.grid.txtfield.label.zip")} defaultValue={profile.profile.address?.zip} required  margin="dense" variant="standard" fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                id="country" name="country" label={t("profileview.grid.txtfield.label.country")} defaultValue={profile.profile.address?.country} required margin="dense" variant="standard" fullWidth
                            />
                        </Grid>
                    </Grid>
                    
                    <Grid container textAlign="center">
                        <Grid item xs={12}>
                            <Button
                                type="submit"
                                variant="contained"
                                sx={{ mt: 3, mb: 3, py: 1.5, px: 4, fontSize: '0.875rem' }}
                            >
                                {t("profileview.box.button.update.profile")}
                            </Button>
                        </Grid>
                        <Grid item xs={12}>
                            <Link href="/resetpassword" sx={{ fontSize: '0.875rem' }}>{t("profileview.box.grid.link.resetpassword")}</Link>
                        </Grid>
                    </Grid>
                </Box>
            }
            <Toaster />
            <Spinner open={spinner} />
        </>
    );
};

export default ProfileView;