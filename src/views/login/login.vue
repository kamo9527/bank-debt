<template>
  <div class="login_login">
    <img
      class="page_back"
      src="~@/assets/images/common/black_back@2x.png"
      @click="$router.go(-1)"
    />
    <h2 class="title">登录</h2>
    <div class="operate_input">
      <div class="input_wrap">
        <input type="text" placeholder="请输入手机号" v-model="mobile" />
      </div>
      <div class="input_wrap">
        <input
          :type="isEyesClose ? 'password' : 'text'"
          placeholder="请输入密码"
          v-model="password"
        />
        <span @click="isEyesClose = !isEyesClose">
          <img
            class="icon"
            src="~@/assets/images/login/login/eyes_close@2x.png"
            v-if="isEyesClose"
          />
          <img
            class="icon"
            src="~@/assets/images/login/login/eyes_open@2x.png"
            v-else
          />
        </span>
      </div>
      <div class="forget">
        <span @click="$router.push('/login_findPassword')">忘记密码？</span>
      </div>
      <div class="btn login" @click="login">登录</div>
      <div class="register" @click="$router.push('/login_register')">
        <span>还没有账号？快速</span>
        <span class="blue">注册</span>
      </div>
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
  name: 'login_login',
  data() {
    return {
      isEyesClose: true,
      // mobile: '',
      // password: '',
      mobile: '18520249272', // 不可发短信
      password: '123456',
      // mobile: '13528853680', // 可发短信
      // password: '123456',
    };
  },
  beforeDestroy() {
    // clearInterval(this.timerId);
  },
  mounted() {
    // this.nextUrl = this.$route.query.next;
  },
  methods: {
    login() {
      if (!regexpMap.regexp_mobile.test(this.mobile)) {
        this.$toast.text('请输入正确的手机号码');
        return;
      }
      if (this.password.trim() === '') {
        this.$toast.text('请输入密码');
        return;
      }

      const params = {
        deviceId: '1111',
        loginName: this.mobile,
        password: md5.hex_md5(this.password),
        version: '1.0',
      };
      ajax.post('http://120.79.102.97:9000/account/login', params).then(res => {
        if (res.code === 0) {
          this.$toast.text('登录成功');
          localStorage.setItem('person_info', res.data);
          localStorage.setItem('signKey', res.data.signKey);

          // cache.setSessionData('person_info', res.data);
          // cache.setSessionData('signKey', res.data.signKey);
          // const url = this.nextUrl || 'home';
          // this.$router.push(url);
        } else {
          this.$toast.text(res.message);
        }
      });
    },

    // handleRead(e) {
    //   this.isRead = e.target.checked;
    // },
    // handlGetSnake() {
    //   if (this.loading) return;
    //   if (this.timerId) return;
    //   if (!regexpMap.regexp_mobile.test(this.mobile)) {
    //     this.$toast.text('请输入正确的手机号码');
    //     return;
    //   }
    //   const query = {
    //     mobile: this.mobile,
    //     verifyCode: 223322,
    //   };
    //   ajax.get('/getCode', query).then((res) => {
    //     if (res.code === 0) {
    //       this.$toast.text('成功获取验证码');
    //       this.handleLoading();
    //     } else {
    //       this.$toast.text(res.message);
    //     }
    //   });
    // },
    // handleLoading() {
    //   this.loading = true;
    //   clearInterval(this.timerId);
    //   this.timerId = setInterval(() => {
    //     this.secend--;
    //     if (this.secend === 0) {
    //       this.loading = false;
    //       clearInterval(this.timerId);
    //       this.timerId = null;
    //       this.secend = 60;
    //     }
    //   }, 1000);
    // },
    // handleRegister() {
    //   if (!regexpMap.regexp_mobile.test(this.mobile)) {
    //     this.$toast.text('请输入正确的手机号码');
    //     return;
    //   }
    //   if (!regexpMap.regexp_captcha.test(this.smCode)) {
    //     this.$toast.text('请输入正确的验证码');
    //     return;
    //   }
    //   if (!this.isRead) {
    //     this.$toast.text('请阅读并同意本债惠协议');
    //     return;
    //   }
    //   const params = { mobile: this.mobile, smCode: this.smCode };
    //   ajax.post('/login', params).then((res) => {
    //     if (res.code === 0) {
    //       this.$toast.text('登录成功');
    //       cache.setSessionData('person_info', res.data);
    //       const url = this.nextUrl || 'home';
    //       this.$router.push(url);
    //     } else {
    //       this.$toast.text(res.message);
    //     }
    //   });
    // },
  },
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
.page_back {
  position: fixed;
  top: 72px;
  left: 30px;
  width: 16px;
  height: 29px;
}
.login_login {
  height: 100vh;
  display: flex;
  align-items: center;
  flex-direction: column;
  background-color: #fff;
  .title {
    margin-top: 288px;
    margin-bottom: 42px;
    font-size: 40px;
    font-family: PingFang SC;
    font-weight: 500;
    color: #000000;
  }
  .operate_input {
    width: 641px;
    display: flex;
    align-items: center;
    flex-direction: column;
    .input_wrap {
      width: 100%;
      height: 141px;
      background: url('"~@/assets/images/login/login/input_bg@2x.png') no-repeat;
      background-size: 100% 100%;
      padding: 0 61px;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: space-between;
      input {
        width: 100%;
        height: 43px;
        border: none;
        outline: none;
      }
      .icon {
        width: 43px;
        height: 43px;
      }
      & + .input_wrap {
        margin-top: -10px;
      }
    }
    .forget {
      width: 100%;
      margin-top: 9px;
      text-align: right;
      font-size: 0;
      span {
        font-size: 26px;
        font-family: PingFang SC;
        font-weight: 500;
        color: #f9bb03;
      }
    }
    .btn {
      margin-top: 78px;
      width: 615px;
      height: 105px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 30px;
      font-family: PingFang SC;
      font-weight: 500;
      border-radius: 45px;
      &.login {
        background: url('"~@/assets/images/login/login/btn_bg@2x.png') no-repeat;
        background-size: 100% 100%;
        color: #ffffff;
      }
    }
    .register {
      margin-top: 90px;
      font-family: PingFang SC;
      font-weight: 500;
      font-size: 0;
      span {
        color: #999999;
        font-size: 26px;
      }
      .blue {
        color: #3574f2;
      }
    }
  }
}
</style>
