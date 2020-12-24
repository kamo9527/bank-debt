<template>
  <div class="payback_detail">
    <!-- <div class="title">
      <img
        class="page_back"
        src="~@/assets/images/common/black_back@2x.png"
        @click="$router.go(-1)"
      />
      <span>还款详情</span>
    </div> -->
    <div class="card">
      <div class="head">
        <span class="left">
          <img class="bank_icon" :src="item.bankCode | getBankLogo" />
          <span>
            <p class="bank_name">{{ item.bankName }}</p>
            <p class="bank_no">尾号:{{ item.bankCardNo.slice(-4) }}</p>
          </span>
        </span>
        <span class="lable">{{ item.statusDesc }}</span>
        <!-- <span class="lable">{{
          item.status == 0
            ? '待执行'
            : item.status == 1
            ? '分期还款中'
            : item.status == 2
            ? '执行成功'
            : '手动终止计划'
        }}</span> -->
      </div>
      <div class="process">
        <nut-circleprogress
          :progress="(item.finishPeriodCount / item.periodCount) * 100"
          :is-auto="true"
          :progress-option="{
            radius: 56,
            backColor: '#f0f0f0',
            progressColor: 'red',
          }"
        >
          <div class="inner">
            <p>已还款</p>
            <p>{{ item.finishInsteadAmount }}</p>
            <p>{{ item.finishPeriodCount }}/{{ item.periodCount }}期</p>
          </div>
        </nut-circleprogress>
      </div>
      <div class="footer">
        <span>
          <p class="desc">完成还款时间</p>
          <p>{{ item.finishTime }}</p>
        </span>
        <span>
          <p class="desc">还款总额</p>
          <p>{{ item.insteadAmount }}</p>
        </span>
        <span>
          <p class="desc">手续费</p>
          <p>{{ item.totalFee }}元</p>
        </span>
      </div>
    </div>
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
          <span class="right">{{ detail.payStatusStr }}</span>
        </div>
        <div class="line3">
          <div class="left">
            <span></span>
            <span>{{ detail.repayTime }}</span>
            <span>还款:{{ detail.repayAmount }}</span>
          </div>
          <span class="right">{{ detail.repayStatusStr }}</span>
        </div>
      </li>
    </ul>

    <template v-if="item.status == 1 || item.status == 3">
      <div class="mock-bottom"></div>
      <div class="btn-wrap">
        <span class="btn" @click="stopPlan" v-if="item.status == 1"
          >终止计划</span
        >
        <span class="btn" @click="createPlan" v-if="item.status == 3"
          >重新创建分期计划</span
        >
      </div>
    </template>
  </div>
</template>

<script>
// @ is an alias to /src
import { formatTime } from '@/utils/common';
import ajax from '@/rest/ajax';

export default {
  name: 'payback_detail',
  data() {
    return {
      bankCardNo: '',
      show: false,
      isRefundPack: false,
      item: {
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
    this.taskId = this.$route.query.taskId;
    this.bankCardNo = this.$route.query.bankCardNo;
    this.isRefundPack = this.$route.query.isRefundPack;
    this.getTaskById();
  },
  methods: {
    initData() {
      const itemStr = localStorage.getItem('paybackDetail') || '';
      if (!itemStr) return;
      const item = JSON.parse(itemStr);

      item.detailList.forEach(item => {
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
            : item.payStatus == 3
            ? '失败'
            : '';

        item.repayStatusStr =
          item.repayStatus == 0
            ? '待执行'
            : item.repayStatus == 1
            ? '还款中'
            : item.repayStatus == 2
            ? '成功'
            : item.repayStatus == 3
            ? '失败'
            : '';
      });
      this.item = item;
    },
    getTaskById() {
      let params = {};
      let url = '';
      if (this.taskId) {
        url = '/repay/getTaskById';
        params = {
          taskId: this.taskId,
        };
      }
      if (this.bankCardNo) {
        url = '/repay/getTaskByCardNo';
        params = {
          bankCardNo: this.bankCardNo,
        };
      }
      ajax
        .post(url, params, {
          headers: {
            'content-type': 'application/x-www-form-urlencoded',
          },
        })
        .then(res => {
          if (res.code === 0) {
            res.data.detailList.forEach(item => {
              item.payStatusStr =
                item.payStatus == 0
                  ? '待执行'
                  : item.payStatus == 1
                  ? '扣款中'
                  : item.payStatus == 2
                  ? '成功'
                  : item.payStatus == 3
                  ? '失败'
                  : '';

              item.repayStatusStr =
                item.repayStatus == 0
                  ? '待执行'
                  : item.repayStatus == 1
                  ? '还款中'
                  : item.repayStatus == 2
                  ? '成功'
                  : item.repayStatus == 3
                  ? '失败'
                  : '';
            });
            this.item = res.data;
          } else {
            this.$toast.text(res.msg);
          }
        });
    },
    stopPlan() {
      const _this = this;
      this.$dialog({
        id: 'my-dialogxxx',
        title: '提示',
        content: '确定终止该计划吗？',
        cancelBtnTxt: '再考虑一下',
        okBtnTxt: '确定终止',
        onOkBtn() {
          const __this = this;
          const params = {
            taskId: _this.item.taskId,
          };
          ajax.post('/repay/stopPlan', params).then(res => {
            if (res.code === 0) {
              __this.close(); //关闭对话框
              // 区分 还款记录 进来还是 还款确认进来
              if (_this.isRefundPack) {
                _this.$router.push('/payback_stopResult');
              }
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
    createPlan() {
      this.$router.push('/my_refund');
      // this.$router.push({
      //   path: '/my_refund_chanel',
      //   query: {
      //     bankName: this.item.bankName,
      //     bankCardNo: this.item.bankCardNo,
      //   },
      // });
    },
  },
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
.payback_detail {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  overflow-y: auto;
  // height: 100vh;
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
          // background: #ff0;
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
        max-width: 150px;
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
      justify-content: center;
      font-size: 15px;
      color: #333333;
      line-height: 1;
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
        // margin-left: 55px;
        margin-right: 10px;
        // width: 125.5px;
      }
      span:nth-child(2) {
        margin-right: 10px;
        // width: 54px;
      }
      span:nth-child(3) {
        // width: 74px;
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
          color: #d51523;
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
          color: #04a612;
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
