import { createTheme } from "@mui/material";

const distributorTheme = createTheme({
    palette: {
        primary: {
            main: "#7c3a1e",
        },
        secondary: {
            main: "#ffffff",
        },
        background: {
            default: "#f5e8e28f",
            paper: '#ffffff',
        }
    },
    components: {
        MuiTableContainer: {
            styleOverrides: {
                root: {
                    border: '2px solid #7c3a1e',
                    borderRadius: "5px"
                }
            }
        },
        MuiTableCell: {
            styleOverrides: {
                root: {
                    backgroundColor: "#ffffff",
                    borderBlock: "1px solid #f5e8e2"
                },
                head: {
                    backgroundColor: "#f5e8e2",
                    color: "#7c3a1e",
                    borderBlock: '1px solid #7c3a1e'
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
                    backgroundColor: "#f5e8e28f"
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
            color: '#7c3a1e',
            fontWeight: 400,
        },
        h5: {
            color: '#7c3a1e',
            fontSize: '1.25rem',
            fontWeight: 500,
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

export default distributorTheme;