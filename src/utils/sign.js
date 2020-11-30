/**
 * 签名
 **/
import md5 from '@/utils/md5';

/**
 * 不需要登陆状态 签名接口列表 (所有接口默认 有登陆状态 签名)
 **/
const noLoginApiList = [
  'account/login',
];

export function addCommonParams(params) {
  const personInfo = localStorage.getItem('person_info') || '';
  if (!personInfo) return;
  if (personInfo) {
    if (!params.version) params.version = '1.0.0';
    if (!params.deviceId) params.deviceId = localStorage.getItem('deviceId') || '';
    if (!params.loginName) params.loginName = personInfo.loginName || '';
    if (!params.merchantId) params.merchantId = personInfo.merchantId || '';
  }
}

export function checkApiToSign(url) {
  if (!noLoginApiList) return;
  const index = noLoginApiList.findIndex(item => url.indexOf(item) > -1);
  return index > -1;
}

export function createParamsSign(params, noLogin) {
  const timestamp = new Date().getTime();
  const nonce = 'zhaih' + Math.random().toString(36).substr(2);

  params.timestamp = timestamp;
  params.nonce = nonce;

  const paramsKeys = Object.keys(params).sort();
  let paramsStr = '';
  paramsKeys.forEach((item) => {
    if (!(params[item] instanceof Function) && params[item] || params[item] === 0 || params[item] === false) {
      const paramsItemStr = typeof params[item] === 'object' ? JSON.stringify(params[item]) : params[item];
      paramsStr += `&${item}=${paramsItemStr}`;
    }
  })
  paramsStr = paramsStr.slice(1);

  const saltKey = localStorage.getItem('saltKey');
  // 区分 是否有登陆状态 1、没登陆`${timestamp}#${nonce}` 2、有登陆`${timestamp}#${nonce}#${saltKey}`
  const hexMd5Str = noLogin ? `${timestamp}#${nonce}` : `${timestamp}#${nonce}#${saltKey}`;

  const salt = md5.hex_md5(hexMd5Str).toUpperCase();
  paramsStr = `${paramsStr}&key=${salt}`;

  const sign = md5.hex_hmac_md5(salt, paramsStr);
  params.sign = sign;
  // return {
  //   sign,
  //   ...params
  // }

}