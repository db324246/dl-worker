/* eslint-disable consistent-return */
// 是否固话
export function validateTelphone(rule, value, callback) {
  const reg = /0\d{2,3}-\d{7,8}/
  if (value === '' || value === undefined || value === null) {
    callback()
  } else {
    if ((!reg.test(value)) && value !== '') {
      callback(new Error('请输入正确的固定电话）'))
    } else {
      callback()
    }
  }
}

// 是否手机号
export function validatePhone(rule, value, callback) {
  const reg = /^[1][3-9][0-9]{9}$/
  if (value === '' || value === undefined || value === null) {
    callback()
  } else {
    if ((!reg.test(value)) && value !== '') {
      callback(new Error('请输入正确的电话号码'))
    } else {
      callback()
    }
  }
}

// 是否身份证
export function validateIdNo(rule, value, callback) {
  const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
  if (value === '' || value === undefined || value === null) {
    callback()
  } else {
    if ((!reg.test(value)) && value !== '') {
      callback(new Error('请输入正确的身份证号码'))
    } else {
      callback()
    }
  }
}

// 是否是邮箱
export function validateEMail(rule, value, callback) {
  const reg = /^([a-zA-Z0-9]+[-_\.]?)+@[a-zA-Z0-9]+\.[a-z]+$/
  if (value === '' || value === undefined || value === null) {
    callback()
  } else {
    if (!reg.test(value)) {
      callback(new Error('请输入正确的邮箱'))
    } else {
      callback()
    }
  }
}

// 验证内容是否包含英文数字以及下划线
export function isPassword(rule, value, callback) {
  const reg = /^[_a-zA-Z0-9]+$/
  if (value === '' || value === undefined || value === null) {
    callback()
  } else {
    if (!reg.test(value)) {
      callback(new Error('仅由英文字母，数字以及下划线组成'))
    } else {
      callback()
    }
  }
}

// 密码校验
// eslint-disable-next-line consistent-return
export function validatePassword(rule, value, callback) {
  if (value === '' || value === undefined || value === null) {
    return callback()
  }
  if (!/^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$)([^\u4e00-\u9fa5\s]){6,20}$/.test(value)) {
    callback(new Error('请输入6-20位英文字母、数字或者符号（除空格），且字母、数字和标点符号至少包含两种'))
  } else {
    callback()
  }
}

// 账号校验
export function validateIdCode(rule, value, callback) {
  if (value === '' || value === undefined || value === null) {
    return callback()
  }
  if (!/^(?![0-9]*$)(?![a-zA-Z]*$)[a-zA-Z0-9]{6,20}$/.test(value)) {
    callback(new Error('账号必须为6-20位字母和数字组合'))
  } else {
    callback()
  }
}

// 纯数字校验
export const validateNumber = (rule, value, callback) => {
  const numberReg = /^\d+$|^\d+[.]?\d+$/
  if (value === '' || value === undefined || value === null) {
    return callback()
  }
  if (value !== '') {
    if (!numberReg.test(value)) {
      callback(new Error('请输入数字'))
    } else {
      callback()
    }
  }
}

// 中文校验
export const validateContacts = (rule, value, callback) => {
  if (value === '' || value === undefined || value === null) {
    return callback()
  }
  if (!/^[\u0391-\uFFE5A-Za-z]+$/.test(value)) {
    callback(new Error('不可输入特殊字符'))
  } else {
    callback()
  }
}

// 两位小数验证
export const validateValidity = (rule, value, callback) => {
  if (value === '' || value === undefined || value === null) {
    return callback()
  }
  if (!/(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/.test(value)) {
    callback(new Error('最多两位小数！！！'))
  } else {
    callback()
  }
}
