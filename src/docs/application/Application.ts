import {makeObservable, observable} from "mobx";
import {UUID} from "../infrastructure/UIDGenerator";

export enum LayoutLayer {
  DEFAULT = "0",
  HEADER = "1",
  DOC_LIST = "2",
  POPUP = "3",
  MODAL = "4",
}

export enum AppSize {
  S = "Short",
  M = "Middle",
  L = "Large"
}


export class Application {
  readonly uid
  @observable isDocListShown = true;
  @observable yesNoDialog: YesNoDialog | undefined = undefined;
  @observable infoDialog: InfoDialog | undefined = undefined;
  @observable size = AppSize.S;

  constructor() {
    this.uid = UUID()
    this.size = this.evaluateAppSize()
    makeObservable(this)
  }

  subscribeToWindowResize(): void {
    window.addEventListener("resize", this.updateSize);
  }

  private updateSize = () => {
    if (this.size !== this.evaluateAppSize()) {
      this.size = this.evaluateAppSize()
      if (this.size !== AppSize.S)
        this.isDocListShown = true
    }
  }

  private evaluateAppSize = (): AppSize => {
    if (window.innerWidth > 1500) return AppSize.L
    if (window.innerWidth > 1200) return AppSize.M
    return AppSize.S
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
