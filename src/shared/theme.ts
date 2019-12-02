const colors = {
    aquaMarine: '#56F3AA',
    brightSun: '#FED337',
    coal: '#2c2d5c',
    coalBright: '#8584bf',
    flame: '#FF8755',
    malibu: '#5DD9FF',
    mauve: '#C39AFC',
    radicalRed: '#FF406F',
    zircon: '#EDF2FF',
}

const commonTheme = {
    window: {
        height: 800,
        minHeight: 600,
        minWidth: 800,
        width: 1024,
    },
}

export const darkTheme = {
    colors: {
        border: colors.coalBright,
        text: colors.zircon,
        accent: colors.aquaMarine,
        light: colors.coalBright,
        white: colors.zircon,
        red: colors.radicalRed,
    },
    fonts: {
        poppins: 'Poppins',
    },
    window: {
        ...commonTheme.window,
        backgroundColor: colors.coal,
    },
}

export const defaultTheme = darkTheme
