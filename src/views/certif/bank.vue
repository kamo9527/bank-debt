<template>
  <div class="certif_bank">
    <div class="title">
      <img
        class="page_back"
        src="~@/assets/images/common/white_back@2x.png"
        @click="$router.go(-1)"
      />
      <span>开户行网点</span>
    </div>
    <div class="search_wrap">
      <img
        class="icon"
        src="~@/assets/images/certif/bank/search@2x.png"
        @click="$router.go(-1)"
      />
      <input type="text" placeholder="请输入关键词搜索" />
    </div>
    <ul class="search_list">
      <!-- <li v-for="i in 3" :key="i">中国建设银行北京新华支行</li> -->
      <li>无搜索结果！</li>
    </ul>
  </div>
</template>

<script>
// @ is an alias to /src
import ajax from '@/rest/ajax';
export default {
  name: 'certif_bank',
  data() {
    return {
      show: false,
    };
  },
  mounted() {
    // this.nextUrl = this.$route.query.next;
    this.getList();
  },
  methods: {
    getList() {
      const params = {
        bankName: '阳江',
      };
      ajax.post(`/bankBranch/search`, params).then((res) => {
        if (res.code === 0) {
          // this.$toast.text('成功获取验证码');
          // this.handleLoading();
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
.certif_bank {
  // height: 100vh;
  display: flex;
  align-items: center;
  flex-direction: column;
  background-color: #fff;
  padding-top: 63.5px;
  // padding-bottom: 28.5px;
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
    color: #ffffff;
    text-align: center;
    line-height: 1;
    z-index: 9;
    background: url('~@/assets/images/certif/bank/title_bg@2x.png') no-repeat;
    background-size: 100% 63.5px;
    box-sizing: border-box;
    .page_back {
      position: absolute;
      top: 36px;
      left: 15px;
      width: 8px;
      height: 14.5px;
      z-index: 9;
    }
  }
  .search_wrap {
    margin-top: 10px;
    width: 340px;
    height: 35px;
    display: flex;
    align-items: center;
    border: 0.5px solid #dbdbdb;
    border-radius: 2px;
    padding: 0 17.5px;
    box-sizing: border-box;
    .icon {
      margin-right: 14.5px;
      width: 20px;
      height: 20px;
      flex-shrink: 0;
    }
    input {
      height: 18px;
      width: 203.5px;
      outline: none;
      font-size: 14px;
    }
  }
  .search_list {
    margin-top: 10px;
    width: 340px;
    font-size: 13px;
    color: #333333;
    padding-left: 17.5px;
    box-sizing: border-box;
    li {
      height: 40px;
      line-height: 50px;
      border-bottom: 0.5px solid #dbdbdb;
    }
  }
}
</style>
