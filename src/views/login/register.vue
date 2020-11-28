<template>
  <div class="register_login">
    <div class="register_login_bg">
      <!-- <img
        src="../assets/images/login_bg@2x.png"
        class="register_login_img"
        alt
      /> -->
    </div>
    <div class="operate_input">
      <nut-textinput
        class="my_input"
        label="手机号"
        placeholder="请输入手机号"
        :hasBorder="false"
        v-model="mobile"
      />
      <div class="need_border">
        <nut-textinput
          class="my_input input_width"
          label="验证码"
          placeholder="请输入验证码"
          :hasBorder="false"
          v-model="smCode"
        />
        <div class="my_snake">
          <div v-if="loading" class="my_flex my_ju">
            <span class="spinner_snake" />
            <span>{{ secend }} s</span>
          </div>
          <button v-else class="my_text reset_btn" @click="handlGetSnake">
            获取验证码
          </button>
        </div>
      </div>
    </div>

    <div class="operate_btn">
      <button @click="handleRegister" class="my_btn my_btn_active">
        注册 / 登录
      </button>
      <div class="my_tips">
        <input
          class="my_checkbox middle"
          type="checkbox"
          name="vehicle"
          checked="checked"
          @change="handleRead"
        />
        <span class="middle">注册即表示您已阅读并同意债惠</span>
        <router-link to="/agreement1" class="contract middle"
          >《用户协议》</router-link
        >
        <span>与</span>
        <router-link to="/agreement2" class="contract middle"
          >《隐私协议》</router-link
        >
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import { regexpMap } from '@/utils/common';
import cache from '@/utils/cache';
import ajax from '@/rest/ajax';
export default {
  name: 'Register',
  data() {
    return {
      nextUrl: '',
      mobile: '',
      smCode: '',
      loading: false,
      secend: 60,
      isRead: true,
      timerId: null,
    };
  },
  beforeDestroy() {
    clearInterval(this.timerId);
  },
  mounted() {
    this.nextUrl = this.$route.query.next;
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
    handleRegister() {
      if (!regexpMap.regexp_mobile.test(this.mobile)) {
        this.$toast.text('请输入正确的手机号码');
        return;
      }
      if (!regexpMap.regexp_captcha.test(this.smCode)) {
        this.$toast.text('请输入正确的验证码');
        return;
      }
      if (!this.isRead) {
        this.$toast.text('请阅读并同意本债惠协议');
        return;
      }
      const params = { mobile: this.mobile, smCode: this.smCode };
      ajax.post('/login', params).then((res) => {
        if (res.code === 0) {
          this.$toast.text('登录成功');
          cache.setSessionData('person_info', res.data);
          const url = this.nextUrl || 'home';
          this.$router.push(url);
        } else {
          this.$toast.text(res.message);
        }
      });
    },
  },
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
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

.register_login {
  height: 100vh;
  background-color: #fff;
  font-size: 14px;

  .register_login_bg {
    padding: 15px;

    .register_login_img {
      display: block;
      width: 100%;
    }
  }

  // .register_login_icon {
  //   display: block;
  //   width: 50px;
  //   margin: 0 auto;
  //   padding: 50px 0;
  // }

  .operate_input {
    margin: 30px;
    font-size: 14px;

    .my_input .nut-textinput-label {
      display: block;
      width: 75px;
      text-align: left;
    }

    .my_input input {
      padding: 0;
    }
    .input_width {
      height: 100%;
    }
    .input_width input {
      max-width: 90px;
    }
  }

  .need_border {
    height: 60px;
    border-top: 1px solid #d4caca;
    border-bottom: 1px solid #d4caca;
    // justify-content: flex-start;
    position: relative;
    padding-right: 90px;
    .my_snake {
      position: absolute;
      right: 5px;
      top: 50%;
      -webkit-transform: translateY(-50%);
      transform: translateY(-50%);
      width: 79px;
      border-left: 1px solid #d4caca;
      .my_ju {
        width: 50px;
        margin: 0 auto;
      }

      .spinner_snake {
        display: inline-block;
        height: 12px;
        width: 12px;
        animation: circle 1s infinite linear;
        -webkit-animation: circle 1s infinite linear;
        border: 2px solid transparent;
        border-top-color: #fe7570;
        border-left-color: #fe7570;
        border-bottom-color: #fe7570;
        border-radius: 50%;
      }
      .my_text {
        font-size: 13px;
        padding: 0;
        background-color: #ffffff;
        border: none;
      }
    }
  }

  .operate_btn {
    padding: 0 30px;

    .my_btn {
      width: 100%;
      height: 50px;
      border-radius: 4px;
      font-size: 16px;
      color: #fff;
      border: 1px solid #fad09d;
    }
  }
}
</style>
