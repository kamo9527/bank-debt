<template>
  <section class="page_w return_information_page">
    <nut-cell
      class="my_cell"
      :title="queryInfo.bankName"
      :sub-title="`${queryInfo.bankCardNo.slice(0, 3)}***********
            ${queryInfo.bankCardNo.slice(-4)}`"
    />
    <div class="operate_input">
      <nut-cell
        class="my_cellxx"
        :show-icon="true"
        title="最后还款日:"
        :desc="params.lastRepaymentDate"
        @click.native="openDateSwitch"
      />
      <nut-textinput
        class="my_input"
        label="信用卡内余额（元）"
        placeholder="卡内最小余额200"
        :hasBorder="false"
        v-model="params.cardBalance"
      />
      <nut-textinput
        class="my_input"
        label="还款金额（元）"
        placeholder="最小还款金额300"
        :hasBorder="false"
        v-model="params.repaymentAmount"
      />
      <nut-cell
        class="my_cellxx"
        :show-icon="true"
        title="选择常住地："
        :desc="cityCustmer"
        @click.native="openAddressSwitch"
      />
      <!-- <nut-numberkeyboard
        :visible="visible"
        v-model="value"
        maxlength="8"
        @close="close"
      /> -->
      <div class="tips">*计划执行期内信用卡余额不能小于你输入的金额</div>
    </div>
    <button @click="handleSubmit" class="my_btn">下一步</button>
    <nut-calendar
      :is-visible.sync="dateVisible"
      :start-date="startDate"
      :end-date="endDate"
      :animation="`nutSlideUp`"
      @close="switchPicker"
      @choose="setChooseValue"
    />
    <nut-picker
      :is-visible="addressVisible"
      :default-value-data="defaultValueData"
      :list-data="custmerCityData"
      @close="closeSwitch"
      @confirm="setChooseValueCustmer"
      @choose="updateChooseValueCustmer"
      @close-update="closeUpdateChooseValueCustmer"
    />
  </section>
</template>

<script>
// @ is an alias to /src
import ajax from '@/rest/ajax';
import { formatTime } from '@/utils/common';
const toDay = new Date().getTime();
const StartDate = formatTime(
  new Date(toDay + 2 * 24 * 60 * 60 * 1000),
  'yyyy-MM-dd'
);
const EndDate = formatTime(
  new Date(toDay + 22 * 24 * 60 * 60 * 1000),
  'yyyy-MM-dd'
);
export default {
  name: 'refundReturnInformationPage',
  data() {
    return {
      dateVisible: false,
      addressVisible: false,
      startDate: StartDate,
      endDate: EndDate,
      balance: '',
      refund: '',
      defaultValueData: null,
      cityCustmer: '请选择常住地址',
      queryInfo: {
        bankName: '',
        bankCardNo: '',
      },
      params: {
        province: '',
        cityCode: '',
        cardBalance: '',
        repaymentAmount: '',
        channelNo: 'H5',
        lastRepaymentDate: StartDate,
      },
      custmerCityData: [],
    };
  },
  mounted() {
    const { cardId, channelId, bankName, bankCardNo } = this.$route.query;
    this.queryInfo.bankName = bankName;
    this.queryInfo.bankCardNo = bankCardNo;
    this.params.cardId = cardId;
    this.params.channelId = channelId;
    ajax.post('/area/list', {}).then((res) => {
      if (res.code === 0) {
        const resData = res.data;
        const col2 = [];
        resData.forEach((item) => {
          item.label = item.bank_area_code;
          item.value = item.bank_area;
          item.city_list.forEach((city) => {
            city.label = city.bank_city_code;
            city.value = city.bank_city;
          });
          col2.push(item.city_list);
        });
        this.custmerCityData = [resData, col2[0]];
      } else {
        this.$toast.text(res.msg);
      }
    });
  },
  methods: {
    switchPicker() {
      this.dateVisible = false;
    },
    setChooseValue(param) {
      this.params.lastRepaymentDate = param[3];
      console.log(param[3]);
    },
    openDateSwitch() {
      this.dateVisible = true;
    },
    openAddressSwitch() {
      this.addressVisible = true;
    },
    closeSwitch() {
      this.addressVisible = false;
    },
    setChooseValueCustmer(chooseData) {
      console.log(chooseData);
      let str = chooseData.map((item) => item.value).join('-');
      this.cityCustmer = str;
      this.params.province = chooseData[0].bank_area_code.replace(/\s/g, '');
      this.params.cityCode = chooseData[1].bank_city_code.replace(/\s/g, '');
    },
    closeUpdateChooseValueCustmer(self, chooseData) {
      console.log(self, chooseData);
      //此处模拟查询API，如果数据缓存了不需要再重新请求
      // setTimeout(() => {
      //   let { label, value } = chooseData[0];
      //   console.log(label, value);
      //   var resItems = APIData.find(item => item.label == label);
      //   if (resItems && resItems.array.length) {
      //     this.$set(this.custmerCityData, 1, resItems.array);
      //     // 复原位置
      //     self.updateChooseValue(self, 0, chooseData[0]);
      //     self.updateChooseValue(self, 1, chooseData[1]);
      //   }
      // }, 100);
    },
    updateChooseValueCustmer(self, index, resValue, cacheValueData) {
      console.log(cacheValueData);
      // 本demo为二级联动，所以限制只有首列变动的时候触发事件
      if (index === 0) {
        let { label, value } = resValue;
        console.log(label, value);
        setTimeout(() => {
          var resItems = resValue.city_list;
          if (resItems && resItems.length) {
            this.$set(this.custmerCityData, 1, resItems);
            self.updateChooseValue(self, index + 1, resItems[0]);
          }
        }, 100);
      }
    },
    handleSubmit() {
      if (!this.params.lastRepaymentDate) {
        this.$toast.text('请输入最后还款日');
        return;
      }
      if (!this.params.cardBalance) {
        this.$toast.text('请输入信用卡内余额');
        return;
      }
      if (!this.params.repaymentAmount) {
        this.$toast.text('请输入还款金额');
        return;
      }
      if (!this.params.province || !this.params.cityCode) {
        this.$toast.text('请选择常住地');
        return;
      }
      ajax.post('/repay/generatePlan', this.params).then((res) => {
        if (res.code === 0) {
          const taskId = res.data.taskId;
          this.$router.push(`/payback_GDetail?taskId=${taskId}`);
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
.return_information_page {
  background-color: #f5f5f5;
  .my_cell {
    border-radius: 10px;
    height: 100px;
    line-height: 100px;
    margin: 15px;
    background: url('../../assets/images/refund/refund_channel@2x.png');
    background-size: cover;
    .my_link {
      width: 30px;
      margin-right: 10px;
    }
    .my_icon {
      display: block;
      width: 100%;
    }
    .nut-cell-box {
      height: 100%;
    }
    .nut-cell-title {
      color: #fff;
    }
    .nut-cell-sub-title {
      color: #fff;
      font-size: 15px;
    }
    .nut-cell-desc {
      color: #fff;
    }
  }
  .operate_input {
    font-size: 14px;
    .my_input {
      background-color: #fff;
      padding: 0 20px;
      margin-bottom: 6px;
    }
    .my_input .nut-textinput-label {
      display: block;
      width: 150px;
      text-align: left;
    }
    .input_width {
      height: 100%;
    }
    .input_width input {
      max-width: 90px;
    }
    .my_cellxx {
      background-color: #fff;
      padding: 0 20px;
      margin-bottom: 6px;
    }
    .my_cellxx .nut-cell-right {
      font-size: 14px;
    }
    .tips {
      padding: 10px 20px;
      color: #d51523;
      font-size: 10px;
    }
  }
  .my_btn {
    margin: 40px auto 0;
    display: block;
    width: 60%;
    box-sizing: border-box;
    height: 40px;
    border-radius: 20px;
    font-size: 16px;
    color: #fff;
    border: none;
    background-color: #3375f2;
  }
}
</style>
