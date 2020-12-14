/**
 * 初始化配置: deviceId生成
 **/
import cache from '@/utils/cache';

// 银行logo图片资源
import abc from '@/assets/images/bankLogo/ABC.png';
// import bcm from '@/assets/images/bankLogo/BCM.png';
import boc from '@/assets/images/bankLogo/BOC.png';
import ccb from '@/assets/images/bankLogo/CCB.png';
import ceb from '@/assets/images/bankLogo/CEB.png';
import cib from '@/assets/images/bankLogo/CIB.png';
import cmb from '@/assets/images/bankLogo/CMB.png';
import cmbc from '@/assets/images/bankLogo/CMBC.png';
import psbc from '@/assets/images/bankLogo/PSBC.png';
import spdb from '@/assets/images/bankLogo/SPDB.png';
import gdb from '@/assets/images/bankLogo/bank_gdb.png';
// import bod from '@/assets/images/bankLogo/BOD.png';
import spabank from '@/assets/images/bankLogo/SPABANK.png';
import icbc from '@/assets/images/bankLogo/ICBC.png';
import bjbank from '@/assets/images/bankLogo/BJBANK.png';
import bjrcb from '@/assets/images/bankLogo/BJRCB.png';
import shbank from '@/assets/images/bankLogo/SHBANK.png';
import citic from '@/assets/images/bankLogo/CITIC.png';
import _default from '@/assets/images/bankLogo/Default.png';

export default function(vue) {
  const deviceId = cache.getLocalStorageData('deviceId') || '';
  if (!deviceId) cache.setLocalStorageData('deviceId', uuid());

  vue.filter('getBankLogo', bankCode => {
    bankCode = bankCode.toLowerCase();
    let bankLogo = '';
    switch (bankCode) {
      case 'abc':
        bankLogo = abc;
        break;
      // case 'bcm':
      //   bankLogo = bcm;
      //   break;
      case 'boc':
        bankLogo = boc;
        break;
      case 'ccb':
        bankLogo = ccb;
        break;
      case 'ceb':
        bankLogo = ceb;
        break;
      case 'cib':
        bankLogo = cib;
        break;
      case 'cmb':
        bankLogo = cmb;
        break;
      case 'cmbc':
        bankLogo = cmbc;
        break;
      case 'psbc':
        bankLogo = psbc;
        break;
      case 'spdb':
        bankLogo = spdb;
        break;
      case 'gdb':
        bankLogo = gdb;
        break;
      // case 'bod':
      //   bankLogo = bod;
      //   break;
      case 'spabank':
        bankLogo = spabank;
        break;
      case 'icbc':
        bankLogo = icbc;
        break;
      case 'bjbank':
        bankLogo = bjbank;
        break;
      case 'bjrcb':
        bankLogo = bjrcb;
        break;
      case 'shbank':
        bankLogo = shbank;
        break;
      case 'citic':
        bankLogo = citic;
        break;
      default:
        bankLogo = _default;
        break;
    }
    return bankLogo;
  });
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
