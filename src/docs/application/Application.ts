import { uid } from '../infrastructure/UIDGenerator'
import { Observable } from '../infrastructure/Observer'

export enum LayoutLayer {
  ZERO = '0',
  ONE = '1',
  HEADER = '10',
  DOC_LIST = '20',
  POPUP = '30',
  MODAL = '40',
}

export enum AppSize {
  XS = 'XS',
  S = 'S',
  M = 'M',
  L = 'L'
}

export class Application extends Observable {
  readonly uid

  //--------------------------------------
  //  isDocListShown
  //--------------------------------------
  private _isDocListShown: boolean = false
  get isDocListShown(): boolean { return this._isDocListShown }
  set isDocListShown(value: boolean) {
    if (this._isDocListShown !== value) {
      this._isDocListShown = value
      this.mutated()
    }
  }

  //--------------------------------------
  //  yesNoDialog
  //--------------------------------------
  private _yesNoDialog: YesNoDialog | undefined = undefined
  get yesNoDialog(): YesNoDialog | undefined { return this._yesNoDialog }
  set yesNoDialog(value: YesNoDialog | undefined) {
    if (this._yesNoDialog !== value) {
      this._yesNoDialog = value
      this.mutated()
    }
  }

  //--------------------------------------
  //  infoDialog
  //--------------------------------------
  private _infoDialog: InfoDialog | undefined = undefined
  get infoDialog(): InfoDialog | undefined { return this._infoDialog }
  set infoDialog(value: InfoDialog | undefined) {
    if (this._infoDialog !== value) {
      this._infoDialog = value
      this.mutated()
    }
  }

  //--------------------------------------
  //  size
  //--------------------------------------
  private _size: AppSize
  get size(): AppSize { return this._size }
  set size(value: AppSize) {
    if (this._size !== value) {
      this._size = value
      this.mutated()
    }
  }

  public readonly isMobileDevice: boolean

  constructor() {
    super('App')
    this.uid = uid()
    this._size = this.evaluateAppSize()
    this.isMobileDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0)

    console.log('isMobileDevice: ' + this.isMobileDevice)
    console.log('localStorage, theme: ' + window.localStorage.getItem('theme'))
  }

  showDocList() {
    this.isDocListShown = true
  }

  hideDocList() {
    this.isDocListShown = false
  }

  subscribeToWindowResize(): void {
    window.addEventListener('resize', this.updateSize.bind(this))
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
  readonly text: string
  readonly onApply: () => void
  readonly onCancel: (() => void) | undefined

  constructor(text: string, onApply: () => void, onCancel?: (() => void) | undefined) {
    this.text = text
    this.onApply = onApply
    this.onCancel = onCancel
  }
}

export class InfoDialog {
  readonly title: string
  readonly text: string

  constructor(title: string, text: string) {
    this.title = title
    this.text = text
  }
}
