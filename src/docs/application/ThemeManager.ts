import {UUID} from "../infrastructure/UIDGenerator";
import {buildRule, StylableComponentProps} from "./NoCSS";

const DARK_THEME_RED = "#E06C75"
const LIGHT_THEME_RED = "#b44553"
const DARK_THEME_WHITE = "#c7d7e5"
const LIGHT_THEME_WHITE = "#dbe0e4"
const BLACK = "#23282a"

export interface Theme {
  id: string,
  isDark: boolean,
  red: string,
  white: string,
  white25: string,
  yellow: string,
  appBg: string,
  panelBg: string,
  modalWindowBg: string,
  text: string,
  text75: string,
  textGreen: string,
  textGreen75: string,
  pageTitle: string,
  inputBg: string,
  inputBorder: string,
  inputBorderFocused: string,
  pageSelection: string,
  docSelection: string,
  border: string,
  caretColor: string,
  error: string,
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
    id: "darkTheme",
    isDark: true,
    red: DARK_THEME_RED,
    white: DARK_THEME_WHITE,
    white25: "#ffffff10",
    yellow: "#c29a5f",
    appBg: BLACK,
    panelBg: "#292f31",
    modalWindowBg: "#495655",
    text: DARK_THEME_WHITE,
    text75: "#76818d",
    textGreen: "#a7c6d2",
    textGreen75: "#a7c6d275",
    pageTitle: "#86b3c7",
    inputBg: "#1f2528",
    inputBorder: "#a7c6d2",
    inputBorderFocused: DARK_THEME_RED,
    border: "#2a3439",
    pageSelection: "#2a3439",
    docSelection: "#00000020",
    caretColor: DARK_THEME_RED,
    error: "#ff719a",
  }

  buildDarkThemeStandardSelectors() {
    const theme = this.darkTheme

    const textProps: StylableComponentProps = {textColor: theme.text}
    buildRule(textProps, theme.id, "*")

    buildRule({textColor: "#64B1EB"}, theme.id, "a:link")
    buildRule({textColor: "#64B1EB"}, theme.id, "a:visited")
    buildRule({textDecoration: "underline"}, theme.id, "a:hover")
    buildRule({textColor: "#5391c0"}, theme.id, "a:active")

    const inlineCodeProps: StylableComponentProps = {
      className: "mono",
      textColor: "#b1c5de",
      bgColor: "#2e393f50",
      border: ["1px", "solid", theme.border],
      padding: "4px",
      cornerRadius: "4px",
    }
    buildRule(inlineCodeProps, theme.id, "code")

    const blockquoteProps: StylableComponentProps = {
      textColor: "#9aa8bb",
      bgColor: "#2d3034",
      padding: "20px",
      borderLeft: "5px solid #4c5157",
    }
    buildRule(blockquoteProps, theme.id, "blockquote")

  }

  /*
  *
  *
  * LIGHT THEME
  *
  * */

  readonly lightTheme: Theme = {
    id: "lightTheme",
    isDark: false,
    red: LIGHT_THEME_RED,
    white: LIGHT_THEME_WHITE,
    white25: "#ffffff20",
    yellow: "#6f838d",
    appBg: LIGHT_THEME_WHITE,
    panelBg: "#e0e5e9",
    modalWindowBg: "#d0d4d8",
    text: BLACK,
    text75: "#687278",
    textGreen: "#2c363c",
    textGreen75: "#2c363c75",
    pageTitle: "#396a88",
    inputBg: "#cbd3db",
    inputBorder: "#757b7d",
    inputBorderFocused: LIGHT_THEME_RED,
    border: "#c4d1d7",
    pageSelection: "#c4d1d7",
    docSelection: "#c4d1d7",
    caretColor: "#000",
    error: "#914058",
  }

  buildLightThemeStandardSelectors() {
    const theme = this.lightTheme

    const textProps: StylableComponentProps = {textColor: theme.text}
    buildRule(textProps, theme.id, "*")

    buildRule({textColor: "#27588c"}, theme.id, "a:link")
    buildRule({textColor: "#27588c"}, theme.id, "a:visited")
    buildRule({textDecoration: "underline"}, theme.id, "a:hover")
    buildRule({textColor: "#204873"}, theme.id, "a:active")

    const inlineCodeProps: StylableComponentProps = {
      className: "mono",
      textColor: theme.text,
      bgColor: "#c0c9d275",
      border: "none",
      padding: "4px",
      cornerRadius: "4px",
    }
    buildRule(inlineCodeProps, theme.id, "code")

    const blockquoteProps: StylableComponentProps = {
      textColor: "#9da1a9",
      bgColor: "#cbd0da",
      padding: "20px",
      borderLeft: "5px solid #9da1a9",
    }
    buildRule(blockquoteProps, theme.id, "blockquote")
  }
}

/*
*
* :root {
  color-scheme: dark;
--Gray: #292f31;
--LightGray: #DEDEDE;
--Red: #E06C75;
--Red25: #E06C7525;
--Red75: #E06C7575;
--Yellow: #c29a5f;
--Error: #ff4178;
--Text: #c7d7e5;
--TextDark: #76818d;
--TextDark75: #76818d75;
--TextGreen: #a7c6d2;
--TextDarkGreen: #596a70;
--TextBlue: #b1c5de;
--PageTitle: #86b3c7;
--DocListTextSelected: #d2e4f2;
--PanelBg: #292f31;
--AppBg: #23282a;
--HeaderBg: #252a2c;
--DarkBg: #00000020;
--CodeBg: #2e393f50;
--CodeBlockBg: #2a343920;
--Border: #2a3439;
--Pink: #a29cbe;
--InputBg: #1f2528;
--BtnWeight: 600;
--BtnColor: #E06C75;
--BtnHoverColor: #c7d7e5;
--BtnDisabledColor: #76818d;
--CodeLineHeight: 1.76;
--font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
--font-family-mono: Menlo, source-code-pro, Monaco, 'Courier New', monospace;
}
*/