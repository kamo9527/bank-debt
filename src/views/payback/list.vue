<template>
  <div class="payback_list">
    <!-- <div class="title">
      <span class="page_back_wrap" @click="$router.go(-1)">
        <img
          class="page_back"
          src="~@/assets/images/common/white_back@2x.png"
        />
      </span>
      <span>还款记录</span>
    </div> -->
    <!-- <div class="time">2020年04月</div> -->
    <nut-scroller
      :is-un-more="isUnMore"
      :is-loading="loading"
      :type="'vertical'"
      @loadMore="loadMoreVert"
      @pulldown="pulldown"
    >
      <div slot="list">
        <ul class="card_list">
          <li
            class="item"
            v-for="(item, index) in list"
            :key="index"
            @click="gotoDetail(item)"
          >
            <div class="header">
              <img class="bank_icon" :src="item.bankCode | getBankLogo" />
              <span class="bank_name">{{ item.bankName }}</span>
              <span class="bank_no">尾号:{{ item.bankCardNo.slice(-4) }}</span>
            </div>
            <div class="body">
              <span class="body_left">
                <p>{{ item.insteadAmount }}</p>
                <p class="desc">还款总额</p>
              </span>
              <span class="body_right">
                <p>{{ item.finishTime }}</p>
                <p class="desc">完成还款时间</p>
              </span>
            </div>
            <span class="lable">{{
              item.status == 0
                ? '待执行'
                : item.status == 1
                ? '分期还款中'
                : item.status == 2
                ? '执行成功'
                : '手动终止计划'
            }}</span>
            <div class="process">
              <circleProgress
                :percent="(item.finishPeriodCount / item.periodCount) * 100"
                :rd="50"
                :strokeWidth="6"
                :trailWidth="6"
              >
                <div class="inner">
                  <p>已还款</p>
                  <p>{{ item.finishInsteadAmount }}</p>
                  <p>{{ item.finishPeriodCount }}/{{ item.periodCount }}期</p>
                </div>
              </circleProgress>
              <!-- <nut-circleprogress
                :progress="(item.finishPeriodCount / item.periodCount) * 100"
                :is-auto="true"
                strokeInnerWidth="6"
                :progress-option="{
                  radius: 48,
                  strokeOutWidth: 6,
                  backColor: '#f0f0f0',
                  progressColor: 'red',
                }"
              >
                <div class="inner">
                  <p>已还款</p>
                  <p>{{ item.finishInsteadAmount }}</p>
                  <p>{{ item.finishPeriodCount }}/{{ item.periodCount }}期</p>
                </div>
              </nut-circleprogress> -->
            </div>
          </li>
        </ul>

        <div class="no_list" v-if="list.length === 0">
          <img
            class="igmegeger"
            src="~@/assets/images/personInfo/no_list.png"
            alt=""
          />
        </div>
      </div>
    </nut-scroller>
  </div>
</template>

<script>
// @ is an alias to /src
import ajax from '@/rest/ajax';
import { formatTime } from '@/utils/common';
import circleProgress from '@/components/circleProgress';

export default {
  name: 'payback_list',
  data() {
    return {
      list: [],
      endDate: formatTime(new Date(), 'yyyy-MM-dd'),
      pageSize: 10,
      pageNum: 0,
      isUnMore: false,
      loading: false,
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    getList() {
      const params = {
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        endDate: this.endDate,
      };
      ajax.post('/repay/getTaskHistory', params).then((res) => {
        if (res.code === 0) {
          this.list = res.data;
          // this.list = [];
        } else {
          this.$toast.text(res.msg);
        }
        this.loading = false;
      });
    },
    gotoDetail(item) {
      // localStorage.setItem('paybackDetail', JSON.stringify(item));
      this.$router.push({
        path: '/payback_detail',
        query: {
          taskId: item.taskId,
          isRecordEnter: 1,
        },
      });
      // this.$router.push('/payback_GDetail');
    },
    loadMoreVert() {
      this.loading = true;
      const params = {
        pageSize: this.pageSize,
        pageNum: ++this.pageNum,
        endDate: this.endDate,
      };
      ajax.post('/repay/getTaskHistory', params).then((res) => {
        if (res.code === 0) {
          if (this.list.length < this.pageSize) this.isUnMore = true;

          this.list = [...this.list, ...res.data];
        } else {
          this.$toast.text(res.msg);
        }
        this.loading = false;
        this.isUnMore = false;
      });
    },
    pulldown() {
      this.pageNum = 0;
      this.loading = true;
      this.isUnMore = false;
      this.getList();
    },
  },
  components: {
    circleProgress,
  },
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
.payback_list {
  height: 100vh;
  display: flex;
  align-items: center;
  flex-direction: column;
  background-color: #f2f2f2;
  padding: 0 15px;
  // padding-bottom: 28.5px;
  box-sizing: border-box;
  .title {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 45px;
    // padding-top: 33.5px;
    overflow: hidden;
    font-size: 18px;
    color: #ffffff;
    text-align: center;
    line-height: 1;
    z-index: 9;
    background: url('~@/assets/images/certif/bank/title_bg@2x.png') no-repeat;
    background-size: 100% 63.5px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    .page_back_wrap {
      position: absolute;
      top: 0;
      left: 0;
      display: inline-block;
      width: 45px;
      height: 45px;
      z-index: 10;
    }
    .page_back {
      position: absolute;
      top: 16px;
      left: 15px;
      width: 8px;
      height: 14.5px;
      z-index: 10;
    }
  }
  .time {
    margin-top: 20px;
    margin-bottom: 15px;
    width: 100%;
    font-size: 14px;
    color: #333333;
  }
  .card_list {
    margin-top: 10px;
    .item {
      position: relative;
      width: 348.5px;
      height: 163px;
      background: #fff;
      border-radius: 8px;
      padding-left: 22.5px;
      padding-top: 11.5px;
      box-sizing: border-box;
      & + .item {
        margin-top: 11.5px;
      }
      .header {
        display: flex;
        align-items: flex-end;
        font-size: 15px;
        color: #333333;
        .bank_icon {
          width: 28px;
          height: 24px;
          // background: #ff0;
        }
        .bank_name {
          margin-left: 11px;
          margin-right: 7px;
        }
        .bank_no {
          font-size: 12px;
          color: #999999;
        }
      }
      .body {
        margin-top: 40px;
        display: flex;
        align-items: center;
        font-size: 15px;
        color: #333333;
        .body_left {
          width: 90px;
          text-align: center;
          .desc {
            margin-top: 7.5px;
          }
        }
        .body_right {
          width: 110px;
          text-align: center;
          .desc {
            margin-top: 7.5px;
          }
        }
      }
      .lable {
        position: absolute;
        top: 17px;
        right: 30px;
        font-size: 15px;
        color: #4574f2;
      }
      .process {
        position: absolute;
        bottom: 17px;
        right: 25.5px;
        width: 99px;
        height: 99px;
        .inner {
          text-align: center;
          p:nth-child(1) {
            font-size: 15px;
            color: #333333;
            white-space: nowrap;
          }
          p:nth-child(2) {
            font-size: 14px;
            font-weight: bold;
            color: #f0aa01;
            white-space: nowrap;
          }
          p:nth-child(3) {
            font-size: 15px;
            color: #d51523;
            white-space: nowrap;
          }
        }
      }
    }
  }
}
.no_list {
  padding-top: 80px;
  .igmegeger {
    margin: 0 auto;
    display: block;
    width: 106px;
    height: 106px;
  }
}
</style>
