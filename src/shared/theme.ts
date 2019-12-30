import { Theme } from 'src/bin/ThemeManager'

enum MergeStyle {
    Bezier = 'bezier',
    Straight = 'straight',
}

/**
 * Provide a default value to a number.
 * @param value
 * @param defaultValue
 */
function numberOptionOr(value: any, defaultValue: number): number {
    return typeof value === 'number' ? value : defaultValue
}

function LightenDarkenColor(hex: string, lum: number) {
    let ghex = String(hex).replace(/[^0-9a-f]/gi, '')
    if (ghex.length < 6) {
        ghex = ghex[0] + ghex[0] + ghex[1] + ghex[1] + ghex[2] + ghex[2]
    }
    lum = lum || 0

    // convert to decimal and change luminosity
    let rgb = '#',
        c,
        i
    for (i = 0; i < 3; i++) {
        c = parseInt(ghex.substr(i * 2, 2), 16)
        c = Math.round(Math.min(Math.max(0, c + c * lum), 255)).toString(16)
        rgb += ('00' + c).substr(c.length)
    }

    return rgb
}

const colors = {
    aquaMarine: '#56F3AA',
    brightSun: '#FED337',
    blueRibbon: '#0062FF',
    coal: '#232041',
    coalBright: '#8584bf',
    ebony: '#191632',
    flame: '#FF8755',
    malibu: '#5DD9FF',
    mauve: '#C39AFC',
    martinique: '#312D51',
    radicalRed: '#FF406F',
    zircon: '#EDF2FF',
    white: '#ffffff',
}

const darkColorPalette = {
    aquaMarine: '#56F3AA',
    brightSun: '#FED337',
    flame: '#FF8755',
    malibu: '#5DD9FF',
    mauve: '#C39AFC',
    radicalRed: '#FF406F',
    aquaMarineLight: LightenDarkenColor(colors.aquaMarine, 0.3),
    brightSunLight: LightenDarkenColor(colors.brightSun, 0.3),
    flameLight: LightenDarkenColor(colors.flame, 0.3),
    mauveLight: LightenDarkenColor(colors.mauve, 0.3),
    malibuLight: LightenDarkenColor(colors.malibu, 0.3),
    radicalRedLight: LightenDarkenColor(colors.radicalRed, 0.3),
    aquaMarineDark: LightenDarkenColor(colors.aquaMarine, -0.3),
    brightSunDark: LightenDarkenColor(colors.brightSun, -0.3),
    flameDark: LightenDarkenColor(colors.flame, -0.3),
    malibuDark: LightenDarkenColor(colors.malibu, -0.3),
    mauveDark: LightenDarkenColor(colors.mauve, -0.3),
    radicalRedDark: LightenDarkenColor(colors.radicalRed, -0.3),
}

const colorPalette = (themeColors: any = colors) => Object.values(themeColors)

const commonTheme = {
    window: {
        height: 800,
        minHeight: 600,
        minWidth: 800,
        width: 1024,
    },
}

export const DEFAULT_FONT = 'normal 12pt Poppins'

export const darkTheme: Theme = {
    name: 'dark',
    colors: {
        ...colors,
        link: colors.aquaMarine,
        border: colors.coalBright,
        text: colors.zircon,
        accent: colors.aquaMarine,
        light: colors.coalBright,
        white: colors.white,
        red: colors.radicalRed,
        bar: {
            top: colors.ebony,
            sidebar: colors.coal,
        },
        button: {
            active: colors.blueRibbon,
            default: colors.martinique,
        },
    },
    colorPalette: colorPalette(darkColorPalette),
    fonts: {
        poppins: 'Poppins',
    },
    branch: {
        color: colors.zircon,
        lineWidth: 2,
        mergeStyle: MergeStyle.Bezier,
        spacing: 20,
        label: {
            display: true,
            color: colors.coalBright,
            strokeColor: colors.zircon,
            bgColor: 'white',
            font: DEFAULT_FONT,
            borderRadius: 10,
        },
    },
    commit: {
        spacing: 30,
    },
    sizes: {
        topBar: '60px',
    },
    window: {
        ...commonTheme.window,
        backgroundColor: colors.coal,
    },
}

export const defaultTheme = darkTheme
