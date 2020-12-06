<template>
  <section class="page_w fee_page">
    <div class="fee_title">无卡收款费率</div>
    <div class="my_fee">
      <span class="fee_item">无卡收款</span>
      <span class="fee_item">费率</span>
      <span class="fee_item">单笔手续费</span>
    </div>
    <div class="my_fee">
      <span class="fee_item">无卡收款</span>
      <span class="fee_item">0.51%</span>
      <span class="fee_item">2.00元</span>
    </div>
    <div class="fee_title">无卡收款费率</div>
    <div class="my_fee">
      <span class="fee_item">I入口</span>
      <span class="fee_item">0.51%</span>
      <span class="fee_item">2元</span>
    </div>
    <div class="my_fee">
      <span class="fee_item">G入口</span>
      <span class="fee_item">0.51%</span>
      <span class="fee_item">2元</span>
    </div>
    <div class="my_fee">
      <span class="fee_item">H入口</span>
      <span class="fee_item">0.51%</span>
      <span class="fee_item">2元</span>
    </div>
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
      entranceList: [],
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
    tabSwitch(index, event) {
      console.log(index + '--' + event);
    },
    changeTips(index) {
      this.isTip = index;
    },
    tabSwitch3(value, index) {
      console.log(index);
    },
  },
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
.fee_page {
  .fee_title {
    font-size: 14px;
    color: #3574f2;
    padding: 15px;
  }
  .my_fee {
    display: flex;
    justify-content: space-between;
    align-items: center;
    text-align: center;
    font-size: 14px;
    color: #666;
    background-color: #fff;
  }
  .fee_item {
    flex: 1;
    height: 45px;
    line-height: 45px;
    box-sizing: border-box;
    border-right: 1px solid #f7f7f7;
    border-bottom: 1px solid #f7f7f7;
  }
}
</style>
