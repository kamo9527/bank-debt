<template>
  <div class="certif_index">
    <img
      class="page_back"
      src="~@/assets/images/common/white_back@2x.png"
      @click="$router.go(-1)"
    />
    <h2 class="header">卡信息认证</h2>
    <div class="step">
      <img class="step_img" src="~@/assets/images/certif/step2/step@2x.png" />
    </div>
    <div class="step_desc">
      <span>身份证认证</span>
      <span>卡信息认证</span>
    </div>
    <div class="tips">*为确保您顺利使用，请认真准备以下材料进行认证</div>
    <div class="content">
      <div class="card_line">
        <div class="card">
          <img src="~@/assets/images/certif/step2/plus@2x.png" />
          <span>上传储蓄卡正面</span>
        </div>
      </div>
      <div class="input_wrap">
        <span>证件姓名：</span>
        <input type="text" placeholder="请输入真实姓名" />
      </div>
      <div class="input_wrap">
        <span>证件号码：</span>
        <input type="text" placeholder="请输入真实号码" />
      </div>
      <div class="btn">下一步</div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
export default {
  name: 'certif_index',
  data() {
    return {};
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
  z-index: 9;
}
.certif_index {
  height: 100vh;
  display: flex;
  align-items: center;
  flex-direction: column;
  background: url('"~@/assets/images/certif/step1/bg@2x.png') no-repeat;
  // background-size: 100% auto;
  background-size: 100% 197px;
  background-color: #fff;
  padding-top: 51px;
  padding-bottom: 28.5px;
  div {
    line-height: 1;
  }
  .header {
    position: fixed;
    top: 33.5px;
    left: 0;
    width: 100%;
    font-size: 18px;
    color: #ffffff;
    text-align: center;
    line-height: 1;
    z-index: 9;
  }
  .step {
    margin-top: 22px;
    position: relative;
    .step_img {
      width: 252px;
      height: 32px;
    }
  }

  .step_desc {
    margin-top: 13px;
    width: 217px;
    font-size: 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-weight: bold;
    color: #ffffff;
  }
  .tips {
    margin-top: 16px;
    font-size: 9px;
    color: #ffffff;
  }
  .content {
    margin-top: 60px;
    width: 290px;
    display: flex;
    align-items: center;
    flex-direction: column;
    .card_line {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .card {
        width: 300px;
        height: 124px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        background: #f5f5f5;
        // background: url('"~@/assets/images/certif/step1/card_bg@2x.png')
        //   no-repeat;
        // background-size: 100% 100%;
        img {
          width: 62px;
          height: 62px;
          border: dashed 0.5px #888888;
          padding: 1px;
        }
        span {
          margin-top: 10px;
          font-size: 12px;
          color: #333;
        }
      }
    }
    .input_wrap {
      margin-top: 11.5px;
      width: 100%;
      display: flex;
      align-items: center;
      span {
        font-size: 11px;
        color: #333333;
      }
      input {
        height: 20px;
        width: 203.5px;
        text-align: center;
        border-bottom: 0.5px solid #999999;
        outline: none;
      }
    }
    .btn {
      margin-top: 19px;
      width: 177px;
      height: 33.5px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 13px;
      background: url('~@/assets/images/login/login/btn_bg@2x.png') no-repeat;
      background-size: 100% 100%;
      color: #ffffff;
    }
  }
}
</style>
