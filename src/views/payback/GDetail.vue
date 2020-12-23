<template>
  <div class="payback_GDetail">
    <!-- <div class="title">
      <img
        class="page_back"
        src="~@/assets/images/common/black_back@2x.png"
        @click="$router.go(-1)"
      />
      <span>代还款确认（G入口）</span>
    </div> -->
    <div class="card">
      <div class="head">
        <img class="bank_icon" :src="item.bankCode | getBankLogo" />
        <p class="bank_name">{{ item.bankName }}</p>
        <p class="bank_no">尾号:{{ item.bankCardNo.slice(-4) }}</p>
      </div>
      <div class="process">
        <div class="line">
          <div class="left">
            <span>还款总额</span>
            <span>{{ item.insteadAmount }}元</span>
          </div>
          <div class="right">
            <span>分期次数</span>
            <span>{{ item.periodCount }}期</span>
          </div>
        </div>
        <div class="line line2">
          <div class="left">
            <span>信用卡余额</span>
            <span>{{ item.cardBalance }}元</span>
          </div>
          <div class="right">
            <span>手续费</span>
            <span>{{ item.totalFee }}元</span>
          </div>
        </div>
      </div>
    </div>
    <div class="detail">每期还款详情</div>
    <ul class="list">
      <li class="item" v-for="(detail, index) in item.detailList" :key="index">
        <div class="line1">
          <span class="lable">第{{ detail.period }}期</span>
        </div>
        <div class="line2">
          <div class="left">
            <span>{{ detail.taskTime }}</span>
            <span>{{ detail.payTime }}</span>
            <span>消费:{{ detail.payAmount }}</span>
          </div>
          <!-- <span class="rightx">{{ statusInfo[detail.payStatus] }}</span> -->
          <span class="rightx">等待</span>
        </div>
        <div class="line3">
          <div class="left">
            <span></span>
            <span>{{ detail.repayTime }}</span>
            <span>还款:{{ detail.repayAmount }}</span>
          </div>
          <!-- <span class="rightx">{{ statusInfo[detail.repayStatus] }}</span> -->
          <span class="rightx">等待</span>
        </div>
      </li>
    </ul>

    <template v-if="!isConfirm">
      <div class="mock-bottom"></div>
      <div class="btn-wrap">
        <span class="btn" @click="createPlan">确认分期</span>
      </div>
    </template>
  </div>
</template>

<script>
// @ is an alias to /src
import { formatTime } from '@/utils/common';
import ajax from '@/rest/ajax';

export default {
  name: 'payback_GDetail',
  data() {
    return {
      statusInfo: {
        0: '待执行',
        1: '执行中',
        2: '执行成功',
        3: '执行失败',
      },
      isConfirm: false,
      item: {
        bankCardNo: '',
        bankCode: '',
        bankName: '',
        cardBalance: '',
        createTime: '',
        detailList: [
          {
            payAmount: '111',
            payStatus: 0,
            payTime: new Date(),
            period: 0,
            repayAmount: '222',
            repayStatus: 0,
            repayTime: new Date(),
            taskTime: '33',
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
    // this.initData();
    this.taskId = this.$route.query.taskId;
    this.getTaskById();
  },
  methods: {
    initData() {
      const itemStr = localStorage.getItem('paybackDetail') || '';
      if (!itemStr) return;
      const item = JSON.parse(itemStr);

      item.detailList.forEach((item) => {
        const payTime = formatTime(
          new Date(item.payTime),
          'yyyy-MM-dd hh:mm'
        ).split(' ');
        const repayTime = formatTime(
          new Date(item.repayTime),
          'yyyy-MM-dd hh:mm'
        ).split(' ');

        item.displayPayDate = payTime[0];
        item.displayPayTime = payTime[1];
        item.displayRepayDate = repayTime[0];
        item.displayRepayTime = repayTime[1];

        item.payStatusStr =
          item.payStatus == 0
            ? '待执行'
            : item.payStatus == 1
              ? '扣款中'
              : item.payStatus == 2
                ? '成功'
                : item.payStatus == 3 ? '失败' : '';

        item.repayStatusStr =
          item.repayStatus == 0
            ? '待执行'
            : item.repayStatus == 1
              ? '还款中'
              : item.repayStatus == 2
                ? '成功'
                : item.repayStatus == 3 ? '失败' : '';
      });
      this.item = item;
    },
    getTaskById() {
      const params = {
        taskId: this.taskId,
      };
      ajax
        .post('/repay/getTaskById', params, {
          headers: {
            'content-type': 'application/x-www-form-urlencoded',
          },
        })
        .then((res) => {
          if (res.code === 0) {
            res.data.detailList.forEach((item) => {
              const payTime = formatTime(
                new Date(item.payTime),
                'yyyy-MM-dd hh:mm'
              ).split(' ');
              const repayTime = formatTime(
                new Date(item.repayTime),
                'yyyy-MM-dd hh:mm'
              ).split(' ');

              item.displayPayDate = payTime[0];
              item.displayPayTime = payTime[1];
              item.displayRepayDate = repayTime[0];
              item.displayRepayTime = repayTime[1];

              item.payStatusStr =
                item.payStatus == 0
                  ? '待执行'
                  : item.payStatus == 1
                    ? '扣款中'
                    : item.payStatus == 2
                      ? '成功'
                      : item.payStatus == 3 ? '失败' : '';

              item.repayStatusStr =
                item.repayStatus == 0
                  ? '待执行'
                  : item.repayStatus == 1
                    ? '还款中'
                    : item.repayStatus == 2
                      ? '成功'
                      : item.repayStatus == 3 ? '失败' : '';
            });
            this.item = res.data;
          } else {
            this.$toast.text(res.msg);
          }
        });
    },
    createPlan() {
      const _this = this;
      this.$dialog({
        id: 'my-dialogxxx',
        title: '提示',
        content: '确定开始该计划吗？',
        cancelBtnTxt: '再考虑一下',
        okBtnTxt: '确定开始',
        onOkBtn() {
          const __this = this;
          const params = {
            taskId: _this.taskId,
          };
          ajax.post('/repay/confirmPlan', params).then((res) => {
            if (res.code === 0) {
              __this.close(); //关闭对话框
              // _this.$toast.text('确认成功');
              _this.isConfirm = true;
              _this.$router.push({
                path: '/payback_detail',
                query: {
                  taskId: _this.taskId,
                  isRefundPack: 1,
                },
              });
              // this.list = res.data;
            } else {
              _this.$toast.text(res.msg);
            }
          });
        },
        onCancelBtn(event) {
          console.log(event);
        },
      });
    },
  },
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
.payback_GDetail {
  height: 100vh;
  display: flex;
  align-items: center;
  flex-direction: column;
  background-color: #f2f2f2;
  padding: 0px 15px 0;
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
    height: 131.5px;
    padding-top: 15px;
    background: #fff;
    .head {
      width: 100%;
      padding: 0 13.5px 0 26px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 15px;
      color: #333333;
      box-sizing: border-box;
      line-height: 1;
      .bank_icon {
        width: 28px;
        height: 24px;
      }
      .bank_name {
        margin-left: 11px;
        margin-right: 10px;
        font-size: 15px;
        color: #333333;
      }
      .bank_no {
        font-size: 12px;
        color: #999999;
      }
      // .left {
      //   display: flex;
      //   line-height: 1;
      // }
      .lable {
        font-size: 15px;
        color: #4574f2;
      }
    }
    .process {
      margin-top: 25px;
      line-height: 1;
      font-size: 13px;
      color: #333333;
      padding-left: 37px;
      box-sizing: border-box;
      .line {
        display: flex;
        align-content: center;
        .left {
          width: 190px;
          display: flex;
          align-content: center;
          span:nth-child(1) {
            width: 92px;
          }
        }
        .right {
          display: flex;
          align-content: center;
          span:nth-child(1) {
            width: 78px;
          }
        }
      }
      .line2 {
        margin-top: 20px;
      }
    }
  }
  .detail {
    margin-top: 7px;
    margin-bottom: 7px;
    height: 35px;
    width: 375px;
    padding-left: 37px;
    box-sizing: border-box;
    line-height: 35px;
    font-size: 13px;
    color: #333333;
    background: #fff;
  }
  .list {
    .item {
      width: 375px;
      height: 85px;
      box-sizing: border-box;
      padding-left: 37.5px;
      background: #fff;
      &:not(:first-child) {
        margin-top: 5px;
      }
      .line1 {
        padding-top: 7px;
        line-height: 1;
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
        position: relative;
        margin-top: 4.5px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 13px;
        color: #333333;
        box-sizing: border-box;
        padding-right: 49px;
        line-height: 1;
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
          position: absolute;
          right: 49px;
          top: 50%;
          transform: translateY(-50%);
          width: 30px;
          height: 30px;
          border-radius: 50%;
          color: #fff;
          background: #a3a3a3;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }
      .line3 {
        position: relative;
        left: 10px;
        margin-top: 16.5px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 13px;
        color: #333333;
        box-sizing: border-box;
        padding-right: 49px;
        line-height: 1;
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
          color: #999999;
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
