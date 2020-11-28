<template>
  <div class="login_guide">
    <img class="bannar" src="~@/assets/images/login/guide/banner@2x.png" alt />
    <img class="img1" src="~@/assets/images/login/guide/img1@2x.png" alt />
    <img class="img2" src="~@/assets/images/login/guide/img2@2x.png" alt />
    <div class="btn login" @click="$router.push('/login_login')">登录</div>
    <div class="btn register" @click="$router.push('/login_register')">
      注册
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
export default {
  name: 'login_guide',
  data() {
    return {};
  },
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
.login_guide {
  height: 100vh;
  display: flex;
  align-items: center;
  flex-direction: column;
  .bannar {
    margin-top: 126px;
    margin-bottom: 57px;
    width: 608px;
    height: 495px;
  }
  .img1 {
    width: 300px;
    height: 32px;
  }
  .img2 {
    margin-top: 41px;
    margin-bottom: 85px;
    width: 437px;
    height: 46px;
  }
  .btn {
    width: 476px;
    height: 86px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 30px;
    font-family: PingFang SC;
    font-weight: 500;
    border-radius: 45px;
    &.login {
      width: 487px;
      height: 97px;
      background: url('"~@/assets/images/login/guide/btn_bg@2x.png') no-repeat;
      background-size: 100% 100%;
      color: #ffffff;
    }
    &.register {
      margin-top: 25px;
      color: #3574f2;
      border: 2px solid #3574f2;
    }
  }
}
</style>
