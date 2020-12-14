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
        <img class="my_icon" :src="item.icon" alt="" />
      </div>
    </nut-cell>
    <button @click="handleSubmit" class="my_btn">
      添加信用卡
    </button>
  </section>
</template>

<script>
// @ is an alias to /src
import cache from '@/utils/cache';
import ajax from '@/rest/ajax';
import icon1 from '@/assets/images/refund/icon1@2x.png';
// import icon2 from '@/assets/images/refund/icon2@2x.png';
// import icon3 from '@/assets/images/refund/icon3@2x.png';
export default {
  name: 'cardSelectPage',
  data() {
    return {
      refundCardList: [
        // {
        //   bankName: '广东发展银行',
        //   bankCardNo: '6358********6587',
        //   currentPlanStatus: '还款中',
        //   icon: icon1,
        // },
        // {
        //   bankName: '广东发展银行',
        //   bankCardNo: '6358********4587',
        //   currentPlanStatus: '还款中',
        //   icon: icon2,
        // },
        // {
        //   bankName: '广东发展银行',
        //   bankCardNo: '6358********6687',
        //   currentPlanStatus: '还款中',
        //   icon: icon3,
        // },
      ],
    };
  },
  mounted() {
    ajax.post('/account/info', {}).then(res => {
      if (res.code === 0) {
        const { merchantCreditQueryResult } = res.data;
        // todo 遍历数组映射icon
        this.refundCardList = merchantCreditQueryResult.merchantCreditCardList.map(
          item => {
            item.icon = icon1;
            return item;
          }
        );
      } else {
        this.$toast.text(res.msg);
      }
    });
  },
  methods: {
    cellClick(item) {
      const info = cache.getLocalStorageData('card_collection_form');
      info.bankName = item.bankName;
      info.bankCardNo = item.bankCardNo;
      info.payCardId = item.cardId;
      cache.setSessionData('card_collection_form', info);
      // 读取数据缓存再返回todo
      this.$router.go(-1);
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
