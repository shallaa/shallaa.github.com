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