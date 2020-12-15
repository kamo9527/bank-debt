<template>
  <section class="page_w deal_page">
    <nut-scroller
      :is-un-more="isUnMore"
      :is-loading="loading"
      :type="'vertical'"
      @loadMore="loadMoreVert"
      @pulldown="pulldown"
    >
      <div slot="list">
        <div class="deal_item" v-for="item in dataList" :key="item.orderId">
          <div class="deal_line">订单号：{{ item.orderId }}</div>
          <div class="deal_info">
            <div class="item_left">
              交易金额：<span class="red_color">{{ item.amount }}元</span>
            </div>
            <div class="item_right">
              状态：<span class="y_color">{{ statusInfo[item.status] }}</span>
            </div>
          </div>
          <div class="deal_info">
            <div class="item_left">付款信用卡：{{ item.payBankName }}</div>
            <div class="item_right bank_num">尾号：{{ item.payCardNo }}</div>
          </div>
          <div class="deal_info">
            <div class="item_left">收款银行卡：{{ item.settleBankName }}</div>
            <div class="item_right bank_num">尾号：{{ item.settleCardNo }}</div>
          </div>
          <div class="deal_line">
            交易时间：<span class="b_color">{{ item.tradeTime }}</span>
          </div>
        </div>
        <div class="mgergerg" v-if="dataList.length === 0">暂无纪录</div>
      </div>
    </nut-scroller>
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
      jsonData: {
        merchantId: '',
        pageNum: 1,
        pageSize: 10,
      },
      dataList: [],
      isUnMore: false,
      loading: false,
      showList: false,
      showNolist: false,
      statusInfo: {
        1: '待支付/支付中',
        2: '支付成功',
        3: '支付失败',
      },
    };
  },
  mounted() {
    const info = cache.getLocalStorageData('person_info');
    this.jsonData.merchantId = info.merchantId;
    ajax.post('/quickpay/queryOrderHistory', this.jsonData).then((res) => {
      if (res.code === 0) {
        const records = res.data;
        console.log('records', records);
        // this.totalPages = totalPages;
        if (records && records.length > 0) {
          records.forEach((item) => {
            item.payCardNo = item.payCardNo.slice(-4);
            item.settleCardNo = item.settleCardNo.slice(-4);
          });
          this.dataList = records;
          this.showList = true;
        } else {
          this.showNolist = true;
        }
      } else {
        this.$toast.text(res.message);
      }
    });
  },
  methods: {
    loadMoreVert() {
      this.loading = true;
      // if (this.jsonData.pageNum >= this.totalPages) {
      //   this.isUnMore = true;
      //   this.loading = false;
      // } else {
      //   this.jsonData.pageNum++;
      //   ajax.post('/quickpay/queryOrderHistory', this.jsonData).then(res => {
      //     if (res.code === 0) {
      //       const { records } = res.data;
      //       this.dataList.push(...records);
      //     } else {
      //       this.jsonData.pageNum--;
      //       this.$toast.text(res.message);
      //     }
      //     this.loading = false;
      //     this.isUnMore = false;
      //   });
      // }
      this.jsonData.pageNum++;
      ajax.post('/quickpay/queryOrderHistory', this.jsonData).then((res) => {
        if (res.code === 0) {
          // const { records } = res.data;
          const records = res.data;
          records.forEach((item) => {
            item.payCardNo = item.payCardNo.slice(-4);
            item.settleCardNo = item.settleCardNo.slice(-4);
          });
          this.dataList.push(...records);
        } else {
          this.jsonData.pageNum--;
          this.$toast.text(res.message);
        }
        this.loading = false;
        this.isUnMore = false;
      });
    },
    pulldown() {
      this.loading = true;
      this.jsonData.pageNum = 1;
      ajax.post('/quickpay/queryOrderHistory', this.jsonData).then((res) => {
        if (res.code === 0) {
          const records = res.data;
          if (records.length > 0) {
            records.forEach((item) => {
              item.payCardNo = item.payCardNo.slice(-4);
              item.settleCardNo = item.settleCardNo.slice(-4);
            });
            this.dataList = records;
            this.showList = true;
          } else {
            this.showNolist = true;
          }
        } else {
          this.$toast.text(res.message);
        }
        this.loading = false;
        this.isUnMore = false;
      });
    },
  },
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
.deal_page {
  height: 99%;
  .fee_title {
    color: #333;
    font-size: 13px;
    padding: 15px;
  }
  .deal_item {
    color: #333;
    font-size: 13px;
    padding: 10px 30px;
    background-color: #fff;
    margin-bottom: 10px;
    .deal_line {
      line-height: 26px;
    }
    .deal_info {
      line-height: 26px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .item_left {
      flex: 1;
    }
    .item_right {
      width: 90px;
      white-space: nowrap;
    }
    .red_color {
      color: #ee8b8f;
    }
    .y_color {
      color: #ffd375;
    }
    .bank_num {
      color: #999;
    }
    .b_color {
      color: #6893f4;
    }
  }
  .mgergerg {
    text-align: center;
    padding: 20px;
  }
}
</style>
