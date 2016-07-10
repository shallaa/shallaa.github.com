# 인자없는 화살표 함수

를 작성할때는 주로 `_`를 써왔었는데.

```javascript
const func = _ => { /* ... */ };
```

프로젝트에서 [underscore.js](http://underscorejs.org/)를 쓰다보니 종종 `_`가 문제를 일으킨다.

```javascript
const _ = require('underscore');

const func = _ => {
  // underscore를 사용할 수 없다.
};
```

그래서 `()`로 교체중에. 그러고보니 인자없는 화살표 함수에 `_`를 사용하면서 불필요한 인자를 하나씩 생성하고 있었던게 아닌가.  
사용 안하는 변수를 선언하고 있었던 셈.

```javascript
const func = () => { /* ... */ };
```

모양은 덜 이쁘지만 인자가 없는 경우에도 `()`를 사용하자.
