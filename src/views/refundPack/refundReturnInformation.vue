<template>
  <section class="page_w return_information_page">
    <nut-cell class="my_cell" title="华夏银行" sub-title="6358********6587" />
    <div class="operate_input">
      <nut-cell
        class="my_cellxx"
        :show-icon="true"
        title="最后还款日:"
        :desc="dateCustmer"
        @click.native="openDateSwitch"
      />
      <nut-textinput
        class="my_input"
        label="信用卡内余额（元）"
        placeholder="卡内最小余额200"
        :hasBorder="false"
        v-model="balance"
      />
      <nut-textinput
        class="my_input"
        label="还款金额（元）"
        placeholder="最小还款金额300"
        :hasBorder="false"
        v-model="refund"
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
    <button @click="handleSubmit" class="my_btn">
      下一步
    </button>
    <nut-datepicker
      :is-visible="dateVisible"
      type="date"
      title="请选择日期"
      :startDate="startDate"
      :endDate="endDate"
      :is-show-chinese="false"
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
const APIData = [
  {
    label: 1,
    array: [
      {
        label: 1,
        value: '朝阳区',
      },
      {
        label: 2,
        value: '海淀区',
      },
      {
        label: 3,
        value: '大兴区',
      },
      {
        label: 4,
        value: '东城区',
      },
      {
        label: 5,
        value: '西城区',
      },
      {
        label: 6,
        value: '丰台区',
      },
    ],
  },
  {
    label: 2,
    array: [
      {
        label: 1,
        value: '黄浦区',
      },
      {
        label: 2,
        value: '长宁区',
      },
      {
        label: 3,
        value: '普陀区',
      },
      {
        label: 4,
        value: '杨浦区',
      },
      {
        label: 5,
        value: '浦东新区',
      },
    ],
  },
];
export default {
  name: 'refundReturnInformationPage',
  data() {
    return {
      dateVisible: false,
      dateCustmer: StartDate,
      addressVisible: false,
      startDate: StartDate,
      endDate: EndDate,
      balance: '',
      refund: '',
      defaultValueData: null,
      cityCustmer: '请选择常住地址',
      listData: [
        [
          {
            label: 1,
            value: '南京市',
          },
          {
            label: 2,
            value: '无锡市',
          },
          {
            label: 3,
            value: '海北藏族自治区',
          },
          {
            label: 4,
            value: '北京市',
          },
          {
            label: 5,
            value: '连云港市',
          },
          {
            label: 6,
            value: '浙江市',
          },
          {
            label: 7,
            value: '江苏市',
          },
          {
            label: 8,
            value: '大庆市',
          },
          {
            label: 9,
            value: '绥化市',
          },
          {
            label: 10,
            value: '潍坊市',
          },
          {
            label: 11,
            value: '请按市',
          },
          {
            label: 12,
            value: '乌鲁木齐市',
          },
        ],
      ],
      custmerCityData: [
        [
          {
            label: 1,
            value: '北京',
          },
          {
            label: 2,
            value: '上海',
          },
        ],
      ],
    };
  },
  mounted() {},
  methods: {
    switchPicker() {
      this.dateVisible = false;
    },
    setChooseValue(param) {
      this.toDay = param[3];
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
      var str = chooseData.map(item => item.value).join('-');
      this.cityCustmer = str;
    },
    closeUpdateChooseValueCustmer(self, chooseData) {
      //此处模拟查询API，如果数据缓存了不需要再重新请求
      setTimeout(() => {
        let { label, value } = chooseData[0];
        console.log(label, value);
        var resItems = APIData.find(item => item.label == label);
        if (resItems && resItems.array.length) {
          this.$set(this.custmerCityData, 1, resItems.array);

          // 复原位置
          self.updateChooseValue(self, 0, chooseData[0]);
          self.updateChooseValue(self, 1, chooseData[1]);
        }
      }, 100);
    },
    updateChooseValueCustmer(self, index, resValue, cacheValueData) {
      console.log(cacheValueData);
      // 本demo为二级联动，所以限制只有首列变动的时候触发事件
      if (index === 0) {
        //此处模拟查询API，如果数据缓存了不需要再重新请求
        let { label, value } = resValue;
        console.log(label, value);
        setTimeout(() => {
          var resItems = APIData.find(item => item.label == label);
          if (resItems && resItems.array.length) {
            this.$set(this.custmerCityData, 1, resItems.array);
            // 更新第二列位置
            self.updateChooseValue(self, index + 1, this.custmerCityData[1][0]);
          }
        }, 100);
      }
    },
    handleSubmit() {
      console.log(1111);
    },
    // handleGo(info) {
    //   // 交互说明：选择渠道需判断是否要开通业务，需开通跳到开通业务界面，不需要开通业务跳到填写代还信息页
    //   this.$router.push(info.link);
    // },
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
