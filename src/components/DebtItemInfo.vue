<template>
  <div class="debt_info_item">
    <div class="my_flex my_cell">
      <div class="title">{{ info.name }}</div>
      <div class="title">实际年化利率{{ info.annualizedInterest }}</div>
    </div>
    <div class="my_flex my_cell h_66">
      <div class="content">
        <div class="text">借款本金 （元）</div>
        <div class="text text_more">
          {{ info.borrowMoney | toThousandsText }}
        </div>
      </div>
      <div class="content content_1">
        <div class="text">借款期限</div>
        <div class="text text_more">{{ info.repaymentCycle }}</div>
      </div>
      <div class="content">
        <div class="text">剩余还款期限</div>
        <div class="text text_more">{{ info.remainingRepaymentCycle }}</div>
      </div>
    </div>
    <div class="my_flex my_cell my_cell_last">
      <div class="color">
        每月还款：<span class="color1"
          >{{ info.periodMoney | toThousandsText }}元</span
        >
      </div>
      <button class="check_btn" @click.stop="handlCheckItem">
        查看
      </button>
    </div>
  </div>
</template>

<script>
import cache from '@/utils/cache';
export default {
  name: 'DebtDetail',
  props: {
    info: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  methods: {
    handlCheckItem() {
      cache.setSessionData('debt_info', this.info);
      this.$router.push('debt_detail');
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.debt_info_item {
  background-color: #fff;
  border-radius: 4px;
  padding: 0 10px;
  margin-bottom: 10px;
  color: #333333;
  font-size: 14px;
  .my_cell {
    height: 40px;
    padding: 0 6px;
    border-bottom: 1px solid #e2dede;
  }
  .h_66 {
    height: 66px;
  }
  .my_cell_last {
    border-bottom: none;
  }
  .content {
    flex: 3;
    font-size: 12px;
    color: #666666;
    text-align: center;
    .text {
      line-height: 1;
    }
    .text_more {
      padding-top: 13px;
      color: #fc992e;
    }
  }
  .color {
    color: #666666;
  }
  .color1 {
    color: #333333;
  }
  .content_1 {
    flex: 2;
    border-left: 1px solid #e2dede;
    border-right: 1px solid #e2dede;
  }
  .check_btn {
    padding: 0 15px;
    height: 24px;
    border-radius: 4px;
    background-color: #fb992f;
    font-size: 12px;
    color: #fff;
    border: none;
    border-radius: 3px;
  }
}
</style>
