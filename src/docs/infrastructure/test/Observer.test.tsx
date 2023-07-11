import { render } from '@testing-library/react'
import { Observable, ObservableGlobalState, observe, observer } from '../Observer'
import { UUID } from '../UIDGenerator'

/*
*
* Observable Classes
*
*  */

class TodoList extends Observable {
  //--------------------------------------
  //  title
  //--------------------------------------
  private _title: string
  get title(): string { return this._title }
  set title(value: string) {
    if (this._title !== value) {
      this._title = value
      this.mutated()
    }
  }
  
  tasks = Array<Task>()

  constructor(title: string) {
    super('TodoList')
    this._title = title
  }

  addTask(t: Task) {
    this.tasks.push(t)
    this.mutated()
  }

  removeAll() {
    this.tasks.forEach(t => { t.dispose() })
    this.tasks = Array<Task>()
    this.mutated()
  }
}

class Task extends Observable {
  readonly uid = UUID()
  
  //--------------------------------------
  //  text
  //--------------------------------------
  private _text: string = ''
  get text(): string { return this._text }
  set text(value: string) {
    if (this._text !== value) {
      this._text = value
      this.mutated()
    }
  }
}

class FakeThemeManager extends Observable {
  //--------------------------------------
  //  theme
  //--------------------------------------
  private _theme: string = ''
  get theme(): string { return this._theme }
  set theme(value: string) {
    if (this._theme !== value) {
      this._theme = value
      this.mutated()
    }
  }
}

/*
*
* React components
*
*  */

const FakeApp = observer(({ todoList, themeManager }: { todoList: TodoList, themeManager?: FakeThemeManager }) => {
  fakeAppRenderings++
  console.log('new FakeApp, renderings =', fakeAppRenderings)
  observe(todoList)
  observe(themeManager)

  const lbl = <ThemeLabel themeManager={themeManager}/>

  return <div>
    {lbl}
    { todoList.tasks.map(t => {
      return <TaskComponent key={t.uid} task={t}/>
    })}
  </div>
})

const TaskComponent = observer(({ task }: { task: Task }) => {
  taskRenderings++
  console.log('new TaskComponent, renderings =', taskRenderings)
  observe(task)

  return <p>{'Task' + task.uid + ', text: ' + task.text}</p>
})

const ThemeLabel = observer(({ themeManager }: { themeManager?: FakeThemeManager }) => {
  themeLblRenderings++
  console.log('new ThemeLabel, renderings =', themeLblRenderings)
  observe(themeManager)
  return <p>{'Theme' + themeManager?.theme ?? 'undefined'}</p>
})

let fakeAppRenderings = 0
let taskRenderings = 0
let themeLblRenderings = 0
let todoList = new TodoList('Todo')
let themeManager = new FakeThemeManager()

// eslint-disable-next-line @typescript-eslint/promise-function-async
const sleep = () => {
  return new Promise(resolve => {
    setTimeout(resolve, 200)
    jest.advanceTimersByTime(200)
  })
}

beforeAll(() => {
  console.log('beforeAll')
  jest.useFakeTimers()
  ObservableGlobalState.testMode = true
  //ObservableGlobalState.debug = true
})

let testNum = 1
beforeEach(() => {
  todoList = new TodoList('Todo')
  themeManager = new FakeThemeManager()
  fakeAppRenderings = 0
  taskRenderings = 0
  themeLblRenderings = 0
  console.log('START: Test', testNum)
  render(<FakeApp todoList={todoList} themeManager={themeManager}/>)
})

afterEach(() => {
  console.log('End: Test', testNum)
  testNum++
})

afterAll(() => {
  console.log('afterAll')
  jest.useRealTimers()
})

/*
*
* START TESTING
*
*  */

test('Empty Todo list after setting the same title has only one render', async() => {
  expect(fakeAppRenderings).toBe(1)
  expect(themeLblRenderings).toBe(1)
  expect(todoList.reactions.length).toBe(1)

  todoList.title = 'Title 1'

  await sleep()

  expect(fakeAppRenderings).toBe(2)
  expect(themeLblRenderings).toBe(2)
  expect(todoList.reactions.length).toBe(1)

  todoList.title = 'Title 1'

  await sleep()

  expect(fakeAppRenderings).toBe(2)
  expect(themeLblRenderings).toBe(2)
  expect(todoList.reactions.length).toBe(1)
})

test('Empty Todo list after sync updates minimizes renderings', async() => {
  expect(fakeAppRenderings).toBe(1)
  expect(themeLblRenderings).toBe(1)
  expect(taskRenderings).toBe(0)
  expect(todoList.reactions.length).toBe(1)
  expect(themeManager.reactions.length).toBe(2)

  todoList.title = 'New Title'
  themeManager.theme = 'dark'
  todoList.addTask(new Task())

  console.log('AFTER UPDATING DATA: new title of todoList and new theme')

  await sleep()

  expect(fakeAppRenderings).toBe(2)
  expect(themeLblRenderings).toBe(2)
  expect(taskRenderings).toBe(1)
  expect(todoList.reactions.length).toBe(1)
  expect(themeManager.reactions.length).toBe(2)
})

test('The sequence of mutations has not impact on amount and sequence of renderings', async() => {
  expect(fakeAppRenderings).toBe(1)
  expect(themeLblRenderings).toBe(1)
  expect(taskRenderings).toBe(0)
  expect(todoList.reactions.length).toBe(1)
  expect(themeManager.reactions.length).toBe(2)

  todoList.addTask(new Task())
  themeManager.theme = 'dark'
  todoList.title = 'New Title'

  console.log('AFTER UPDATING DATA: new title of todoList and new theme')

  await sleep()

  expect(fakeAppRenderings).toBe(2)
  expect(themeLblRenderings).toBe(2)
  expect(taskRenderings).toBe(1)
  expect(todoList.reactions.length).toBe(1)
  expect(themeManager.reactions.length).toBe(2)
})

test('One task list after removing task', async() => {
  expect(fakeAppRenderings).toBe(1)
  expect(themeLblRenderings).toBe(1)
  expect(taskRenderings).toBe(0)
  expect(todoList.reactions.length).toBe(1)
  expect(themeManager.reactions.length).toBe(2)

  todoList.addTask(new Task())

  console.log('AFTER ADDING A NEW TASK')

  await sleep()

  expect(fakeAppRenderings).toBe(2)
  expect(themeLblRenderings).toBe(2)
  expect(taskRenderings).toBe(1)
  expect(todoList.reactions.length).toBe(1)
  expect(themeManager.reactions.length).toBe(2)

  todoList.removeAll()
  console.log('AFTER DELETING A TASK')

  await sleep()

  expect(fakeAppRenderings).toBe(3)
  expect(themeLblRenderings).toBe(3)
  expect(taskRenderings).toBe(1)
  expect(todoList.reactions.length).toBe(1)
  expect(themeManager.reactions.length).toBe(2)
})
