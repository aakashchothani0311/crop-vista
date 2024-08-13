import { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { lookInSession } from '../../session/session';
import { getProfile } from '../../store/profile-slice';
import { Account } from '../../models/account';

const PasswordReset: FC = () => {
    
    const { t } = useTranslation('passwordReset');

    // const { t } = useTranslation('profileview');
    // const navigate = useNavigate();
    // const dispatch = useDispatch();
    // const [spinner, setSpinner] = useState<boolean>(true);
    // const [loading, setLoading] = useState<boolean>(true);
    // const account: Account = JSON.parse(lookInSession('account') as string);
    // const profile = useSelector(getProfile);
    // //console.log('profile:', profile);
    // const theme = useTheme();
    
    // const dispatch = useDispatch<AppDispatch>();
    const [forgotPassword, setForgotPassword ] = useState(1);

    const handleContinue = (event: React.FormEvent) => {
        event.preventDefault();
        setForgotPassword(2);
    }

    return (
        <>
            <Typography component="h5" variant="h5">{t("passreset.title")}</Typography>
            <Box component="form" noValidate onSubmit={handleContinue} sx={{marginTop:'3px'}}>
                {forgotPassword === 1 ? (
                    <>
                        <TextField id="uname" name="username" label= {t("passreset.username")} required margin="dense" variant="standard" fullWidth autoFocus />
                        <TextField id="email" name="email" label={t("passreset.email")} required margin="dense" variant="standard" fullWidth />
                        <Button type="button" onClick={handleContinue} fullWidth variant="contained" sx={{ mt: 5, mb: 5 }}>{t("passreset.continue.button")}</Button>
                    </>
                ) : (
                    <>
                        <TextField id="password" name="password" label={t("passreset.new.password")} type="password" required margin="dense" variant="standard" fullWidth />
                        <TextField id="newPassword" name="newPassword" label={t("passreset.confirm.new.password")} type="password" required margin="dense" variant="standard" fullWidth />
                        <Button type="submit" fullWidth variant="contained" sx={{ mt: 5, mb: 5 }}>{t("reset.password.button")}</Button>
                    </>
                )}
            </Box>
        </>
    )
}

export default PasswordReset;