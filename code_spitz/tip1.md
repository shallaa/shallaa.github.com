# CodeSpitz 1회차를 이해하기 위한 약간의 팁

## IIFE
- 이것을
  ```js 
  const Table = (_ => {})();
  ```
- 이전 스터디에서 다루었던 `ES5` 이전 버전으로 기술하면  
  ```js 
  var Table = (function(_) {})();
  ```
  즉시 실행함수(`IIFE`)일 뿐  
  `_` 인자는 보통 인자를 사용하지 않는 화살표 함수에서 간단히 기술할 때 사용  
  인자가 없는 화살표 함수는 빈 괄호 `“()”`를 사용하기도 한다  
    ```js
    const Table = (() => {})();
    ```
- 따라서 이것은
  ```js
  const Table = (_ => { return class {}; })();
  ```
- 이전에 배운 이것을 화살표 함수로 기술한 것
  ```js
  const Table = (function() { return function() {}; })();
  ```

## class
- 이전 스터디에서 다루었던 `ES5` 이전 버전까지는 `function`이 `new` 연산자의 대상이 되어왔지만
- `ES6` 이후부터는 명확하게 `class`라는 키워드를 사용 가능
- 특징으로는 `new` 없이 호출하면 에러 ( `new` 사용을 강제한다 )
- 이 코드는
  ```js
  class Test { method() { return ’true’; } }
  ```
- 이런 식으로 이해가 가능
  ```js
  var Test = function() {};
  Test.prototype.method = function() { return ’true’; };
  ```
- 사용하는 측면에서는 두 방식 다 동일
  ```js
  var test = new Test();
  test.method(); // true
  ```
## constructor
- `class`를 작성할 때는 `constructor`라는 메소드를 기술할 수 있다
- `ES5` 이전 버전에서의 생성자 함수와 비슷하게 동작
  - `ES5` 이전 버전에서 이렇게 기술했다면
    ```js
    var Test = function() { console.log(’test’) };
    ```
  - `ES6` 이후 버전에서는
    ```js
    const Test = class { constructor() { console.log(’test’); } };
    ```
  - 사용하는 측면에서 동일하다
    ```js
    var test = new Test(); // ‘test’
    ```

## promise
- `thenable` 객체를 반환
- 이런 식으로 `Promise` 객체를 생성하면
  ```js
  const pm = new Promise((success, reject) => { success(100); });
  ```
- 이런 식으로 `then` 메소드를 사용 가능
  ```js
  pm.then(res => console.log(res)); // 100
  ```
- 주도권 관점에서 기존 콜백과 다른 점이라면
  - 기존 콜백은 콜백을 호출하는 쪽이 ( 콜백이호출될 준비가 되었든 안되었든 ) 콜백이 호출되는 시점을 결정
  - `promise`는 콜백이 호출될 시점을 명확하게 제어 가능
- 콜백에서 이랬다면
  ```js
  ajax('http://url', function(res) { /* ajax가 완료되면 ajax에서 호출을 결정 */ });
  ```
- promise에서는
  ```js
  const pm = fetch('http://url');
  // 콜백이 실행되기 전에 준비해야 할 일들을 다 하고 응답된 값이 필요한 시점에
  pm.then(res => { /* ajax에서 받아온 값을 사용 */ });
  ```

## async await
- `promise` + `generator` 의 형태
- 비동기를 동기처럼 기술한다
- 이랬던 비동기를
  ```js
  function() {
    const response = fetch('http://url');
    response.then(res => { /* fetch로 가져온 값( res) 을 사용 */ });
  }
  ```
- 이렇게 동기식으로 기술
  ```js
  async function() {
    const res = await fetch('http://url');
    // fetch로 가져온 값( res )을 사용
  }
  ```
## Symbol
- 모든 `Symbol`은 유니크하다
- 그러니까
  ```js
  const a = Symbol(), b = Symbol();
  a == b // false
  ```
- `IIFE` 패턴 내에서 `Symbol`을 사용하면
  ```js
  const Test = (_ => {
    const METHOD = Symbol();
    return class {
      [METHOD]() { console.log('test'); }
      doMethod() { this[METHOD](); }
    };
  })();
  ```
- 외부에서 `METHOD`에 접근할 방법이 없으므로 메소드를 `private`하게 처리 가능
  ```js
  const test = new Test();
  test[METHOD](); // 에러.
  test.doMethod(); // test
  ```
## reduce
- 요렇게 해보면
  ```js
  const a = [1, 2, 3, 4].reduce((a, b, c) => { console.log(a, b, c); return a + b; }, 0);
  // 0 1 0 ( a는 reduce 메소드의 두 번째 인자 0, b는 [1, 2, 3, 4] 배열의 첫번째 인자, c는 인덱스 )
  // 1 2 1 ( a는 위에서 리턴한 a + b, b는 [1, 2, 3, 4] 배열의 두번째 인자, c는 인덱스 )
  // 3 3 2 ( a는 위에서 리턴한 a + b, b는 [1, 2, 3, 4] 배열의 세번째 인자, c는 인덱스 )
  // 6 4 3 ( a는 위에서 리턴한 a + b, b는 [1, 2, 3, 4] 배열의 네번째 인자, c는 인덱스 )
  console.log(a); // 10 ( [1, 2, 3, 4]를 합한 하나의 값 )
  ```
- 배열의 여러 개 원소에서 하나의 값을 얻어냈다
