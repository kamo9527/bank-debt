<template>
  <section class="page_w refund_page">
    <nut-cell
      class="my_cell"
      v-for="item in refundCardList"
      :show-icon="true"
      :key="item.bankCardNo"
      :title="item.bankName"
      :sub-title="item.bankCardNoCopy"
      :desc="statusInfo[item.status]"
    >
      <div class="my_link" slot="avatar">
        <img class="my_icon" :src="item.bankCode | getBankLogo" alt="" />
      </div>
      <div class="my_bgeg" @click="cellClick(item)" slot="icon">解除绑定</div>
    </nut-cell>
    <div class="no_list" v-if="refundCardList.length === 0">
      <img
        class="igmegeger"
        src="~@/assets/images/personInfo/no_list.png"
        alt=""
      />
    </div>
    <button @click="handleSubmit" class="my_btn">添加信用卡</button>

  </section>
</template>

<script>
// @ is an alias to /src
import ajax from '@/rest/ajax';
export default {
  name: 'myCardsPage',
  data() {
    return {
      merchantId: '',
      refundCardList: [],
      statusInfo: {
        0: '正常',
        1: '还款中',
        2: '还款失败',
      },
    };
  },
  mounted() {
    this.getCardList();
  },
  methods: {
    getCardList() {
      ajax.post('/account/info', {}).then((res) => {
        if (res.code === 0) {
          const { merchantCreditQueryResult } = res.data;
          this.refundCardList = merchantCreditQueryResult.merchantCreditCardList.map(
            (item) => {
              item.bankCardNoCopy =
                item.bankCardNo.slice(0, 3) +
                '***********' +
                item.bankCardNo.slice(-4);
              return item;
            }
          );
        } else {
          this.$toast.text(res.msg);
        }
      });
    },
    cellClick(item) {
      const { bankCardNo } = item;
      ajax
        .post(
          '/debitCard/unbind',
          { bankCardNo },
          {
            headers: {
              'content-type': 'application/x-www-form-urlencoded',
            },
          }
        )
        .then((res) => {
          if (res.code === 0) {
            this.getCardList();
          } else {
            this.$toast.text(res.msg);
          }
        });
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
    .my_bgeg {
      height: 20px;
      line-height: 20px;
      padding: 4px 15px;
      border-radius: 16px;
      border: 1px solid #fff;
      color: #fff;
    }
  }
  .no_list {
    padding-top: 80px;
    .igmegeger {
      margin: 0 auto;
      display: block;
      width: 106px;
      height: 106px;
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
