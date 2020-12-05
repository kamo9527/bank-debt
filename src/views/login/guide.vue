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
import cache from '@/utils/cache';
export default {
  name: 'login_guide',
  data() {
    return {};
  },
  beforeCreate() {
    const signKey = cache.getLocalStorageData('signKey') || '';
    if (signKey) this.$router.push('/home');
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
    margin-top: 63px;
    margin-bottom: 28.5px;
    width: 304px;
    height: 297.5px;
  }
  .img1 {
    width: 150px;
    height: 16px;
  }
  .img2 {
    margin-top: 2.05px;
    margin-bottom: 42.5px;
    width: 218.5px;
    height: 23px;
  }
  .btn {
    width: 238px;
    height: 43px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 15px;
    font-family: PingFang SC;
    font-weight: 500;
    border-radius: 22.5px;
    &.login {
      width: 243.5px;
      height: 48.5px;
      background: url('"~@/assets/images/login/guide/btn_bg@2x.png') no-repeat;
      background-size: 100% 100%;
      color: #ffffff;
    }
    &.register {
      margin-top: 12.5px;
      color: #3574f2;
      border: 1px solid #3574f2;
    }
  }
}
</style>
