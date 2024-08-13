import { createTheme } from "@mui/material";

const companyTheme = createTheme({
    palette: {
        primary: {
            main: "#342d63",
        },
        secondary: {
            main: "#ffffff",
        },
        background: {
            default: "#f3f1fb",
            paper: '#ffffff',
        }
    },
    components: {
        MuiTableContainer: {
            styleOverrides: {
                root: {
                    border: '2px solid #342d63',
                    borderRadius: "5px"
                }
            }
        },
        MuiTableCell: {
            styleOverrides: {
                root: {
                    backgroundColor: "#ffffff",
                    borderBlock: "1px solid #c8c7ea"
                },
                head: {
                    backgroundColor: "#e4e1f3",
                    color: "#342d63",
                    borderBlockEnd: '1px solid #342d63'
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    fontWeight: "bold"
                },
            },
        },
        MuiAvatar: {
            styleOverrides: {
                root: {
                    color: "#ffffff"
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    backgroundColor: "#f3f1fb"
                },
            },
        },
    },
    typography: {
        fontFamily: '"Verdana"',
        h1: {
            fontSize: '2.25rem',
            fontWeight: 400,
        },
        h2: {
            fontSize: '2rem',
            fontWeight: 400,
        },
        h3: {
            fontSize: '1.75rem',
            fontWeight: 400,
        },
        h4: {
            color: '#342d63',
            fontWeight: 400,
        },
        h5: {
            fontSize: '1.25rem',
            fontWeight: 400,
        },
        h6: {
            fontSize: '1rem',
            fontWeight: 400,
        },
        body1: {
           fontSize: '1rem',
        },
        body2: {
            fontSize: '0.875rem',
        }
    }
})

export default companyTheme;