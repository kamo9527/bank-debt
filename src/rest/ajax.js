/* eslint-disable no-case-declarations */
/**
 * ajax request help
 */
import Fly from 'flyio/dist/npm/fly';
// import cache from '@/utils/cache';
import baseUrl from './config';
import {
  addCommonParams,
  createParamsSign,
  checkApiToSign,
  checkTimestampToSign,
} from '@/utils/sign';

let fly = new Fly();
fly.interceptors.request.use(request => {
  // 给所有请求添加自定义header
  request.headers['X-Tag'] = 'flyio';
  request.headers['channelType'] = 'wx';
  // request.headers['Content-Type'] = 'application/x-www-form-urlencoded';

  request.baseURL = baseUrl;

  const params =
    request.method.toUpperCase() === 'GET' ? request.params : request.body;
  // 添加公共参数
  addCommonParams(params);
  // 签名
  createParamsSign(
    params,
    checkApiToSign(request.url),
    checkTimestampToSign(request.url)
  );
  return request;
});
fly.interceptors.response.use(
  response => {
    const { code } = response.data;
    if (code === 8017 || code === 8014) {
      // cache.clearLocalStorageData('person_info');
      // cache.clearLocalStorageData('signKey');
      // const next = window.location.hash.slice(1);
      // window.location.href = `/login_login?next=${next}`;
    }
    return response.data;
  },
  err => {
    if (err.status) {
      switch (err.status) {
        case 404:
          console.log('请求发生404错误!');
          break;
        case 500:
          console.log('请求发生500错误!');
          break;
        case 504:
          console.log('请求超时!');
          break;
        case 400: // 用户没有x-token
        case 401: // 用户没有登录态
          window.location.href = `/register?next=${window.location.pathname}`;
          break;
        default:
          console.log('error:' + err.message);
          break;
      }
    }
    return Promise.resolve(err);
  }
);

export default fly;
