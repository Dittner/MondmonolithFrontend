import { uid } from '../infrastructure/UIDGenerator'
import { buildRule, type StylableComponentProps } from './NoCSS'
import { Observable } from '../infrastructure/Observer'

const DARK_THEME_RED = '#E06C75'
const DARK_THEME_WHITE = '#c7d7e5'
const DARK_THEME_APP_BG = '#292f32'

const LIGHT_THEME_APP_BG = '#ebebeb'
const LIGHT_THEME_RED = '#b44553'
const LIGHT_THEME_BLACK = '#111314'

const TRANSPARENT = '#00000001'

export interface Theme {
  id: string
  h1: string
  h2: string
  h3: string
  h4: string
  h5: string
  h6: string
  p: string
  code: string
  isDark: boolean
  red: string
  white: string
  white25: string
  appBg: string
  transparent: string
  panelBg: string
  modalWindowBg: string
  text: string
  text75: string
  green: string
  green75: string
  pageTitleBg: string
  inputBg: string
  codeBg: string
  inputBorder: string
  inputBorderFocused: string
  textAreaBorderFocused: string
  selectedBlockBg: string
  border: string
  caretColor: string
  error: string
  errorMsgBg: string
  about: string
  //docBody
  prevNextPageBtnBg: string
  //docList
  docListBg: string
  docLink: string
  docLinkIcon: string
  docLinkHovered: string
  docLinkBgHovered: string
  docLinkSelected: string
  docLinkBgSelected: string
}

export class ThemeManager extends Observable {
  readonly uid

  //--------------------------------------
  //  theme
  //--------------------------------------
  private _theme: Theme
  get theme(): Theme {
    return this._theme
  }

  set theme(value: Theme) {
    if (this._theme !== value) {
      this._theme = value
      this.mutated()
    }
  }

  constructor() {
    super('ThemeManager')
    this.uid = uid()
    this.buildDarkThemeStandardSelectors()
    this.buildLightThemeStandardSelectors()
    if (window.localStorage.getItem('theme') === 'light') {
      this._theme = this.lightTheme
      this.setUpLightTheme()
    } else {
      this._theme = this.darkTheme
      this.setUpDarkTheme()
    }
  }

  setUpLightTheme() {
    this.theme = this.lightTheme
    const html = document.querySelector('html')
    if (html) {
      html.style.colorScheme = 'light'
      html.style.backgroundColor = this.theme.appBg
    }
    window.localStorage.setItem('theme', 'light')
  }

  setUpDarkTheme() {
    this.theme = this.darkTheme
    const html = document.querySelector('html')
    if (html) {
      html.style.colorScheme = 'dark'
      html.style.backgroundColor = this.theme.appBg
    }
    window.localStorage.setItem('theme', 'dark')
  }

  switchTheme(): void {
    if (this.theme.isDark) {
      this.setUpLightTheme()
    } else {
      this.setUpDarkTheme()
    }
  }

  /*
  *
  *
  * DARK THEME
  *
  * */

  readonly darkTheme: Theme = {
    id: 'dark',
    isDark: true,
    h1: DARK_THEME_WHITE,
    h2: '#c2b99f',
    h3: '#a4887e',
    h4: '#ab9b4d',
    h5: '#8064c7',
    h6: '#626b75',
    p: '#86b3c7',
    code: '#a9e2fc',
    red: DARK_THEME_RED,
    white: DARK_THEME_WHITE,
    white25: '#ffffff10',
    appBg: DARK_THEME_APP_BG,
    transparent: TRANSPARENT,
    panelBg: '#252b2e',
    modalWindowBg: '#495655',
    text: DARK_THEME_WHITE,
    text75: '#76818d',
    green: '#aec7d5',
    green75: '#aed9ee75',
    pageTitleBg: '#53cbff50',
    inputBg: '#252b2d',
    codeBg: '#2e393f75',
    inputBorder: '#323e44',
    inputBorderFocused: '#33464f',
    textAreaBorderFocused: '#3a4a5250',
    border: '#323e44',
    selectedBlockBg: '#323e44',
    caretColor: DARK_THEME_RED,
    error: '#ff719a',
    errorMsgBg: '#5e4e31',
    about: '#a9e2fc',
    //docBody
    prevNextPageBtnBg: '#794c78',
    //docList
    docListBg: '#252b2e',
    docLink: '#76818d',
    docLinkIcon: '#86b3c7',
    docLinkHovered: DARK_THEME_WHITE,
    docLinkBgHovered: '#00000020',
    docLinkSelected: '#B88EBF',
    docLinkBgSelected: TRANSPARENT
  }

  buildDarkThemeStandardSelectors() {
    const theme = this.darkTheme

    // const textProps: StylableComponentProps = { textColor: '#86b3c7' }
    // buildRule(textProps, theme.id, '*')

    buildRule({ textColor: '#64B1EB' }, theme.id, 'a:link')
    buildRule({ textColor: '#64B1EB' }, theme.id, 'a:visited')
    buildRule({ textDecoration: 'underline' }, theme.id, 'a:hover')
    buildRule({ textColor: '#5391c0' }, theme.id, 'a:active')
    buildRule({ textColor: theme.h1 }, theme.id, 'h1')
    buildRule({ textColor: theme.h2 }, theme.id, 'h2')
    buildRule({ textColor: theme.h3 }, theme.id, 'h3')
    buildRule({ textColor: theme.h4 }, theme.id, 'h4')
    buildRule({ textColor: theme.h5 }, theme.id, 'h5')
    buildRule({ textColor: theme.h6 }, theme.id, 'h6')
    buildRule({ textColor: theme.p }, theme.id, 'p')
    buildRule({ textColor: theme.p }, theme.id, 'li')
    buildRule({ textColor: theme.code }, theme.id, 'code')

    const blockquoteProps: StylableComponentProps = {
      padding: '20px',
      borderLeft: ['7px', 'solid', theme.p]
    }
    buildRule(blockquoteProps, theme.id, 'blockquote')
  }

  /*
  *
  *
  * LIGHT THEME
  *
  * */

  lightTheme: Theme = {
    id: 'light',
    isDark: false,
    h1: '#ebebeb',
    h2: '#b47726',
    h3: '#817c10',
    h4: '#b6a11c',
    h5: '#803eaf',
    h6: '#867d78',
    p: '#23282a',
    code: '#2b5c73',
    red: LIGHT_THEME_RED,
    white: LIGHT_THEME_APP_BG,
    white25: '#ffffff20',
    appBg: LIGHT_THEME_APP_BG,
    transparent: TRANSPARENT,
    panelBg: LIGHT_THEME_APP_BG,
    modalWindowBg: '#d0d4d8',
    text: LIGHT_THEME_BLACK,
    text75: '#706d69',
    green: '#2c363c',
    green75: '#2c363c75',
    pageTitleBg: '#42134988',
    inputBg: '#ebebeb',
    codeBg: '#e8d6cd',
    inputBorder: '#ccCCcc',
    inputBorderFocused: '#d58c6b',
    textAreaBorderFocused: '#d7d7d1',
    border: '#ccCCcc',
    selectedBlockBg: '#e1ddd7',
    caretColor: LIGHT_THEME_BLACK,
    error: '#914058',
    errorMsgBg: '#c5b395',
    about: '#23282a',
    //docBody
    prevNextPageBtnBg: '#333333',
    //docList
    docListBg: '#e8e8e8',
    docLink: '#2A2623',
    docLinkIcon: '#2A2623',
    docLinkHovered: '#2A2623',
    docLinkBgHovered: '#96886550',
    docLinkSelected: '#ebebeb',
    docLinkBgSelected: '#968865'
  }

  buildLightThemeStandardSelectors() {
    const theme = this.lightTheme

    // const textProps: StylableComponentProps = { textColor: theme.text }
    // buildRule(textProps, theme.id, '*')

    buildRule({ textColor: '#27388C' }, theme.id, 'a:link')
    buildRule({ textColor: '#27388C' }, theme.id, 'a:visited')
    buildRule({ textDecoration: 'underline' }, theme.id, 'a:hover')
    buildRule({ textColor: '#27388C' }, theme.id, 'a:active')

    buildRule({ textColor: theme.h2 }, theme.id, 'h2')
    buildRule({ textColor: theme.h3 }, theme.id, 'h3')
    buildRule({ textColor: theme.h4 }, theme.id, 'h4')
    buildRule({ textColor: theme.h5 }, theme.id, 'h5')
    buildRule({ textColor: theme.h6 }, theme.id, 'h6')
    buildRule({ textColor: theme.p }, theme.id, 'p')
    buildRule({ textColor: theme.p }, theme.id, 'li')
    buildRule({ bgColor: '#dce3e7', padding: '3px', margin: '-3px' }, theme.id, 'code')

    const h1Props: StylableComponentProps = {
      className: 'h1',
      textColor: theme.h1,
      bgColor: '#42134988',
      border: 'none',
      paddingHorizontal: '20px',
      marginHorizontal: '-20px'
    }
    buildRule(h1Props, theme.id, 'h1')

    const blockquoteProps: StylableComponentProps = {
      padding: '20px',
      borderLeft: '7px solid #ce9c81'
    }
    buildRule(blockquoteProps, theme.id, 'blockquote')
  }
}
