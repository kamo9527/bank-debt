export const regexpMap = {
  regexp_mobile: /^1\d{10}$/, // 手机校验
  regexp_name_cn: /^([\u4e00-\u9fa5]{2,8})$/, // 中文姓名校验
  regexp_Identification_card: /^\d{13,17}[0-9xX]$/, // 身份证号码格式校验
  regexp_captcha: /^\d{6}$/, // 验证码校验
  regexp_thousand: /^(([1-9][0-9]{0,2}(,\d{3})*)|0)(\.\d+)?$/, // 检验千位符
  regexp_password: /^(?=.*\d)(?=.*[a-zA-Z])[\da-zA-Z~!@#$%^&*]{6,20}$/, // 密码限制最长6-20位可以为特殊字符， 但不能空格
};
/**
 * 时间格式化
 */
export const formatTime = (time, fmt) => {
  try {
    if (typeof time === 'string') {
      time = time.replace(/-/g, '/');
      time = new Date(time);
    }
    const o = {
      'M+': time.getMonth() + 1, // 月份
      'd+': time.getDate(), // 日
      'h+': time.getHours(), // 小时
      'm+': time.getMinutes(), // 分
      's+': time.getSeconds(), // 秒
      'q+': Math.floor((time.getMonth() + 3) / 3), // 季度
      S: time.getMilliseconds(), // 毫秒
    };
    if (/(y+)/.test(fmt)) {
      const newValue = `${time.getFullYear()}`.substr(4 - RegExp.$1.length);
      fmt = fmt.replace(RegExp.$1, newValue);
    }
    for (const k in o) {
      if (new RegExp(`(${k})`).test(fmt)) {
        const newValue =
          RegExp.$1.length === 1 ? o[k] : `00${o[k]}`.substr(`${o[k]}`.length);
        fmt = fmt.replace(RegExp.$1, newValue);
      }
    }
  } catch (e) {
    throw new Error(`${e}>>时间格式化失败>>${time}>>${fmt}`);
  }
  return fmt;
};

export const toThousands = num => {
  const ll = num.toString().split('.');
  let value = ll[0];
  let res = ll[1];
  let result = '';
  while (value.length > 3) {
    result = ',' + value.slice(-3) + result;
    value = value.slice(0, value.length - 3);
  }
  if (value) {
    result = value + result;
  }
  return res ? `${result}.${res.slice(0, 2)}` : result;
};
const nums = [...Array(100).keys()];
nums.shift();
export const numList = [nums];

//防抖
export function _debounce(fn, delay = 200) {
  // var delay = delay || 200;
  var timer;
  return function() {
    var th = this;
    var args = arguments;
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(function() {
      timer = null;
      fn.apply(th, args);
    }, delay);
  };
}

//节流
export function _throttle(fn, interval = 200) {
  var last;
  var timer;
  // var interval = interval || 200;
  return function() {
    var th = this;
    var args = arguments;
    var now = +new Date();
    if (last && now - last < interval) {
      clearTimeout(timer);
      timer = setTimeout(function() {
        last = now;
        fn.apply(th, args);
      }, interval);
    } else {
      last = now;
      fn.apply(th, args);
    }
  };
}
