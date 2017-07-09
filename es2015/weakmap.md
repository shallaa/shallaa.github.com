# Map, WeakMap

## Map
- `ES6`에 추가된 네가지 데이터 구조( `Map`, `WeakMap`, `Set`, `WeakSet`) 중 하나
- 키에 객체를 포함한 어떠한 값이든 설정할 수 있다
  - `ES5` 이전의 데이터 구조인 객체의 모든 키는 문자열
  ```js
  var object = {};
  var key = {};

  object[key] = 123;
  object['[object Object]']; // 123
  ```
  - 키로 설정하는 값은 무조건 문자열
  ```js
  var object = {};
  var key = { toString() { return 'key'; } };

  object[key] = 123;
  object['key'] // 123
  ```
  - 숫자를 키로 사용하는 것으로 보이던 배열 역시
  ```js
  var array = [123];
  var key = { toString() { return '0'; } };

  array[0]; // 123
  array['0']; // 123
  array[key]; // 123
  ```
  - `Map`의 키는 문자열 뿐 아니라 객체도 가능
  ```js
  const map = new Map();
  const key = {};

  map.set(key, 123);
  map.get(key); // 123
  map.has('[object Object]'); // false
  ```
  - 심지어 `NaN`도 가능한데
    - `NaN`은 `NaN` 끼리도 같지 않은 값이지만
  	```js
  	NaN === NaN // false
  	```
  	- `Map`에서는 동등하게 판단한다
  	```js
  	const map = new Map();
  	map.set(NaN, 123);
  	map.get(NaN); // 123

  	```
  그 외에는 === 비교와 비슷하다
  ```js
  const map = new Map();
  map.set(-0, 123);
  map.get(+0); // 123
  -0 === +0 // true
  ```
## WeakMap
- `WeakMap`은 키로 사용하는 객체가 가비지 컬렉션에 수집되는 것을 막지 않는 `Map`
- `Map`과의 차이는
  - `WeakMap`의 키는 객체만 가능
    ```js
    const wm = new WeakMap();
    wm.set({}, 123); // OK
    wm.set('abc', 123); // 에러
    ```
  - `WeakMap`의 키들은 `WeakMap`에 약하게 연결
    - 변수, 프로퍼티 등에서 참조되지 않는 객체는 가비지 컬렉션의 대상이 된다
    - `WeakMap`의 키로 할당된 객체들은 참조 카운트가 올라가지 않는다
    - `WeakMap`은 키로 할당된 객체들이 가비지 컬렉션의 대상이 되는 것을 막지 않는다
  - `WeakMap`의 전체 내용을 살펴볼 수 있는 메소드는 없다
    - 각 키들이 약하게 연결된 상태를 유지해야 하기 때문에
  - `WeakMap`의 내용을 일괄 삭제( `clear` )할 수 없다
- `WeakMap`으로 `private` 구현
```javascript
const Countdown = (() => {
  const _counter = new WeakMap();
  const _action = new WeakMap();

  return class {
    constructor(counter, action) {
      _counter.set(this, counter);
      _action.set(this, action);
    }
    dec() {
      let counter = _counter.get(this);

      if (--counter < 1) {
        _action.get(this)();
      }

      _counter.set(this, counter);
    }
  };
})();
```
- `Countdown` 클래스의 `counter`, `action`은 외부에서 접근할 수 없는 `private`
- `Countdown` 클래스의 인스턴스의 참조가 끊기면 가비지 컬렉팅의 대상이 된다
```js
const countdown = new Countdown(3, () => console.log('test'));
countdown.dec();
countdown.dec();
countdown.dec();
countdown.dec(); // test
countdown = null;
```
- `Symbol`을 사용하여 `private`를 구현하면
```js
const Countdown = (() => {
  const _counter = Symbol('counter');
  const _action = Symbol('action');

  return class {
    constructor(counter, action) {
      this[_counter] = counter;
      this[_action] = action;
    }
    dec() {
      if (--this[_counter] < 1) {
        this[_action]();
      }
    }
  };
})();
```
- 비슷하게 동작하지만 `Reflect.ownKeys` 메소드로 `Symbol` 키에 접근할 수 있기 때문에 안전하지 않다
```js
const countdown = new Countdown(3, () => console.log('test'));
const action = Reflect.ownKeys(countdown)[1];
countdown[action](); // test
```