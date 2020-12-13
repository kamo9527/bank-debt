<template>
  <div class="payback_detail">
    <div class="title">
      <img
        class="page_back"
        src="~@/assets/images/common/black_back@2x.png"
        @click="$router.go(-1)"
      />
      <span>还款详情</span>
    </div>
    <div class="card">
      <div class="head">
        <span class="left">
          <img
            class="bank_icon"
            src="~@/assets/images/common/white_back@2x.png"
          />
          <span>
            <p class="bank_name">广东发展银行</p>
            <p class="bank_no">尾号:6587</p>
          </span>
        </span>
        <span class="lable">分期还款终止</span>
      </div>
      <div class="process">
        <nut-circleprogress
          progress="10"
          :is-auto="true"
          :progress-option="{
            radius: 56,
            backColor: '#f0f0f0',
            progressColor: 'red',
          }"
        >
          <div class="inner">
            <p>已还款</p>
            <p>0.00</p>
            <p>0/0期</p>
          </div>
        </nut-circleprogress>
      </div>
      <div class="footer">
        <span>
          <p class="desc">完成还款时间</p>
          <p>2020-04-15</p>
        </span>
        <span>
          <p class="desc">还款总额</p>
          <p>10000.00</p>
        </span>
        <span>
          <p class="desc">手续费</p>
          <p>50元</p>
        </span>
      </div>
    </div>
    <ul class="list">
      <li class="item" v-for="i in 4" :key="i">
        <div class="line1">
          <span class="lable">第一期</span>
        </div>
        <div class="line2">
          <div class="left">
            <span>2020-05-08</span>
            <span>11:49</span>
            <span>消费:990</span>
          </div>
          <span class="right">扣款中</span>
        </div>
      </li>
    </ul>
    <div class="mock-bottom"></div>
    <div class="btn-wrap">
      <span class="btn">终止计划</span>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
export default {
  name: 'payback_detail',
  data() {
    return {
      show: false,
      detail: {
        bankCardNo: '',
        bankCode: '',
        bankName: '',
        cardBalance: '',
        createTime: '',
        detailList: [
          {
            payAmount: '',
            payStatus: 0,
            payTime: '',
            period: 0,
            repayAmount: '',
            repayStatus: 0,
            repayTime: '',
            taskTime: '',
          },
        ],
        finishInsteadAmount: '',
        finishPeriodCount: 0,
        finishTime: '',
        insteadAmount: '',
        periodCount: 0,
        status: 0,
        statusDesc: '',
        taskId: 0,
        totalFee: '',
      },
    };
  },
  mounted() {
    const detail = this.$route.params.detail;
    this.detail = JSON.parse(detail);
  },
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
.payback_detail {
  height: 100vh;
  display: flex;
  align-items: center;
  flex-direction: column;
  background-color: #f2f2f2;
  padding: 63.5px 15px 0;
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
  .card {
    margin-top: 10px;
    width: 375px;
    height: 260px;
    padding-top: 15px;
    background: #fff;
    .head {
      width: 100%;
      padding: 0 37.5px 0 26px;
      display: flex;
      justify-content: space-between;
      font-size: 15px;
      color: #333333;
      box-sizing: border-box;
      .left {
        display: flex;
        .bank_icon {
          margin-right: 11px;
          width: 28px;
          height: 24px;
          background: #ff0;
        }
        .bank_name {
          font-size: 15px;
          color: #333333;
        }
        .bank_no {
          margin-top: 14.5px;
          font-size: 12px;
          color: #999999;
        }
      }
      .lable {
        font-size: 15px;
        color: #4574f2;
      }
    }
    .process {
      margin-top: 10px;
      display: flex;
      justify-content: center;
      .inner {
        text-align: center;
        p:nth-child(1) {
          font-size: 12px;
          color: #666666;
        }
        p:nth-child(2) {
          font-size: 18px;
          font-weight: bold;
          color: #333333;
        }
        p:nth-child(3) {
          font-size: 12px;
          color: #3574f2;
        }
      }
    }
    .footer {
      margin-top: 5px;
      display: flex;
      align-items: center;
      font-size: 15px;
      color: #333333;
      .desc {
        margin-bottom: 10px;
        font-size: 12px;
        color: #666666;
      }
      span {
        font-size: 15px;
        color: #3574f2;
        text-align: center;
      }
      span:nth-child(1) {
        margin-left: 55px;
        width: 125.5px;
      }
      span:nth-child(2) {
        width: 54px;
      }
      span:nth-child(3) {
        width: 74px;
      }
    }
  }
  .list {
    .item {
      margin-top: 11px;
      width: 375px;
      height: 85px;
      box-sizing: border-box;
      padding-left: 37.5px;
      background: #fff;
      .line1 {
        padding-top: 7px;
        .lable {
          width: 51px;
          height: 22.5px;
          font-size: 13px;
          color: #ffffff;
          background: #3574f2;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }
      .line2 {
        margin-top: 4.5px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 13px;
        color: #333333;
        box-sizing: border-box;
        padding-right: 49px;
        .left {
          display: flex;
          align-items: center;
          span:nth-child(1) {
            width: 103px;
          }
          span:nth-child(2) {
            width: 62px;
          }
          span:nth-child(3) {
            width: 80px;
          }
        }
        .right {
          color: #d51523;
        }
      }
    }
  }
  .mock-bottom {
    width: 100%;
    height: 91px;
    flex-shrink: 0;
  }
  .btn-wrap {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 81px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #ffffff;
    .btn {
      width: 242.5px;
      height: 41px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      font-weight: bold;
      color: #ffffff;
      background: url('~@/assets/images/login/login/btn_bg@2x.png') no-repeat;
      background-size: 100% 100%;
    }
  }
}
</style>
