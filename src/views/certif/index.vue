<template>
  <div class="certif_index">
    <img
      class="page_back"
      src="~@/assets/images/common/white_back@2x.png"
      @click="$router.go(-1)"
    />
    <h2 class="header">认证中心</h2>
    <div class="step">
      <span class="num1">1</span>
      <span class="num2">2</span>
      <img class="step_img" src="~@/assets/images/certif/index/step@2x.png" />
    </div>
    <div class="step_desc">
      <span>身份证认证</span>
      <span>卡信息认证</span>
    </div>
    <div class="tips">*为确保您顺利使用，请认真准备以下材料进行认证</div>
    <div class="content">
      <div class="card_line">
        <div class="card">
          <img src="~@/assets/images/certif/index/camera@2x.png" />
          <span>身份证正面照</span>
        </div>
        <div class="card">
          <img src="~@/assets/images/certif/index/camera@2x.png" />
          <span>身份证背面照</span>
        </div>
      </div>
      <div class="card_line">
        <div class="card">
          <img src="~@/assets/images/certif/index/camera@2x.png" />
          <span>手持身份证</span>
        </div>
      </div>
      <div class="claim">证件要求：</div>
      <p class="claim_desc">1.请上传有效身份证照片，非证件照片不予受理</p>
      <p class="claim_desc">2.证件照必须是彩色原件电子版</p>
      <p class="claim_desc">
        3.证件照需完整、清晰、请勿逆光拍摄，否则审核不通过
      </p>
      <div class="info">信息采集</div>
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
  top: 72px;
  left: 30px;
  width: 16px;
  height: 29px;
  z-index: 9;
}
.certif_index {
  height: 100vh;
  display: flex;
  align-items: center;
  flex-direction: column;
  background: url('"~@/assets/images/certif/index/bg@2x.png') no-repeat;
  // background-size: 100% auto;
  background-size: 100% 394px;
  background-color: #fff;
  padding-top: 102px;
  padding-bottom: 57px;
  div {
    line-height: 1;
  }
  .header {
    position: fixed;
    top: 67px;
    left: 0;
    width: 100%;
    font-size: 36px;
    color: #ffffff;
    text-align: center;
    line-height: 1;
    z-index: 9;
  }
  .step {
    margin-right: 60px;
    margin-top: 44px;
    position: relative;
    .step_img {
      width: 440px;
      height: 64px;
    }
    .num1 {
      position: absolute;
      left: 86px;
      top: 16px;
      font-size: 37px;
      color: #3574f2;
      line-height: 1;
    }
    .num2 {
      position: absolute;
      left: 396px;
      top: 16px;
      font-size: 37px;
      color: #eef1fe;
      line-height: 1;
    }
  }

  .step_desc {
    margin-top: 26px;
    width: 434px;
    font-size: 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-family: PingFang SC;
    font-weight: bold;
    color: #ffffff;
  }
  .tips {
    margin-top: 32px;
    font-size: 18px;
    font-family: PingFang SC;
    font-weight: 500;
    color: #ffffff;
  }
  .content {
    margin-top: 190px;
    width: 580px;
    display: flex;
    align-items: center;
    flex-direction: column;
    .card_line {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      & + .card_line {
        margin-top: 40px;
      }
      .card {
        width: 267px;
        height: 166px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        background: url('"~@/assets/images/certif/index/card_bg@2x.png')
          no-repeat;
        background-size: 100% 100%;
        img {
          width: 80px;
          height: 80px;
        }
        span {
          margin-top: 10px;
          font-size: 22px;
          color: #999999;
        }
      }
    }
    .claim {
      margin-top: 58px;
      width: 100%;
      text-align: left;
      font-size: 24px;
      color: #333333;
    }
    .claim_desc {
      width: 100%;
      text-align: left;
      margin-top: 20px;
      font-size: 20px;
      color: #999999;
    }
    .info {
      width: 100%;
      text-align: left;
      margin-top: 38px;
      font-size: 24px;
      color: #333333;
    }
    .input_wrap {
      margin-top: 23px;
      width: 100%;
      display: flex;
      align-items: center;
      span {
        font-size: 22px;
        color: #333333;
      }
      input {
        height: 40px;
        width: 407px;
        text-align: center;
        border-bottom: 1px solid #999999;
        outline: none;
      }
    }
    .btn {
      margin-top: 38px;
      width: 354px;
      height: 67px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 26px;
      background: url('~@/assets/images/login/login/btn_bg@2x.png') no-repeat;
      background-size: 100% 100%;
      color: #ffffff;
    }
  }
}
</style>
