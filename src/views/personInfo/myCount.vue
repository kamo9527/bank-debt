<template>
  <section class="page_w count_page">
    <nut-textinput
      class="my_input"
      label="银行卡号"
      placeholder="请输入"
      :hasBorder="false"
      v-model="countInfo.bankCardNo"
    />
    <nut-textinput
      class="my_input"
      label="开户名"
      placeholder="请输入"
      :hasBorder="false"
      v-model="countInfo.bankName"
    />
    <nut-textinput
      class="my_input"
      label="银行所在地"
      placeholder="请输入"
      :hasBorder="false"
      v-model="countInfo.bankAddress"
    />
    <nut-cell
      class="my_cell"
      :show-icon="true"
      title="银行网点"
      :desc="countInfo.branchBankName"
      @click.native="cellClick"
    />
    <nut-cell
      class="my_cell"
      :show-icon="true"
      title="选择常住地："
      :desc="cityCustmer"
      @click.native="openAddressSwitch"
    />
    <nut-textinput
      class="my_input"
      label="预留手机号"
      placeholder="请输入"
      :hasBorder="false"
      v-model="countInfo.bankCardMobile"
    />

    <div class="input_wrap">
      <span class="ggspan">验证码</span>
      <input
        class="gerginput"
        type="text"
        placeholder="请输入验证码"
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
    <button @click="handleSubmit" class="my_btn">修改结算卡</button>
  </section>
</template>

<script>
// @ is an alias to /src
import { regexpMap } from '@/utils/common';
import ajax from '@/rest/ajax';
import bank from '../certif/bank';

export default {
  name: 'myCountPage',
  components: {
    bank,
  },
  data() {
    return {
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
        bankCardNo: '',
        bankName: '',
        branchBankName: '请选择',
        bankAddress: '',
        bankCardMobile: '',
        smCode: '',
        workProvinceName: '',
        workCityName: '',
      },
      bankInfo: {},
      bankPickerVisible: false,
    };
  },
  mounted() {
    ajax.post('/account/info', {}).then((res) => {
      if (res.code === 0) {
        const { merchantDebitQueryResult, merchantInfoQueryResult } = res.data;
        const { bankCardNo } = merchantDebitQueryResult;
        merchantDebitQueryResult.bankCardNo =
          bankCardNo.slice(0, 3) + '***********' + bankCardNo.slice(-4);
        this.countInfo = merchantDebitQueryResult;
        this.countInfo.merchantId = merchantInfoQueryResult.merchantId;
        this.countInfo.workProvinceName = merchantInfoQueryResult.provinceName;
        this.countInfo.workCityName = merchantInfoQueryResult.cityName;
        this.cityCustmer =
          merchantInfoQueryResult.provinceName +
          merchantInfoQueryResult.cityName;
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
    openAddressSwitch() {
      this.addressVisible = true;
    },
    closeSwitch() {
      this.addressVisible = false;
    },
    setChooseValueCustmer(chooseData) {
      let str = chooseData.map((item) => item.value).join('-');
      this.cityCustmer = str;
      this.countInfo.workProvinceName = chooseData[0].bank_area;
      this.countInfo.workCityName = chooseData[1].bank_city;
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
      if (!this.countInfo.bankName) {
        this.$toast.text('请选择开户城市');
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
      // if (this.isReadonly) {
      //   const _this = this;
      //   this.$dialog({
      //     title: '温馨提示',
      //     content: '确定要修改收款账号信息么？',
      //     onOkBtn() {
      //       //确定按钮点击事件
      //       _this.isReadonly = false;
      //       _this.countInfo.bankCardNo = _this.countInfo.bankCardNoCopy;
      //       _this.countInfo.bankCardMobile = _this.countInfo.bankCardMobileCopy;
      //       this.close(); //关闭对话框
      //     },
      //     onCancelBtn(event) {
      //       console.log(event);
      //       //取消按钮点击事件，默认行为关闭对话框
      //       //return false;  //阻止默认“关闭对话框”的行为
      //     },
      //   });
      // } else {
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
      const list = ['bankCardNo', 'bankName', 'bankAddress'];
      list.forEach((key) => {
        this.countInfo[key] = `${this.countInfo[key]}`.replace(/\s/g, '');
      });
      ajax
        .post('/debitCard/updateSettleCardAndPhotos', this.countInfo)
        .then((res) => {
          if (res.code === 0) {
            this.$toast.text('修改成功');
            const { bankCardNo } = this.bankInfo;
            this.bankInfo.bankCardNo =
              bankCardNo.slice(0, 3) + '***********' + bankCardNo.slice(-4);
          } else {
            this.$toast.text(res.msg);
          }
        });
    },
  },
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
.count_page {
  font-size: 14px;
  padding-top: 20px;
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
    }
    .nut-cell-desc {
      display: inline-block;
      max-width: 230px;
      color: #000;
      font-size: 14px;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      word-break: break-all;
    }
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
