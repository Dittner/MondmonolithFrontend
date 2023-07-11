import { useLayoutEffect, useRef, useState } from 'react'
import { act } from 'react-dom/test-utils'
import { UUID } from './UIDGenerator'

const logInfo = (...msg: any[]) => {
  if (ObservableGlobalState.debug) console.log(...msg)
}

const logWarn = (...msg: any[]) => {
  console.warn(...msg)
}

class Reaction {
  static readonly empty = new Reaction(() => {})
  readonly uid = UUID()
  renderCycle = -1

  readonly listener: () => void
  constructor(listener: () => void) {
    this.listener = listener
  }

  private _isDisposed: boolean = false
  get isDisposed(): boolean { return this._isDisposed }
  dispose() {
    this._isDisposed = true
  }

  run() {
    this.listener()
  }
}

export class ObservableGlobalState {
  static renderCycle = 0
  static reaction: Reaction = Reaction.empty
  static testMode = false
  static debug = false
}

class ReactionRunner {
  private static readonly queue = Array<Observable>()
  private static pending = false
  static addToQueue(ob: Observable) {
    ReactionRunner.queue.push(ob)
    if (!ReactionRunner.pending) {
      ReactionRunner.pending = true
      setTimeout(() => {
        ReactionRunner.runAll()
      }, 0)
    }
  }

  static runAll() {
    logInfo('--Start executing of reaction...')
    ObservableGlobalState.renderCycle++
    let executedReactions = 0
    ReactionRunner.queue.forEach((ob) => {
      if (!ob.isDisposed && ob.isMutated) {
        ob.reactions = ob.reactions.filter(r => !r.isDisposed)
        logInfo(ob.className + ':: running of', ob.reactions.length, 'subscribers')
        ob.reactions.forEach(r => {
          if (r.renderCycle !== ObservableGlobalState.renderCycle) {
            r.renderCycle = ObservableGlobalState.renderCycle
            r.run()
            executedReactions++
          }
        })
        ob.ready()
      }
    })
    ReactionRunner.pending = false
    logInfo("--End of reaction's executing, total executions:", executedReactions)
  }
}
export class Observable {
  reactions = Array<Reaction>()

  addReaction(reaction: Reaction) {
    if (this.isDisposed) {
      logWarn('Attempt to subscribe to disposed Observable object!', ', this =', this)
    } else {
      if (!this.reactions.find(r => r.uid === reaction.uid)) {
        this.reactions.push(reaction)
      }
    }
  }

  subscribe(callback: () => void) {
    if (this.isDisposed) {
      logWarn('Attempt to subscribe to disposed Observable object!', ', this =', this)
    } else {
      const r = new Reaction(callback)
      this.reactions.push(r)
    }
  }

  unsubscribe(callback: () => void) {
    if (!this.isDisposed) {
      const r = new Reaction(callback)
      const index = this.reactions.findIndex(r => { return callback === r.listener })
      if (index !== -1) {
        this.reactions.splice(index, 1)
        r.dispose()
        this.mutated()
      }
    }
  }

  private _isMutated = false
  get isMutated(): boolean { return this._isMutated }

  private _isDisposed: boolean = false
  get isDisposed(): boolean { return this._isDisposed }

  get className(): string { return this.constructor.name }

  mutated() {
    if (!this._isMutated) {
      this._isMutated = true
      console.log(this.className, 'mutated')
      ReactionRunner.addToQueue(this)
    }
  }

  ready() {
    this._isMutated = false
  }

  dispose() {
    if (!this._isDisposed) {
      this._isDisposed = true
      logInfo('dispose: subscribers before =', this.reactions.length, ', this =', this)
      this.reactions.length = 0
      logInfo('dispose: subscribers after =', this.reactions.length + ', this =', this)
    }
  }
}

// GLOBAL OBSERVE METHODS

export function observe<T extends Observable | undefined>(observable: T): T {
  if (observable) {
    if (ObservableGlobalState.reaction !== Reaction.empty) {
      logInfo('observe(' + observable.className + '), reaction uid =', ObservableGlobalState.reaction.uid)
      observable.addReaction(ObservableGlobalState.reaction)
    } else {
      logWarn('observe(' + observable.className + ') is failed: JSX Function Component has not "observer" wrapper!')
    }
  }

  return observable
}

export function observer<T>(component: (props: T) => JSX.Element): ((props: T) => JSX.Element) {
  return (props: T) => {
    const reactionRef = useRef<Reaction>(Reaction.empty)
    const [_, forceUpdate] = useState({})

    if (reactionRef.current === Reaction.empty) {
      reactionRef.current = new Reaction(() => {
        if (ObservableGlobalState.testMode) {
          act(() => {
            forceUpdate({})
          })
        } else {
          forceUpdate({})
        }
      })
    }

    useLayoutEffect(() => () => { reactionRef.current.dispose() }, [])

    const parentGlobalReaction = ObservableGlobalState.reaction
    ObservableGlobalState.reaction = reactionRef.current

    reactionRef.current.renderCycle = ObservableGlobalState.renderCycle
    const renderedComponent = component(props)

    ObservableGlobalState.reaction = parentGlobalReaction

    return renderedComponent
  }
}
