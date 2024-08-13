import { useTranslation } from 'react-i18next';
import { ChangeEvent, FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import { Avatar, Box, Button, Container, IconButton, Menu, MenuItem, Switch, Toolbar, Tooltip, Typography } from '@mui/material';
import { Account } from '../../models/account';
import MenuIcon from '@mui/icons-material/Menu';
import { clearSession, lookInSession, storeInSession } from '../../session/session';
import { changeLanguage } from 'i18next';
import LanguageIcon from '@mui/icons-material/Language';

/* Type definition for navigation pages in the AppBar.*/
type AppBarPages = {
    label: string;
    link: string;
}

/* Functional component for rendering the AppBar with navigation and user settings. */
const AppBarComp: FC = () => {
    const [lang, setLang] = useState<boolean>(false);

    /*  On component mount, check session storage for language preference and apply it. */
    useEffect(() => {
        if(!lookInSession('lng'))
            storeInSession('lng', 'en');
        else {
            const lang = lookInSession('lng') as string;
            setLang(lang === 'hi');
            changeLanguage(lang);
        }
    }, []);

    const { t } = useTranslation('appbar');

    /* Navigation options for different user roles. */
    const farmerView: AppBarPages[] = [
        { label: t("app.marketview"), link: './marketview' },
        { label: t("app.mysupplies"), link: './supplies' },
        { label: t("app.mynegotiations"), link: './procnegotiations' },
        { label: t("app.contract"), link: './contracts' }
    ];
    
    const companyView: AppBarPages[] = [
        { label: t("app.marketview"), link: './marketview' },
        { label: t("app.mydemands"), link: './demands' },
        { label: t("app.mynegotiations"), link: './offernegotiations' },
        { label: t("app.contract"), link: './contracts' }
    ];
    
    const distributorView: AppBarPages[] = [
        { label: t("app.marketview"), link: './marketview' },
        { label: t("app.myprocurements"), link: './procnegotiations' },
        { label: t("app.myoffers"), link: './offernegotiations' },
        { label: t("app.contract"), link: './contracts' }
    ];
    
    /* // User profile setting options. */
    const settings = [t("app.profile"), t("app.logout")];

    const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
    const navigate = useNavigate();

    const account: Account = JSON.parse(lookInSession('account') as string);

    /* Event handler to open the user settings menu. */
    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>): void => {
        setAnchorElUser(event.currentTarget);
    };

    /* Event handler to close the user settings menu. */
    const handleCloseUserMenu = (): void => {
        setAnchorElUser(null);
    };
 
    /* Event handler to open the navigation menu. */
    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>): void => {
        setAnchorElNav(event.currentTarget);
    };

    /* Event handler to close the navigation menu. */
    const handleCloseNavMenu = (): void => {
        setAnchorElNav(null);
    };

    /* Event handler for the profile click action. */
    const handleProfileClick = (): void => {
        handleCloseUserMenu();
        navigate('/app/profile');
    };

    /* Event handler for the logout. */
    const handleLogout = (): void => {
        clearSession();
        navigate('/');
    }

    /* Event handler to toggle language between English and Hindi. */
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

    let pages: AppBarPages[]; 

    /* Determine the pages to display based on user role. */
    if (account.role === 'farmer')
        pages = farmerView;
    else if (account.role === 'company')
        pages = companyView;
    else
        pages = distributorView;

    /* Create buttons for user settings (Profile, Logout). */
    const settingButtons = settings.map((setting) => (
        <MenuItem key={setting} onClick={ setting === t("app.profile") ? handleProfileClick : handleLogout }>
            <Typography textAlign="center">{setting}</Typography>
        </MenuItem>
    ));

    return (
        <AppBar position="static">
            <Container maxWidth="xl">
                <Toolbar>
                    {/* Navigation buttons for larger screens */}
                    <Avatar alt={account.username} src="/src/assets/img/logo.svg" />
                    <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
                        {pages.map((page) => (
                            <Button size="large" key={page.label} onClick={() => navigate(page.link)} sx={{ color: "white" }}>{page.label}</Button>
                        ))}
                    </Box>
                    {/* Navigation menu for smaller screens */}
                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                        <IconButton color="inherit" onClick={handleOpenNavMenu}>
                            <MenuIcon />
                        </IconButton>
                        <Menu anchorEl={anchorElNav} keepMounted open={Boolean(anchorElNav)} onClose={handleCloseNavMenu}
                            anchorOrigin={{
                                vertical: "bottom",
                                horizontal: "left",
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            sx={{
                                display: { xs: 'block', md: 'none' },
                            }}
                        >
                            {pages.map((page) => (
                                <MenuItem key={page.label} onClick={() => { handleCloseNavMenu(); navigate(page.link)}}>
                                    <Typography textAlign="center">{page.label}</Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>

                    {/* Language switch between English and Hindi */}
                    <Box display="flex" flexDirection="row" justifyContent="flex-end" alignItems="center" paddingInlineEnd={3}>
                        <LanguageIcon />
                        <Typography>EN</Typography>
                        <Switch checked={lang} value={lang} onChange={(event: ChangeEvent<HTMLInputElement>) => handleLangChange(event)} sx={{ color: "#ffffff" }} color="secondary"  />
                        <Typography>HI</Typography>
                    </Box>
                    {/* User avatar and settings menu */}
                    <Box>
                        <Tooltip title="Open settings">
                            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                <Avatar alt={account.username} src={account.profilePic} />
                            </IconButton>
                        </Tooltip>
                        <Menu sx={{ mt: "45px" }} id="menu-appbar" anchorEl={anchorElUser} keepMounted open={Boolean(anchorElUser)} onClose={handleCloseUserMenu}
                            anchorOrigin={{
                                vertical: "top",
                                horizontal: "right",
                            }}
                            transformOrigin={{
                                vertical: "top",
                                horizontal: "right",
                            }} 
                        >
                            {settingButtons}
                        </Menu>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}

export default AppBarComp;