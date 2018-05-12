import _ from 'lodash'

export function getValFromListByKey(list, keyName, valName, key) {
  let ret = _.result(_.find(list, [keyName, key]), valName)
  if (!ret) {
    ret = '无可用值'
  }
  return ret
}

export function reload() {
  location.reload()
}

// checkbox 返回的是 boolean 数据库存的是整数 所以要转一下
export function objectBool2IntTrans(obj) {
  Object.keys(obj).forEach(
    function(key) {
      if (typeof obj[key] === 'boolean') {
        obj[key] = 1 * obj[key]
      }
    }
  )
  return obj
}

export function objectInt2BoolTrans(obj, mark) {
  Object.keys(obj).forEach(
    function(key) {
      if (key.indexOf(mark) >= 0) {
        obj[key] = !!obj[key]
      }
    }
  )
  return obj
}

export function clearObject(obj) {
  Object.keys(obj).forEach(
    function(key) {
      obj[key] = undefined
    }
  )
  return obj
}

export function printInfo(obj, tag) {
  var tagStr = !tag ? '' : tag + ':  '
  try {
    console.log(tagStr + JSON.stringify(obj))
  } catch (err) {
    console.log(tagStr + obj)
  }
}

export function isInteger(obj) {
  try {
    obj = Number(obj)
  } catch (err) {
    console.error(err.message)
    return false
  }
  return typeof obj === 'number' && obj % 1 === 0
}
