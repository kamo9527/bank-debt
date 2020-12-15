<template>
  <section class="page_w refund_page">
    <nut-cell
      class="my_cell"
      v-for="item in refundCardList"
      :key="item.bankCardNo"
      :title="item.bankName"
      :sub-title="item.bankCardNo"
      :desc="item.currentPlanStatus"
      @click-cell="cellClick(item)"
    >
      <div class="my_link" slot="avatar">
        <img class="my_icon" :src="item.bankCode | getBankLogo" alt="" />
      </div>
    </nut-cell>
    <button @click="handleSubmit" class="my_btn">添加信用卡</button>
  </section>
</template>

<script>
// @ is an alias to /src
import ajax from '@/rest/ajax';
import icon1 from '@/assets/images/refund/icon1@2x.png';
// import icon2 from '@/assets/images/refund/icon2@2x.png';
// import icon3 from '@/assets/images/refund/icon3@2x.png';
export default {
  name: 'cardSelectPage',
  data() {
    return {
      merchantId: '',
      refundCardList: [],
    };
  },
  mounted() {
    ajax.post('/account/info', {}).then((res) => {
      if (res.code === 0) {
        const { merchantCreditQueryResult, merchantInfoQueryResult } = res.data;
        this.merchantId = merchantInfoQueryResult.merchantId;
        if (!merchantCreditQueryResult) {
          return;
        }
        this.refundCardList = merchantCreditQueryResult.merchantCreditCardList;
      } else {
        this.$toast.text(res.msg);
      }
    });
  },
  methods: {
    cellClick(item) {
      item.merchantId = this.merchantId;
      this.$router.push({ path: '/my_refund_chanel', query: item });
    },
    handleSubmit() {
      this.$router.push('/add_new_card');
    },
  },
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
.refund_page {
  padding: 15px;
  background-color: #fff;
  .my_cell {
    border-radius: 10px;
    height: 105px;
    line-height: 105px;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    background: linear-gradient(to right, #c7b0f0, #8f9ae9);
    .my_link {
      width: 30px;
      margin-right: 10px;
    }
    .my_icon {
      display: block;
      width: 100%;
    }
    .nut-cell-title {
      color: #fff;
      font-size: 15px;
    }
    .nut-cell-box {
      width: 100%;
      background-image: none;
    }
    .nut-cell-desc {
      color: #fff;
      font-size: 15px;
    }
    .nut-cell-sub-title {
      color: #fff;
      font-size: 15px;
    }
  }
  .my_btn {
    margin: 40px auto 0;
    display: block;
    width: 90%;
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
