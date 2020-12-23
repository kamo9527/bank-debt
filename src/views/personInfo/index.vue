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
          <div>
            {{ userName || '用户' }} {{ mobile.slice(0, 3) }}****{{
              mobile.slice(7)
            }}
          </div>
          <div>{{ auditStatus === 1 ? '已认证' : '未认证' }}</div>
        </div>
      </div>
    </div>
    <nut-cell
      class="my_cell"
      v-for="item in entranceList"
      :key="item.link"
      :show-icon="true"
      :title="item.text"
      @click-cell="cellClick(item)"
    >
      <div class="my_link" slot="avatar">
        <img class="my_icon" :src="item.icon" alt="" />
      </div>
    </nut-cell>
    <div class="logout_btn">
      <button @click="handleLogout" class="my_btn my_btn_xx">退出登录</button>
    </div>
    <nut-popup
      class="my_popup"
      v-model="showService"
      position="bottom"
      :style="{ height: '170px' }"
    >
      <div class="service_list">
        <button class="my_btn">
          <a
            style="color: #fff"
            target="blank"
            :href="`http://wpa.qq.com/msgrd?V=1&Uin=${personInfo.customerServiceQQ}`"
            >在线QQ咨询（9:00-18:00）
          </a>
          <!-- <a
            target="_blank"
            href="http://wpa.qq.com/msgrd?v=1&uin=QQ号码&site=qq&menu=yes"
            >在线QQ咨询（9:00-18:00）
          </a> -->
          <!-- <a href="tencent://message/?uin=你的QQ号&Site=QQ交谈bai&Menu=yes" target="blank"><img border="0" src="http://wpa.qq.com/pa?p=1:你的QQ号:7" alt="图片不正常时显示的文字du" width="71" height="24" /></a> -->
        </button>
        <button class="my_btn">
          <a
            style="color: #fff"
            :href="`tel:${personInfo.customerServicePhone.slice(
              0,
              4
            )}-${personInfo.customerServicePhone.slice(4)}`"
          >
            电话咨询（{{ personInfo.customerServicePhone.slice(0, 4) }}-{{
              personInfo.customerServicePhone.slice(4)
            }}）
          </a>
        </button>
        <button @click="handleCancle" class="my_btn my_btn_xx">取消</button>
      </div>
    </nut-popup>
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
        { icon: fee_icon, text: '我的费率', link: '/my_fee', checked: true },
        {
          icon: account_icon,
          text: '收款账户',
          link: '/my_count',
          checked: true,
        },
        {
          icon: card_icon,
          text: '我的付款卡',
          link: '/my_refund',
          // checked: true,
        },
        {
          icon: count_detail_icon,
          text: '收款明细',
          link: '/my_deal_list',
          checked: true,
        },
        {
          icon: change_number_icon,
          text: '修改密码',
          link: '/my_set_password',
        },
        { icon: service_icon, text: '联系客服' },
        { icon: note_icon, text: '消息通知', link: '/my_message' },
      ],
      tabList3: [
        {
          tabTitle: '首页',
          curr: false,
          icon: home_icon,
          activeIcon: home_active_icon,
          href: '#/home',
        },
        {
          tabTitle: '我的',
          curr: true,
          icon: person_icon,
          activeIcon: person_active_icon,
          href: '',
        },
      ],
      personInfo: {
        customerServicePhone: '',
        customerServiceQQ: '',
      },
      activeNames: 1,
      showService: false,
      mobile: '',
      auditStatus: 0,
      userName: '',
    };
  },
  mounted() {
    this.personInfo = cache.getLocalStorageData('person_info');
    ajax.post('/account/info', {}).then((res) => {
      if (res.code === 0) {
        const { merchantInfoQueryResult } = res.data;
        this.auditStatus = merchantInfoQueryResult.auditStatus;
        this.mobile = merchantInfoQueryResult.mobile;
        this.userName = merchantInfoQueryResult.userName;
      } else {
        this.$toast.text(res.msg);
      }
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
    cellClick(info) {
      const { checked, link } = info;
      if (checked) {
        if (this.auditStatus === 1) {
          this.$router.push(link);
        } else {
          this.$router.push('/certif_step1');
        }
      } else {
        if (link) {
          this.$router.push(link);
        } else {
          this.showService = true;
        }
      }
    },
    handleQQ() {
      console.log(222);
    },
    handlePhone() {
      console.log(222);
    },
    handleCancle() {
      this.showService = false;
    },
    handleLogout() {
      this.$router.push('/login_login');
    },
  },
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
.person_page {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  // background-color: #fff;
  background-color: #f5f5f5;
  padding-bottom: 70px;
  .person_top {
    height: 170px;
    background: url('../../assets/images/personInfo/page_bg@2x.png') center
      no-repeat;
    background-size: cover;
    .person_title {
      padding-top: 20px;
      color: #fff;
      font-size: 18px;
      text-align: center;
    }
    .person_detail {
      padding: 20px 15px 0;
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
  .my_popup {
    background-color: transparent;
  }
  .service_list {
    padding: 0 40px;
  }
  .logout_btn {
    padding: 15px 30px;
    .my_btn_xx {
      border-radius: 21px;
      color: #3574f5;
    }
  }
  .my_btn {
    margin-bottom: 10px;
    display: block;
    width: 100%;
    box-sizing: border-box;
    height: 42px;
    border-radius: 8px;
    font-size: 16px;
    color: #fff;
    border: none;
    background-color: #3375f2;
  }
  .my_btn_xx {
    color: #333;
    background-color: #fff;
  }
}
</style>
