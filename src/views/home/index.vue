<template>
  <section class="page_w home_page">
    <div class="home_top">
      <img
        class="home_image"
        src="~@/assets/images/home/collection_image@2x.png"
      />
      <img
        class="home_image is_top"
        src="~@/assets/images/home/refund_image@2x.png"
      />
    </div>
    <div class="home_entrance">
      <router-link
        v-for="item in entranceList"
        :key="item.link"
        :to="item.link"
        class="home_entrance_item"
      >
        <img class="icon" :src="item.icon" />
        <div class="text">{{ item.text }}</div>
      </router-link>
    </div>
    <nut-swiper
      class="my_swiper"
      direction="horizontal"
      :swiperData="dataItem"
      :canDragging="true"
      :paginationVisible="true"
      ref="demo2"
    >
      <div
        v-for="(item, index) in dataItem"
        :key="index"
        class="nut-swiper-slide"
      >
        <img
          style="max-width: 100%; max-height: 100%"
          :src="item.image"
          alt=""
        />
      </div>
    </nut-swiper>
    <div class="home_tips">
      <div class="home_tips_icon" />
      <div class="home_tips_title">使用攻略</div>
    </div>
    <div class="home_tab">
      <div
        class="home_tab_item"
        v-for="(item, index) in tipsList"
        :class="{ isActive: isTip === index }"
        :key="item"
        @click="changeTips(index)"
      >
        {{ item }}
      </div>
    </div>
    <collapse v-model="activeNames" :accordion="true">
      <collapse-item title="标题1" :name="1">
        京东“厂直优品计划”首推“政府优品馆” 3年覆盖80%镇级政府
      </collapse-item>
      <collapse-item title="标题2" :name="2">
        京东到家：教师节期间 创意花束销量增长53倍
      </collapse-item>
      <collapse-item title="标题3" :name="3"
        >京东不回家：教师节期间 创意花束销量增长53倍
      </collapse-item>
    </collapse>
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
import Collapse from '@/components/Collapse.vue';
import CollapseItem from '@/components/CollapseItem.vue';
import deal_record_icon from '@/assets/images/home/deal_record_icon@2x.png';
import refund_record_icon from '@/assets/images/home/refund_record_icon@2x.png';
import name_register_icon from '@/assets/images/home/name_register_icon@2x.png';
import new_boy_icon from '@/assets/images/home/new_boy_icon@2x.png';
import ad_image_1 from '@/assets/images/home/adv_image_1@2x.png';
import ad_image_2 from '@/assets/images/home/adv_image_2@2x.png';
import home_icon from '@/assets/images/person_icon@2x.png';
import home_active_icon from '@/assets/images/home_active_icon@2x.png';
import person_icon from '@/assets/images/person_icon@2x.png';
import person_active_icon from '@/assets/images/person_active_icon@2x.png';
export default {
  name: 'homePage',
  components: {
    Collapse,
    CollapseItem,
  },
  data() {
    return {
      isTip: 1,
      newDebtData: {
        name: '',
        borrowMoney: '',
        arriveMoney: '',
        periodMoney: '',
        repaymentCycle: '',
        remainingRepaymentCycle: '',
        annualizedInterest: '0.00%',
        surplusMoney: '',
      },
      entranceList: [
        { icon: deal_record_icon, text: '交易记录', link: '/agreement4' },
        {
          icon: refund_record_icon,
          text: '还款记录',
          link: '/agreement1',
        },
        {
          icon: name_register_icon,
          text: '实名认证',
          link: '/agreement2',
        },
        {
          icon: new_boy_icon,
          text: '新手教程',
          link: '/agreement3',
        },
      ],
      dataItem: [
        {
          name: '广告1',
          image: ad_image_1,
        },
        {
          name: '广告2',
          image: ad_image_2,
        },
      ],
      tipsList: ['无卡收款', '实名认证', '绑定卡片'],
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
    const sessionData = cache.getSessionData('new_debt_data');
    if (sessionData) {
      this.newDebtData = sessionData;
    }
    ajax.get('/repay/confirmSm').then(res => {
      console.log(res);
    });
  },
  methods: {
    tabSwitch(index, event) {
      console.log(index + '--' + event);
    },
    changeTips(index) {
      this.isTip = index;
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
  padding-top: 20px;
  padding-bottom: 200px;
  .home_top {
    position: relative;
    .home_image {
      display: block;
      box-sizing: border-box;
      width: 100%;
      padding: 0 12px;
    }
    .is_top {
      position: absolute;
      top: 40px;
      width: 100%;
    }
  }
  .my_swiper {
    height: 100px;
  }
  .home_entrance {
    margin: 60px 0 30px;
    padding: 0 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    &_item {
      margin: 0 15px;
      flex: 1;
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
