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
        <span>储蓄卡卡号</span>
        <input type="text" placeholder="请输入储蓄卡卡号" />
      </div>
      <div class="input_wrap">
        <span>所属银行</span>
        <input type="text" placeholder="请输入银行名称" />
      </div>
      <div class="input_wrap">
        <span>开户城市</span>
        <input type="text" placeholder="请输入开户城市" />
        <img
          class="triangle"
          src="~@/assets/images/certif/step2/triangle@2x.png"
        />
      </div>
      <div class="input_wrap">
        <span>开户支行</span>
        <input type="text" placeholder="请输入开户支行" />
        <img
          class="triangle"
          src="~@/assets/images/certif/step2/triangle@2x.png"
        />
      </div>
      <div class="input_wrap">
        <span>常驻地址</span>
        <input type="text" placeholder="请输入常驻地址" />
        <img
          class="triangle"
          src="~@/assets/images/certif/step2/triangle@2x.png"
        />
      </div>
      <div class="input_wrap">
        <span>银行预留手机号</span>
        <input type="text" placeholder="请输入银行预留手机号" />
      </div>
      <div class="input_wrap">
        <span>验证码</span>
        <input type="text" placeholder="请输入验证码" />
        <div class="smcode">获取验证码</div>
      </div>
      <div class="btn" @click="show = true">下一步</div>
    </div>
    <nut-popup position="right" v-model="show">
      <div class="bank"></div>
    </nut-popup>
  </div>
</template>

<script>
// @ is an alias to /src
export default {
  name: 'certif_index',
  data() {
    return {
      show: false,
    };
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
    width: 330px;
    display: flex;
    align-items: center;
    flex-direction: column;
    .card_line {
      margin-bottom: 30px;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      .card {
        width: 300px;
        height: 124px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        background: #f5f5f5;
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
      margin-top: 5px;
      width: 330px;
      height: 25px;
      display: flex;
      align-items: center;
      border-bottom: 0.5px solid #999999;
      span {
        width: 115px;
        font-size: 11px;
        color: #333333;
        flex-shrink: 0;
      }
      input {
        height: 18px;
        width: 203.5px;
        outline: none;
      }
      .triangle {
        margin-right: 35px;
        width: 18.5px;
        height: 11px;
        flex-shrink: 0;
      }
      .smcode {
        margin-right: 18.5px;
        width: 52px;
        height: 21px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 9px;
        color: #ffffff;
        flex-shrink: 0;
        background: #3574f2;
      }
    }
    .btn {
      margin-top: 28px;
      width: 242.5px;
      height: 42.5px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 13px;
      background: url('~@/assets/images/login/login/btn_bg@2x.png') no-repeat;
      background-size: 100% 100%;
      color: #ffffff;
    }
  }
  .bank {
    width: 375px;
    height: 100vh;
    background: #fff;
  }
}
</style>
