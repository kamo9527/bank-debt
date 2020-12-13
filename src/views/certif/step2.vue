<template>
  <div class="certif_step2">
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
          <SmImagePicker @getImg="getBankCardFront">
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
        <input
          type="text"
          placeholder="请输入开户城市"
          v-model.trim="bankCity"
          disabled
        />
        <img
          class="triangle"
          src="~@/assets/images/certif/step2/triangle@2x.png"
        />
      </div>
      <div class="input_wrap" @click="bankPickerShow">
        <span>开户支行</span>
        <input
          type="text"
          placeholder="请输入开户支行"
          v-model.trim="info.bankAddress"
          disabled
        />
        <img
          class="triangle"
          src="~@/assets/images/certif/step2/triangle@2x.png"
        />
      </div>
      <div class="input_wrap" @click="cityPickerShow('workCity')">
        <span>常驻地址</span>
        <input
          type="text"
          placeholder="请输入常驻地址"
          v-model.trim="workCity"
          disabled
        />
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

export default {
  name: 'certif_step2',
  data() {
    return {
      loading: false,
      secend: 60,
      timerId: null,

      info: {
        bankName: 'sdfsfsdf',
        bankCardNo: '15521',
        bankCode: 'sdfsdf',
        bankCardFront: 'sdfsdf',
        bankAccountName: '和大家',
        bankAddress: 'sfdf',
        alliedBankCode: 'sdfsdfsdf',
        workProvinceName: 'sdfsfsf',
        workCityName: 'sdfsfsdf',

        merchantId: '',
        bankCardMobile: '15521220234',
        smCode: '950579',
      },
      bankCity: '',
      workCity: '',
      cityPickerVisible: false,
      cityPickerType: '',
      bankInfo: {},
      bankPickerVisible: false,
      custmerCityData: [],
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    getList() {
      const params = {};
      ajax.post('/area/list', params).then(res => {
        if (res.code === 0) {
          const resData = res.data;
          const col2 = [];
          resData.forEach(item => {
            item.label = item.bank_area_code;
            item.value = item.bank_area;
            item.city_list.forEach(city => {
              city.label = city.bank_city_code;
              city.value = city.bank_city;
            });
            col2.push(item.city_list);
          });
          this.custmerCityData = [resData, col2[0]];
          // this.defaultValueData = [col2[0]];
          // this.$set(this.custmerCityData, 1, col2);
          console.log('this.custmerCityData', this.custmerCityData);
        } else {
          this.$toast.text(res.msg);
        }
      });
    },
    async getBankCardFront(e) {
      const file = e.file;
      this.info.bankCardFront = await this.uploadImg(file);

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
      if (!item) return;
      this.info.bankAddress = item.name;
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
            this.$toast.text('验证码下发你手机请查收！');
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

    addCard() {
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

      const certif_stpe1_data = localStorage.getItem('certif_stpe1_data');
      const params = {
        ...this.info,
        ...JSON.parse(certif_stpe1_data),
      };
      // console.log('certif_stpe1_data', certif_stpe1_data);
      // console.log('params', params);
      // return;
      ajax.post('/debitCard/addSettleCardAndPhotos', params).then(res => {
        if (res.code === 0) {
          this.$dialog({
            id: 'my-dialogxxx',
            title: '认证成功提醒',
            content: '实名认证完成啦！去绑字支付卡就可以交易啦！',
            cancelBtnTxt: '等一会',
            okBtnTxt: '去绑支付卡',
            onOkBtn: () => {
              this.close(); //关闭对话框
              this.$router.push('/add_new_card');
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
  },
  components: {
    bank,
    SmImagePicker,
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
  &::before {
    content: '';
    position: absolute;
    left: -10px;
    right: -10px;
    top: -10px;
    bottom: -10px;
    background: #000;
  }
}
.certif_step2 {
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
