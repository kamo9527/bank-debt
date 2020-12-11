<template>
  <section class="page_w collection_page">
    <div class="collection_title">无卡收款</div>
    <div class="mony_info">
      <div class="mony_info_title">请输入收款金额(元）</div>
      <nut-textinput
        class="mony_info_input"
        placeholder="0.00"
        :hasBorder="false"
        v-model="cardInfo.money"
      />
    </div>
    <div class="form_info">
      <nut-cell
        class="my_cell"
        :show-icon="true"
        title="支付卡"
        desc="民生银行 | 尾号4510"
        @click-cell="cellClick"
      />
      <nut-cell class="my_cell" title="收款账户" desc="民生银行 | 尾号4510" />
      <nut-cell class="my_cell" title="到帐金额" desc="0.00 元" />
      <nut-cell class="my_cell" title="到账方式" desc="实时到账" />
    </div>
    <div class="xxx_cell">*费率0.63%+3；交易时间00:00-23:00</div>
    <button @click="handleSubmit" class="my_btn">
      下一步
    </button>
  </section>
</template>

<script>
// @ is an alias to /src
// import ajax from '@/rest/ajax';
export default {
  name: 'cardCollectionPage',
  data() {
    return {
      cardInfo: {
        money: '',
      },
    };
  },
  mounted() {},
  methods: {
    handleSubmit() {
      console.log(12123);
    },
    cellClick() {
      this.$router.push('/card_select');
    },
  },
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
.collection_page {
  .collection_title {
    text-align: center;
    padding: 20px 0 40px;
    font-size: 18px;
    background-color: #3375f2;
    color: #fff;
  }
  .mony_info {
    margin-top: -20px;
    background-color: #fff;
    border-radius: 20px 20px 0 0;
    padding: 20px 35px 10px;
    margin-bottom: 6px;
    &_title {
      font-size: 13px;
      color: #333;
    }
  }
  .mony_info_input {
    input {
      font-size: 24px;
      // height: 36px;
      padding-left: 30px;
      padding-right: 40px;
      background: url('~@/assets/images/personInfo/yuan_icon@2x.png') no-repeat
        3px center;
      background-size: 15px 18px;
    }
    .nut-textinput-clear {
      right: 15px;
    }
  }
  .form_info {
    font-size: 13px;
  }
  .my_cell {
    margin-bottom: 6px;
    padding: 0 35px;
    background-image: none;
  }
  .my_cell .nut-cell-box {
    background-image: none;
  }
  .egergerg {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .xx_input {
    flex: 1;
    margin-bottom: 6px;
    padding: 0 35px;
    background-color: #fff;
  }
  .xxx_cell {
    padding: 10px 35px;
    font-size: 12px;
    color: #d51523;
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
