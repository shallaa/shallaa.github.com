const Task = class {
  constructor() {
    this._list = [];
  }

  add(task) {
    this._list.push(task);
  }

  remove(task) {
    const l = this._list;

    if (l.includes(task)) l.splice(l.indexOf(task), 1);
  }

  getResult(sort, state) {
    const l = this._list;

    let result = [];

    if (state) result = [l.filter(v => !v.isComplete()), l.filter(v => v.isComplete())]
      .reduce((p, c) => p.concat(c.sort(sort)), []);
    else result = [...l].sort(sort);

    return {
      item: this._getResult(),
      children: result.map(v => v.getResult(sort, state))
    };
  }

  _getResult() {
    throw 'must be overrided';
  }
};
const TaskItem = class extends Task {
  static title(a, b) {
    return a.sortTitle(b);
  }

  static date(a, b) {
    return a.sortDate(b);
  }

  static register(a, b) {
    return null;
  }

  constructor(title) {
    super();

    this._title = title;
    this._date = Date.now();
    this._isComplete = false;
  }

  get date() {
    return this._date.toString();
  }

  get title() {
    return this._title;
  }

  _getResult(sort, state) {
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
    super();

    this._title = title;
  }

  add(title) {
    super.add(new TaskItem(title));
  }

  remove(task) {
    super.remove(task);
  }

  _getResult(sort, state) {
    return this._title;
  }

  byRegister(state = false) {
    return this.getResult(TaskItem.register, state);
  }

  byTitle(state = false) {
    return this.getResult(TaskItem.title, state);
  }

  byDate(state = false) {
    return this.getResult(TaskItem.date, state);
  }
};

const Dr = class {
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

  constructor(taskList, parent) {
    this._list = taskList;
    this._parent = parent;
    this._sort = 'register';
  }

  sort(s) {
    this._sort = s;

    this.render();
  }

  add(title) {
    this._list.add(title);

    this.render();
  }

  remove(taskItem) {
    this._list.remove(taskItem);

    this.render();
  }

  toggle(taskItem) {
    taskItem.toggle(); // !!

    this.render();
  }

  render() { // throw
    const parent = document.querySelector(this._parent);
    const data = this._list.getResult(this._sort, true);

    parent.innerHTML = '';

    [
      Dr.el('h2', 'innerHTML', data.item),
      'register,title,date'.split(',').reduce((p, c) => {
        p.appendChild(Dr.el('button', 'innerHTML', c,
          'addEventListener', ['click', e => this.sort(c)]));
        return p;
      }, Dr.el('nav')),
      Dr.el('section',
        'appendChild', Dr.el('input', 'type', 'text'),
        'appendChild', Dr.el('button', 'innerHTML', 'add task',
          'addEventListener', [
            'click', e => this.add(e.target.previousSibling.value)
          ])
      ),
      data.children.reduce((p, { item, children }) => {
        p.appendChild([
          Dr.el('h3', 'innerHTML', item.title,
            '@textDecoration', item.isComplete() ? 'line-through' : 'none'
          ),
          Dr.el('time', 'innerHTML', item.date, 'dateTime', item.date),
          Dr.el('button', 'innerHTML', item.isComplete() ? 'progress' : 'complete',
            'addEventListener', [
              'click', e => this.toggle(item)
            ]),
          Dr.el('button', 'innerHTML', 'remove',
            'addEventListener', [
              'click', e => this.remove(item)
            ])
        ].reduce((p, c) => (p.appendChild(c), p), Dr.el('section')));

        return p;
      }, Dr.el('section'))
    ].reduce((p, c) => (p.appendChild(c), p), parent);
  }
};