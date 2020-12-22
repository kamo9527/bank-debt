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
  name: 'refundChannelPage',
  data() {
    return {
      refundChannelList: [],
      queryInfo: {
        bankName: '',
        bankCardNo: '',
      },
      channelData: '',
      timerId: null,
    };
  },
  mounted() {
    this.queryInfo = this.$route.query;
    this.getList();
  },
  methods: {
    getList() {
      const info = this.queryInfo;
      ajax.post('/repay/channelList', info).then((res) => {
        if (res.code === 0) {
          this.refundChannelList = res.data;
        } else {
          this.$toast.text(res.msg);
        }
      });
    },
    handleGo(info) {
      const pagea = { ...info, ...this.queryInfo };
      pagea.from = 'h5';
      // 交互说明：选择渠道需判断是否要开通业务，需开通跳到开通业务界面，不需要开通业务跳到填写代还信息页
      ajax.post('/repay/channelListSelect', pagea).then((res) => {
        if (res.code === 0) {
          const { status, bindingUrl } = res.data;
          if (status === '0') {
            this.channelData = bindingUrl;
            this.showMore = true;
            let _this = this;
            window.addEventListener('message', function (e) {
              const a = e.data + '';
              if (a === '2' || a === '3') {
                _this.showMore = false;
                _this.getList();
              }
            });
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
  .dkdkdkkdk {
    width: 100%;
    height: 100%;
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
