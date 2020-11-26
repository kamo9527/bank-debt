<template>
  <section class="page_w add_debt">
    <div class="page_title">添加负债信息</div>
    <div class="pd_15">
      <div class="debt_info more_mb color">
        <div class="small fz_16">此份合同计算值：</div>
        <div class="fz_12">
          剩余还款总额：{{ debtMoney | toThousandsText }} 元;
        </div>
        <div class=" fz_12">
          实际年化利率为：{{ newDebtData.annualizedInterest }};
        </div>
      </div>
      <div class="debt_info">
        <nut-textinput
          class="new_input"
          label="贷款平台"
          maxlength="16"
          placeholder="向您贷款的公司/app/公众号"
          v-model="newDebtData.name"
        />
      </div>
      <div class="debt_info">
        <nut-textinput
          class="new_input_item"
          v-for="{ key, text, xx } in checkList"
          :key="key"
          :label="`${xx}${text}（元）`"
          :placeholder="`单份合同的${text}`"
          v-model="newDebtData[key]"
          @blur="handleBlur(key)"
          @change="e => handleInput(key, e)"
        />
        <div
          class="my_flex pick_xxx"
          v-for="{ key, text } in checkListPicker"
          :key="key"
        >
          <div class="pick_title">{{ text }}</div>
          <div class="pick_num">
            <span class="pick_btn" @click="changeNum(key)">
              {{ newDebtData[key] }}
            </span>
            期
          </div>
        </div>
      </div>
    </div>
    <div class="foot_btn">
      <button @click="handleNext" class="my_btn my_btn_single my_btn_active">
        下一步
      </button>
    </div>
    <nut-picker
      :is-visible="isVisible"
      :list-data="listData"
      @close="switchPicker"
      @confirm="saveValue"
    ></nut-picker>
  </section>
</template>

<script>
// @ is an alias to /src
import cache from '@/utils/cache';
import ajax from '@/rest/ajax';
import { toThousands, regexpMap, numList } from '@/utils/common';
export default {
  name: 'AddDebtForm',
  data() {
    return {
      isVisible: false,
      changeKey: '',
      listData: numList,
      newDebtData: {
        name: '',
        borrowMoney: '',
        arriveMoney: '',
        periodMoney: '',
        repaymentCycle: '',
        remainingRepaymentCycle: '',
        annualizedInterest: '0.00%',
        surplusMoney: '',
      },
      checkList: [
        { key: 'borrowMoney', text: '借款金额', xx: '您的' },
        { key: 'arriveMoney', text: '到账金额', xx: '您的' },
        { key: 'periodMoney', text: '每期还款', xx: '' },
      ],
      checkListPicker: [
        { key: 'repaymentCycle', text: '还款分期' },
        { key: 'remainingRepaymentCycle', text: '剩余还款期' },
      ],
    };
  },
  mounted() {
    const sessionData = cache.getSessionData('new_debt_data');
    if (sessionData) {
      this.newDebtData = sessionData;
    }
  },
  computed: {
    debtMoney() {
      const { periodMoney, remainingRepaymentCycle } = this.newDebtData;
      if (!periodMoney || !remainingRepaymentCycle) {
        return '0.00';
      }
      if (!regexpMap.regexp_thousand.test(periodMoney)) {
        return '0.00';
      }
      const value = periodMoney.replace(/,/g, '') * remainingRepaymentCycle;
      return value * 100;
    },
    // IRRvalue() {
    //   const { borrowMoney, periodMoney, repaymentCycle } = this.newDebtData;
    //   if (!borrowMoney || !periodMoney || !repaymentCycle) return '0.00';
    //   if (!regexpMap.regexp_thousand.test(borrowMoney)) return '0.00';
    //   if (!regexpMap.regexp_thousand.test(periodMoney)) return '0.00';
    //   const a = borrowMoney.replace(/,/g, '');
    //   const b = periodMoney.replace(/,/g, '');
    //   const IRRval = [-a];
    //   // IRRval.push(-borrowMoney); // borrowMoney 资金（总欠款资金）
    //   for (let i = 0; i < +repaymentCycle; i++) {
    //     // Period 期数
    //     IRRval.push(+b); // rental  租金（每期还款金额）
    //   }
    //   const IRR = this.IRRCalc(IRRval, 0.001);
    //   return IRR.toFixed(2);
    // },
    // iRRdata() {
    //   const { arriveMoney, periodMoney, repaymentCycle } = this.newDebtData;
    //   return { arriveMoney, periodMoney, repaymentCycle };
    // },
  },
  methods: {
    IRRCalc(CArray, guest) {
      const inc = 0.000001;
      let NPV = 0;
      do {
        guest += inc;
        for (var j = 0; j < CArray.length; j++) {
          NPV += CArray[j] / Math.pow(1 + guest, j);
        }
      } while (NPV > 0);
      return guest * 12;
    },
    handleBlur(key) {
      const aa = ['borrowMoney', 'remainingRepaymentCycle'];
      if (aa.includes(key)) return;
      const { arriveMoney, periodMoney, repaymentCycle } = this.newDebtData;
      if (!arriveMoney || !periodMoney || !repaymentCycle) {
        this.newDebtData.annualizedInterest = '0.00%';
        return;
      }
      if (!regexpMap.regexp_thousand.test(arriveMoney)) {
        this.newDebtData.annualizedInterest = '0.00%';
        return;
      }
      if (!regexpMap.regexp_thousand.test(periodMoney)) {
        this.newDebtData.annualizedInterest = '0.00%';
        return;
      }
      const params = {
        arriveMoney: arriveMoney.replace(/,/g, '') * 100,
        periodMoney: periodMoney.replace(/,/g, '') * 100,
        repaymentCycle,
      };
      if (params.arriveMoney > params.periodMoney * repaymentCycle) {
        this.$toast.text('还款金额过小');
        this.newDebtData.annualizedInterest = '0.00%';
        return;
      }
      ajax.post('/platform/irr', params).then(res => {
        if (res.code === 0 && res.data) {
          this.newDebtData.annualizedInterest = res.data;
        } else {
          this.$toast.text(res.message);
        }
      });
    },
    handleInput(key, e) {
      const value = e.target.value;
      // 删除清空,不修改
      if (value === '') return;
      // 校验千位符, 不修改
      if (regexpMap.regexp_thousand.test(value)) {
        const ll = value.split('.');
        if (ll[1]) {
          this.newDebtData[key] = `${ll[0]}.${ll[1].slice(0, 2)}`;
        }
        return;
      }
      // 非数字，不修改
      if (isNaN(value)) return;
      this.newDebtData[key] = toThousands(value);
    },
    changeNum(key) {
      this.changeKey = key;
      this.isVisible = true;
    },
    saveValue(value) {
      this.newDebtData[this.changeKey] = value[0];
      this.handleBlur(this.changeKey);
    },
    switchPicker() {
      this.isVisible = false;
    },
    handleNext() {
      // 表单校验 空值校验
      if (!this.newDebtData.name) {
        this.$toast.text('请输入向您贷款的公司/app/公众号');
        return;
      }
      const check1 = this.checkList.find(({ key }) => !this.newDebtData[key]);
      if (check1) {
        this.$toast.text('请输入' + check1.text);
        return;
      }
      if (!this.newDebtData.repaymentCycle) {
        this.$toast.text('请选择还款分期');
        return;
      }
      if (!this.newDebtData.remainingRepaymentCycle) {
        this.$toast.text('请选择剩余还款期');
        return;
      }
      const falseItem = this.checkList.find(({ key }) => {
        const value = this.newDebtData[key];
        return !regexpMap.regexp_thousand.test(value);
      });
      if (falseItem) {
        this.$toast.text(falseItem.text + '请输入数字');
        return;
      }
      const checkData = {};
      this.checkList.forEach(({ key }) => {
        checkData[key] = this.newDebtData[key].replace(/,/g, '');
      });
      if (+checkData.arriveMoney > +checkData.borrowMoney) {
        this.$toast.text('到账金额不能大于借款金额');
        return;
      }
      const falseItem1 = this.checkList.find(({ key }) => {
        return checkData[key] * 1 > 9999999.99;
      });
      if (falseItem1) {
        this.$toast.text(falseItem1.text + '大于9,999,999.99，请重新输入');
        return;
      }
      const falseItem2 = this.checkList.find(({ key }) => {
        return checkData[key] * 1 <= 0;
      });
      if (falseItem2) {
        this.$toast.text(falseItem2.text + '小于或等于0，请重新输入');
        return;
      }
      this.newDebtData.surplusMoney = this.debtMoney;
      cache.setSessionData('new_debt_data', this.newDebtData);
      this.$router.push('upload_debt_pic');
    },
  },
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
.add_debt {
  padding-bottom: 60px;
  .debt_info {
    background-color: #fff;
    padding: 10px 15px;
    margin-bottom: 10px;
    font-size: 14px;
    border-radius: 4px;
    .fz_16 {
      font-size: 16px;
    }
    .fz_12 {
      text-align: left;
      font-size: 14px;
    }
    .small {
      text-align: left;
      padding: 4px 0;
    }
  }
  .more_mb {
    padding-right: 10px;
    margin-top: -40px;
  }
  .color {
    color: #8f6b2e;
  }
  .new_input .nut-textinput-label {
    width: 80px;
  }
  .new_input_item {
    padding: 8px 0;
  }
  .new_input_item .nut-textinput-label {
    width: 130px;
    text-align: right;
  }
  .new_input_item input {
    max-width: 184px;
  }
  .pick_xxx {
    height: 44px;
    .pick_title {
      width: 120px;
      padding-right: 10px;
      text-align: right;
    }
    .pick_num {
      flex: 1;
      display: flex;
      align-items: center;
    }
    .pick_btn {
      border: 1px solid #d4caca;
      width: 28px;
      height: 28px;
      line-height: 28px;
      text-align: center;
      margin-right: 15px;
    }
  }
}
</style>
