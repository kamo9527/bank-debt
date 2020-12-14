<template>
  <section class="page_w home_page">
    <router-link to="/my_refund" class="home_image">
      <img
        class="home_image_item"
        src="~@/assets/images/home/refund_image@2x.png"
      />
    </router-link>
    <router-link to="/card_collection" class="home_image">
      <!-- @click="goCardCollection" -->

      <img
        class="home_image_item"
        src="~@/assets/images/home/collection_image@2x.png"
      />
    </router-link>
    <div class="home_entrance">
      <div
        v-for="item in entranceList"
        :key="item.link"
        class="home_entrance_item"
        @click="cellClick(item.name)"
      >
        <img class="icon" :src="item.url" />
        <div class="text">{{ item.name }}</div>
      </div>
    </div>
    <nut-swiper
      class="my_swiper"
      direction="horizontal"
      :swiperData="dataItem"
      :canDragging="true"
      :loop="true"
      :paginationVisible="true"
      ref="demo2"
    >
      <div
        v-for="(item, index) in dataItem"
        :key="index"
        class="nut-swiper-slide"
      >
        <img style="max-width: 100%; max-height: 100%" :src="item.url" alt="" />
      </div>
    </nut-swiper>
    <nut-tabbar
      class="my_tabs"
      @tab-switch="tabSwitch3"
      :tabbar-list="tabList3"
      :bottom="true"
    >
    </nut-tabbar>
  </section>
</template>

<script>
// @ is an alias to /src
import cache from '@/utils/cache';
import ajax from '@/rest/ajax';
// import deal_record_icon from '@/assets/images/home/deal_record_icon@2x.png';
// import refund_record_icon from '@/assets/images/home/refund_record_icon@2x.png';
// import name_register_icon from '@/assets/images/home/name_register_icon@2x.png';
// import ad_image_1 from '@/assets/images/home/adv_image_1@2x.png';
// import ad_image_2 from '@/assets/images/home/adv_image_2@2x.png';
import home_icon from '@/assets/images/person_icon@2x.png';
import home_active_icon from '@/assets/images/home_active_icon@2x.png';
import person_icon from '@/assets/images/person_icon@2x.png';
import person_active_icon from '@/assets/images/person_active_icon@2x.png';
export default {
  name: 'homePage',
  data() {
    return {
      auditStatus: false,
      ocrStatus: false,
      entranceList: [],
      dataItem: [],
      tabList3: [
        {
          tabTitle: '首页',
          curr: true,
          icon: home_icon,
          activeIcon: home_active_icon,
          href: '###',
        },
        {
          tabTitle: '我的',
          curr: false,
          icon: person_icon,
          activeIcon: person_active_icon,
          href: '/person_info',
        },
      ],
      activeNames: 1,
    };
  },
  mounted() {
    ajax.post('/account/info', {}).then(res => {
      console.log(res);
      if (res.code === 0) {
        const { merchantInfoQueryResult } = res.data;
        this.auditStatus = merchantInfoQueryResult.auditStatus;
        this.ocrStatus = merchantInfoQueryResult.ocrStatus;
        const _this = this;
        if (this.auditStatus !== 1) {
          this.$dialog({
            title: '温馨提示',
            content: '您还未实名认证，请先完成实名认证',
            cancelBtnTxt: '等一会',
            onOkBtn() {
              this.close(); //关闭对话框
              _this.$router.push('/certif_step1');
            },
            onCancelBtn(event) {
              console.log(event);
            },
          });
        }
      } else {
        this.$toast.text(res.msg);
      }
    });
    ajax.post('/index/getIconAndBanner', {}).then(res => {
      if (res.code === 0) {
        const { bannerDTOS, iconDTOS } = res.data;
        const list = iconDTOS.filter(item => item.name !== '新手教程');
        this.entranceList = list;
        this.dataItem = bannerDTOS;
      } else {
        this.$toast.text(res.msg);
      }
    });
  },
  methods: {
    goCardCollection() {
      if (this.auditStatus !== 1) {
        this.$router.push('/certif_step1');
      } else {
        if (this.ocrStatus) {
          cache.setSessionData('card_collection_form', null);
          this.$router.push('/card_collection');
        } else {
          // todo 跳转去人脸识别
          this.$router.push('/card_collection');
        }
      }
    },
    cellClick(name) {
      switch (name) {
        case '交易明细':
          this.$router.push('/my_deal_list');
          break;
        case '还款记录':
          this.$router.push('/payback_list');
          break;
        case '实名认证':
          if (this.auditStatus) {
            this.$toast.text('已实名认证成功');
          } else {
            this.$router.push('/certif_step1');
          }
          break;
        default:
          break;
      }
    },
    tabSwitch3(value, index) {
      console.log(index);
    },
  },
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
.home_page {
  .home_image {
    margin-top: 20px;
    display: block;
    box-sizing: border-box;
    width: 100%;
    padding: 0 12px;
    .home_image_item {
      display: block;
      width: 100%;
    }
  }
  .is_top {
    position: absolute;
    top: 40px;
    width: 100%;
  }
  .my_swiper {
    height: 100px;
  }
  .home_entrance {
    margin: 15px 0 30px;
    padding: 0 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    &_item {
      margin: 0 auto;
      width: 64px;
    }
    .icon {
      display: block;
      width: 100%;
    }
    .text {
      padding-top: 3px;
      text-align: center;
      color: #333333;
      font-size: 13px;
    }
  }
  .home_tips {
    margin-top: 20px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding: 0 15px;
    &_icon {
      display: block;
      width: 6px;
      height: 23px;
      margin-right: 5px;
      background-color: #3375f2;
      border-radius: 2px;
    }
    &_title {
      color: #333;
      font-size: 17px;
    }
  }
  .home_tab {
    padding: 20px 45px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 33px;
    &_item {
      flex: 1;
      text-align: center;
      line-height: 33px;
      color: #999;
      font-size: 14px;
      background-color: #f0f0f0;
    }
    .isActive {
      color: #fff;
      background-color: #3375f2;
    }
  }
  .my_tabs {
    // height: 100px;
    .icon-box {
      font-size: 13px;
      // .icon {
      //   width: 50px;
      //   height: 50px;
      // }
    }
  }
}
</style>
