import { UUID } from '../infrastructure/UIDGenerator'
import { buildRule, type StylableComponentProps } from './NoCSS'

const DARK_THEME_RED = '#E06C75'
const DARK_THEME_WHITE = '#c7d7e5'
const DARK_THEME_APP_BG = '#23282a'

const LIGHT_THEME_APP_BG = '#e5eaee'
const LIGHT_THEME_RED = '#b44553'

const TRANSPARENT = '#00000001'

export interface Theme {
  id: string
  isDark: boolean
  red: string
  white: string
  white25: string
  yellow: string
  appBg: string
  appBg50: string
  transparent: string
  docListBg: string
  panelBg: string
  modalWindowBg: string
  text: string
  text75: string
  green: string
  green75: string
  pageTitle: string
  inputBg: string
  codeBg: string
  inputBorder: string
  inputBorderFocused: string
  pageSelection: string
  docSelection: string
  border: string
  caretColor: string
  error: string
}

export class ThemeManager {
  readonly uid

  constructor() {
    this.uid = UUID()
    this.buildDarkThemeStandardSelectors()
    this.buildLightThemeStandardSelectors()
  }

  /*
  *
  *
  * DARK THEME
  *
  * */

  public readonly darkTheme: Theme = {
    id: 'darkTheme',
    isDark: true,
    red: DARK_THEME_RED,
    white: DARK_THEME_WHITE,
    white25: '#ffffff10',
    yellow: '#c29a5f',
    appBg: DARK_THEME_APP_BG,
    appBg50: DARK_THEME_APP_BG + '50',
    transparent: TRANSPARENT,
    docListBg: '#293034',
    panelBg: '#293034',
    modalWindowBg: '#495655',
    text: DARK_THEME_WHITE,
    text75: '#76818d',
    green: '#afd2e8',
    green75: '#afd2e875',
    pageTitle: '#86b3c7',
    inputBg: '#212628',
    codeBg: '#2e393f75',
    inputBorder: TRANSPARENT,
    inputBorderFocused: '#293034',
    border: '#323e44',
    pageSelection: '#323e44',
    docSelection: '#00000020',
    caretColor: DARK_THEME_RED,
    error: '#ff719a'
  }

  buildDarkThemeStandardSelectors() {
    const theme = this.darkTheme

    const textProps: StylableComponentProps = { textColor: theme.text }
    buildRule(textProps, theme.id, '*')

    buildRule({ textColor: '#64B1EB' }, theme.id, 'a:link')
    buildRule({ textColor: '#64B1EB' }, theme.id, 'a:visited')
    buildRule({ textDecoration: 'underline' }, theme.id, 'a:hover')
    buildRule({ textColor: '#5391c0' }, theme.id, 'a:active')

    const inlineCodeProps: StylableComponentProps = {
      className: 'mono',
      textColor: theme.green,
      bgColor: theme.codeBg,
      border: ['1px', 'solid', theme.border],
      padding: '4px',
      cornerRadius: '4px'
    }
    buildRule(inlineCodeProps, theme.id, 'code')

    const blockquoteProps: StylableComponentProps = {
      textColor: '#9aa8bb',
      bgColor: '#2d3034',
      padding: '20px',
      borderLeft: '5px solid #4c5157'
    }
    buildRule(blockquoteProps, theme.id, 'blockquote')
  }

  /*
  *
  *
  * LIGHT THEME
  *
  * */

  readonly lightTheme: Theme = {
    id: 'lightTheme',
    isDark: false,
    red: LIGHT_THEME_RED,
    white: LIGHT_THEME_APP_BG,
    white25: '#ffffff20',
    yellow: '#6f838d',
    appBg: LIGHT_THEME_APP_BG,
    appBg50: LIGHT_THEME_APP_BG + '50',
    transparent: TRANSPARENT,
    docListBg: '#e0e5e8',
    panelBg: LIGHT_THEME_APP_BG,
    modalWindowBg: '#d0d4d8',
    text: DARK_THEME_APP_BG,
    text75: '#687278',
    green: '#2c363c',
    green75: '#2c363c75',
    pageTitle: '#396a88',
    inputBg: '#c4d1d775',
    codeBg: '#c4d1d775',
    inputBorder: TRANSPARENT,
    inputBorderFocused: '#c4d1d7',
    border: '#c4d1d7',
    pageSelection: '#c4d1d775',
    docSelection: '#c4d1d775',
    caretColor: LIGHT_THEME_RED,
    error: '#914058'
  }

  buildLightThemeStandardSelectors() {
    const theme = this.lightTheme

    const textProps: StylableComponentProps = { textColor: theme.text }
    buildRule(textProps, theme.id, '*')

    buildRule({ textColor: '#27588c' }, theme.id, 'a:link')
    buildRule({ textColor: '#27588c' }, theme.id, 'a:visited')
    buildRule({ textDecoration: 'underline' }, theme.id, 'a:hover')
    buildRule({ textColor: '#204873' }, theme.id, 'a:active')

    const inlineCodeProps: StylableComponentProps = {
      className: 'mono',
      textColor: theme.text,
      bgColor: theme.codeBg,
      border: 'none',
      padding: '4px',
      cornerRadius: '4px'
    }
    buildRule(inlineCodeProps, theme.id, 'code')

    const blockquoteProps: StylableComponentProps = {
      textColor: '#6a6a73',
      bgColor: '#dedde4',
      padding: '20px',
      borderLeft: '5px solid #b9b7bb'
    }
    buildRule(blockquoteProps, theme.id, 'blockquote')
  }
}
