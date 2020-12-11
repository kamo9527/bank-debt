<template>
  <div class="page_w add_new_card">
    <div class="add_title">添加信用卡</div>
    <div class="basic_info">
      <div class="basic_info_tips">*请绑定您本人的信用卡</div>
      <div class="basic_info_title">用户名:张三</div>
      <div class="basic_info_title">身份证号码：440427199510210961</div>
    </div>
    <div class="operate_input">
      <div class="iinpu_ophne">
        <nut-textinput
          class="my_input flexx1"
          label="信用卡卡号"
          placeholder="请输入卡号或扫描信用卡"
          :hasBorder="false"
          v-model="cardInfo.card"
        />
        <img
          class="phongg"
          src="~@/assets/images/personInfo/xiangji@2x.png"
          alt=""
        />
      </div>
      <nut-textinput
        class="my_input"
        label="所属银行"
        placeholder="请输入开户银行名称"
        :hasBorder="false"
        v-model="cardInfo.bank"
      />
      <!-- <nut-cell
        class="my_cell"
        :show-icon="true"
        title="账单日"
        placeholder="请输入开户银行名称"
        :desc="billDate"
        @click.native="openSwitch('isVisible')"
      /> -->
      <div @click="openSwitch">
        <nut-textinput
          class="my_input my_cell"
          label="账单日"
          placeholder="请选择信用卡账单日"
          :hasBorder="false"
          :disabled="true"
          v-model="cardInfo.bill"
        />
      </div>
      <nut-textinput
        class="my_input "
        label="预留手机号"
        placeholder="请输入银行预留手机号"
        :hasBorder="false"
        v-model="cardInfo.phone"
      />
    </div>
    <button @click="handleSubmit" class="my_btn">
      完成
    </button>
    <nut-picker
      :is-visible="isVisible"
      :list-data="listData"
      @close="closeSwitch"
      @confirm="saveValue"
    ></nut-picker>
  </div>
</template>

<script>
// @ is an alias to /src
import { regexpMap } from '@/utils/common';
// import cache from '@/utils/cache';
import ajax from '@/rest/ajax';
import md5 from '@/utils/md5';
const nums = [...Array(31).keys()];
nums.shift();
export default {
  name: 'addNewCardPage',
  data() {
    return {
      billDate: '请选择信用卡账单日',
      isVisible: false,
      listData: [nums],
      defaultValueData: [1],
      cardInfo: {
        card: '',
        bank: '',
        bill: '',
        phone: '',
      },
      isEyesClose1: true,
      isEyesClose2: true,
      isEyesClose3: true,
      mobile: '',
      oldPassword: '',
      password: '',
      confirmPassword: '',
      // mobile: '15521220234',
      // smCode: '123456',
      // newPassWord: 'qq123456',
      // confirmPassword: 'qq123456',
    };
  },
  methods: {
    closeSwitch() {
      this.isVisible = false;
    },
    openSwitch() {
      this.isVisible = true;
    },
    saveValue(value) {
      this.cardInfo.bill = value[0] + '日';
      // this.isVisible = false
    },
    handleSubmit() {
      console.log(1231);
    },
    onFocus() {
      console.log(12123);
    },
    handle() {
      if (this.newPassWord !== this.confirmPassword) {
        this.$toast.text('您输入的两次密码不相同');
        return;
      }
      if (!regexpMap.regexp_password.test(this.newPassWord)) {
        this.$toast.text('请输入正确的密码');
        return;
      }
      const params = {
        oldPassword: this.smCode,
        newPassWord: md5.hex_md5(this.newPassWord),
      };
      ajax.post('/account/resetPassword', params).then(res => {
        if (res.code === 0) {
          this.$toast.text('密码修改成功');
          this.$router.go(-1);
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
.add_new_card {
  background-color: #fff;
  .add_title {
    background-color: #5083f5;
    height: 60px;
    line-height: 60px;
    padding: 20px 0 40px;
    text-align: center;
    color: #fff;
    font-size: 18px;
  }
  .basic_info {
    margin: -40px 25px 0;
    padding: 20px 20px 15px;
    background: url('~@/assets/images/personInfo/add_car@2x.png') center
      no-repeat;
    background-size: cover;
    &_tips {
      line-height: 30px;
      font-size: 12px;
      color: #e12a2a;
    }
    &_title {
      font-size: 14px;
      line-height: 30px;
    }
  }
  .operate_input {
    padding: 20px 30px;
    font-size: 14px;
    .my_input {
      border-bottom: 1px solid #eee;
    }
    .my_input .nut-textinput-label {
      width: 80px;
    }
    .my_input input {
      height: 46px;
      background-color: #fff;
    }
    .my_cell {
      position: relative;
    }
    .my_cell ::after {
      content: '';
      position: absolute;
      right: 0;
      top: 15px;
      display: block;
      width: 16px;
      height: 9px;
      background: url('~@/assets/images/personInfo/picker_icon@2x.png') center
        no-repeat;
      background-size: cover;
    }
    .iinpu_ophne {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #eee;
      .flexx1 {
        flex: 1;
        border: none;
      }
      .phongg {
        display: block;
        width: 17px;
        margin-left: 20px;
      }
    }
  }
  .my_btn {
    margin: 20px auto 0;
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
