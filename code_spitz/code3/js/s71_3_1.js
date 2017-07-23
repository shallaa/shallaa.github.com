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