<template>
  <div class="page_w agreement">
    <div class="page_title">服务委托协议书</div>
    <div class="pd_15">
      <div class="agreement_info">
        <p class="agreement_item title">
          受托人：深圳市创享商务信息咨询有限公司
        </p>
        <p class="agreement_item">
          委托人现委托上述受托人在委托人与 (债权人/平台 及贷款产品类型)贷款事
        </p>
        <p class="agreement_item">
          代理人权限包括代委托人了解贷款产品详细信息(包括但
          不限于贷款产品的现时债权人、贷款本金、贷款利率、
          贷款期限等)、贷款发放及
        </p>
        <p class="agreement_item">
          上述委托有效期自本授权委托书签名之日起至上述委托
          事务办理完毕止，上述委托不可撤销。上述受托人在期
          代理权限范围内及委托有效期
        </p>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
// import { postClient } from '@/rest/goods'
// import XCell from '@/components/Cell.vue';
export default {
  name: 'Agreement3',
  data() {
    return {};
  },
  methods: {},
};
</script>
<style scope lang="less">
.agreement {
  .agreement_info {
    margin-top: -40px;
    padding: 15px 10px 0;
    background-color: #fff;
    font-size: 12px;
    border-radius: 4px;

    .agreement_item {
      line-height: 19px;
      padding-bottom: 10px;
      text-align: left;
    }
    .title {
      color: #0e0e0e;
      padding-bottom: 0;
    }
  }
}
</style>
