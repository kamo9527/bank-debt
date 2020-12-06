/**
 * 初始化配置: deviceId生成
 **/
import cache from '@/utils/cache';
export default function() {
  const deviceId = cache.getLocalStorageData('deviceId') || '';
  if (!deviceId) cache.setLocalStorageData('deviceId', uuid());
}
function uuid() {
  function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  }
  return (
    S4() +
    S4() +
    '-' +
    S4() +
    '-' +
    S4() +
    '-' +
    S4() +
    '-' +
    S4() +
    S4() +
    S4()
  );
}
