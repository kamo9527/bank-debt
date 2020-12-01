<template>
  <section class="page_w person_page">
    <div class="person_top">
      <div class="person_title">我的</div>
      <div class="person_detail">
        <img
          class="person_icon"
          src="~@/assets/images/personInfo/avater_icon@2x.png"
          alt=""
        />
        <div class="person_info">
          <div>用户 159****3990</div>
          <div>未认证</div>
        </div>
      </div>
    </div>
    <nut-cell
      class="my_cell"
      v-for="item in entranceList"
      :key="item.link"
      :to="item.link"
      :show-icon="true"
      :title="item.text"
    >
      <div class="my_link" slot="avatar">
        <img class="my_icon" :src="item.icon" alt="" />
      </div>
    </nut-cell>
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
import fee_icon from '@/assets/images/personInfo/fee_icon@2x.png';
import account_icon from '@/assets/images/personInfo/account_icon@2x.png';
import card_icon from '@/assets/images/personInfo/card_icon@2x.png';
import change_number_icon from '@/assets/images/personInfo/change_number_icon@2x.png';
import count_detail_icon from '@/assets/images/personInfo/count_detail_icon@2x.png';
import about_icon from '@/assets/images/personInfo/about_icon@2x.png';
import service_icon from '@/assets/images/personInfo/service_icon@2x.png';
import note_icon from '@/assets/images/personInfo/note_icon@2x.png';
import home_icon from '@/assets/images/home_icon@2x.png';
import home_active_icon from '@/assets/images/home_active_icon@2x.png';
import person_icon from '@/assets/images/person_icon@2x.png';
import person_active_icon from '@/assets/images/person_active_icon@2x.png';
export default {
  name: 'personInfoPage',
  data() {
    return {
      entranceList: [
        { icon: fee_icon, text: '我的费率', link: '/agreement0' },
        { icon: account_icon, text: '收款账户', link: '/agreement1' },
        { icon: card_icon, text: '我的付款卡', link: '/agreement2' },
        { icon: count_detail_icon, text: '收款明细', link: '/agreement3' },
        { icon: change_number_icon, text: '修改密码', link: '/agreement4' },
        { icon: service_icon, text: '联系客服', link: '/agreement5' },
        { icon: about_icon, text: '关于我们', link: '/agreement6' },
        { icon: note_icon, text: '消息通知', link: '/agreement7' },
      ],
      tabList3: [
        {
          tabTitle: '首页',
          curr: false,
          icon: home_icon,
          activeIcon: home_active_icon,
          href: '/home',
        },
        {
          tabTitle: '我的',
          curr: true,
          icon: person_icon,
          activeIcon: person_active_icon,
          href: '',
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
.person_page {
  background-color: #fff;
  .person_top {
    height: 214px;
    background: url('../../assets/images/personInfo/page_bg@2x.png') center
      no-repeat;
    background-size: cover;
    .person_title {
      padding-top: 40px;
      color: #fff;
      font-size: 18px;
      text-align: center;
    }
    .person_detail {
      padding: 40px 15px 0;
      display: flex;
      justify-content: flex-start;
      align-items: center;
    }
    .person_icon {
      display: block;
      width: 80px;
      margin-right: 20px;
    }
    .person_info {
      color: #fff;
      font-size: 16px;
    }
  }
  .person_entrance {
    padding: 0 10px;
  }
  .my_cell .nut-cell-right svg {
    height: 16px;
  }
  .my_link {
    color: #333;
    .my_icon {
      display: block;
      width: 20px;
      margin: 0 10px;
    }
  }
  .my_tabs {
    .icon-box {
      font-size: 13px;
    }
  }
}
</style>
