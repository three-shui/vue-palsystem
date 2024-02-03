//获取当前时间进行判断
export const getTime = () => {
  let message = ''
  const hours = new Date().getHours()
  if (hours >= 6 && hours <= 9) {
    message = '早上'
  } else if (hours <= 11) {
    message = '上午'
  } else if (hours <= 13) {
    message = '中午'
  } else if (hours <= 18) {
    message = '下午'
  } else {
    message = '晚上'
  }

  return message;
}