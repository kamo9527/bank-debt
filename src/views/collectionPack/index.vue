<template>
  <section class="page_w refund_page">
    <nut-cell
      class="my_cell"
      v-for="item in refundCardList"
      :key="item.card"
      :title="item.bank"
      :sub-title="item.card"
      :desc="item.status"
      :to="item.link"
    >
      <div class="my_link" slot="avatar">
        <img class="my_icon" :src="item.icon" alt="" />
      </div>
    </nut-cell>
  </section>
</template>

<script>
// @ is an alias to /src
// import ajax from '@/rest/ajax';
import icon1 from '@/assets/images/refund/icon1@2x.png';
import icon2 from '@/assets/images/refund/icon2@2x.png';
import icon3 from '@/assets/images/refund/icon3@2x.png';
export default {
  name: 'AddDebtForm',
  data() {
    return {
      refundCardList: [
        {
          bank: '广东发展银行',
          card: '6358********6587',
          status: '还款中',
          icon: icon1,
          link: '/my_refund_chanel',
        },
        {
          bank: '广东发展银行',
          card: '6358********4587',
          status: '还款中',
          icon: icon2,
          link: '/my_refund_chanel',
        },
        {
          bank: '广东发展银行',
          card: '6358********6687',
          status: '还款中',
          icon: icon3,
          link: '/my_refund_chanel',
        },
      ],
    };
  },
  mounted() {},
  methods: {},
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
    background: linear-gradient(to right, #c7b0f0, #8f9ae9);
    .my_link {
      width: 30px;
      margin-right: 10px;
    }
    .my_icon {
      display: block;
      width: 100%;
    }
    .nut-cell-desc {
      color: #fff;
    }
  }
}
</style>
