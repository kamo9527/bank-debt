<template>
  <section class="page_w refund_channel_page">
    <nut-cell
      class="my_cell"
      :title="queryInfo.bankName"
      :sub-title="`${queryInfo.bankCardNo.slice(0, 3)}***********
            ${queryInfo.bankCardNo.slice(-4)}`"
    />
    <div
      class="my_chanel"
      v-for="item in refundChannelList"
      :key="item.channelId"
      @click="handleGo(item)"
    >
      <div class="my_chanel_flex">
        <div class="my_chanel_title">{{ item.channelName }}</div>
        <div class="my_chanel_detail">{{ item.channelDesc }}</div>
      </div>
      <img
        class="my_chanel_icon"
        src="~@/assets/images/refund/refund_icon@2x.png"
      />
    </div>
    <div class="no_list" v-if="refundChannelList.length === 0">
      <img
        class="igmegeger"
        src="~@/assets/images/personInfo/no_list.png"
        alt=""
      />
    </div>
  </section>
</template>

<script>
// @ is an alias to /src
import cache from '@/utils/cache';
import ajax from '@/rest/ajax';
export default {
  name: 'refundChannelPage',
  data() {
    return {
      refundChannelList: [
        // {
        //   title: 'I入口',
        //   detail:
        //     '费率0.8%+1，该入口是大额分期入口，可单笔1000以 上，当天单卡5000元内，当天单卡最多五笔消费',
        //   link: '/my_return_information?cardId=3333',
        // },
        // {
        //   title: 'G入口',
        //   detail:
        //     '费率0.8%+1，该入口是大额分期入口，可单笔1000以 上，当天单卡20000元内，当天单卡最多五笔消费,能短 时间还大额账',
        //   link: '/my_return_information?cardId=1111',
        // },
        // {
        //   title: 'H入口',
        //   detail:
        //     '费率0.7%+1，该入口是小额分期入口，可单笔1000以 内，当天单卡5000元内，当天单卡最多五笔消费。',
        //   link: '/my_return_information?cardId=123',
        // },
      ],
      queryInfo: {
        bankName: '',
        bankCardNo: '',
      },
    };
  },
  mounted() {
    this.queryInfo = this.$route.query;
    ajax.post('/repay/channelList', this.queryInfo).then((res) => {
      if (res.code === 0) {
        this.refundChannelList = res.data;
      } else {
        this.$toast.text(res.msg);
      }
    });
  },
  methods: {
    handleGo(info) {
      const pagea = { ...info, ...this.queryInfo };
      console.log(pagea);
      // 交互说明：选择渠道需判断是否要开通业务，需开通跳到开通业务界面，不需要开通业务跳到填写代还信息页
      ajax.post('/repay/channelListSelect', pagea).then((res) => {
        if (res.code === 0) {
          const { status, bindingUrl } = res.data;
          if (status === '0') {
            window.location.href = bindingUrl;
          } else {
            cache.setLocalStorageData('my_return_information', pagea);
            this.$router.push('/my_return_information');
          }
        } else {
          this.$toast.text(res.msg);
        }
      });
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
    height: 100px;
    line-height: 100px;
    margin-bottom: 15px;
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
      font-size: 15px;
    }
    .nut-cell-desc {
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
  .my_chanel {
    border-radius: 10px;
    height: 75px;
    line-height: 75px;
    margin-bottom: 15px;
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
