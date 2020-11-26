var IRRval = [];

IRRval.push(-financed);  //financed 资金（总欠款资金）
for (i = 0; i < period; i++) {  //Period 期数
  IRRval.push(rental); //rental  租金（每期还款金额）
}

var IRR = IRRCalc(IRRval, 0.001) * 0.01;

function IRRCalc(CArray, guest) {
  inc = 0.000001;
  do {
    guest += inc;
    NPV = 0;
    for (var j = 0; j < CArray.length; j++) {
      NPV += CArray[j] / Math.pow((1 + guest), j);
    }
  } while (NPV > 0);
  return guest * 100;
}

// 13620958386
// 千位分隔符处理：
// 图片懒加载组件vue-lazyload 
