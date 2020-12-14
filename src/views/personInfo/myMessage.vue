<template>
  <section class="page_w my_message">
    <nut-scroller
      :is-un-more="isUnMore"
      :is-loading="loading"
      :type="'vertical'"
      @loadMore="loadMoreVert"
      @pulldown="pulldown"
    >
      <div slot="list">
        <collapse v-model="activeNames" :accordion="true">
          <collapse-item
            v-for="item of debtList"
            :key="item.noticeId"
            :title="item.title"
            :subTitle="item.createTime"
            :name="item.noticeId"
            :isRead="item.isRead"
          />
        </collapse>
        <div class="no_list" v-if="showNolist">
          您暂无消息
        </div>
      </div>
    </nut-scroller>
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
      jsonData: {
        merchantId: '',
        currentPage: 1,
        pageSize: 10,
      },
      activeNames: 1,
      debtList: [],
      isUnMore: false,
      loading: false,
      showList: false,
      showNolist: false,
    };
  },
  mounted() {
    const info = cache.getLocalStorageData('person_info');
    this.jsonData.merchantId = info.merchantId;
    ajax
      .post('/index/noticeList', this.jsonData, {
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
        },
      })
      .then(res => {
        if (res.code === 0) {
          const { records, totalPages } = res.data;
          this.totalPages = totalPages;
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
  },
  methods: {
    loadMoreVert() {
      this.loading = true;
      if (this.jsonData.currentPage >= this.totalPages) {
        this.isUnMore = true;
        this.loading = false;
      } else {
        this.jsonData.currentPage++;
        ajax.post('/index/noticeList', this.jsonData).then(res => {
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
      ajax.post('/index/noticeList', this.jsonData).then(res => {
        if (res.code === 0) {
          const { records, totalPages } = res.data;
          this.totalPages = totalPages;
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
  .no_list {
    text-align: center;
    padding: 20px;
  }
}
</style>
