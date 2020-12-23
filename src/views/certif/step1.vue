<template>
  <div class="certif_step1">
    <!-- <div class="title">
      <span class="page_back_wrap" @click="$router.go(-1)">
        <img
          class="page_back"
          src="~@/assets/images/common/white_back@2x.png"
        />
      </span>
      <span>认证中心</span>
    </div> -->
    <div class="step">
      <span class="num1">1</span>
      <span class="num2">2</span>
      <img class="step_img" src="~@/assets/images/certif/step1/step@2x.png" />
    </div>
    <div class="step_desc">
      <span>身份证认证</span>
      <span>卡信息认证</span>
    </div>
    <div class="tips">*为确保您顺利使用，请认真准备以下材料进行认证</div>
    <div class="content">
      <div class="card_line">
        <div class="card">
          <SmImagePicker
            :initPreview="info.identityFront"
            @getImg="getIdentityFront"
          >
            <img src="~@/assets/images/certif/step1/camera@2x.png" />
            <span>身份证正面照</span>
          </SmImagePicker>
        </div>
        <div class="card">
          <SmImagePicker
            :initPreview="info.identityBack"
            @getImg="getIdentityBack"
          >
            <img src="~@/assets/images/certif/step1/camera@2x.png" />
            <span>身份证背面照</span>
          </SmImagePicker>
        </div>
      </div>
      <div class="card_line">
        <div class="card">
          <SmImagePicker
            :initPreview="info.identityInHand"
            @getImg="getIdentityInHand"
          >
            <img src="~@/assets/images/certif/step1/camera@2x.png" />
            <span>手持身份证</span>
          </SmImagePicker>
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
        <input
          class="input"
          type="text"
          placeholder="请输入真实姓名"
          v-model.trim="info.name"
        />
      </div>
      <div class="input_wrap">
        <span>证件号码：</span>
        <input
          class="input"
          type="text"
          placeholder="请输入真实号码"
          v-model.trim="info.identity"
        />
      </div>

      <div class="btn" @click="handle">下一步</div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import { regexpMap } from '@/utils/common';
import ajax from '@/rest/ajax';
import SmImagePicker from '@/components/SmImagePicker';

export default {
  name: 'certif_stpe1',
  data() {
    return {
      info: {
        identityFront: '',
        identityBack: '',
        identityInHand: '',
        identity: '',
        name: '',
      },
    };
  },
  mounted() {
    this.initDataByStorage();
  },
  methods: {
    async getIdentityFront(e) {
      const file = e.file;
      this.info.identityFront = await this.uploadImg(file);

      const ocrData = await this.ocrIdcard(file);
      if (ocrData) {
        this.info.name = ocrData.name;
        this.info.identity = ocrData.idCardNo;
      }
    },
    async getIdentityBack(e) {
      const file = e.file;
      this.info.identityBack = await this.uploadImg(file);
    },
    async getIdentityInHand(e) {
      const file = e.file;
      this.info.identityInHand = await this.uploadImg(file);
    },
    uploadImg(file) {
      return new Promise((resolve, reject) => {
        const params = new FormData();
        params.append('file', file);
        ajax
          .post('/upload', params)
          .then((res) => {
            if (res.code === 0) {
              const picPath = res.data;
              // console.log('picPath', picPath, res);
              resolve(picPath);
            } else {
              this.$toast.text(res.msg);
              resolve('');
            }
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    ocrIdcard(file) {
      return new Promise((resolve, reject) => {
        const params = new FormData();
        params.append('file', file);
        ajax
          .post('/ocr/idcard', params)
          .then((res) => {
            if (res.code === 0) {
              const resData = res.data;
              resolve(resData);
            } else {
              this.$toast.text(res.msg);
              resolve('');
            }
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    initDataByStorage() {
      const certif_step1_data_str =
        localStorage.getItem('certif_step1_data') || '';
      if (!certif_step1_data_str) return;
      const certif_step1_data = JSON.parse(certif_step1_data_str);
      Object.keys(this.info).forEach((item) => {
        this.info[item] = certif_step1_data[item];
      });
    },

    handle() {
      if (this.info.identityFront == '') {
        this.$toast.text('请上传身份证正面照');
        return;
      }
      if (this.info.identityBack == '') {
        this.$toast.text('请上传身份证背面照');
        return;
      }
      if (this.info.identityInHand == '') {
        this.$toast.text('请上传手持身份证照');
        return;
      }
      if (!regexpMap.regexp_name_cn.test(this.info.name)) {
        this.$toast.text('请输入正确姓名');
        return;
      }
      if (!regexpMap.regexp_Identification_card.test(this.info.identity)) {
        this.$toast.text('请输入正确身份证号');
        return;
      }

      localStorage.setItem('certif_step1_data', JSON.stringify(this.info));
      this.$router.push('/certif_step2');

      // const params = {
      //   mobile: this.mobile,
      //   smCode: this.smCode,
      //   agentMobile: this.agentMobile,
      // };
      // ajax.post('/account/register', params).then((res) => {
      //   if (res.code === 0) {
      //     this.$toast.text('注册成功');
      //     this.$router.push('/login_login');
      //   } else {
      //     this.$toast.text(res.msg);
      //   }
      // });
    },
  },
  components: {
    SmImagePicker,
  },
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
.certif_step1 {
  height: 600px;
  display: flex;
  align-items: center;
  flex-direction: column;
  background: url('~@/assets/images/certif/step1/bg@2x.png') no-repeat;
  // background-size: 100% auto;
  background-size: 100% 197px;
  background-color: #fff;
  padding-top: 43.5px;
  padding-bottom: 28.5px;
  div {
    line-height: 1;
  }
  .title {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 45px;
    // padding-top: 33.5px;
    overflow: hidden;
    font-size: 18px;
    color: #ffffff;
    text-align: center;
    line-height: 1;
    z-index: 9;
    background: url('~@/assets/images/certif/step1/bg@2x.png') no-repeat;
    background-size: 100% 197px;
    background-color: #ffffff;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    .page_back_wrap {
      position: absolute;
      top: 0;
      left: 0;
      display: inline-block;
      width: 45px;
      height: 45px;
      z-index: 10;
    }
    .page_back {
      position: absolute;
      top: 16px;
      left: 15px;
      width: 8px;
      height: 14.5px;
      z-index: 10;
    }
  }
  .step {
    margin-right: 30px;
    margin-top: 22px;
    position: relative;
    .step_img {
      width: 220px;
      height: 32px;
    }
    .num1 {
      position: absolute;
      left: 43px;
      top: 8px;
      font-size: 18.5px;
      color: #3574f2;
      line-height: 1;
    }
    .num2 {
      position: absolute;
      left: 198px;
      top: 8px;
      font-size: 18.5px;
      color: #eef1fe;
      line-height: 1;
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
    margin-top: 95px;
    width: 290px;
    display: flex;
    align-items: center;
    flex-direction: column;
    .card_line {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      & + .card_line {
        margin-top: 20px;
      }
      .card {
        position: relative;
        width: 133.5px;
        height: 83px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        background: url('"~@/assets/images/certif/step1/card_bg@2x.png')
          no-repeat;
        background-size: 100% 100%;
        overflow: hidden;
        img {
          width: 40px;
          height: 40px;
        }
        span {
          margin-top: 5px;
          font-size: 11px;
          color: #999999;
        }
      }
    }
    .claim {
      margin-top: 29px;
      width: 100%;
      text-align: left;
      font-size: 12px;
      color: #333333;
    }
    .claim_desc {
      width: 100%;
      text-align: left;
      margin-top: 10px;
      font-size: 10px;
      color: #999999;
    }
    .info {
      width: 100%;
      text-align: left;
      margin-top: 19px;
      font-size: 12px;
      color: #333333;
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
      .input {
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
      height: 38.5px;
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
