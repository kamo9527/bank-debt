<template>
  <section class="page_w home">
    <div class="page_title">债惠</div>
    <div class="pd_15">
      <div class="debt_info more_mb">
        <div class="my_flex h_60">
          <div class="flex_1">总借款金额（元）</div>
          <div class="flex_1">总剩余还款额（元）</div>
        </div>
        <div class="line"></div>
        <div class="my_flex h_60">
          <div class="flex_1">
            {{ debtInfo.borrowMoneyCount | toThousandsText }}
          </div>
          <div class="flex_1">
            {{ debtInfo.surplusMoneyCount | toThousandsText }}
          </div>
        </div>
      </div>
      <div class="no_list" v-if="showNolist">
        <div>你还没有上传负债信息</div>
        <img
          class="no_list_icon"
          src="../assets/images/no_list@2x.png"
          alt="no_list"
        />
      </div>
      <div class="debt_info" @click="goAddNewDebt">
        <img class="add_icon" src="../assets/images/add_icon.png" alt="add_" />
        <div class="text">立即添加负债信息</div>
      </div>
      <div class="debt_list_text" v-if="showList">我的申请</div>
      <div class="debt_list" v-if="showList">
        <nut-scroller
          :is-un-more="isUnMore"
          :is-loading="loading"
          :type="'vertical'"
          @loadMore="loadMoreVert"
          @pulldown="pulldown"
        >
          <div slot="list">
            <debt-item-info
              v-for="item of debtList"
              :key="item.id"
              :info="item"
            />
          </div>
        </nut-scroller>
      </div>
    </div>
    <div class="foot_btn">
      <button class="my_btn my_btn_active">负债管理</button>
      <button @click="goPersonal" class="my_btn">个人信息</button>
    </div>
  </section>
</template>

<script>
// @ is an alias to /src
import DebtItemInfo from '@/components/DebtItemInfo.vue';
import cache from '@/utils/cache';
import ajax from '@/rest/ajax';
export default {
  name: 'Home',
  data() {
    return {
      jsonData: {
        currentPage: 1,
        pageSize: 10,
      },
      debtInfo: {
        borrowMoneyCount: 0,
        surplusMoneyCount: 0,
      },
      totalPages: 0,
      debtList: [],
      isUnMore: false,
      loading: false,
      showList: false,
      showNolist: false,
    };
  },
  activated() {
    if (this.debtList.length === 0) {
      this.jsonData = {
        currentPage: 1,
        pageSize: 10,
      };
      this.showList = false;
      this.showNolist = false;
      ajax.post('/platform/list', this.jsonData).then((res) => {
        if (res.code === 0) {
          const { obj, records, totalPages } = res.data;
          this.totalPages = totalPages;
          this.debtInfo = obj;
          if (records && records.length > 0) {
            this.debtList = records;
            this.showList = true;
          } else {
            this.showNolist = true;
          }
        } else {
          this.$toast.text(res.message);
        }
      });
    } else {
      // 列表删除债务
      const deleteInfo = cache.getSessionData('delete_info');
      if (deleteInfo === null) return;
      this.debtInfo = deleteInfo;
      const index = this.debtList.findIndex(({ id }) => id === deleteInfo.id);
      if (index > -1) {
        this.debtList.splice(index, 1);
        if (this.debtList.length === 0) {
          this.showList = false;
          this.showNolist = true;
        }
      }
    }
  },
  components: {
    DebtItemInfo,
  },
  methods: {
    goPersonal() {
      this.$router.push('personal_info');
    },
    goAddNewDebt() {
      // 清除新增债务页面表单缓存
      cache.clearSessionData('new_debt_data');
      this.$router.push('add_new_debt');
    },
    loadMoreVert() {
      this.loading = true;
      if (this.jsonData.currentPage >= this.totalPages) {
        this.isUnMore = true;
        this.loading = false;
      } else {
        this.jsonData.currentPage++;
        ajax.post('/platform/list', this.jsonData).then((res) => {
          if (res.code === 0) {
            const { records } = res.data;
            this.debtList.push(...records);
          } else {
            this.jsonData.currentPage--;
            this.$toast.text(res.message);
          }
          this.loading = false;
          this.isUnMore = false;
        });
      }
    },
    pulldown() {
      this.loading = true;
      this.jsonData.currentPage = 1;
      ajax.post('/platform/list', this.jsonData).then((res) => {
        if (res.code === 0) {
          const { obj, records, totalPages } = res.data;
          this.totalPages = totalPages;
          this.debtInfo = obj;
          if (records.length > 0) {
            this.debtList = records;
            this.showList = true;
          } else {
            this.showNolist = true;
          }
        } else {
          this.$toast.text(res.message);
        }
        this.loading = false;
        this.isUnMore = false;
      });
    },
  },
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.home {
  padding-bottom: 64px;
  text-align: center;
  .debt_info {
    background-color: #fff;
    padding: 0 10px;
    margin-bottom: 10px;
    font-size: 16px;
    color: chocolate;
    border-radius: 4px;
    .line {
      width: 100%;
      height: 0;
      border-bottom: 1px solid #d4caca;
    }
    .h_60 {
      line-height: 54px;
    }
    .add_icon {
      display: block;
      width: 30px;
      height: 30px;
      padding: 10px 0;
      margin: 0 auto;
    }
    .text {
      color: #666666;
      padding-bottom: 10px;
    }
  }
  .more_mb {
    margin-top: -50px;
  }
  .no_list {
    padding: 24px 0 30px;
    font-size: 16px;
    color: #666666;
    .no_list_icon {
      display: block;
      width: 90px;
      height: 90px;
      margin: 0 auto;
      padding-top: 16px;
    }
  }
  .debt_list_text {
    color: #333333;
    font-size: 16px;
    text-align: left;
    padding: 4px 6px;
  }
  .debt_list {
    height: 400px;
  }
}
</style>
