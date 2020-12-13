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
        <input
          type="number"
          placeholder="请输入手机号"
          maxlength="11"
          v-model="mobile"
        />
      </div>
      <div class="input_wrap">
        <input
          type="number"
          placeholder="请输入验证码"
          v-model="smCode"
          maxlength="6"
        />
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
          v-model="newPassWord"
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

      <div class="btn login" @click="handleRegister">修改密码</div>
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
  name: 'login_findPassword',
  data() {
    return {
      isEyesClose1: true,
      isEyesClose2: true,
      mobile: '',
      smCode: '',
      password: '',
      confirmPassword: '',
      // mobile: '15521220234',
      // smCode: '123456',
      // newPassWord: 'qq123456',
      // confirmPassword: 'qq123456',

      loading: false,
      secend: 60,
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
    handlGetSnake() {
      if (this.loading) return;
      if (this.timerId) return;
      if (!regexpMap.regexp_mobile.test(this.mobile)) {
        this.$toast.text('请输入正确的手机号码');
        return;
      }
      const params = {
        mobile: this.mobile,
        type: '103',
      };
      ajax
        .post('/sm/getCode', params, {
          headers: {
            'content-type': 'application/x-www-form-urlencoded',
          },
        })
        .then(res => {
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
      if (this.newPassWord !== this.confirmPassword) {
        this.$toast.text('您输入的两次密码不相同');
        return;
      }
      if (!regexpMap.regexp_password.test(this.newPassWord)) {
        this.$toast.text('请输入正确的密码');
        return;
      }
      const params = {
        mobile: this.mobile,
        smCode: this.smCode,
        newPassWord: md5.hex_md5(this.newPassWord),
      };
      ajax.post('/account/resetPassword', params).then(res => {
        if (res.code === 0) {
          this.$toast.text('密码修改成功');
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
  z-index: 10;
}
.login_login {
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
      font-family: PingFang SC;
      font-weight: 500;
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

    .btn {
      margin-top: 32px;
      width: 307.5px;
      height: 52.5px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 15px;
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
