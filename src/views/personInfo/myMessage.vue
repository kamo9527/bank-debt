<template>
  <section class="page_w my_message">
    <collapse v-model="activeNames" :accordion="true">
      <collapse-item
        title="京东“厂直优品计划”首推“政府优品馆” 3年覆盖80%镇级政府"
        subTitle="12:30"
        :name="1"
      >
      </collapse-item>
      <collapse-item
        title="京东到家：教师节期间 创意花束销量增长53倍节期间 创意花束销量节期间 创意花束销量节期间 创意花束销量节期间 创意花束销量"
        subTitle="12:30"
        :name="2"
      >
      </collapse-item>
      <collapse-item
        title="京东不回家：教师节期间 创意花束销量增长53倍节期间 创意花束销量节期间 创意花束销量节期间 创意花束销量节期间 创意花束销量"
        subTitle="昨天"
        :name="3"
      >
      </collapse-item>
    </collapse>
  </section>
</template>

<script>
// @ is an alias to /src
import cache from '@/utils/cache';
import ajax from '@/rest/ajax';
import Collapse from '@/components/Collapse.vue';
import CollapseItem from '@/components/CollapseItem.vue';
export default {
  name: 'myMessagePage',
  components: {
    Collapse,
    CollapseItem,
  },
  data() {
    return {
      activeNames: 1,
    };
  },
  mounted() {
    const sessionData = cache.getSessionData('new_debt_data');
    if (sessionData) {
      this.newDebtData = sessionData;
    }
    ajax.get('/repay/confirmSm').then(res => {
      console.log(res);
    });
  },
  methods: {
    tabSwitch(index, event) {
      console.log(index + '--' + event);
    },
    changeTips(index) {
      this.isTip = index;
    },
    tabSwitch3(value, index) {
      console.log(index);
    },
  },
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
.my_message {
  .fee_title {
    font-size: 14px;
    color: #3574f2;
    padding: 15px;
  }
  .my_fee {
    display: flex;
    justify-content: space-between;
    align-items: center;
    text-align: center;
    font-size: 14px;
    color: #666;
    background-color: #fff;
  }
  .fee_item {
    flex: 1;
    height: 45px;
    line-height: 45px;
    box-sizing: border-box;
    border-right: 1px solid #f7f7f7;
    border-bottom: 1px solid #f7f7f7;
  }
}
</style>
