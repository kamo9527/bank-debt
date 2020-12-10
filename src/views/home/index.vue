<template>
  <section class="page_w home_page">
    <router-link to="/my_refund" class="home_image">
      <img
        class="home_image_item"
        src="~@/assets/images/home/refund_image@2x.png"
      />
    </router-link>
    <router-link to="/card_collection" class="home_image">
      <img
        class="home_image_item"
        src="~@/assets/images/home/collection_image@2x.png"
      />
    </router-link>
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
      :loop="true"
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
    <!-- <div class="home_tips">
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
    </collapse> -->
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
import ajax from '@/rest/ajax';
// import Collapse from '@/components/Collapse.vue';
// import CollapseItem from '@/components/CollapseItem.vue';
import deal_record_icon from '@/assets/images/home/deal_record_icon@2x.png';
import refund_record_icon from '@/assets/images/home/refund_record_icon@2x.png';
import name_register_icon from '@/assets/images/home/name_register_icon@2x.png';
import ad_image_1 from '@/assets/images/home/adv_image_1@2x.png';
import ad_image_2 from '@/assets/images/home/adv_image_2@2x.png';
import home_icon from '@/assets/images/person_icon@2x.png';
import home_active_icon from '@/assets/images/home_active_icon@2x.png';
import person_icon from '@/assets/images/person_icon@2x.png';
import person_active_icon from '@/assets/images/person_active_icon@2x.png';
export default {
  name: 'homePage',
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
        { icon: deal_record_icon, text: '交易记录', link: '/my_deal_list' },
        { icon: refund_record_icon, text: '还款记录', link: '/payback_list' },
        { icon: name_register_icon, text: '实名认证', link: '/certif_step1' },
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
    this.$dialog({
      id: 'my-dialog',
      title: '允许“帐无忧”在您使用该应用时访问您的位置吗？',
      content: '为了保障持卡人的交易安全，交易过程中需要使用您的位置信息。',
      onOkBtn(event) {
        //确定按钮点击事件
        console.log(event);
        this.close(); //关闭对话框
        this.$dialog({
          id: 'my-dialogxxx',
          title: '温馨提示',
          content: '您还未实名认证，请先完成实名认证',
          onOkBtn(event) {
            //确定按钮点击事件
            console.log(event);
            this.close(); //关闭对话框
          },
          onCancelBtn(event) {
            console.log(event);
            //取消按钮点击事件，默认行为关闭对话框
            //return false;  //阻止默认“关闭对话框”的行为
          },
        });
      },
      onCancelBtn(event) {
        this.close(); //关闭对话框
        console.log(event);
        //取消按钮点击事件，默认行为关闭对话框
        //return false;  //阻止默认“关闭对话框”的行为
      },
    });
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
