<template>
  <div class="page_w add_new_card">
    <div class="add_title">添加信用卡</div>
    <div class="basic_info">
      <div class="basic_info_tips">*请绑定您本人的信用卡</div>
      <div class="basic_info_title">用户名: {{ cardInfo.bankAccountName }}</div>
      <div class="basic_info_title">
        身份证号码：{{ cardInfo.identity.slice(0, 3) }}***********{{
          cardInfo.identity.slice(-4)
        }}
      </div>
    </div>
    <div class="operate_input">
      <div class="iinpu_ophne">
        <nut-textinput
          class="my_input flexx1"
          label="信用卡号"
          placeholder="请输入卡号或扫描信用卡"
          :hasBorder="false"
          @blur="onBlur"
          v-model="cardInfo.bankCardNo"
        />
        <sing-image-picker
          class="upload_item"
          :ismultiple="false"
          :showImage="false"
          max="1"
          @getImg="handleUpload"
        />
      </div>
      <nut-textinput
        class="my_input"
        label="所属银行"
        placeholder="请输入开户银行名称"
        :hasBorder="false"
        v-model="cardInfo.bankName"
      />
      <div @click="openSwitch">
        <nut-textinput
          class="my_input my_cellxxx"
          label="账单日"
          placeholder="请选择信用卡账单日"
          :hasBorder="false"
          :disabled="true"
          v-model="cardInfo.billDay"
        />
      </div>
      <nut-textinput
        class="my_input"
        label="预留手机号"
        placeholder="请输入银行预留手机号"
        maxlength="11"
        :hasBorder="false"
        v-model="cardInfo.bankCardMobile"
      />
    </div>
    <button @click="handleSubmit" class="my_btn">完成</button>
    <nut-picker
      :is-visible="isVisible"
      :list-data="listData"
      @close="closeSwitch"
      @confirm="saveValue"
    ></nut-picker>
  </div>
</template>

<script>
// @ is an alias to /src
import { regexpMap } from '@/utils/common';
import ajax from '@/rest/ajax';
import SingImagePicker from '@/components/SingImagePicker.vue';

const nums = [...Array(31).keys()];
nums.shift();
export default {
  name: 'addNewCardPage',
  components: {
    SingImagePicker,
  },
  data() {
    return {
      isVisible: false,
      listData: [nums],
      defaultValueData: [1],
      //  bankAccountName 姓名
      //  bankCardMobile 银行卡绑定手机号
      //  bankCardNo 银行卡号
      //  bankCode 银行简码
      //  bankName 银行名称
      //  billDay 账单日
      //  identity 身份证号
      //  merchantId
      cardInfo: {
        bankCardNo: '',
        bankName: '',
        billDay: '',
        bankCardMobile: '',
        bankAccountName: '',
        identity: '',
        merchantId: '',
        bankCode: '',
      },
    };
  },
  mounted() {
    ajax.post('/account/info', {}).then((res) => {
      if (res.code === 0) {
        const { merchantDebitQueryResult } = res.data;
        const {
          bankAccountName,
          identity,
          merchantId,
        } = merchantDebitQueryResult;
        this.cardInfo.identity = identity;
        this.cardInfo.bankAccountName = bankAccountName;
        this.cardInfo.merchantId = merchantId;
      } else {
        this.$toast.text(res.msg);
      }
    });
  },
  methods: {
    onBlur(e) {
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
            this.cardInfo.bankName = res.data.bank_name;
            this.cardInfo.bankCode = res.data.bank_code;
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
            this.cardInfo.bankCardNo = data.bankCardNo.replace(/\s/g, '');
            return this.cardInfo.bankCardNo;
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
                this.cardInfo.bankName = res.data.bank_name;
                this.cardInfo.bankCode = res.data.bank_code;
              } else {
                this.$toast.text(res.message);
              }
            });
        });
    },
    closeSwitch() {
      this.isVisible = false;
    },
    openSwitch() {
      this.isVisible = true;
    },
    saveValue(value) {
      this.cardInfo.billDay = value[0] + '';
    },
    handleSubmit() {
      if (!this.cardInfo.bankCardNo) {
        this.$toast.text('请输入卡号或扫描信用卡');
        return;
      }
      if (!this.cardInfo.bankName) {
        this.$toast.text('请输入开户银行名称');
        return;
      }
      if (!this.cardInfo.billDay) {
        this.$toast.text('请选择信用卡账单日');
        return;
      }
      if (!this.cardInfo.bankCardMobile) {
        this.$toast.text('请输入银行预留手机号');
        return;
      }
      if (!regexpMap.regexp_mobile.test(this.cardInfo.bankCardMobile)) {
        this.$toast.text('请输入正确的手机号码');
        return;
      }
      const list = ['bankCardNo', 'bankName', 'bankCardMobile'];
      list.forEach((key) => {
        this.cardInfo[key] = `${this.cardInfo[key]}`.replace(/\s/g, '');
      });
      ajax.post('/account/bind', this.cardInfo).then((res) => {
        if (res.code === 0) {
          this.$toast.text('添加成功');
          this.$router.go(-1);
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
.add_new_card {
  background-color: #fff;
  .add_title {
    background-color: #5083f5;
    height: 60px;
    line-height: 60px;
    padding: 20px 0 40px;
    text-align: center;
    color: #fff;
    font-size: 18px;
  }
  .basic_info {
    margin: -40px 20px 0;
    padding: 20px 20px 15px;
    background: url('~@/assets/images/personInfo/add_car@2x.png') center
      no-repeat;
    background-size: cover;
    &_tips {
      line-height: 30px;
      font-size: 12px;
      color: #e12a2a;
    }
    &_title {
      font-size: 14px;
      line-height: 30px;
    }
  }
  .operate_input {
    box-sizing: border-box;
    padding: 20px 25px;
    font-size: 14px;
    .my_input {
      border-bottom: 1px solid #eee;
    }
    .my_input .nut-textinput-label {
      width: 80px;
    }
    .my_input input {
      height: 46px;
      background-color: #fff;
    }
    .my_cellxxx {
      position: relative;
    }
    .nut-textinput-disabled input {
      color: #000 !important;
      opacity: 1;
    }
    .my_cellxxx ::after {
      content: '';
      position: absolute;
      right: 0;
      top: 15px;
      display: block;
      width: 16px;
      height: 9px;
      background: url('~@/assets/images/personInfo/picker_icon@2x.png') center
        no-repeat;
      background-size: cover;
    }
    .iinpu_ophne {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #eee;
      .flexx1 {
        flex: 1;
        border: none;
      }
      // .upload_item {
      //   width: 40px;
      //   height: 40px;
      // }
      // .phongg {
      //   display: block;
      //   width: 17px;
      //   margin-left: 20px;
      // }
    }
  }
  .my_btn {
    margin: 20px auto 0;
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
