<template>
  <section class="page_w success_tips">
    <div class="page_title">提交成功</div>
    <div class="pd_15">
      <div class="success_info">
        <img
          class="success_icon"
          src="../assets/images/success_icon@2x.png"
          alt=""
        />
        <div class="success_tips">
          您的负债信息已提交成功，理财顾问将于1-2个工作
          日子与您联系，给您提出降低负债的专业建议，请保 持电话畅通。
        </div>
        <button @click="clickHandler" class="go_btn my_btn_active">
          返回
        </button>
      </div>
    </div>
  </section>
</template>

<script>
// @ is an alias to /src
// import { postClient } from '@/rest/goods'
// import XCell from '@/components/Cell.vue';
export default {
  name: 'Success',
  data() {
    return {};
  },
  methods: {
    clickHandler() {
      this.$router.push('home');
    },
  },
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scope lang="less">
.success_tips {
  .success_info {
    background-color: #fff;
    padding: 25px 44px 40px;
    font-size: 14px;
    border-radius: 4px;
    margin-top: -40px;
  }
  .success_icon {
    display: block;
    width: 70px;
    height: 70px;
    margin: 0 auto;
    padding-top: 15px;
  }
  .success_tips {
    color: #666666;
    font-size: 12px;
    line-height: 18px;
    text-align: left;
    padding: 25px 0 30px;
  }
  .go_btn {
    margin: 0 auto;
    width: 150px;
    height: 40px;
    line-height: 40px;
    font-size: 16px;
    border-radius: 4px;
    border: 1px solid #fad09d;
  }
}
</style>
