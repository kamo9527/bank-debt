<template>
  <div class="payback_result">
    <div class="title">
      <img
        class="page_back"
        src="~@/assets/images/common/black_back@2x.png"
        @click="$router.go(-1)"
      />
      <span>我要还款</span>
    </div>
    <img class="icon" src="~@/assets/images/payback/emoji@2x.png" alt />
    <span class="tips">终止计划成功</span>
    <div class="btn index">去首页</div>
    <div class="btn rebuild">重新创建</div>
  </div>
</template>

<script>
// @ is an alias to /src
export default {
  name: 'payback_list',
  data() {
    return {
      show: false,
    };
  },
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
.payback_result {
  height: 100vh;
  display: flex;
  align-items: center;
  flex-direction: column;
  background-color: #fff;
  padding: 63.5px 15px 0;
  box-sizing: border-box;
  .title {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 63.5px;
    padding-top: 33.5px;
    overflow: hidden;
    font-size: 18px;
    color: #333333;
    text-align: center;
    line-height: 1;
    z-index: 9;
    background: #fff;
    box-sizing: border-box;
    .page_back {
      position: absolute;
      top: 36px;
      left: 15px;
      width: 8px;
      height: 14.5px;
      z-index: 10;
    }
  }
  .icon {
    margin-top: 37.5px;
    width: 107px;
    height: 107px;
  }
  .tips {
    margin-top: 30px;
    font-size: 19px;
    color: #333333;
  }
  .btn {
    margin-top: 42px;
    width: 235px;
    height: 35px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    background: #4982f3;
    color: #ffffff;
    border-radius: 8px;
    border: 1px solid #4982f3;
    &.rebuild {
      margin-top: 7.5px;
      background: #ffffff;
      color: #4982f3;
    }
  }
}
</style>
