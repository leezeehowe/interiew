/**
 * 题目1：
 * 编写一个 People 类，使其的实例具有监听事件、触发事件、解除绑定功能。
 * （实例可能监听多个不同的事件，也可以去除监听事件）
 */
class People {

  constructor(name) {
    this.name = name;
    this.eventMap = new Map();
  }

  sayHi() {
    console.log(`Hi, I am ${this.name}`)
  }

  on(event, handler) {
    let handlerMap = this.eventMap.get(event);
    if (!(handlerMap instanceof Map)) {
      handlerMap = new Map();
    }
    handlerMap.set(handler, handler);
    this.eventMap.set(event, handlerMap);
  }

  emit(event, ...params) {
    if (!this.eventMap.has(event)) {
      return;
    }
    const handlerMap = this.eventMap.get(event);
    for (const [k, v] of handlerMap) {
      k(...params);
    }
  }

  off(event, handler) {
    if (!this.eventMap.has(event)) {
      return;
    }
    const handlerMap = this.eventMap.get(event);
    handlerMap.delete(handler);
  }
}

/**
 * 题目2：完成 sleep 函数，可以达到下面的效果：
 * @param {*} duration 
 */
const sleep = (duration) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, duration)
  })
}

const anyFunc = async () => {
  console.log("123") // 输出 123
  await sleep(300) // 暂停 300 毫秒
  console.log("456") // 输出 456，但是距离上面输出的 123 时间上相隔了 300 毫秒
}

/**
 * 题目3：完成 deepGet 函数，
 * 给它传入一个对象和字符串，
 * 字符串表示对象深层属性的获取路径，
 * 可以深层次获取对象内容：
 */

// 提取索引
// 'school.students[1][2].name' => ['1', '2']
function extractIndex(str = '') {
  const res = str.match(/\[\d\]/g) || [];
  return res.map(item => {
    return item.replace('[', '').replace(']', '');
  })
}

// 把'school.students[1].name' 转为 ['school', 'students', '1', 'name']
// or
// 把'school.students[1][2].name' 转为 ['school', 'students', '1', '2', 'name']
function replaceArrayIndex(s) {
  let str = s;
  extractIndex(str).forEach(index => {
    str = str.replace(/\[\d\]/, '.' + index);
  })
  return str;
}

function isValidNumber(str) {
  return !Number.isNaN(Number(str));
}

const deepGet = (obj, prop = '') => {
  const path = prop.split('.')
    .map(replaceArrayIndex)
    .map(i => i.split('.'))
    .reduce((p, c) => {
      return p.concat(c);
    }, []);
  console.log(path, prop)
  let curObj = obj;
  for (const pathItem of path) {
    if (!curObj) {
      console.warn(`路径比对象层级深，对象为${curObj}，key为${pathItem}`);
      return undefined;
    }
    else if (isValidNumber(pathItem) && !Array.isArray(curObj)) {
      console.warn(`索引是数字${pathItem}，但是对象${curObj}不是数组`);
      return undefined;
    }
    else if (!isValidNumber(pathItem) && Array.isArray(curObj)) {
      console.warn(`索引不是数字${pathItem}，但是对象${curObj}是数组`);
      return undefined;
    }
    else {
      curObj = curObj[pathItem];
    }
  }
  return curObj;
}

/**
 * 题目4：完成 combo 函数。
 * 它接受任意多个单参函数（只接受一个参数的函数）作为参数，并且返回一个函数。
 * 它的作为用：使得类似 f(g(h(a))) 这样的函数调用可以简写为 combo(f, g, h)(a)。
 */
const combo = (...fns) => {
  return function (param) {
    let result = undefined;
    result = param;
    for(let i = fns.length - 1; i >= 0; i--) {
      const fn = fns[i];
      result = fn(result);
    }
    return result;
  }
}

function testFirstQues() {
  /* 以下为测试代码 */
  const say1 = (greeting) => {
    console.log(`${greeting}, nice meeting you.`)
  }

  const say2 = (greeting) => {
    console.log(`${greeting}, nice meeting you, too.`)
  }

  const jerry = new People('Jerry')
  jerry.sayHi()
  // => 输出：'Hi, I am Jerry'

  jerry.on('greeting', say1)
  jerry.on('greeting', say2)

  jerry.emit('greeting', 'Hi')
  // => 输出：'Hi, nice meeting you.' 和 'Hi, nice meeting you, too'

  jerry.off('greeting', say1)
  jerry.emit('greeting', 'Hi')
  // => 只输出：'Hi, nice meeting you, too'
}

function testSecondQues() {
  anyFunc()
}

function testThirdQues() {
  /** 以下为测试代码 */
  // console.log(deepGet({
  //   school: {
  //     student: { name: 'Tomy' },
  //   },
  // }, 'school.student.name')) // => 'Tomy'

  // console.log(deepGet({
  //   school: {
  //     students: [
  //       { name: 'Tomy' },
  //       { name: 'Lucy' },
  //     ],
  //   }
  // }, 'school.students[1].name')) // => 'Lucy'

  console.log(deepGet({
    school: {
      students: [
        { name: 'Tomy', score: [11, 222] },
        { name: 'Lucy' },
      ],
    }
  }, 'school.students[0].score[1]')) // => '222'

  console.log(deepGet({
    school: {
      classroom: [
        [{ name: 'mike' }, { name: 'jane' }],
        [{ name: 'kaven' }, { name: 'leborn' }],
      ],
    }
  }, 'school.classroom[0][0].name')) // => 'mike'

  // // 对于不存在的属性，返回 undefined
  // console.log(deepGet({ user: { name: 'Tomy' } }, 'user.age')) // => undefined
  // console.log(deepGet({ user: { name: 'Tomy' } }, 'school.user.age')) // => undefined
}

function test4Ques() {
  /* 以下为测试代码 */
  const addOne = (a) => a + 1
  const multiTwo = (a) => a * 2
  const divThree = (a) => a / 3
  const toString = (a) => a + ''
  const split = (a) => a.split('')

  split(toString(addOne(multiTwo(divThree(666)))))
  // => ["4", "4", "5"]

  const testForCombo = combo(split, toString, addOne, multiTwo, divThree)
  console.log(testForCombo(666))
  // => ["4", "4", "5"]
}

test4Ques()