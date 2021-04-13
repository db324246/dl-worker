export const stringify = (data) => {
  if (typeof data === 'string') return data
  else return JSON.stringify(data)
}

export const parse = (str) => {
  if (typeof str !== 'string') return str
  else return JSON.parse(str || '[]')
}

export const timeParse = (date, format = '{y}-{m}-{d} {h}:{i}') => {
  const _date = date || new Date()
  const formatObj = {
    y: _date.getFullYear(),
    m: _date.getMonth() + 1,
    d: _date.getDate(),
    h: _date.getHours(),
    i: _date.getMinutes(),
    s: _date.getSeconds(),
    a: _date.getDay()
  }
  const timeStr = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    if (key === 'a') {
      return ['日', '一', '二', '三', '四', '五', '六'][value]
    }
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })

  return timeStr
}

export const queryObj = obj => {
  const del = []
  for (const key in obj) {
    if (obj[key] === undefined || obj[key] === null) del.push(key)
  }
  del.forEach(k => Reflect.deleteProperty(obj, k))
  return obj
}

export const defined = (val) => {
  return val !== undefined && val !== null && val !== ''
}

// 深度克隆
export const deepClone = source => {
  if (!source && typeof source !== 'object') {
    throw new Error('error arguments', 'shallowClone')
  }
  const targetObj = source.constructor === Array ? [] : {}
  Object.keys(source).forEach(keys => {
    if (source[keys] && typeof source[keys] === 'object') {
      targetObj[keys] = deepClone(source[keys])
    } else {
      targetObj[keys] = source[keys]
    }
  })
  return targetObj
}

/**
 * 对象属性覆盖方法
 * @params { target, source1, source2.. }
 */
export function objectMergeByOwnProperty() {
  let result = arguments[0]
  const sourceArr = Array.prototype.slice.call(arguments, 1)

  const merge = function(target, source) {
    const res = {}

    Object.keys(target).forEach(property => {
      const targetProperty = target[property]

      if (source.hasOwnProperty(property)) {
        const sourceProperty = source[property]
        if (Object.prototype.toString.call(targetProperty) === '[object Object]') {
          res[property] = objectMergeByOwnProperty(targetProperty, sourceProperty)
        } else {
          res[property] = sourceProperty
        }
      } else {
        res[property] = targetProperty
      }
    })
    return res
  }

  const len = sourceArr.length
  for (let i = 0; i < len; i++) {
    result = merge(result, sourceArr[i])
  }

  return result
}

/**
 * 异步函数柯里化防止重复调用
 * 作用：针对于 对存储在仓库中的数据 多处 并行执行 初始化异步请求
 * @param {*} fn ：异步函数，应返回一个promise
 */
export function syncFuncToEeasy(fn) {
  const emitter = new Map() // 事件中心
  const handler = function(...args) {
    if (handler.running) {
      const cbs = emitter.get(fn) || []
      return new Promise(r => {
        cbs.push({
          r,
          fn,
          parmas: [...args],
          _this: this
        })
        emitter.set(fn, cbs)
      })
    }

    handler.running = true
    const res = fn.call(this, ...args)
    res
      .catch(() => {})
      .finally(() => {
        delete handler.running
        if (emitter.has(fn)) {
          const cbs = emitter.get(fn).slice()
          cbs.forEach(({ r, fn, parmas, _this }) => {
            fn.call(_this, ...parmas).then(r)
          })
          emitter.delete(fn)
        }
      })
    return res
  }
  return handler
}
