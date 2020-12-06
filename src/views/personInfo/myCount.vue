<template>
  <section class="page_w count_page">
    <nut-textinput
      class="my_input"
      label="银行卡号"
      placeholder="请输入"
      :hasBorder="false"
      v-model="countInfo.count"
    />
    <nut-textinput
      class="my_input"
      label="开户名"
      placeholder="请输入"
      :hasBorder="false"
      v-model="countInfo.name"
    />
    <nut-textinput
      class="my_input"
      label="银行所在地"
      placeholder="请输入"
      :hasBorder="false"
      v-model="countInfo.address"
    />
    <nut-textinput
      class="my_input"
      label="银行网点"
      placeholder="请输入"
      :hasBorder="false"
      v-model="countInfo.bankName"
    />
    <nut-textinput
      class="my_input"
      label="预留手机号"
      placeholder="请输入"
      :hasBorder="false"
      v-model="countInfo.phone"
    />
    <button @click="handleSubmit" class="my_btn">
      修改结算卡
    </button>
  </section>
</template>

<script>
// @ is an alias to /src
import cache from '@/utils/cache';
import ajax from '@/rest/ajax';
export default {
  name: 'myFeePage',
  data() {
    return {
      countInfo: {
        count: '',
        name: '',
        address: '',
        bankName: '',
        phone: '',
      },
    };
  },
  mounted() {
    const sessionData = cache.getSessionData('new_debt_data');
    if (sessionData) {
      this.newDebtData = sessionData;
    }
    ajax.get('/repay/confirmSm').then(res => {
      console.log(res);
    });
  },
  methods: {
    handleSubmit() {
      console.log(1111);
    },
  },
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
.count_page {
  font-size: 14px;
  padding-top: 20px;
  .my_input {
    background-color: #fff;
    padding: 2px 20px;
    border-bottom: 1px solid #f7f7f7;
  }
  .my_input .nut-textinput-label {
    display: block;
    width: 100px;
    text-align: left;
  }
  .my_btn {
    margin: 40px auto 0;
    display: block;
    width: 60%;
    box-sizing: border-box;
    height: 40px;
    border-radius: 20px;
    font-size: 16px;
    color: #fff;
    border: none;
    background-color: #3375f2;
  }
}
</style>
