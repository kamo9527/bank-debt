<template>
  <div class="my_setPassword">
    <div class="title">
      <img
        class="page_back"
        src="~@/assets/images/common/white_back@2x.png"
        @click="$router.go(-1)"
      />
      <span>修改密码</span>
    </div>
    <div class="operate_input">
      <div class="name first">旧密码</div>
      <div class="input_wrap">
        <input
          :type="isEyesClose1 ? 'password' : 'text'"
          placeholder="请输入您的旧密码"
          v-model="oldPassword"
        />
        <span @click="isEyesClose1 = !isEyesClose1">
          <img
            class="icon"
            src="~@/assets/images/login/login/eyes_close@2x.png"
            v-if="isEyesClose1"
          />
          <img
            class="icon"
            src="~@/assets/images/login/login/eyes_open@2x.png"
            v-else
          />
        </span>
      </div>
      <div class="name">新密码</div>
      <div class="input_wrap">
        <input
          :type="isEyesClose2 ? 'password' : 'text'"
          placeholder="6-20位数字字母的组合"
          v-model="newPassWord"
        />
        <span @click="isEyesClose2 = !isEyesClose2">
          <img
            class="icon"
            src="~@/assets/images/login/login/eyes_close@2x.png"
            v-if="isEyesClose2"
          />
          <img
            class="icon"
            src="~@/assets/images/login/login/eyes_open@2x.png"
            v-else
          />
        </span>
      </div>
      <div class="name">确认新密码</div>
      <div class="input_wrap">
        <input
          :type="isEyesClose3 ? 'password' : 'text'"
          placeholder="6-20位数字字母的组合"
          v-model="confirmPassword"
        />
        <span @click="isEyesClose3 = !isEyesClose3">
          <img
            class="icon"
            src="~@/assets/images/login/login/eyes_close@2x.png"
            v-if="isEyesClose3"
          />
          <img
            class="icon"
            src="~@/assets/images/login/login/eyes_open@2x.png"
            v-else
          />
        </span>
      </div>

      <div class="btn login" @click="handle">确认修改</div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import { regexpMap } from '@/utils/common';
// import cache from '@/utils/cache';
import ajax from '@/rest/ajax';
import md5 from '@/utils/md5';
export default {
  name: 'my_setPassword',
  data() {
    return {
      isEyesClose1: true,
      isEyesClose2: true,
      isEyesClose3: true,
      oldPassword: 'wdc123',
      newPassWord: 'wdc1234',
      confirmPassword: 'wdc1234',
      // mobile: '15521220234',
      // smCode: '123456',
      // newPassWord: 'qq123456',
      // confirmPassword: 'qq123456',
    };
  },
  methods: {
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
        oldPassword: md5.hex_md5(this.oldPassword),
        newPassWord: md5.hex_md5(this.newPassWord),
      };
      ajax
        .post('/account/updatePassword', params, {
          headers: {
            'content-type': 'application/x-www-form-urlencoded',
          },
        })
        .then(res => {
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
.my_setPassword {
  display: flex;
  align-items: center;
  flex-direction: column;
  background-color: #fff;
  padding-top: 63.5px;
  // padding-bottom: 28.5px;
  box-sizing: border-box;
  .title {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 63.5px;
    padding-top: 33.5px;
    overflow: hidden;
    font-size: 18px;
    color: #ffffff;
    text-align: center;
    line-height: 1;
    z-index: 9;
    background: url('~@/assets/images/certif/bank/title_bg@2x.png') no-repeat;
    background-size: 100% 63.5px;
    box-sizing: border-box;
    .page_back {
      position: absolute;
      top: 36px;
      left: 15px;
      width: 8px;
      height: 14.5px;
      z-index: 10;
    }
  }
  .operate_input {
    width: 300px;
    display: flex;
    align-items: center;
    flex-direction: column;
    .name {
      margin-top: 15px;
      width: 100%;
      justify-content: flex-start;
      font-size: 15px;
      color: #333333;
      &.first {
        margin-top: 17.5px;
      }
    }
    .input_wrap {
      margin-top: 7.5px;
      width: 100%;
      height: 33px;
      background-size: 100% 100%;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #999;
      input {
        width: 100%;
        height: 21.5px;
        border: none;
        outline: none;
      }
      .icon {
        width: 21.5px;
        height: 21.5px;
      }
    }
    .btn {
      margin-top: 40px;
      width: 236.5px;
      height: 45px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      font-family: PingFang SC;
      font-weight: 500;
      border-radius: 22.5px;
      &.login {
        background: url('"~@/assets/images/login/login/btn_bg@2x.png') no-repeat;
        background-size: 100% 100%;
        color: #ffffff;
      }
    }
  }
}
</style>
