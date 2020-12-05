<template>
  <div class="login_register">
    <img
      class="page_back"
      src="~@/assets/images/common/black_back@2x.png"
      @click="$router.go(-1)"
    />
    <h2 class="title">注册</h2>
    <div class="operate_input">
      <div class="input_wrap">
        <input
          type="number"
          placeholder="请输入手机号"
          maxlength="11"
          v-model="mobile"
        />
      </div>
      <div class="input_wrap">
        <input type="number" placeholder="请输入验证码" v-model="smCode" maxlength="6"/>
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
          :type="isEyesClose1 ? 'password' : 'text'"
          placeholder="请输入密码"
          v-model="password"
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
      <div class="input_wrap">
        <input
          :type="isEyesClose2 ? 'password' : 'text'"
          placeholder="再次确认密码"
          v-model="confirmPassword"
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
      <div class="input_wrap">
        <input type="text" placeholder="请填写邀请码" v-model="agentMobile" />
      </div>
      <div class="protocol">
        <span @click="isRead = !isRead">
          <img
            class="read"
            src="~@/assets/images/login/register/checked@2x.png"
            v-if="isRead"
          />
          <img
            class="read"
            src="~@/assets/images/login/register/uncheck@2x.png"
            v-else
          />
        </span>

        <span
          >已阅读并同意<span class="blue">《账无忧用户使用协议》</span></span
        >
      </div>
      <div class="btn login" @click="handleRegister">注册</div>
      <div class="login_tips" @click="$router.push('/login_login')">
        <span>已有账号？立即</span>
        <span class="blue">登录</span>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import { regexpMap } from '@/utils/common';
import ajax from '@/rest/ajax';
import md5 from '@/utils/md5';
export default {
  name: 'login_register',
  data() {
    return {
      isEyesClose1: true,
      isEyesClose2: true,
      mobile: '',
      smCode: '',
      password: '',
      confirmPassword: '',
      agentMobile: '',
      // mobile: '15521220234',
      // smCode: '123456',
      // password: 'qq123456',
      // confirmPassword: 'qq123456',
      // agentMobile: '15521220234',

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
      const params = {
        mobile: this.mobile,
        type: '101',
      };
      ajax.post(`/sm/getCode`, params).then((res) => {
        if (res.code === 0) {
          this.$toast.text('成功获取验证码');
          this.handleLoading();
        } else {
          this.$toast.text(res.msg);
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
    handleRegister() {
      if (!regexpMap.regexp_mobile.test(this.mobile)) {
        this.$toast.text('请输入正确的手机号码');
        return;
      }
      if (!regexpMap.regexp_captcha.test(this.smCode)) {
        this.$toast.text('请输入正确的验证码');
        return;
      }
      if (this.password !== this.confirmPassword) {
        this.$toast.text('您输入的两次密码不相同');
        return;
      }
      if (!regexpMap.regexp_password.test(this.password)) {
        this.$toast.text('请输入正确的密码');
        return;
      }
      if (this.agentMobile.trim() == '') {
        this.$toast.text('请输入邀请码');
        return;
      }
      if (!this.isRead) {
        this.$toast.text('请阅读用户使用协议并同意才能注册');
        return;
      }
      const params = { 
        mobile: this.mobile, 
        smCode: this.smCode,
        password: md5.hex_md5(this.password),
        agentMobile: this.agentMobile,
      };
      ajax.post('/account/register', params).then((res) => {
        if (res.code === 0) {
          this.$toast.text('注册成功');
          this.$router.push('/login_login');
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
.page_back {
  position: fixed;
  top: 36px;
  left: 15px;
  width: 8px;
  height: 14.5px;
}
.login_register {
  height: 100vh;
  display: flex;
  align-items: center;
  flex-direction: column;
  background-color: #fff;
  .title {
    margin-top: 94px;
    margin-bottom: 21px;
    font-size: 20px;
    color: #000000;
  }
  .operate_input {
    width: 320.5px;
    display: flex;
    align-items: center;
    flex-direction: column;
    .input_wrap {
      width: 100%;
      height: 70.5px;
      background: url('"~@/assets/images/login/login/input_bg@2x.png') no-repeat;
      background-size: 100% 100%;
      padding: 0 30.5px;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: space-between;
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
      & + .input_wrap {
        margin-top: -5px;
      }
    }
    .my_snake {
      width: 98px;
      height: 30px;
      border-left: 1px solid #d4caca;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      font-size: 14px;
      color: #333333;
      .spinner_snake {
        margin-right: 5px;
        display: inline-block;
        height: 6px;
        width: 6px;
        animation: circle 1s infinite linear;
        -webkit-animation: circle 1s infinite linear;
        border: 1px solid transparent;
        border-top-color: #3574f2;
        border-left-color: #3574f2;
        border-bottom-color: #3574f2;
        border-radius: 50%;
      }
    }

    .forget {
      width: 100%;
      margin-top: 4.5px;
      text-align: right;
      font-size: 0;
      span {
        font-size: 13px;
        color: #f9bb03;
      }
    }
    .btn {
      margin-top: 32px;
      width: 307.5px;
      height: 52.5px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 15px;
      border-radius: 22.5px;
      &.login {
        background: url('"~@/assets/images/login/login/btn_bg@2x.png') no-repeat;
        background-size: 100% 100%;
        color: #ffffff;
      }
    }
    .protocol {
      // margin-top: 90px;
      width: 100%;
      font-family: PingFang SC;
      font-weight: 500;
      font-size: 0;
      display: flex;
      align-items: center;
      .read {
        margin-left: 10px;
        margin-right: 7px;
        width: 11px;
        height: 11px;
      }
      span {
        color: #999999;
        font-size: 13px;
      }
      .blue {
        color: #3574f2;
      }
    }
    .login_tips {
      margin-top: 15px;
      font-family: PingFang SC;
      font-weight: 500;
      font-size: 0;
      span {
        color: #999999;
        font-size: 13px;
      }
      .blue {
        color: #3574f2;
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
