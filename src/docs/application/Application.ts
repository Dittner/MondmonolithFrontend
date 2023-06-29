import {makeObservable, observable} from "mobx";
import {UUID} from "../infrastructure/UIDGenerator";
import {Theme, ThemeManager} from "./ThemeManager";

export enum LayoutLayer {
  ZERO = "0",
  ONE = "1",
  HEADER = "10",
  DOC_LIST = "20",
  POPUP = "30",
  MODAL = "40",
}

export enum AppSize {
  XS = "XS",
  S = "S",
  M = "M",
  L = "L"
}

export class Application {
  readonly uid
  @observable isDocListShown = false;
  @observable yesNoDialog: YesNoDialog | undefined = undefined;
  @observable infoDialog: InfoDialog | undefined = undefined;
  @observable size = AppSize.S;
  @observable theme: Theme;
  public readonly isMobileDevice: boolean;

  private readonly themeManager: ThemeManager

  constructor() {
    this.uid = UUID()
    this.size = this.evaluateAppSize()
    this.themeManager = new ThemeManager()
    this.isMobileDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

    if (window.localStorage.getItem("theme") === "dark") {
      this.theme = this.themeManager.darkTheme
      this.setUpDarkTheme()
    } else {
      this.theme = this.themeManager.lightTheme
      this.setUpLightTheme()
    }

    makeObservable(this)
    console.log("isMobileDevice: " + this.isMobileDevice)
    console.log("localStorage, theme: " + window.localStorage.getItem("theme"))
  }

  subscribeToWindowResize(): void {
    window.addEventListener("resize", this.updateSize.bind(this));
  }

  setUpLightTheme() {
    this.theme = this.themeManager.lightTheme
    const html = document.querySelector('html');
    if (html) {
      html.style.colorScheme = "light"
      html.style.backgroundColor = this.theme.appBg
    }
    window.localStorage.setItem("theme", "light");
  }

  setUpDarkTheme() {
    this.theme = this.themeManager.darkTheme
    const html = document.querySelector('html');
    if (html) {
      html.style.colorScheme = "dark"
      html.style.backgroundColor = this.theme.appBg
    }
    window.localStorage.setItem("theme", "dark");
  }

  switchTheme(): void {
    if (this.theme.isDark) this.setUpLightTheme()
    else this.setUpDarkTheme()
  }

  private updateSize(): void {
    const evaluatedSize = this.evaluateAppSize()
    if (this.size !== evaluatedSize) {
      this.size = evaluatedSize
    }
  }

  private evaluateAppSize(): AppSize {
    if (window.innerWidth > 1500) return AppSize.L
    if (window.innerWidth > 1200) return AppSize.M
    if (window.innerWidth > 767) return AppSize.S
    return AppSize.XS
  }
}


export class YesNoDialog {
  readonly text: string;
  readonly onApply: () => void;
  readonly onCancel: (() => void) | undefined;

  constructor(text: string, onApply: () => void, onCancel?: (() => void) | undefined) {
    this.text = text
    this.onApply = onApply
    this.onCancel = onCancel
  }
}

export class InfoDialog {
  readonly title: string;
  readonly text: string;

  constructor(title: string, text: string) {
    this.title = title
    this.text = text
  }
}
