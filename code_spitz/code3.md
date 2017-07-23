# CodeSpitz 3회차 코드

## Step 1

[SAMPLE](http://shallaa.github.io/code_spitz/code3/s71_3_1.html)

```js
const Task = class {
  constructor(title, date) {
    if (!title) throw 'invalid title';

    this._title = title;
    this._date = date;
    this._isComplete = false;
  }

  isComplete() {
    return this._isComplete;
  }

  toggle() {
    this._isComplete = !this._isComplete;
  }

  sortTitle(task) {
    return this._title > task._title;
  }

  sortDate(task) {
    return this._date > task._date;
  }
};

const TaskList = class {
  constructor(title) {
    if (!title) throw 'invalid title';

    this._title = title;
    this._list = [];
  }

  _getList(sort, stateGroup) {
    const list = this._list, s = taskSort[sort];

    if (!stateGroup) return [...list].sort(s);

    return [list.filter(v => !v.isComplete()), list.filter(v => v.isComplete())]
      .reduce((p, c) => p.concat(c.sort(s)), []);
  }

  byRegister(stateGroup = true) {
    return this._getList('register', stateGroup);
  }

  byTitle(stateGroup = true) {
    return this._getList('title', stateGroup);
  }

  byDate(stateGroup = true) {
    return this._getList('date', stateGroup);
  }

  add(title, date = Date.now()) {
    this._list.push(new Task(title, date));
  }

  remove(task) {
    const list = this._list;

    if (list.includes(task)) list.splice(list.indexOf(task), 1);
  }
};

const taskSort = {
  title: (a, b) => a.sortTitle(b),
  date: (a, b) => a.sortDate(b),
  register: null
};
```

## Step 2

[SAMPLE](http://shallaa.github.io/code_spitz/code3/s71_3_2.html)

```js
const Task = class {
  constructor(title, date) {
    if (!title) throw 'invalid title';

    this._title = title;
    this._date = date;
    this._isComplete = false;
    this._list = [];
  }

  isComplete() {
    return this._isComplete;
  }

  toggle() {
    this._isComplete = !this._isComplete;
  }

  sortTitle(task) {
    return this._title > task._title;
  }

  sortDate(task) {
    return this._date > task._date;
  }

  add(title, date = Date.now()) {
    this._list.push(new Task(title, date));
  }

  _getList(sort, stateGroup) {
    const list = this._list, s = taskSort[sort];

    let result = { task: this };

    if (!stateGroup) result.sub = [...list].sort(s);
    else result.sub = [list.filter(v => !v.isComplete()), list.filter(v => v.isComplete())]
      .reduce((p, c) => p.concat(c.sort(s)), []);

    return result;
  }
};

const TaskList = class {
  constructor(title) {
    if (!title) throw 'invalid title';

    this._title = title;
    this._list = [];
  }

  _getList(sort, stateGroup) {
    const list = this._list, s = taskSort[sort];

    let result;

    if (!stateGroup) result = [...list].sort(s);
    else result = [list.filter(v => !v.isComplete()), list.filter(v => v.isComplete())]
      .reduce((p, c) => p.concat(c.sort(s)), []);

    return result.map(v => v._getList());
  }

  byRegister(stateGroup = true) {
    return this._getList('register', stateGroup);
  }

  byTitle(stateGroup = true) {
    return this._getList('title', stateGroup);
  }

  byDate(stateGroup = true) {
    return this._getList('date', stateGroup);
  }

  add(title, date = Date.now()) {
    this._list.push(new Task(title, date));
  }

  remove(task) {
    const list = this._list;

    if (list.includes(task)) list.splice(list.indexOf(task), 1);
  }
};

const taskSort = {
  title: (a, b) => a.sortTitle(b),
  date: (a, b) => a.sortDate(b),
  register: null
};
```

* `byRegister`, `byTitle`, `byDate`가 반환하는 값이 `{ task, sub }` 형태로 변경 됨

## Step 3

[SAMPLE](http://shallaa.github.io/code_spitz/code3/s71_3_3.html)

```js
const Task = class {
  constructor() {
    this._list = [];
  }

  add(task) {
    if (!(task instanceof Task)) throw 'invalid Task';

    this._list.push(task);
  }

  remove(task) {
    const list = this._list;

    if (list.includes(task)) list.splice(list.indexOf(task), 1);
  }

  getResult(sort, stateGroup) {
    const list = this._list;

    let result;

    if (!stateGroup) result = [...list].sort(sort);
    else result = [list.filter(v => !v.isComplete()), list.filter(v => v.isComplete())]
      .reduce((p, c) => p.concat(c.sort(sort)), []);

    return {
      item: this._getResult(),
      children: result
    };
  }

  _getResult() {
    throw 'must be overried';
  }
};

const TaskItem = class extends Task {
  static title(a, b) {
    return a.sortTitle(b);
  }

  static date(a, b) {
    return a.sortDate(b);
  }

  static register() {
    return null;
  }

  constructor(title, date = Date.now()) {
    if (!title) throw 'invalid title';

    super();

    this._title = title;
    this._date = date;
    this._isComplete = false;
  }

  _getResult(sort, stateGroup) {
    return this;
  }

  isComplete() {
    return this._isComplete;
  }

  toggle() {
    this._isComplete = !this._isComplete;
  }

  sortTitle(task) {
    return this._title > task._title;
  }

  sortDate(task) {
    return this._date > task._date;
  }
};

const TaskList = class extends Task {
  constructor(title) {
    if (!title) throw 'invalid title';

    super();

    this._title = title;
  }

  _getResult(sort, stateGroup) {
    return this._title;
  }

  byRegister(stateGroup = true) {
    return this.getResult(TaskItem.register, stateGroup);
  }

  byTitle(stateGroup = true) {
    return this.getResult(TaskItem.title, stateGroup);
  }

  byDate(stateGroup = true) {
    return this.getResult(TaskItem.date, stateGroup);
  }

  add(title, date) {
    super.add(new TaskItem(title, date));
  }
};
```

* 기존의 `Task`가 새로운 `Task`를 상속한 `TaskItem`으로 변경 됨
* 기존의 `taskSort`가 `TaskItem`의 `static` 메소드로 포함 됨
* `byRegister`, `byTitle`, `byDate`가 반환하는 값이 `{ item, children }` 형태로 변경 됨
  * `item`은 `title` ( `TaskList`의 `_getResult`가 `title`을 반환 )
  
## Step 4

[SAMPLE](http://shallaa.github.io/code_spitz/code3/s71_3_4.html)

```js
const Task = class {
  constructor() {
    this._list = [];
  }

  add(task) {
    if (!(task instanceof Task)) throw 'invalid Task';

    this._list.push(task);
  }

  remove(task) {
    const list = this._list;

    if (list.includes(task)) list.splice(list.indexOf(task), 1);
  }

  getData(sort, stateGroup) {
    const list = this._list;

    let result;

    if (!stateGroup) result = [...list].sort(sort);
    else result = [list.filter(v => !v.isComplete()), list.filter(v => v.isComplete())].reduce((p, c) => p.concat(c.sort(sort)), []);

    result = result.map(v => v.getData(sort, stateGroup));

    return {
      item: this._getData(),
      children: result
    };
  }

  _getData() {
    throw 'must be overried';
  }
};

const TaskItem = class extends Task {
  static title(a, b) {
    return a.sortTitle(b);
  }

  static date(a, b) {
    return a.sortDate(b);
  }

  static register() {
    return null;
  }

  constructor(title, date = Date.now()) {
    if (!title) throw 'invalid title';

    super();

    this._title = title;
    this._date = date;
    this._isComplete = false;
  }

  _getData(sort, stateGroup) {
    return this;
  }

  get title() {
    return this._title;
  }

  get date() {
    return this._date;
  }

  isComplete() {
    return this._isComplete;
  }

  toggle() {
    this._isComplete = !this._isComplete;
  }

  sortTitle(task) {
    return this._title > task._title;
  }

  sortDate(task) {
    return this._date > task._date;
  }
};

const TaskList = class extends Task {
  constructor(title) {
    if (!title) throw 'invalid title';

    super();

    this._title = title;
  }

  _getData(sort, stateGroup) {
    return this._title;
  }

  byRegister(stateGroup = true) {
    return this.getData(TaskItem.register, stateGroup);
  }

  byTitle(stateGroup = true) {
    return this.getData(TaskItem.title, stateGroup);
  }

  byDate(stateGroup = true) {
    return this.getData(TaskItem.date, stateGroup);
  }

  add(title, date) {
    super.add(new TaskItem(title, date));
  }

  remove(task) {
    super.remove(task);
  }
};

const DomRenderer = class {
  static el(type, ...attr) {
    const el = document.createElement(type);

    for (let i = 0; i < attr.length;) {
      const k = attr[i++], v = attr[i++];

      if (typeof el[k] === 'function') el[k].apply(el, Array.isArray(v) ? v : [v]);
      else if (k[0] === '@') el.style[k.substr(1)] = v;
      else el[k] = v;
    }

    return el;
  }

  constructor(taskList, parentSelector) {
    this._parent = parentSelector;
    this._taskList = taskList;
    this._sort = 'byRegister';
  }

  add(title) {
    this._taskList.add(title), this.render();
  }

  remove(task) {
    this._taskList.remove(task), this.render();
  }

  addSubTask(task, title) {
    task.add(new TaskItem(title)), this.render();
  }

  removeSubTask(parent, task) {
    parent.remove(task), this.render();
  }

  toggle(task) {
    task.toggle(), this.render();
  }

  render() {
    const parent = document.querySelector(this._parent);

    if (!parent) throw 'invalid parent';

    parent.innerHTML = '';

    const data = this._taskList[this._sort]();

    [
      DomRenderer.el('h2', 'innerHTML', data.item),
      'byTitle,byDate,byRegister'.split(',').reduce((p, c) => (
        p.appendChild(
          DomRenderer.el('button', 'innerHTML', c,
            '@fontWeight', this._sort == c ? 'bold' : 'normal',
            'addEventListener', ['click', e => (this._sort = c, this.render())])
        ), p
      ), DomRenderer.el('nav')),
      DomRenderer.el('section',
        'appendChild', DomRenderer.el('input', 'type', 'text'),
        'appendChild', DomRenderer.el('button', 'innerHTML', 'addTask',
          'addEventListener', ['click', e => this.add(e.target.previousSibling.value)])
      ),
      ...data.children.map(({item, children}) =>
        [
          DomRenderer.el('h3', 'innerHTML', item.title,
            '@textDecoration', item.isComplete() ? 'line-through' : 'none'),
          DomRenderer.el('time', 'innerHTML', item.date.toString(), 'datetime', item.date.toString()),
          DomRenderer.el('button', 'innerHTML', item.isComplete() ? 'progress' : 'complete',
            'addEventListener', ['click', _ => this.toggle(item)]
          ),
          DomRenderer.el('button', 'innerHTML', 'remove',
            'addEventListener', ['click', _ => this.remove(item)]
          ),
          DomRenderer.el('section',
            'appendChild', DomRenderer.el('input', 'type', 'text'),
            'appendChild', DomRenderer.el('button', 'innerHTML', 'addSubTask',
              'addEventListener', ['click', e => this.addSubTask(item, e.target.previousSibling.value)]
            )
          ),
          children.reduce(
            (p, {item, children}) => (p.appendChild(DomRenderer.el('section', 'innerHTML', item.title)), p),
            DomRenderer.el('section')
          ),
        ].reduce((el, v) => (el.appendChild(v), el), DomRenderer.el('section'))
      )
    ].forEach(v => parent.appendChild(v));
  }
};
```