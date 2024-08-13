import { Outlet } from 'react-router-dom';
import { Box, Grid, Paper, Switch, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { changeLanguage } from 'i18next';
import LanguageIcon from '@mui/icons-material/Language';
import { ChangeEvent, useEffect, useState } from 'react';
import { lookInSession, storeInSession } from '../session/session';

const LandingPage = () => {
    /* State to manage the current language setting */
    const [lang, setLang] = useState<boolean>(false);

    const { t } = useTranslation('landingpage');

    /* Effects for stored language preference */
    useEffect(() => {
        if(!lookInSession('lng'))
            storeInSession('lng', 'en');
        else {
            const lang = lookInSession('lng') as string;
            setLang(lang === 'hi');
            changeLanguage(lang);
        }
    }, []);

    /* Handle language toggle switch changes */
    const handleLangChange = (event: ChangeEvent<HTMLInputElement>): void => {
        if(event.target.checked){
            setLang(true);
            changeLanguage('hi');
            storeInSession('lng', 'hi');
        } else {
            setLang(false);
            changeLanguage('en');
            storeInSession('lng', 'en');
        }
    }
    
    return (
        <>
            {/* Main container grid for the landing page */}
            <Grid container component="main" sx={{ height: "100vh" }}>
                {/* Grid item for larger screens with background image */}
                <Grid item xs={0} sm={12} md={9} sx={{ 
                    display: {xs: "none", sm: "flex"},
                    backgroundImage: 'url("src/assets/img/landingPage.jpeg")',
                    backgroundSize: "cover",
                    backgroundPosition: "left",
                    paddingLeft: "2rem",
                    alignItems: "center"
                }}>
                    <Box paddingInline={{ sm: "2rem", md: "3rem" }} paddingTop={{ sm: "2rem", md: "3rem" }} paddingBottom={{ sm: "2rem", md: "5rem" }}
                        margin={{ sm: "2rem" }} width="70%" borderRadius="0.5rem 4rem 0.5rem 4rem" sx={{ backgroundImage: "linear-gradient(rgba(79, 51, 27, 1), rgba(79, 51, 27, 0.3))" }}>
                        <Typography component="h2" variant="h2" fontFamily="Edu Australia VIC WA NT Hand" color="#ffffff" sx={{ textShadow: "#fc0 1px 0 10px" }} gutterBottom>
                            {t("landingpage.title")}
                        </Typography>
                        <Typography fontSize="1.5rem" color="#ffffff" fontStyle="italic" sx={{ textShadow: "#fc0 1px 0 10px" }} >{t("landingpage.tagline")}</Typography>
                    </Box>
                </Grid>
                {/* Grid item for sidebar with language switch and logo */}
                <Grid item xs={12} sm={12} md={3} component={Paper}>
                    <Box display="flex" flexDirection="row" justifyContent="flex-end" alignItems="center" paddingBlockStart={3} paddingInlineEnd={3}>
                        <LanguageIcon />
                        <Typography>EN</Typography>
                        <Switch checked={lang} value={lang} onChange={(event: ChangeEvent<HTMLInputElement>) => handleLangChange(event)} sx={{ color: "#ffffff" }} color="primary"  />
                        <Typography>HI</Typography>
                    </Box>
                    <Box my={3} paddingInline={3} display="flex" flexDirection="column" sx={{ alignItems: "center" }}>
                        <img src="src/assets/img/Logo.svg" height="125" width="125"/>
                        <Outlet />
                    </Box>
                </Grid>
            </Grid>
        </>
    )
}

export default LandingPage;
