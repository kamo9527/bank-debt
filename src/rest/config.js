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
  // baseUrl = 'http://192.168.0.155:8885';
  baseUrl = '.';
}
export default baseUrl;
