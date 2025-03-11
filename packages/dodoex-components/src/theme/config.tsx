import {
  alpha,
  ThemeOptions as ThemeOptionsBase,
  Theme as ThemeBase,
} from '@mui/system';
import { merge } from 'lodash';

export type PaletteMode = 'light' | 'dark';

interface PaletteColorOptions {
  light?: string;
  main: string;
  dark?: string;
  contrastText: string;
}

interface TypeBackground {
  default: string;
  paper: string;
  paperContrast: string;
  paperDarkContrast: string;
  backdrop: string;
  input: string;
  tag: string;
}

interface TypeText {
  primary: string;
  secondary: string;
  disabled: string;
  placeholder: string;
  link: string;
}

interface TypeBorder {
  main: string;
  disabled: string;
  light: string;
}

interface TypeHover {
  default: string;
}

export interface PaletteOptions {
  primary: PaletteColorOptions;
  secondary: PaletteColorOptions;
  error: PaletteColorOptions;
  warning: PaletteColorOptions;
  success: PaletteColorOptions;
  purple: PaletteColorOptions;
  mode: PaletteMode;
  text: TypeText;
  border: TypeBorder;
  hover: TypeHover;
  background: TypeBackground;
  tabActive: PaletteColorOptions;
  getContrastText?: (background: string) => string;
}

export interface ThemeOptions extends ThemeOptionsBase {
  palette?: PaletteOptions;
}

export interface Theme extends ThemeBase {
  palette: PaletteOptions & { mode: 'light' | 'dark' };
}

export interface ZIndex {
  tooltip: number;
}

declare module '@mui/system' {
  interface BreakpointOverrides {
    xs: false; // removes the `xs` breakpoint
    sm: false;
    md: false;
    lg: false;
    xl: false;
    mobile: true; // adds the `mobile` breakpoint
    tablet: true;
    laptop: true;
    desktop: true;
    largeDesktop: true;
  }
}

export const getNormalFontWeight = (lang: string) => {
  const normalFontWeight = ['zh-CN', 'ja-JP', 'ko-KR'].includes(lang)
    ? 400
    : 500;

  return normalFontWeight;
};

export const darkPalette: PaletteOptions = {
  mode: 'dark',
  primary: {
    main: '#EA4D4D',
    contrastText: '#FFFFFF',
  },
  secondary: {
    main: '#EA4D4D',
    contrastText: '#FFFFFF',
  },
  error: {
    main: '#EC5A7D',
    contrastText: '#1A1A1B',
  },
  warning: {
    main: '#F47226',
    contrastText: '#FFFFFF',
  },
  success: {
    main: '#47D1A7',
    contrastText: '#1A1A1B',
  },
  purple: {
    main: '#BC9CFF',
    contrastText: '#1A1A1B',
  },
  background: {
    default: '#171A20',
    paper: '#23252B',
    paperContrast: '#2E3036',
    paperDarkContrast: alpha('#FFF', 0.1),
    backdrop: alpha('#000', 0.7),
    input: '#35363C',
    tag: alpha('#FFF', 0.04),
  },
  text: {
    primary: '#FFF',
    secondary: alpha('#FFF', 0.5),
    disabled: alpha('#FFF', 0.3),
    placeholder: alpha('#FFF', 0.3),
    link: '#EA4D4D',
  },
  border: {
    main: alpha('#FFF', 0.1),
    light: alpha('#FFF', 0.1),
    disabled: alpha('#FFF', 0.1),
  },
  hover: {
    default: alpha('#FFF', 0.04),
  },
  tabActive: {
    main: alpha('#EA4D4D', 0.2),
    contrastText: '#EA4D4D',
  },
};

export const lightPalette: PaletteOptions = {
  mode: 'light',
  primary: {
    main: '#1A1A1B',
    contrastText: '#fff',
  },
  secondary: {
    main: '#FFE804',
    contrastText: '#1A1A1B',
  },
  error: {
    main: '#EC5A7D',
    contrastText: '#FFFFFF',
  },
  warning: {
    main: '#B15600',
    contrastText: '#1A1A1B',
  },
  success: {
    main: '#2FBA90',
    contrastText: '#1A1A1B',
  },
  purple: {
    main: '#6851B4',
    contrastText: '#1A1A1B',
  },
  background: {
    default: '#F9F6E8',
    paper: '#FFFFFF',
    paperContrast: '#F6F6F6',
    paperDarkContrast: alpha('#1A1A1B', 0.1),
    backdrop: alpha('#000', 0.9),
    input: '#F0F0F0',
    tag: alpha('#1A1A1B', 0.04),
  },
  text: {
    primary: '#1A1A1B',
    secondary: alpha('#1A1A1B', 0.5),
    disabled: alpha('#1A1A1B', 0.3),
    placeholder: alpha('#1A1A1B', 0.3),
    link: '#1A1A1B',
  },
  border: {
    main: alpha('#454851', 0.1),
    light: alpha('#1A1A1B', 0.3),
    disabled: alpha('#1A1A1B', 0.1),
  },
  hover: {
    default: alpha('#1A1A1B', 0.1),
  },
  tabActive: {
    main: alpha('#FFE804', 0.2),
    contrastText: '#1A1A1B',
  },
};

export const getDesignTokens = (
  mode: PaletteMode,
  themeProps?: PartialDeep<ThemeOptions>,
  lang?: string,
): ThemeOptions => {
  const isLight = mode === 'light';
  const normalFontWeight = lang ? getNormalFontWeight(lang) : 400;
  let palette = isLight ? lightPalette : darkPalette;
  if (themeProps?.palette?.mode === mode) {
    palette = merge(palette, themeProps.palette);
  }
  const defaultTheme = {
    spacing: 1,
    shape: {
      borderRadius: 1,
    },
    breakpoints: {
      values: {
        mobile: 0,
        tablet: 768,
        laptop: 1024,
        desktop: 1200,
        largeDesktop: 1536,
      },
    },
    typography: {
      fontFamily: [
        'Manrope',
        ...(lang === 'ja-JP' ? ['Meiryo'] : []),
        'Poppins',
        'Inter',
        'PingFangSC-Regular',
        '"Microsoft YaHei"',
        'sans-serif',
      ].join(','),
      fontSize: 16,
      h1: {
        fontSize: 36,
        lineHeight: '49px',
        fontWeight: 600,
      },
      h2: {
        fontSize: 32,
        fontWeight: 600,
        lineHeight: '44px',
      },
      h3: {
        fontSize: 28,
        fontWeight: 600,
        lineHeight: '38px',
      },
      h4: {
        fontSize: 24,
        lineHeight: '33px',
        fontWeight: 600,
      },
      caption: {
        fontSize: 20,
        fontWeight: 600,
        lineHeight: '28px',
      },
      h5: {
        fontSize: 18,
        lineHeight: '24px',
        fontWeight: 600,
      },
      body1: {
        fontSize: 16,
        lineHeight: '22px',
        fontWeight: normalFontWeight,
      },
      body2: {
        fontSize: 14,
        lineHeight: '19px',
        fontWeight: normalFontWeight,
      },
      h6: {
        fontSize: 12,
        lineHeight: '17px',
        fontWeight: normalFontWeight,
      },
      button: {
        fontSize: 16,
        lineHeight: 1,
        fontWeight: 600,
      },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          '': {
            border: `0 solid ${palette.border?.main}`,
            fontFamily: 'inherit',
          },
          '::-webkit-scrollbar': {
            width: 6,
            height: 8,
            backgroundColor: 'transparent',
          },
          '::-webkit-scrollbar-thumb': {
            backgroundColor: palette.border?.main,
            borderColor: palette.border?.main,
            borderRadius: 100,
          },
        },
      },
      MuiTypography: {
        defaultProps: {
          variantMapping: {
            h1: 'h2',
            h2: 'h2',
            h3: 'h3',
            h4: 'h4',
            h5: 'h5',
            h6: 'div',
            caption: 'h5',
            subtitle1: 'h5',
            subtitle2: 'h5',
            body1: 'div',
            body2: 'div',
          },
        },
      },
    },
    zIndex: {
      tooltip: 1500,
    } as ZIndex,
  };

  return {
    ...merge(defaultTheme, themeProps),
    palette,
  } as ThemeOptions;
};
