import { grey, blueGrey, blue, teal } from '@mui/material/colors'

const LIGHT_THEMES = {
    "light": "light",
}

const DARK_THEMES = {
    "coffee": "dark",
    "dusk": "dark",
    "midnight": "dark",
    "flamingo": "dark",
}

export const ALL_THEMES = {...LIGHT_THEMES, ...DARK_THEMES}

const convertThemeString = (theme) => {
    return theme in LIGHT_THEMES ? "light" : "dark"
}

const getTheme = (theme) => {
    if (theme === "light") {
        return {
            // palette values for light mode
            primary: blue,
            secondary: {
                main: '#C9C9C9',
            },
            unread: {
                main: '#FF0000',
            },
            warning: {
                main: '#fdd835'
            },
            online:{
                main: '#31EC69'
            },
            working: {
                main: "#B68F61"
            },
            offline: {
                main: "#0C0C0C"
            },
            background: {
                default: '#e0e0e0',
                paper: '#e0e0e0',
            },
            text: {
                primary: grey[900],
                secondary: grey[800],
            },
        }
    }
    if (theme === "flamingo") {
        return {
            // palette values for flamingo mode
            primary: {
                main: '#d4778e',
                500: '#d4778e',
            },
            secondary: {
                main: '#7d364d',
            },
            unread: {
                main: '#FF0000',
            },
            warning: {
                main: '#fdd835'
            },
            online:{
                main: '#31EC69'
            },
            working: {
                main: "#B68F61"
            },
            offline: {
                main: "#0C0C0C"
            },
            background: {
                default: '#542434',
                paper: '#542434',
            },
            text: {
                primary: '#fff',
                secondary: grey[400],
            },
        }
    }
    if (theme === "dusk") {
        return {
            // palette values for dusk mode
            primary: blueGrey,
            secondary: {
                main: '#23303F',
            },
            unread: {
                main: '#FF0000',
            },
            warning: {
                main: '#fdd835'
            },
            online:{
                main: '#31EC69'
            },
            working: {
                main: "#B68F61"
            },
            offline: {
                main: "#0C0C0C"
            },
            background: {
                default: '#0A1929',
                paper: '#0A1929',
            },
            text: {
                primary: '#fff',
                secondary: grey[400],
            },
        }
    }
    if (theme === "coffee") {
        return {
            // palette values for coffee mode
            primary: {
                main: '#B68F61',
                500: '#B68F61',
            },
            secondary: {
                main: '#6F584B',
            },
            unread: {
                main: '#FF0000',
            },
            warning: {
                main: '#fdd835'
            },
            online:{
                main: '#31EC69'
            },
            working: {
                main: "#B68F61"
            },
            offline: {
                main: "#0C0C0C"
            },
            background: {
                default: '#393130',
                paper: '#393130',
            },
            text: {
                primary: '#fff',
                secondary: grey[400],
            },
        }
    }

    // return midnight by default
    return {
        // palette values for midnight mode
        primary: teal,
        secondary: {
            main: '#383838',
        },
        unread: {
            main: '#FF0000',
        },
        warning: {
            main: '#fdd835'
        },
        online:{
            main: '#31EC69'
        },
        working: {
            main: "#B68F61"
        },
        offline: {
            main: "#0C0C0C"
        },
        background: {
            default: '#212121',
            paper: '#212121',
        },
        text: {
            primary: '#fff',
            secondary: grey[400],
        },
    }
}

export const getThemeObject = (theme) => ({
    typography: {
        fontFamily: "Inter, sans-serif, Roboto",
    },
    palette: {
      mode: convertThemeString(theme),
      ...(getTheme(theme)),
    },
})