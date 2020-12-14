/**
 * 签名
 **/
import md5 from '@/utils/md5';
import cache from '@/utils/cache';
import { formatTime } from '@/utils/common';

/**
 * 不需要登陆状态 签名接口列表 (所有接口默认 有登陆状态 签名)
 **/
const noLoginApiList = [
  '/account/login',
  '/sm/getCode',
  '/account/register',
  '/account/resetPassword',
];

const otherTimestampApiList = [
  '/area/list',
  '/index/getIconAndBanner',
  '/account/updatePassword',
  '/index/noticeList',
  '/debitCard/getBankNameByCardNo',
];

export function addCommonParams(params = {}) {
  const personInfo = cache.getLocalStorageData('person_info') || '';
  if (personInfo) {
    if (!params.loginName) params.loginName = personInfo.loginName || '';
    if (!params.merchantId) params.merchantId = personInfo.merchantId || '';
  }
  const deviceId = cache.getLocalStorageData('deviceId') || '';
  if (deviceId && !params.deviceId) params.deviceId = deviceId;
  if (!params.version) params.version = '1.0.0';
}

export function checkApiToSign(url) {
  if (!noLoginApiList) return;
  const index = noLoginApiList.findIndex(item => url.indexOf(item) > -1);
  return index > -1;
}

export function checkTimestampToSign(url) {
  if (!otherTimestampApiList) return;
  const index = otherTimestampApiList.findIndex(item => url.indexOf(item) > -1);
  return index > -1;
}

export function createParamsSign(params, noLogin, noNormaltimestamp) {
  if (!noLogin) {
    const personInfo = cache.getLocalStorageData('person_info') || '';
    const deviceId = cache.getLocalStorageData('deviceId') || '';
    const saltKey = cache.getLocalStorageData('signKey');

    // loginName, deviceId, timestamp, signKey
    const timestamp = noNormaltimestamp
      ? formatTime(new Date(), 'yyyyMMddhhmmss')
      : new Date().getTime();
    params.timestamp = timestamp;
    console.log('1111', saltKey);
    console.log(
      '1111',
      `${personInfo.loginName}${deviceId}${timestamp}${saltKey}`
    );
    params.sign = md5.hex_md5(
      `${personInfo.loginName}${deviceId}${timestamp}${saltKey}`
    );
  } else {
    const timestamp = noNormaltimestamp
      ? formatTime(new Date(), 'yyyyMMddhhmmss')
      : new Date().getTime();
    const nonce =
      'zhaih' +
      Math.random()
        .toString(36)
        .substr(2);

    params.timestamp = timestamp;
    params.nonce = nonce;

    const paramsKeys = Object.keys(params).sort();
    let paramsStr = '';
    paramsKeys.forEach(item => {
      if (
        (!(params[item] instanceof Function) && params[item]) ||
        params[item] === 0 ||
        params[item] === false
      ) {
        const paramsItemStr =
          typeof params[item] === 'object'
            ? JSON.stringify(params[item])
            : params[item];
        paramsStr += `&${item}=${paramsItemStr}`;
      }
    });
    paramsStr = paramsStr.slice(1);

    const saltKey = cache.getLocalStorageData('signKey');
    // 区分 是否有登陆状态 1、没登陆`${timestamp}#${nonce}` 2、有登陆`${timestamp}#${nonce}#${saltKey}`
    const hexMd5Str = noLogin
      ? `${timestamp}#${nonce}`
      : `${timestamp}#${nonce}#${saltKey}`;

    const salt = md5.hex_md5(hexMd5Str).toUpperCase();
    paramsStr = `${paramsStr}&key=${salt}`;

    const sign = md5.hex_hmac_md5(salt, paramsStr);
    params.sign = sign;
  }

  // return {
  //   sign,
  //   ...params
  // }
}
