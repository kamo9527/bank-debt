<template>
  <section class="page_w succuss_page">
    <img
      class="hrhrthrh"
      v-if="isOk === '2'"
      src="~@/assets/images/personInfo/ok_icon@2x.png"
      alt=""
    />
    <img
      class="hrhrthrh"
      v-if="isOk !== '2'"
      src="~@/assets/images/personInfo/fuck_icon@2x.png"
      alt=""
    />
    <div class="gtthh">{{ isOk === '2' ? '交易成功' : '交易失败' }}</div>
    <button @click="handleSubmit" class="my_btn">
      {{ isOk === '2' ? '完成' : '重新交易' }}
    </button>
  </section>
</template>

<script>
// @ is an alias to /src
// import cache from '@/utils/cache';
export default {
  name: 'cardSuccussPage',
  data() {
    return {
      isOk: '0',
    };
  },
  mounted() {
    this.isOk = this.$route.query.isOk + '';
  },
  methods: {
    handleSubmit() {
      this.$router.go(-2);
    },
  },
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
.succuss_page {
  .hrhrthrh {
    margin: 40px auto;
    display: block;
    width: 110px;
  }
  .gtthh {
    text-align: center;
    font-size: 19px;
    color: #333;
    padding: 10px 0;
  }
  .my_btn {
    margin: 20px auto 0;
    display: block;
    width: 60%;
    box-sizing: border-box;
    height: 40px;
    border-radius: 8px;
    font-size: 16px;
    color: #fff;
    border: none;
    background-color: #3375f2;
  }
}
</style>
