<template>
  <div class="login_login">
    <img
      class="page_back"
      src="~@/assets/images/common/black_back@2x.png"
      @click="$router.go(-1)"
    />
    <h2 class="title">忘记密码</h2>
    <div class="operate_input">
      <div class="input_wrap">
        <input type="text" placeholder="请输入手机号" v-model="mobile" />
      </div>
      <div class="input_wrap">
        <input type="text" placeholder="请输入验证码" v-model="mobile" />
        <div class="my_snake">
          <div v-if="loading" class="my_flex my_ju">
            <span class="spinner_snake" />
            <span>{{ secend }} s</span>
          </div>
          <span v-else class="my_text" @click="handlGetSnake">
            获取验证码
          </span>
        </div>
      </div>
      <div class="input_wrap">
        <input
          :type="isEyesClose ? 'password' : 'text'"
          placeholder="6-20位数字字母组合密码"
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
      <div class="input_wrap">
        <input
          :type="isEyesClose ? 'password' : 'text'"
          placeholder="再次确认密码"
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

      <div class="btn login" @click="login">修改密码</div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import { regexpMap } from '@/utils/common';
// import cache from '@/utils/cache';
import ajax from '@/rest/ajax';
export default {
  name: 'login_register',
  data() {
    return {
      isEyesClose: true,
      mobile: '',
      password: '',

      smCode: '',
      loading: false,
      secend: 60,
      isRead: true,
      timerId: null,
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

      // const query = {
      //   mobile: this.mobile,
      //   verifyCode: 223322,
      // };

      // ajax.get('/getCode', query).then((res) => {
      //   if (res.code === 0) {
      //     this.$toast.text('成功获取验证码');
      //     this.handleLoading();
      //   } else {
      //     this.$toast.text(res.message);
      //   }
      // });
    },

    handleRead(e) {
      this.isRead = e.target.checked;
    },
    handlGetSnake() {
      if (this.loading) return;
      if (this.timerId) return;
      if (!regexpMap.regexp_mobile.test(this.mobile)) {
        this.$toast.text('请输入正确的手机号码');
        return;
      }
      const query = {
        mobile: this.mobile,
        verifyCode: 223322,
      };
      ajax.get('/getCode', query).then((res) => {
        if (res.code === 0) {
          this.$toast.text('成功获取验证码');
          this.handleLoading();
        } else {
          this.$toast.text(res.message);
        }
      });
    },
    handleLoading() {
      this.loading = true;
      clearInterval(this.timerId);
      this.timerId = setInterval(() => {
        this.secend--;
        if (this.secend === 0) {
          this.loading = false;
          clearInterval(this.timerId);
          this.timerId = null;
          this.secend = 60;
        }
      }, 1000);
    },
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
    margin-top: 188px;
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
    .my_snake {
      width: 196px;
      height: 60px;
      border-left: 1px solid #d4caca;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      font-size: 28px;
      font-family: PingFang SC;
      font-weight: 500;
      color: #333333;
      .spinner_snake {
        margin-right: 10px;
        display: inline-block;
        height: 12px;
        width: 12px;
        animation: circle 1s infinite linear;
        -webkit-animation: circle 1s infinite linear;
        border: 2px solid transparent;
        border-top-color: #3574f2;
        border-left-color: #3574f2;
        border-bottom-color: #3574f2;
        border-radius: 50%;
      }
    }

    .btn {
      margin-top: 64px;
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
  }
}
@keyframes circle {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(-360deg);
  }
}

@-webkit-keyframes circle {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(-360deg);
  }
}
</style>
