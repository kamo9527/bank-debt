/**
 * baseUrl 配置
 **/
// export default {
//   build: {
//     baseUrl: 'https://bluehat.wtf.com/api/v1',
//   },
//   dev: {
//     baseUrl: 'https://bluehat.wtf.test.net/api/v1',
//   },
// };

let baseUrl = '';
if (process.env.NODE_ENV === 'production') {
  // baseUrl = 'http://ydtapi.kuaikuaifu.net/api';
  // baseUrl = 'http://120.79.102.97:9000'; // 开发环境
  // baseUrl = 'http://192.168.0.155:9000'; // 内网测试
  baseUrl = 'http://newpay.kuaikuaifu.net'; // 生产
  // baseUrl = '.';
} else {
  baseUrl = 'http://120.79.102.97:9000'; // 开发环境
}
export default baseUrl;
