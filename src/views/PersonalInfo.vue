<template>
  <section class="page_w personal_info">
    <div class="page_title">债惠</div>
    <div class="pd_15">
      <div class="my_flex debt_info more_mb">
        <img class="avater" :src="personInfo.headImg || iconX" alt="" />
        <div class="name">{{ personInfo.name || '--' }}</div>
      </div>
      <div class="debt_info">
        <div class="my_flex my_cell" @click="handleGo('personal_certify')">
          <div>实名认证</div>
          <span class="with_arrow" />
        </div>
        <div class="my_flex my_cell">
          <div class="cell_title">月收入</div>
          <button class="change_btn" @click="hanleChangeInput">
            <img
              class="change_btn_icon"
              src="../assets/images/number_icon@2x.png"
              alt=""
            />
          </button>
          <input
            class="change_input"
            type="text"
            placeholder="0.00"
            v-model="personInfo.monthMoney"
            @change="e => handleInput('monthMoney', e)"
          />
          <span>元</span>
        </div>
        <div class="my_flex my_cell">
          <div class="cell_title">月最大还款能力</div>
          <button class="change_btn" @click="hanleChangeInput">
            <img
              class="change_btn_icon"
              src="../assets/images/number_icon@2x.png"
              alt=""
            />
          </button>
          <input
            class="change_input"
            type="text"
            placeholder="0.00"
            v-model="personInfo.monthMaxRepayment"
            @change="e => handleInput('monthMaxRepayment', e)"
          />
          <span>元</span>
        </div>
      </div>
    </div>
    <div class="foot_btn">
      <button @click="handleGo('home')" class="my_btn ">负债管理</button>
      <button class="my_btn my_btn_active">
        个人信息
      </button>
    </div>
  </section>
</template>

<script>
import iconXX from '@/assets/images/avatar@2x.png';
import cache from '@/utils/cache';
import ajax from '@/rest/ajax';
import { toThousands, regexpMap } from '@/utils/common';

export default {
  name: 'PersonalInfo',
  data() {
    return {
      iconX: iconXX,
      personInfo: {},
    };
  },
  mounted() {
    const sessionData = cache.getSessionData('person_info') || {};
    if (sessionData) {
      ['monthMoney', 'monthMaxRepayment'].forEach(key => {
        const value = sessionData[key];
        if (value !== null && value !== '') {
          sessionData[key] = toThousands(value / 100);
        }
      });
      this.personInfo = sessionData;
    }
  },
  methods: {
    handleInput(key, e) {
      const value = e.target.value;
      // 删除清空,不修改
      if (value === '') return;
      // 校验千位符, 不修改
      if (regexpMap.regexp_thousand.test(value)) {
        const ll = value.split('.');
        if (ll[1]) {
          this.personInfo[key] = `${ll[0]}.${ll[1].slice(0, 2)}`;
        }
        return;
      }
      // 非数字，不修改
      if (isNaN(value)) return;
      this.personInfo[key] = toThousands(value);
    },
    hanleChangeInput() {
      const { monthMoney, monthMaxRepayment } = this.personInfo;
      if (!monthMoney && !monthMaxRepayment) {
        this.$toast.text('请输入');
        return;
      }
      if (monthMoney && !regexpMap.regexp_thousand.test(monthMoney)) {
        this.$toast.text('月收入请输入数字');
        return;
      }
      if (
        monthMaxRepayment &&
        !regexpMap.regexp_thousand.test(monthMaxRepayment)
      ) {
        this.$toast.text('月还款请输入数字');
        return;
      }
      if (
        !regexpMap.regexp_thousand.test(monthMoney) &&
        !regexpMap.regexp_thousand.test(monthMaxRepayment)
      ) {
        this.$toast.text('请输入数字');
        return;
      }
      const params = {
        monthMoney: monthMoney ? monthMoney.replace(/,/g, '') * 100 : '',
        monthMaxRepayment: monthMaxRepayment
          ? monthMaxRepayment.replace(/,/g, '') * 100
          : '',
      };
      if (params.monthMoney > 999999999) {
        this.$toast.text('月收入大于9,999,999.99，请重新输入');
        return;
      }
      if (params.monthMaxRepayment > 999999999) {
        this.$toast.text('月还款大于9,999,999.99，请重新输入');
        return;
      }
      ajax.post('/platform/updateUserIncome', params).then(res => {
        if (res.code === 0) {
          const info = { ...this.personInfo, ...params };
          cache.setSessionData('person_info', info);
          this.$toast.text('修改成功');
        } else {
          this.$toast.text(res.message);
        }
      });
    },
    handleGo(url) {
      this.$router.push(url);
    },
  },
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.personal_info {
  .debt_info {
    background-color: #fff;
    padding: 10px 15px;
    font-size: 14px;
    border-radius: 4px;
    margin-bottom: 10px;
  }
  .more_mb {
    margin-top: -40px;
    justify-content: flex-start;

    .avater {
      display: block;
      width: 60px;
      height: 60px;
      background-color: #eeeeee;
      border-radius: 50%;
      margin-right: 15px;
    }
    .name {
      font-size: 17px;
      color: #999;
    }
  }
  .my_cell {
    height: 40px;
    border-bottom: 1px solid #d4caca;
    .cell_title {
      flex: 1;
      text-align: left;
    }

    .change_btn {
      display: block;
      width: 20px;
      height: 20px;
      border: none;
      background-color: transparent;
    }
    .change_btn_icon {
      display: block;
      width: 100%;
      height: 100%;
    }
    .change_input {
      width: 60px;
      height: 25px;
      margin: 0 10px;
      padding: 0 10px;
      border-radius: 3px;
      border: 1px solid #888888;
      -webkit-appearance: none;
    }
  }
  .with_arrow {
    display: inline-block; // position: relative;
    // top: 0;
    // right: 0;
    transform: rotate(45deg);
    width: 8px;
    height: 8px;
    border-width: 1px 1px 0 0;
    border-color: #a0a0a0;
    border-style: solid;
  }
}
</style>
