<template>
  <section class="page_w refund_channel_page">
    <nut-cell class="my_cell" title="华夏银行" sub-title="6358********6587" />
    <div
      class="my_chanel"
      v-for="item in refundChannelList"
      :key="item.link"
      @click="handleGo(item.link)"
    >
      <div class="my_chanel_flex">
        <div class="my_chanel_title">{{ item.title }}</div>
        <div class="my_chanel_detail">{{ item.detail }}</div>
      </div>
      <img
        class="my_chanel_icon"
        src="~@/assets/images/refund/refund_icon@2x.png"
      />
    </div>
  </section>
</template>

<script>
// @ is an alias to /src
// import ajax from '@/rest/ajax';
export default {
  name: 'refundChannelPage',
  data() {
    return {
      refundChannelList: [
        {
          title: 'I入口',
          detail:
            '费率0.8%+1，该入口是大额分期入口，可单笔1000以 上，当天单卡5000元内，当天单卡最多五笔消费',
          link: '/xxxx1',
        },
        {
          title: 'G入口',
          detail:
            '费率0.8%+1，该入口是大额分期入口，可单笔1000以 上，当天单卡20000元内，当天单卡最多五笔消费,能短 时间还大额账',
          link: '/xxxx2',
        },
        {
          title: 'H入口',
          detail:
            '费率0.7%+1，该入口是小额分期入口，可单笔1000以 内，当天单卡5000元内，当天单卡最多五笔消费。',
          link: '/xxxx3',
        },
      ],
    };
  },
  mounted() {},
  methods: {
    handleGo(info) {
      this.$router.push(info.link);
    },
  },
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
.refund_channel_page {
  padding: 15px;
  background-color: #f5f5f5;
  .my_cell {
    border-radius: 10px;
    height: 105px;
    line-height: 105px;
    margin-bottom: 20px;
    background: url('../../assets/images/refund/refund_channel@2x.png');
    background-size: cover;
    .my_link {
      width: 30px;
      margin-right: 10px;
    }
    .my_icon {
      display: block;
      width: 100%;
    }
    .nut-cell-box {
      height: 100%;
    }
    .nut-cell-title {
      color: #fff;
    }
    .nut-cell-sub-title {
      color: #fff;
    }
    .nut-cell-desc {
      color: #fff;
    }
  }
  .my_chanel {
    border-radius: 10px;
    height: 90px;
    line-height: 90px;
    margin-bottom: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #fff;
    padding: 15px;
    &_flex {
      flex: 1;
      display: flex;
      line-height: 1.5;
      flex-direction: column;
      align-items: flex-start;
    }
    &_title {
      font-size: 15px;
      margin-bottom: 5px;
    }
    &_detail {
      font-size: 11px;
      color: #999;
    }
    &_icon {
      display: block;
      width: 15px;
      margin-left: 15px;
    }
  }
}
</style>
