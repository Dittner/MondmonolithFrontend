import { uid } from '../infrastructure/UIDGenerator'
import { buildRule, type StylableComponentProps } from './NoCSS'
import { Observable } from '../infrastructure/Observer'

const DARK_THEME_RED = '#E06C75'
const DARK_THEME_WHITE = '#c7d7e5'
const DARK_THEME_APP_BG = '#292f32'

const LIGHT_THEME_APP_BG = '#eceff2'
const LIGHT_THEME_RED = '#b44553'
const LIGHT_THEME_BLACK = '#23282a'

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
  search: string
  about: string
  link: string
  //docBody
  prevNextPageBtnBg: string
  pageTitleColor: string
  pageTitleBg: string
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
    search: '#DC9B30',
    about: '#a9e2fc',
    link: '#64B1EB',
    //docBody
    prevNextPageBtnBg: '#794c78',
    pageTitleColor: DARK_THEME_WHITE,
    pageTitleBg: '#53cbff50',
    //docList
    docListBg: DARK_THEME_APP_BG,
    docLink: '#76818d',
    docLinkIcon: '#86b3c7',
    docLinkHovered: DARK_THEME_WHITE,
    docLinkBgHovered: '#00000020',
    docLinkSelected: '#B88EBF',
    docLinkBgSelected: TRANSPARENT
  }

  buildDarkThemeStandardSelectors() {
    const theme = this.darkTheme
    const monoFont = 'var(--font-family-mono)'
    // const textProps: StylableComponentProps = { textColor: '#86b3c7' }
    // buildRule(textProps, theme.id, '*')

    const h1Props: StylableComponentProps = {
      fontFamily: monoFont,
      fontSize: '1.1rem',
      fontWeight: '500',
      textColor: theme.h1
    }
    buildRule(h1Props, theme.id, 'h1')

    const h2Props: StylableComponentProps = {
      fontFamily: monoFont,
      fontSize: '1.1rem',
      fontWeight: '400',
      textColor: theme.h2
    }
    buildRule(h2Props, theme.id, 'h2')

    const h3Props: StylableComponentProps = {
      fontFamily: monoFont,
      fontSize: '1.1rem',
      fontWeight: '400',
      textColor: theme.h3
    }
    buildRule(h3Props, theme.id, 'h3')

    const h4Props: StylableComponentProps = {
      fontFamily: monoFont,
      fontSize: '1.1rem',
      fontWeight: '400',
      textColor: theme.h4
    }
    buildRule(h4Props, theme.id, 'h4')

    const h5Props: StylableComponentProps = {
      fontFamily: monoFont,
      fontSize: '1.1rem',
      fontWeight: '500',
      textColor: theme.h5
    }
    buildRule(h5Props, theme.id, 'h5')

    const h6Props: StylableComponentProps = {
      fontFamily: monoFont,
      fontSize: '1.1rem',
      fontWeight: '500',
      textColor: theme.h6
    }
    buildRule(h6Props, theme.id, 'h6')

    const pProps: StylableComponentProps = {
      fontFamily: monoFont,
      fontSize: '1rem',
      fontWeight: '500',
      textColor: theme.p
    }
    buildRule(pProps, theme.id, 'p')

    const globalProps: StylableComponentProps = {
      fontFamily: monoFont,
      fontSize: '1rem',
      fontWeight: '500',
      textColor: theme.p
    }
    buildRule(globalProps, theme.id, 'b')
    buildRule(globalProps, theme.id, 'i')
    buildRule(globalProps, theme.id, 'li')

    const inlineCodeProps: StylableComponentProps = {
      fontFamily: monoFont,
      fontSize: '1rem',
      fontWeight: '500',
      textColor: theme.code
    }
    buildRule(inlineCodeProps, theme.id, 'code')
    inlineCodeProps.textColor = theme.search

    buildRule({ bgColor: theme.search, textColor: theme.appBg }, theme.id, 'mark')

    const linkProps: StylableComponentProps = {
      fontFamily: monoFont,
      fontSize: '1rem',
      fontWeight: '500',
      textColor: theme.link
    }
    buildRule(linkProps, theme.id, 'a:link')
    buildRule(linkProps, theme.id, 'a:visited')
    buildRule(linkProps, theme.id, 'a:active')
    linkProps.textDecoration = 'underline'
    buildRule(linkProps, theme.id, 'a:hover')
    
    const blockquoteProps: StylableComponentProps = {
      fontFamily: monoFont,
      fontSize: '1rem',
      fontWeight: '500',
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
    h1: '#23282a',
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
    inputBg: '#dfe4e8',
    codeBg: '#dfe6ea',
    inputBorder: '#c5d2d8',
    inputBorderFocused: '#c5d2d8',
    textAreaBorderFocused: '#c5d2d8',
    border: '#c5d2d8',
    selectedBlockBg: '#e0e6ea',
    caretColor: LIGHT_THEME_BLACK,
    error: '#914058',
    errorMsgBg: '#c5b395',
    search: '#b44553',
    about: '#23282a',
    link: '#27388C',
    //docBody
    prevNextPageBtnBg: '#333333',
    pageTitleColor: '#eceff2',
    pageTitleBg: '#42134988',
    //docList
    docListBg: LIGHT_THEME_APP_BG,
    docLink: '#2A2623',
    docLinkIcon: '#2A2623',
    docLinkHovered: '#2A2623',
    docLinkBgHovered: '#dbe0e4',
    docLinkSelected: '#7f188e',
    docLinkBgSelected: TRANSPARENT
  }

  buildLightThemeStandardSelectors() {
    const theme = this.lightTheme
    const defFont = 'var(--font-family)'
    const monoFont = 'var(--font-family-mono)'

    // const textProps: StylableComponentProps = { textColor: theme.text }
    // buildRule(textProps, theme.id, '*')

    const h1Props: StylableComponentProps = {
      fontFamily: defFont,
      fontSize: '2rem',
      fontWeight: '400',
      textColor: theme.h1,
      border: 'none'
    }
    buildRule(h1Props, theme.id, 'h1')

    const h2Props: StylableComponentProps = {
      fontFamily: defFont,
      fontSize: '1.25rem',
      fontWeight: '400',
      textColor: theme.h2
    }
    buildRule(h2Props, theme.id, 'h2')

    const h3Props: StylableComponentProps = {
      fontFamily: defFont,
      fontSize: '1.25rem',
      fontWeight: '400',
      textColor: theme.h3
    }
    buildRule(h3Props, theme.id, 'h3')

    const h4Props: StylableComponentProps = {
      fontFamily: defFont,
      fontSize: '1.25rem',
      fontWeight: '400',
      textColor: theme.h4
    }
    buildRule(h4Props, theme.id, 'h4')

    const h5Props: StylableComponentProps = {
      fontFamily: defFont,
      fontSize: '1.25rem',
      fontWeight: '400',
      textColor: theme.h5
    }
    buildRule(h5Props, theme.id, 'h5')

    const h6Props: StylableComponentProps = {
      fontFamily: defFont,
      fontSize: '1.25rem',
      fontWeight: '400',
      textColor: theme.h6
    }
    buildRule(h6Props, theme.id, 'h6')

    const pProps: StylableComponentProps = {
      fontFamily: defFont,
      fontSize: '1rem',
      fontWeight: '400',
      textColor: theme.p
    }
    buildRule(pProps, theme.id, 'p')

    const globalProps: StylableComponentProps = {
      fontFamily: defFont,
      fontSize: '1rem',
      fontWeight: '400',
      textColor: theme.p
    }
    buildRule(globalProps, theme.id, 'b')
    buildRule(globalProps, theme.id, 'i')
    buildRule(globalProps, theme.id, 'li')

    const inlineCodeProps: StylableComponentProps = {
      fontFamily: monoFont,
      fontSize: '0.9rem',
      fontWeight: '500',
      bgColor: theme.codeBg,
      padding: '3px',
      margin: '-3px',
      textColor: theme.p
    }
    buildRule(inlineCodeProps, theme.id, 'code')

    const linkProps: StylableComponentProps = {
      fontFamily: defFont,
      fontSize: '1rem',
      fontWeight: '500',
      textColor: theme.link
    }
    buildRule({ bgColor: theme.search, textColor: theme.white }, theme.id, 'mark')

    buildRule(linkProps, theme.id, 'a:link')
    buildRule(linkProps, theme.id, 'a:visited')
    buildRule(linkProps, theme.id, 'a:active')
    linkProps.textDecoration = 'underline'
    buildRule(linkProps, theme.id, 'a:hover')

    const blockquoteProps: StylableComponentProps = {
      fontFamily: defFont,
      fontSize: '1rem',
      fontWeight: '400',
      textColor: theme.p,
      padding: '20px',
      borderLeft: '7px solid #ce9c81'
    }
    buildRule(blockquoteProps, theme.id, 'blockquote')
  }
}
