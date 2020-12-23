<template>
  <section class="page_w collection_page">
    <div class="collection_title">无卡收款</div>
    <div class="mony_info">
      <div class="mony_info_title">请输入收款金额(元）</div>
      <div class="boardValue" @click="showKeyBoard">
        <nut-textinput
          class="mony_info_input"
          placeholder="0.00"
          :has-border="false"
          readonly
          v-model="cardCollection.amount"
        />
        <nut-numberkeyboard
          :visible="visible"
          v-model="cardCollection.amount"
          maxlength="6"
          @close="close"
        />
      </div>
    </div>
    <div class="form_info">
      <nut-cell
        class="my_cell"
        :show-icon="true"
        title="支付卡"
        :desc="
          cardCollection.bankCardNo
            ? `${
                cardCollection.bankName
              } | 尾号${cardCollection.bankCardNo.slice(-4)}`
            : '请选择'
        "
        @click.native="cellClick"
      />
      <nut-cell
        class="my_cell"
        title="收款账户"
        :desc="`${
          merchantDebitQueryResult.bankName
        } | 尾号${merchantDebitQueryResult.bankCardNo.slice(-4)}`"
      />
      <nut-cell class="my_cell" title="到账金额" :desc="`${feeAmount} `" />
      <nut-cell class="my_cell" title="到账方式" desc="实时到账" />
    </div>
    <div class="xxx_cell">
      *费率{{ feeInfo.quickRate }}%+{{
        feeInfo.quickPer
      }}元；交易时间00:00-23:00
    </div>
    <button @click="handleSubmit" class="my_btn">下一步</button>
    <nut-popup position="right" class="dkdkdkkdk" v-model="showMore">
      <iframe
        :src="channelData"
        frameborder="0"
        width="100%"
        height="100%"
      ></iframe>
    </nut-popup>
  </section>
</template>

<script>
// @ is an alias to /src
import cache from '@/utils/cache';
import ajax from '@/rest/ajax';
export default {
  name: 'cardCollectionPage',
  data() {
    return {
      channelData: '',
      showMore: false,
      visible: false,
      merchantDebitQueryResult: {
        bankCardNo: '',
        bankName: '',
      },
      cardCollection: {
        amount: '',
        appOs: '85.0.4183.121',
        appOsType: '0',
        channelNo: 'H5',
        goodsName: 'App购物',
        merchantId: '',
        payCardId: '',
        bankCardNo: '',
        bankName: '',
      },
      feeInfo: {
        quickRate: '',
        quickPer: '',
      },
      statusInfo: {},
      timerId: null,
    };
  },
  computed: {
    feeAmount() {
      // 到账金额=收款金额-收款金额*费率-单笔手续费
      if (!this.cardCollection.amount) return '0.00元';
      if (!this.feeInfo.quickRate) return '0.00元';
      if (!this.feeInfo.quickPer) return '0.00元';
      const aa =
        this.cardCollection.amount -
        (1 * this.cardCollection.amount * (1 * this.feeInfo.quickRate)) / 100 -
        this.feeInfo.quickPer;
      return aa.toFixed(2) + '元';
    },
  },
  mounted() {
    const dfff = cache.getLocalStorageData('person_info');
    this.cardCollection.merchantId = dfff.merchantId;
    const info = cache.getSessionData('card_collection_form');
    if (info) {
      this.cardCollection = info;
    }
    ajax.post('/account/info', {}).then((res) => {
      if (res.code === 0) {
        const { merchantInfoQueryResult, merchantDebitQueryResult } = res.data;
        if (merchantDebitQueryResult) {
          this.merchantDebitQueryResult = merchantDebitQueryResult;
        }
        if (merchantInfoQueryResult) {
          const { quickRate, quickPer } = merchantInfoQueryResult;
          this.feeInfo.quickRate = quickRate / 100;
          this.feeInfo.quickPer = quickPer / 100;
        }
      } else {
        this.$toast.text(res.msg);
      }
    });
  },
  beforeDestroy() {
    clearInterval(this.timerId);
  },
  watch: {
    statusInfo(val) {
      console.log('statusInfo val', val);
      console.log('statusInfo', JSON.stringify(val));
      if (val.orderId) {
        this.getStatusTime(val);
      }
    },
  },
  methods: {
    handleSubmit() {
      if (!this.cardCollection.amount) {
        this.$toast.text('请输入收款金额');
        return;
      }
      if (+this.cardCollection.amount < 50) {
        this.$toast.text('收款金额不得小于50元');
        return;
      }
      if (!this.cardCollection.payCardId) {
        this.$toast.text('请选择支付卡');
        return;
      }
      const info = { ...this.cardCollection };
      info.amount = info.amount * 100;
      info.from = 'h5';
      ajax.post('/quickpay', info).then((res) => {
        if (res.code === 0) {
          const { channelData, status } = res.data;
          if (status === 1) {
            this.channelData = channelData;
            this.showMore = true;
            let _this = this;
            window.addEventListener('message', function (e) {
              if (e.data) {
                _this.showMore = false;
                _this.statusInfo = e.data;
              }
            });
          }
          if (status === 2 || status === 3) {
            this.$router.push(`/card_succuss?isOk=${status}`);
          }
        } else {
          this.$toast.text(res.msg);
        }
      });
    },
    getStatusTime(info) {
      this.timerId = setInterval(() => {
        ajax
          .post('/quickpay/queryOrderStatus', info, {
            closeloading: true,
            headers: {
              'content-type': 'application/x-www-form-urlencoded',
            },
          })
          .then((res) => {
            if (res.code === 0) {
              const { status } = res.data;
              if (status === 2 || status === 3) {
                this.showMore = false;
                clearInterval(this.timerId);
                this.$router.push(`/card_succuss?isOk=${status}`);
              }
            }
          });
      }, 2000);
    },
    cellClick() {
      if (!this.cardCollection.amount) {
        this.$toast.text('请输入收款金额');
        return;
      }

      if (+this.cardCollection.amount < 50) {
        this.$toast.text('收款金额不得小于50元');
        return;
      }
      // 表单缓存
      cache.setSessionData('card_collection_form', this.cardCollection);
      this.$router.push('/card_select');
    },
    showKeyBoard() {
      this.visible = true;
    },
    close() {
      this.visible = false;
    },
  },
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
.collection_page {
  .collection_title {
    text-align: center;
    padding: 20px 0 40px;
    font-size: 18px;
    background-color: #3375f2;
    color: #fff;
  }
  .mony_info {
    margin-top: -20px;
    background-color: #fff;
    border-radius: 20px 20px 0 0;
    padding: 20px 35px 10px;
    margin-bottom: 6px;
    &_title {
      font-size: 13px;
      color: #333;
    }
  }
  .mony_info_input {
    input {
      font-size: 24px;
      // height: 36px;
      padding-left: 30px;
      padding-right: 40px;
      background: url('~@/assets/images/personInfo/yuan_icon@2x.png') no-repeat
        3px center;
      background-size: 15px 18px;
    }
    .nut-textinput-clear {
      right: 15px;
    }
  }
  .form_info {
    font-size: 13px;
  }
  .my_cell {
    margin-bottom: 6px;
    padding: 0 35px;
    background-image: none;
  }
  .my_cell .nut-cell-box {
    background-image: none;
  }
  .egergerg {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .xx_input {
    flex: 1;
    margin-bottom: 6px;
    padding: 0 35px;
    background-color: #fff;
  }
  .xxx_cell {
    padding: 10px 35px;
    font-size: 12px;
    color: #d51523;
  }
  .dkdkdkkdk {
    width: 100%;
    height: 100%;
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
