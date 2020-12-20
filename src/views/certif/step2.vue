<template>
  <div class="certif_step2">
    <div class="title">
      <img
        class="page_back"
        src="~@/assets/images/common/white_back@2x.png"
        @click="$router.go(-1)"
      />
      <span>卡信息认证</span>
    </div>
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
          <SmImagePicker
            :initPreview="info.bankCardFront"
            @getImg="getBankCardFront"
          >
            <img src="~@/assets/images/certif/step2/plus@2x.png" />
            <span>上传储蓄卡正面</span>
          </SmImagePicker>
        </div>
      </div>
      <div class="input_wrap">
        <span>储蓄卡卡号</span>
        <input
          type="text"
          placeholder="请输入储蓄卡卡号"
          v-model.trim="info.bankCardNo"
          maxlength="19"
        />
      </div>
      <div class="input_wrap">
        <span>所属银行</span>
        <input
          type="text"
          placeholder="请输入银行名称"
          v-model.trim="info.bankName"
        />
      </div>
      <div class="input_wrap" @click="cityPickerShow('bankCity')">
        <span>开户城市</span>
        <!-- <input
          type="text"
          placeholder="请输入开户城市"
          v-model.trim="bankCity"
          disabled
        /> -->
        <div class="input">{{ bankCity }}</div>
        <img
          class="triangle"
          src="~@/assets/images/certif/step2/triangle@2x.png"
        />
      </div>
      <div class="input_wrap" @click="bankPickerShow">
        <span>开户支行</span>
        <!-- <input
          type="text"
          placeholder="请输入开户支行"
          v-model.trim="info.bankAddress"
          disabled
        /> -->
        <div class="input">{{ info.bankAddress }}</div>
        <img
          class="triangle"
          src="~@/assets/images/certif/step2/triangle@2x.png"
        />
      </div>
      <div class="input_wrap" @click="cityPickerShow('workCity')">
        <span>常驻地址</span>
        <!-- <input
          type="text"
          placeholder="请输入常驻地址"
          v-model.trim="workCity"
          disabled
        /> -->
        <div class="input">{{ workCity }}</div>
        <img
          class="triangle"
          src="~@/assets/images/certif/step2/triangle@2x.png"
        />
      </div>
      <div class="input_wrap">
        <span>银行预留手机号</span>
        <input
          type="text"
          placeholder="请输入银行预留手机号"
          v-model.trim="info.bankCardMobile"
        />
      </div>
      <div class="input_wrap">
        <span>验证码</span>
        <input
          type="text"
          placeholder="请输入验证码"
          v-model.trim="info.smCode"
          maxlength="6"
        />
        <div class="smcode" v-if="loading">{{ secend }} s</div>
        <div class="smcode" v-else @click="handlGetSnake">获取验证码</div>
      </div>
      <div class="btn" @click="addCard">提交审核</div>
    </div>
    <nut-popup position="right" v-model="bankPickerVisible">
      <bank
        ref="bankBranch"
        class="bank"
        :bankInfo="bankInfo"
        @close="bankPickerClose"
      ></bank>
    </nut-popup>

    <nut-picker
      :is-visible="cityPickerVisible"
      :list-data="custmerCityData"
      @close="closeSwitch('cityPickerVisible')"
      @confirm="setChooseValueCustmer"
      @choose="updateChooseValueCustmer"
      @close-update="closeUpdateChooseValueCustmer"
    ></nut-picker>
  </div>
</template>

<script>
// @ is an alias to /src
import ajax from '@/rest/ajax';
import { regexpMap } from '@/utils/common';
import bank from './bank';
import SmImagePicker from '@/components/SmImagePicker';
import md5 from '@/utils/md5';

export default {
  name: 'certif_step2',
  data() {
    return {
      loading: false,
      secend: 60,
      timerId: null,

      info: {
        bankName: '',
        bankCardNo: '',
        // bankCode: 'sdfsdf',
        bankCardFront: '',
        bankAccountName: '',
        bankAddress: '请输入开户支行',
        alliedBankCode: '',
        workProvinceName: '',
        workCityName: '',

        merchantId: '',
        bankCardMobile: '',
        smCode: '',
      },
      bankCity: '请输入开户城市',
      workCity: '请输入常驻地址',
      cityPickerVisible: false,
      cityPickerType: '',
      bankInfo: {},
      bankPickerVisible: false,
      custmerCityData: [],
    };
  },
  async mounted() {
    this.getList();
    this.initDataByStorage();
    this.checkLivingBody();
  },
  methods: {
    getList() {
      const params = {};
      ajax.post('/area/list', params).then(res => {
        if (res.code === 0) {
          const resData = res.data;
          const col2 = [];
          resData.forEach(item => {
            item.label = item.bank_area_code.replace(/\s+/g, '');
            item.value = item.bank_area.replace(/\s+/g, '');
            item.city_list.forEach(city => {
              city.label = city.bank_city_code.replace(/\s+/g, '');
              city.value = city.bank_city.replace(/\s+/g, '');
            });
            col2.push(item.city_list);
          });
          this.custmerCityData = [resData, col2[0]];
          // this.defaultValueData = [col2[0]];
          // this.$set(this.custmerCityData, 1, col2);
        } else {
          this.$toast.text(res.msg);
        }
      });
    },
    initDataByStorage() {
      const certif_step2_data_str =
        localStorage.getItem('certif_step2_data') || '';
      if (!certif_step2_data_str) return;
      const certif_step2_data = JSON.parse(certif_step2_data_str);
      Object.keys(this.info).forEach(item => {
        this.info[item] = certif_step2_data[item];
      });
      this.bankCity = certif_step2_data.bankCity;
      this.workCity = certif_step2_data.workCity;
    },
    async getBankCardFront(e) {
      const file = e.file;
      this.info.bankCardFront = await this.uploadImg(file);

      console.log('this.info.bankCardFront', this.info.bankCardFront);

      const ocrData = await this.ocrBankcard(file);
      if (ocrData) {
        this.info.bankCardNo = ocrData.bankCardNo.replace(/\s/g, '');
      }
    },

    cityPickerShow(type) {
      this.cityPickerType = type;
      this.cityPickerVisible = true;
    },
    bankPickerShow() {
      if (this.bankCity == '') {
        this.$toast.text('请选择开户城市');
        return;
      }
      const provinceInfo = this.custmerCityData[0].find(({ value }) =>
        this.bankCity.includes(value)
      );
      if (provinceInfo) {
        const xss = provinceInfo.city_list.find(({ value }) =>
          this.bankCity.includes(value)
        );
        if (xss) {
          this.bankInfo.bank_city_code = xss.label;
        }
      }
      this.bankPickerVisible = true;
      // this.$refs.bankBranch.getList();
      // console.log('this.$refs.bankBranch', this.$refs.bankBranch);
    },
    closeSwitch(param) {
      this[`${param}`] = false;
    },

    setChooseValueCustmer(chooseData) {
      if (this.cityPickerType == 'bankCity') {
        this.bankCity = chooseData.map(item => item.value.trim()).join('-');
        this.bankInfo.data = chooseData;
        this.bankInfo.bank_city_code = chooseData[1].bank_city_code;
      } else {
        this.workCity = chooseData.map(item => item.value.trim()).join('-');
        this.info.workProvinceName = chooseData[0].value.trim();
        this.info.workCityName = chooseData[1].value.trim();
      }
      this.cityPickerVisible = false;
      // this.cityCustmer = str;
    },

    closeUpdateChooseValueCustmer(self, chooseData) {
      //此处模拟查询API，如果数据缓存了不需要再重新请求
      // setTimeout(() => {
      //   let { label, value } = chooseData[0];
      //   var resItems = APIData.find((item) => item.label == label);
      //   if (resItems && resItems.array.length) {
      //     this.$set(this.custmerCityData, 1, resItems.array);
      //     // 复原位置
      //     self.updateChooseValue(self, 0, chooseData[0]);
      //     self.updateChooseValue(self, 1, chooseData[1]);
      //   }
      // }, 100);
    },

    updateChooseValueCustmer(self, index, resValue, cacheValueData) {
      if (index === 0) {
        let { label, value } = resValue;
        setTimeout(() => {
          var resItems = resValue.city_list;
          if (resItems && resItems.length) {
            this.$set(this.custmerCityData, 1, resItems);
            self.updateChooseValue(self, index + 1, resItems[0]);
          }
        }, 100);
      }
    },
    bankPickerClose(item) {
      if (!item.allied_bank_code) {
        this.info.bankAddress = this.info.bankAddress || '请输入开户支行';
      } else {
        this.info.bankAddress = item.name;
        this.info.alliedBankCode = item.allied_bank_code;
      }
      this.bankPickerVisible = false;
    },

    handlGetSnake() {
      if (this.loading) return;
      if (this.timerId) return;
      if (!regexpMap.regexp_mobile.test(this.info.bankCardMobile)) {
        this.$toast.text('请输入正确的手机号码');
        return;
      }
      const params = {
        mobile: this.info.bankCardMobile,
        type: '102',
      };
      ajax
        .post('/sm/getCode', params, {
          headers: {
            'content-type': 'application/x-www-form-urlencoded',
          },
        })
        .then(res => {
          if (res.code === 0) {
            this.$toast.text('验证码下发您手机请查收！');
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
    uploadImg(file) {
      return new Promise((resolve, reject) => {
        const params = new FormData();
        params.append('file', file);
        ajax
          .post('/upload', params)
          .then(res => {
            if (res.code === 0) {
              const picPath = res.data;
              console.log('picPath', res);
              resolve(picPath);
            } else {
              this.$toast.text(res.msg);
              resolve('');
            }
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    ocrBankcard(file) {
      return new Promise((resolve, reject) => {
        const params = new FormData();
        params.append('file', file);
        ajax
          .post('/ocr/bankcard', params)
          .then(res => {
            if (res.code === 0) {
              const resData = res.data;
              resolve(resData);
            } else {
              this.$toast.text(res.msg);
              resolve('');
            }
          })
          .catch(err => {
            reject(err);
          });
      });
    },

    async addCard() {
      const certif_step1_data_str = localStorage.getItem('certif_step1_data');
      const certif_step1_data = JSON.parse(certif_step1_data_str);
      this.info.bankAccountName = certif_step1_data.name;

      if (this.info.bankCardFront == '') {
        this.$toast.text('请上传银行卡正面照');
        return;
      }
      if (this.info.bankCardNo == '') {
        this.$toast.text('请输入借记卡卡号');
        return;
      }
      if (this.info.bankName == '') {
        this.$toast.text('请输入开户行');
        return;
      }
      if (this.info.bankAddress == '') {
        this.$toast.text('请输入开户支行');
        return;
      }
      if (this.workCity == '') {
        this.$toast.text('请选择常住地址');
        return;
      }
      if (!regexpMap.regexp_mobile.test(this.info.bankCardMobile)) {
        this.$toast.text('请输入正确的手机号码');
        return;
      }
      if (this.info.smCode == '') {
        this.$toast.text('请输入验证码');
        return;
      }
      this.addCardConfirm();
      // 判断是否人脸认证过 认证过，直接提交，没认证过进行人脸检测
      // const merchantInfoQueryResultStr =
      //   localStorage.getItem('merchantInfoQueryResult') || null;
      // const merchantInfoQueryResult = JSON.parse(merchantInfoQueryResultStr);
      // if (merchantInfoQueryResult.ocrStatus) {
      //   this.addCardConfirm();
      // } else {
      //   this.gotoFaceLive();
      // }
    },
    gotoFaceLive() {
      const person_info = localStorage.getItem('person_info');
      const personInfo = JSON.parse(person_info);
      this.info.merchantId = personInfo.merchantId;

      const appid = 'ry91863kGesF16ud';
      const app_security = 'ry91863kGesF16udcjdNh4wVtheMJ0Kd';
      // const callbackUrl = 'http://120.79.102.97:9000/livingBodyCallback';
      const callbackUrl = 'http://newpay.kuaikuaifu.net/livingBodyCallback';
      // const callbackUrl = `${window.location.origin}/livingBodyCallback`;
      const returnUrl = encodeURIComponent(window.location.href);
      const complexity = '1';
      const timestamp = new Date().getTime();
      const sign = md5.hex_md5(`${appid}&${timestamp}&${app_security}`);
      const uid = this.info.merchantId;
      const title = '账无忧';

      const certif_step1_data_str = localStorage.getItem('certif_step1_data');
      const certif_step1_data = JSON.parse(certif_step1_data_str);
      const params = {
        ...this.info,
        ...certif_step1_data,
      };
      params.bankAccountName = certif_step1_data.name;
      params.bankCity = this.bankCity;
      params.workCity = this.workCity;

      localStorage.setItem('certif_step2_data', JSON.stringify(params));
      localStorage.setItem('faceLiving', new Date().getTime());
      location.href = `https://lifeh5.shumaidata.com/index.html#/?appid=${appid}&callbackUrl=${callbackUrl}&returnUrl=${returnUrl}&complexity=${complexity}&timestamp=${timestamp}&sign=${sign}&uid=${uid}&title=${title}`;
    },

    addCardConfirm() {
      const certif_step1_data_str = localStorage.getItem('certif_step1_data');
      const certif_step1_data = JSON.parse(certif_step1_data_str);
      const params = {
        ...this.info,
        ...certif_step1_data,
      };

      const _this = this;
      ajax.post('/debitCard/addSettleCardAndPhotos', params).then(res => {
        if (res.code === 0) {
          this.$dialog({
            id: 'my-dialogxxx',
            title: '认证成功提醒',
            content: '实名认证完成啦！去绑字支付卡就可以交易啦！',
            cancelBtnTxt: '等一会',
            okBtnTxt: '去绑支付卡',
            onOkBtn() {
              this.close(); //关闭对话框
              _this.$router.push('/add_new_card');
            },
            onCancelBtn(event) {
              console.log(event);
            },
          });
        } else {
          this.$toast.text(res.msg);
        }
      });
    },

    async checkLivingBody() {
      const faceLiving = localStorage.getItem('faceLiving') || 0;
      if (new Date().getTime() - faceLiving < 1000 * 60 * 10) {
        // this.initDataByStorage();
        localStorage.removeItem('faceLiving');
        const livingQueryData = await this.livingBodyQuery();
        if (!livingQueryData) return;
        if (!livingQueryData.passed) {
          this.$toast.text('人脸检测不通过，请重试');
          return;
        }
        localStorage.removeItem('certif_step1_data');
        localStorage.removeItem('certif_step2_data');

        const featureImage = await this.getBase64Image(
          `https://api.shumaidata.com/v2/life/check/image?imageId=${livingQueryData.feature_image_id}`
        );
        const livingCheckData = await this.livingBodyCheck(featureImage);
        if (livingCheckData.code == 200) {
          const updateOcrResult = await this.updateOcrResult();
          if (updateOcrResult.code == 200) {
            this.addCardConfirm();
          }
          await this.updateAccountInfo();
        }
      }
    },
    livingBodyQuery() {
      return new Promise((resolve, reject) => {
        const params = {
          uid: this.info.merchantId,
        };
        ajax
          .post('/livingBodyQuery', params, {
            headers: {
              'content-type': 'application/x-www-form-urlencoded',
            },
          })
          .then(res => {
            if (res.code === 0) {
              resolve(res.data);
            } else {
              // this.$toast.text(res.msg);
              resolve('');
            }
          })
          .catch(() => {
            resolve('');
          });
      });
    },
    livingBodyCheck(image) {
      return new Promise((resolve, reject) => {
        const certif_step1_data_str = localStorage.getItem('certif_step1_data');
        const certif_step1_data = JSON.parse(certif_step1_data_str);
        const params = {
          idCardNo: certif_step1_data.identity,
          name: certif_step1_data.name,
          image,
        };
        ajax
          .post('/livingBodyCheck', params, {
            headers: {
              'content-type': 'application/x-www-form-urlencoded',
            },
          })
          .then(res => {
            if (res.code === 0) {
              resolve(res.data);
            } else {
              resolve('');
            }
          })
          .catch(() => {
            resolve('');
          });
      });
    },
    getBase64Image(url) {
      return new Promise((resolve, reject) => {
        const img = document.createElement('img');
        img.onload = function() {
          const data = getBase64Image(img);
          resolve(data);
        };
        img.onerror = function(err) {
          reject(err);
        };
        img.src = url;

        function getBase64Image(img) {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, img.width, img.height);
          const dataURL = canvas.toDataURL('image/png');
          return dataURL;
          // return dataURL.replace("data:image/png;base64,", "");
        }
      });
    },
    updateOcrResult() {
      return new Promise((resolve, reject) => {
        const params = {
          ocrStatus: true,
        };
        ajax
          .post('/account/updateOcrResult', params, {
            headers: {
              'content-type': 'application/x-www-form-urlencoded',
            },
          })
          .then(res => {
            if (res.code === 0) {
              resolve(res.data);
            } else {
              resolve('');
            }
          })
          .catch(() => {
            resolve('');
          });
      });
    },
    updateAccountInfo() {
      return new Promise((resolve, reject) => {
        ajax
          .post('/account/info', {})
          .then(res => {
            if (res.code === 0) {
              const {
                merchantInfoQueryResult,
                merchantDebitQueryResult,
              } = res.data;
              localStorage.setItem(
                'merchantDebitQueryResult',
                JSON.stringify(merchantDebitQueryResult)
              );
              localStorage.setItem(
                'merchantInfoQueryResult',
                JSON.stringify(merchantInfoQueryResult)
              );
              resolve(res.data);
            } else {
              resolve('');
              // this.$toast.text(res.msg);
            }
          })
          .catch(() => {
            resolve('');
          });
      });
    },
  },
  components: {
    bank,
    SmImagePicker,
  },
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
.certif_step2 {
  height: 100vh;
  display: flex;
  align-items: center;
  flex-direction: column;
  background: url('"~@/assets/images/certif/step1/bg@2x.png') no-repeat;
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
        position: relative;
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
      min-height: 25px;
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
      .input {
        font-size: 13px;
        min-height: 18px;
        width: 203.5px;
        color: #757575;
        line-height: 1.3;
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
.nut-picker-control {
  .nut-picker-confirm-btn,
  .nut-picker-cancel-btn {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #3574f2;
  }
}
</style>
