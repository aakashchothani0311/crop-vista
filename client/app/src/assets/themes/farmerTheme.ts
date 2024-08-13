import { createTheme } from "@mui/material";

const farmerTheme = createTheme({
    palette: {
        primary: {
            main: "#11493e",
        },
        secondary: {
            main: "#ffffff",
        },
        background: {
            default: "#f3fffc",
            paper: '#ffffff',
        }
    },
    components: {
        MuiTableContainer: {
            styleOverrides: {
                root: {
                    border: '2px solid #11493e',
                    borderRadius: "5px"
                }
            }
        },
        MuiTableCell: {
            styleOverrides: {
                root: {
                    backgroundColor: "#ffffff",
                    borderBlock: "1px solid #d0f0eb"
                },
                head: {
                    backgroundColor: "#d0f0eb",
                    color: "#11493e",
                    borderBlock: '1px solid #11493e'
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
                    border: "#ffffff"
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    backgroundColor: "#f3fffc"
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
            color: '#11493e',
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

export default farmerTheme;