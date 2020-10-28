import data from './../data/index'

// 转换金额
export const changeMoney = money => {
  money = parseFloat( parseFloat(money).toFixed(2) )
  if ( money > 1000 ) {
    return (money / 1000 ).toFixed(2) + 'k'
  } else if ( money > 10000 ) {
    return (money / 10000 ).toFixed(2) + 'w'
  } else {
    return money
  }
}

// 计算器
const calculator = ( num1, num2, operator ) => {
  switch (operator) {
      case '+':
          return num1 = num1 + num2
          break
          case '-':
          return num1 = num1 - num2
          break
      case '*':
          return num1 = num1 * num2
          break
      case '/':
          return num1 = parseFloat(parseFloat(num1 / num2).toFixed(2))
          break
  }
}

export const easeCalculate = str => {
  let numbers = str.split(/[\+\-\*\/]/g).map(item => parseFloat(parseFloat(item).toFixed(2)))
  let operators = [] 
  str.split(/\d*/g).map(item => {
    if ( item != '' ) {
      operators.push(item)
    }
  })
  let result = numbers[0]
  for ( let prop in numbers ) {
    let plus = parseInt(prop) + 1
    if ( prop == operators.length ) {return result}
    result = calculator(result, numbers[plus], operators[prop])
  }
}

// 转换时间
export const dateFormat = (date, fmt) => {
  date = new Date(+date)
  if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  let o = {
      'M+': date.getMonth() + 1,
      'd+': date.getDate(),
      'h+': date.getHours(),
      'm+': date.getMinutes(),
      's+': date.getSeconds()
  }
  for (let k in o) {
      if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + ''
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : ('00' + str).substr(str.length))
      }
  }
  return fmt
}

// 返回图标类名
export const getIconClass = row => {
  let className = ''
  if ( row.status == 0 ) {
    data.icons.expenditure.map(item => {
      if ( item.text == row.type ) {
        className = item.iconClass
      }
    })
  } else {
    data.icons.income.map(item => {
      if ( item.text == row.type ) {
        className = item.iconClass
      }
    })
  }
  return className
}