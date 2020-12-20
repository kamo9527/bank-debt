<template>
  <section class="page_w fee_page">
    <div class="fee_title">无卡收款费率</div>
    <div class="my_fee">
      <span class="fee_item">无卡收款</span>
      <span class="fee_item">费率</span>
      <span class="fee_item">单笔手续费</span>
    </div>
    <div class="my_fee">
      <span class="fee_item"></span>
      <span class="fee_item">{{ info.quickRate / 100 }}%</span>
      <span class="fee_item">{{ info.quickPer / 100 }}元</span>
    </div>
    <div class="fee_title">我要还款费率</div>
    <div class="my_fee">
      <span class="fee_item">我要还款</span>
      <span class="fee_item">费率</span>
      <span class="fee_item">单笔手续费</span>
    </div>
    <div class="my_fee">
      <span class="fee_item"></span>
      <span class="fee_item">{{ info.repayRate / 100 }}%</span>
      <span class="fee_item">{{ info.repayPer / 100 }}元</span>
    </div>
  </section>
</template>

<script>
// @ is an alias to /src
import ajax from '@/rest/ajax';
export default {
  name: 'myFeePage',
  data() {
    return {
      info: {},
    };
  },
  mounted() {
    ajax.post('/account/info', {}).then((res) => {
      if (res.code === 0) {
        const { merchantInfoQueryResult } = res.data;
        this.info = merchantInfoQueryResult;
      } else {
        this.$toast.text(res.msg);
      }
    });
  },
  methods: {},
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
