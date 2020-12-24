<template>
  <section class="page_w count_page">
    <div class="iinpu_ophne">
      <nut-textinput
        class="my_input flexx1"
        label="银行卡号"
        placeholder="请输入卡号或扫描"
        :hasBorder="false"
        @blur="onBlur"
        :readonly="isReadonly"
        v-model="countInfo.bankCardNo"
      />
      <sing-image-picker
        v-if="!isReadonly"
        class="upload_item"
        :ismultiple="false"
        :showImage="false"
        max="1"
        @getImg="handleUpload"
      />
    </div>
    <nut-textinput
      class="my_input"
      label="开户名"
      placeholder="请输入"
      :hasBorder="false"
      readonly
      v-model="countInfo.bankAccountName"
    />
    <nut-textinput
      class="my_input efwefwe"
      label="开户行"
      placeholder="请输入"
      :hasBorder="false"
      :readonly="isReadonly"
      v-model="countInfo.bankName"
    />
    <nut-cell
      class="my_cell"
      :show-icon="true"
      title="银行所在地"
      :showIcon="!isReadonly"
      :desc="countInfo.bankAddress"
      @click.native="openAddressSwitch"
    />
    <nut-cell
      class="my_cell"
      :show-icon="true"
      title="银行网点"
      :showIcon="!isReadonly"
      :desc="countInfo.branchBankName"
      @click.native="cellClick"
    />
    <nut-textinput
      class="my_input efwefwe"
      label="预留手机号"
      placeholder="请输入"
      :readonly="isReadonly"
      :hasBorder="false"
      v-model="countInfo.bankCardMobile"
    />

    <div class="input_wrap" v-if="!isReadonly">
      <span class="ggspan">验证码</span>
      <input
        class="gerginput"
        type="text"
        placeholder="请输入验证码"
        :readonly="isReadonly"
        v-model.trim="countInfo.smCode"
        maxlength="6"
      />
      <div class="smcode" v-if="loading">{{ secend }} s</div>
      <div class="smcode" v-else @click="handlGetSnake">获取验证码</div>
    </div>
    <nut-picker
      :is-visible="addressVisible"
      :default-value-data="defaultValueData"
      :list-data="custmerCityData"
      @close="closeSwitch"
      @confirm="setChooseValueCustmer"
      @choose="updateChooseValueCustmer"
      @close-update="closeUpdateChooseValueCustmer"
    />

    <nut-popup position="right" class="dkdkdkkdk" v-model="bankPickerVisible">
      <bank
        ref="bankBranch"
        class="bank"
        :bankInfo="bankInfo"
        @close="bankPickerClose"
      />
    </nut-popup>
    <button @click="handleSubmit" class="my_btn">
      {{ isReadonly ? '修改结算卡' : '完成' }}
    </button>
  </section>
</template>

<script>
// @ is an alias to /src
import { regexpMap } from '@/utils/common';
import SingImagePicker from '@/components/SingImagePicker.vue';
import ajax from '@/rest/ajax';
import bank from '../certif/bank';

export default {
  name: 'myCountPage',
  components: {
    SingImagePicker,
    bank,
  },
  data() {
    return {
      isReadonly: true,
      cityCustmer: '请选择常住地址',
      dateVisible: false,
      defaultValueData: null,
      addressVisible: false,
      custmerCityData: [],
      loading: false,
      secend: 60,
      timerId: null,
      countInfo: {
        bankCode: '',
        bankAddress: '',
        bankCardNo: '',
        bankCardMobile: '',
        bankName: '',
        branchBankName: '请选择',
        smCode: '',
        // workProvinceName: '',
        // workCityName: '',
      },
      bankInfo: {},
      bankPickerVisible: false,
    };
  },
  mounted() {
    ajax.post('/account/info', {}).then((res) => {
      if (res.code === 0) {
        const { merchantDebitQueryResult } = res.data;
        const { bankCardNo, bankCardMobile } = merchantDebitQueryResult;
        this.countInfo = merchantDebitQueryResult;
        this.countInfo.bankCardNoCopy = bankCardNo;
        this.countInfo.bankCardNo =
          bankCardNo.slice(0, 3) + '***********' + bankCardNo.slice(-4);
        this.countInfo.bankCardMobileCopy = bankCardMobile;
        this.countInfo.bankCardMobile =
          bankCardMobile.slice(0, 3) + '****' + bankCardMobile.slice(-4);
        // this.countInfo.merchantId = merchantInfoQueryResult.merchantId;
        // this.countInfo.workProvinceName = merchantInfoQueryResult.provinceName;
        // this.countInfo.workCityName = merchantInfoQueryResult.cityName;
        // this.cityCustmer =
        //   merchantInfoQueryResult.provinceName +
        //   merchantInfoQueryResult.cityName;
      } else {
        this.$toast.text(res.msg);
      }
    });
    ajax.post('/area/list', {}).then((res) => {
      if (res.code === 0) {
        const resData = res.data;
        const col2 = [];
        resData.forEach((item) => {
          item.label = item.bank_area_code.replace(/\s+/g, '');
          item.value = item.bank_area.replace(/\s+/g, '');
          item.city_list.forEach((city) => {
            city.label = city.bank_city_code.replace(/\s+/g, '');
            city.value = city.bank_city.replace(/\s+/g, '');
          });
          col2.push(item.city_list);
        });
        this.custmerCityData = [resData, col2[0]];
      } else {
        this.$toast.text(res.msg);
      }
    });
  },
  beforeDestroy() {
    clearInterval(this.timerId);
  },
  methods: {
    onBlur(e) {
      if (this.isReadonly) {
        return;
      }
      if (!e.target.value) {
        return;
      }
      const bankCardNo = e.target.value.replace(/\s/g, '');
      ajax
        .post(
          '/debitCard/getBankNameByCardNo',
          { bankCardNo },
          {
            headers: {
              'content-type': 'application/x-www-form-urlencoded',
            },
          }
        )
        .then((res) => {
          if (res.code === 0 && res.data) {
            this.countInfo.bankName = res.data.bank_name;
            this.countInfo.bankCode = res.data.bank_code;
          } else {
            this.$toast.text(res.message);
          }
        });
    },
    handleUpload(data) {
      const loading = this.$toast.loading('加载中');
      const formData = new FormData();
      formData.append('file', data.file);
      ajax
        .post('/ocr/bankcard', formData)
        .then((res) => {
          const { code, data } = res;
          if (code === 0) {
            this.countInfo.bankCardNo = data.bankCardNo.replace(/\s/g, '');
            return this.countInfo.bankCardNo;
          } else {
            this.$toast.text(res.message);
          }
        })
        .then((bankCardNo) => {
          if (!bankCardNo) {
            return;
          }
          ajax
            .post(
              '/debitCard/getBankNameByCardNo',
              { bankCardNo },
              {
                headers: {
                  'content-type': 'application/x-www-form-urlencoded',
                },
              }
            )
            .then((res) => {
              loading.hide();
              if (res.code === 0 && res.data) {
                this.countInfo.bankName = res.data.bank_name;
                this.countInfo.bankCode = res.data.bank_code;
              } else {
                this.$toast.text(res.message);
              }
            });
        });
    },
    openAddressSwitch() {
      if (this.isReadonly) {
        return;
      }
      this.addressVisible = true;
    },
    closeSwitch() {
      this.addressVisible = false;
    },
    setChooseValueCustmer(chooseData) {
      console.log(chooseData[1]);
      this.countInfo.bankAddress = chooseData[0].value + chooseData[1].value;
    },
    closeUpdateChooseValueCustmer(self, chooseData) {
      console.log(self, chooseData);
      //此处模拟查询API，如果数据缓存了不需要再重新请求
      // setTimeout(() => {
      //   let { label, value } = chooseData[0];
      //   console.log(label, value);
      //   var resItems = APIData.find(item => item.label == label);
      //   if (resItems && resItems.array.length) {
      //     this.$set(this.custmerCityData, 1, resItems.array);
      //     // 复原位置
      //     self.updateChooseValue(self, 0, chooseData[0]);
      //     self.updateChooseValue(self, 1, chooseData[1]);
      //   }
      // }, 100);
    },
    updateChooseValueCustmer(self, index, resValue, cacheValueData) {
      // 本demo为二级联动，所以限制只有首列变动的时候触发事件
      if (index === 0) {
        // let { label, value } = resValue;
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
      if (item.name && item.allied_bank_code) {
        this.countInfo.branchBankName = item.name;
        this.countInfo.bankCode = item.allied_bank_code;
      }
      this.bankPickerVisible = false;
    },
    cellClick() {
      if (this.isReadonly) {
        return;
      }
      if (!this.countInfo.bankAddress) {
        this.$toast.text('请选择城市所在地');
        return;
      }
      const provinceInfo = this.custmerCityData[0].find(({ value }) =>
        this.countInfo.bankAddress.includes(value)
      );
      if (provinceInfo) {
        const xss = provinceInfo.city_list.find(({ value }) =>
          this.countInfo.bankAddress.includes(value)
        );
        if (xss) {
          this.bankInfo.bank_city_code = xss.label;
        }
      }
      this.bankPickerVisible = true;
    },
    handlGetSnake() {
      if (this.loading) return;
      if (this.timerId) return;
      if (!regexpMap.regexp_mobile.test(this.countInfo.bankCardMobile)) {
        this.$toast.text('请输入正确的手机号码');
        return;
      }
      const params = {
        mobile: this.countInfo.bankCardMobile,
        type: '102',
      };
      ajax
        .post('/sm/getCode', params, {
          headers: {
            'content-type': 'application/x-www-form-urlencoded',
          },
        })
        .then((res) => {
          if (res.code === 0) {
            this.$toast.text('验证码已发送');
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
    handleSubmit() {
      if (this.isReadonly) {
        this.isReadonly = false;
        this.countInfo.bankCardNo = this.countInfo.bankCardNoCopy;
        this.countInfo.bankCardMobile = this.countInfo.bankCardMobileCopy;
      } else {
        // 表单校验
        if (!this.countInfo.bankCardNo) {
          this.$toast.text('请输入银行卡号');
          return;
        }
        if (!this.countInfo.bankName) {
          this.$toast.text('请输入开户银行名称');
          return;
        }
        if (this.countInfo.branchBankName === '请输入') {
          this.$toast.text('请输入银行网点');
          return;
        }
        if (!this.countInfo.bankAddress) {
          this.$toast.text('请输入银行所在地');
          return;
        }
        if (!this.countInfo.bankCardMobile) {
          this.$toast.text('请输入预留手机号');
          return;
        }
        if (!regexpMap.regexp_mobile.test(this.countInfo.bankCardMobile)) {
          this.$toast.text('请输入正确的手机号码');
          return;
        }
        if (!this.countInfo.smCode) {
          this.$toast.text('请输入验证码');
          return;
        }
        if (!regexpMap.regexp_captcha.test(this.countInfo.smCode)) {
          this.$toast.text('请输入正确的验证码');
          return;
        }
        const info = {};
        for (const key in this.countInfo) {
          if (this.countInfo[key]) {
            info[key] = `${this.countInfo[key]}`.replace(/\s/g, '');
          }
        }
        const list = ['bankCardNo', 'bankName'];
        list.forEach((key) => {
          this.countInfo[key] = `${this.countInfo[key]}`.replace(/\s/g, '');
        });
        ajax
          .post('/debitCard/updateSettleCardAndPhotos', this.countInfo)
          .then((res) => {
            if (res.code === 0) {
              this.$toast.text('修改成功');
              this.isReadonly = true;
              const { bankCardNo, bankCardMobile } = this.bankInfo;
              this.countInfo.bankCardNoCopy = bankCardNo;
              this.countInfo.bankCardNo =
                bankCardNo.slice(0, 3) + '***********' + bankCardNo.slice(-4);
              this.countInfo.bankCardMobileCopy = bankCardMobile;
              this.countInfo.bankCardMobile =
                bankCardMobile.slice(0, 3) + '****' + bankCardMobile.slice(-4);
            } else {
              this.$toast.text(res.msg);
            }
          });
      }
    },
  },
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
.count_page {
  font-size: 14px;
  padding-top: 20px;
  .iinpu_ophne {
    background-color: #fff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #eee;
    .flexx1 {
      flex: 1;
      border: none;
    }
    .upload_item img {
      margin-left: 0;
    }
    // .phongg {
    //   display: block;
    //   width: 17px;
    //   margin-left: 20px;
    // }
  }
  .my_input {
    background-color: #fff;
    padding: 2px 20px;
    border-bottom: 1px solid #f7f7f7;
  }
  .my_input .nut-textinput-label {
    display: block;
    width: 100px;
    text-align: left;
  }
  .my_cell {
    background-image: none;
    padding: 0 20px;
    border-bottom: 1px solid #f7f7f7;
    .nut-cell-box {
      background-image: none;
      .nut-cell-left {
        width: 110px;
        flex: none;
      }
      .nut-cell-right {
        flex: 1;
        display: flex;
      }
      .nut-cell-desc {
        display: block;
        flex: 1;
        max-width: 210px;
        color: #000;
        font-size: 14px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        word-break: break-all;
      }
    }
  }
  .efwefwe .nut-textinput-clear {
    right: 20px;
  }
  .input_wrap {
    padding: 0 20px;
    height: 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #fff;
    .ggspan {
      width: 130px;
      color: #333333;
    }
    .gerginput {
      flex: 1;
      font-size: 14px;
      height: 40px;
      outline: none;
    }
    .triangle {
      width: 20px;
      height: 20px;
    }
    .smcode {
      border-radius: 4px;
      margin-left: 10px;
      width: 80px;
      height: 24px;
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 10px;
      color: #ffffff;
      background: #3574f2;
    }
  }
  .dkdkdkkdk {
    width: 100%;
    height: 100%;
  }
  .my_btn {
    margin: 40px auto 0;
    display: block;
    width: 60%;
    box-sizing: border-box;
    height: 40px;
    border-radius: 20px;
    font-size: 16px;
    color: #fff;
    border: none;
    background-color: #3375f2;
  }
}
</style>
