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
    <nut-textinput
      class="my_input"
      label="银行网点"
      placeholder="请输入"
      :hasBorder="false"
      v-model="countInfo.alliedBankCode"
    />
    <nut-textinput
      class="my_input"
      label="预留手机号"
      placeholder="请输入"
      :hasBorder="false"
      v-model="countInfo.bankCardMobile"
    />
    <button @click="handleSubmit" class="my_btn">
      修改结算卡
    </button>
  </section>
</template>

<script>
// @ is an alias to /src
import ajax from '@/rest/ajax';
export default {
  name: 'myFeePage',
  data() {
    return {
      countInfo: {
        bankCardNo: '',
        bankName: '',
        alliedBankCode: '',
        bankAddress: '',
        bankCardMobile: '',
      },
      isCreditVerified: false,
    };
  },
  mounted() {
    ajax.post('/account/info', {}).then(res => {
      if (res.code === 0) {
        const { isCreditVerified, merchantDebitQueryResult } = res.data;
        this.isCreditVerified = isCreditVerified;
        if (merchantDebitQueryResult) {
          this.countInfo = merchantDebitQueryResult;
        } else {
          this.$toast.text('银行卡未认证');
        }
      } else {
        this.$toast.text(res.msg);
      }
    });
  },
  methods: {
    handleSubmit() {
      if (!this.isCreditVerified) {
        this.$toast.text('银行卡未认证');
        return;
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
