<template>
  <section class="page_w debt_detail">
    <button @click="handleDelete" class="my_delete">删除</button>
    <div class="page_title title_xx">小贷第6份</div>
    <div class="pd_15">
      <div class="debt_info more_mb color">
        <div class="small fz_16">此份合同计算值：</div>
        <div class="fz_12">
          剩余还款总额：{{ debtMoney | toThousandsText }} 元;
        </div>
        <div class="fz_12">
          实际年化利率为：{{ newDebtData.annualizedInterest }};
        </div>
      </div>
      <div class="debt_editor_title">贷款平台：{{ newDebtData.name }}</div>
      <div class="debt_editor">
        <nut-textinput
          class="new_input_item"
          v-for="{ key, text, xx } in checkList"
          :key="key"
          :disabled="noEditor"
          :label="`${xx}${text}（元）`"
          :clearBtn="!noEditor"
          @change="e => handleInput(key, e)"
          @blur="handleBlur(key)"
          v-model="newDebtData[key]"
          placeholder="0.00"
        />
        <div
          class="my_flex pick_xxx"
          v-for="{ key, text } in checkListPicker"
          :key="key"
        >
          <div class="pick_title">{{ text }}</div>
          <div class="pick_num">
            <span class="pick_btn" @click="changeNum(key)">
              {{ newDebtData[key] }}
            </span>
            期
          </div>
        </div>
      </div>
      <!-- <div class="my_flex debt_editor img_list_xx" v-if="noEditor">
        <div class="img_item" v-for="item in listInfo" :key="item.key">
          <img class="img_item_pic" :src="newDebtData[item.key]" alt="" />
          <div class="img_title">{{ item.name }}</div>
        </div>
        <div
          class="img_item"
          v-for="(item, index) in newDebtData.imgList"
          :key="index"
        >
          <img class="img_item_pic" :src="item" alt="" />
          <div class="img_title">其他合同页</div>
        </div>
      </div> -->
      <div class="my_flex debt_editor img_list_xx">
        <image-picker
          class="img_item"
          v-for="{ key, name } in listInfo"
          :key="key"
          :imgKey="key"
          :originImgUrl="newDebtData[key]"
          :max="1"
          :title="name"
          :disabled="noEditor"
          @handlePreview="handlePreview"
          @deleteImg="handleDeleteImgSingle"
          @getImg="handleImgSingle"
        />
        <div
          class="img_item"
          v-for="(item, index) in newDebtData.imgList"
          :key="index"
        >
          <image-item
            class="img_item_pic"
            :imgUrl="item"
            :disabled="noEditor"
            @handlePreview="() => handlePreview(item)"
            @deleteImg="handleDeleteImg(index, item)"
          />
          <div class="img_title">其他合同页</div>
        </div>
        <image-picker
          v-if="imgLength > 0 && !noEditor"
          class="img_item"
          :ismultiple="true"
          :showImage="false"
          :max="imgLength"
          :disabled="noEditor"
          @getImg="handleImg"
          title="其他合同页"
        />
      </div>
    </div>
    <van-image-preview
      v-model="previewShow"
      :closeable="true"
      :images="previewImages"
      :startPosition="previewIndex"
    />
    <div class="foot_btn">
      <button @click="handleSubmit" class="my_btn my_btn_single my_btn_active">
        {{ btnText }}
      </button>
    </div>
    <nut-picker
      :is-visible="isVisible"
      :list-data="listData"
      @close="switchPicker('isVisible')"
      @confirm="setPickerValue"
    >
    </nut-picker>
  </section>
</template>

<script>
// @ is an alias to /src
import cache from '@/utils/cache';
import ImagePicker from '@/components/ImagePicker.vue';
import ImageItem from '@/components/ImageItem.vue';
import ajax from '@/rest/ajax';
import { toThousands, regexpMap, numList } from '@/utils/common';
import { ImagePreview } from 'vant';
export default {
  name: 'DebtDetail',
  data() {
    return {
      previewShow: false,
      previewIndex: 0,
      previewImages: [],
      btnText: '编辑',
      changeKey: '',
      noEditor: true,
      isVisible: false,
      listData: numList,
      newDebtData: {
        // id: '',
        // name: '',
        // borrowMoney: '',
        // arriveMoney: '',
        // periodMoney: '',
        // repaymentCycle: '',
        // remainingRepaymentCycle: '',
        // annualizedInterest: '',
        // surplusMoney: '',
        // img1: '',
        // img2: '',
        // img3: '',
        // img4: '',
        imgList: [],
      },
      checkList: [
        { key: 'borrowMoney', text: '借款金额', xx: '您的' },
        { key: 'arriveMoney', text: '到账金额', xx: '您的' },
        { key: 'periodMoney', text: '每期还款', xx: '' },
      ],
      checkListPicker: [
        { key: 'repaymentCycle', text: '还款分期' },
        { key: 'remainingRepaymentCycle', text: '剩余还款期' },
      ],
      listInfo: [
        { key: 'img1', name: '借款金额页' },
        { key: 'img2', name: '到款金额页' },
        { key: 'img3', name: '还款分期页' },
        { key: 'img4', name: '每期还款页' },
      ],
    };
  },
  components: {
    ImagePicker,
    ImageItem,
    [ImagePreview.Component.name]: ImagePreview.Component,
  },
  mounted() {
    this.previewImages = [];
    cache.clearSessionData('delete_info');
    const sessionData = cache.getSessionData('debt_info');
    if (sessionData) {
      this.checkList.forEach(({ key }) => {
        const value = sessionData[key] / 100;
        sessionData[key] = toThousands(value);
      });
      this.newDebtData = sessionData;
      this.listInfo.forEach(({ key }) => {
        this.previewImages.push(sessionData[key]);
      });
      if (sessionData.imgList.length > 0) {
        this.previewImages.push(...sessionData.imgList);
      }
    }
  },
  computed: {
    debtMoney() {
      const { periodMoney, remainingRepaymentCycle } = this.newDebtData;
      if (!periodMoney || !remainingRepaymentCycle) {
        return '0.00';
      }
      if (!regexpMap.regexp_thousand.test(periodMoney)) {
        return '0.00';
      }
      const value = periodMoney.replace(/,/g, '') * remainingRepaymentCycle;
      return value * 100;
    },
    imgLength() {
      return 4 - this.newDebtData.imgList.length;
    },
    iRRdata() {
      const { arriveMoney, periodMoney, repaymentCycle } = this.newDebtData;
      return { arriveMoney, periodMoney, repaymentCycle };
    },
    // iRRvalue() {
    //   const { borrowMoney, periodMoney, repaymentCycle } = this.newDebtData;
    //   if (!borrowMoney || !periodMoney || !repaymentCycle) return '0.00';
    //   if (!regexpMap.regexp_thousand.test(borrowMoney)) return '0.00';
    //   if (!regexpMap.regexp_thousand.test(periodMoney)) return '0.00';
    //   const a = borrowMoney.replace(/,/g, '');
    //   const b = periodMoney.replace(/,/g, '');
    //   const IRRval = [-a];
    //   // IRRval.push(-borrowMoney); // borrowMoney 资金（总欠款资金）
    //   for (let i = 0; i < +repaymentCycle; i++) {
    //     // Period 期数
    //     IRRval.push(+b); // rental  租金（每期还款金额）
    //   }
    //   const IRR = this.IRRCalc(IRRval, 0.001);
    //   return IRR.toFixed(2);
    // },
  },
  methods: {
    IRRCalc(CArray, guest) {
      const inc = 0.000001;
      let NPV = 0;
      do {
        guest += inc;
        for (var j = 0; j < CArray.length; j++) {
          NPV += CArray[j] / Math.pow(1 + guest, j);
        }
      } while (NPV > 0);
      return guest * 12;
    },
    changeNum(key) {
      if (this.noEditor) return;
      this.changeKey = key;
      this.isVisible = true;
    },
    setPickerValue(value) {
      this.newDebtData[this.changeKey] = value[0];
      this.handleBlur(this.changeKey);
    },
    switchPicker() {
      this.isVisible = false;
    },
    handlePreview(src) {
      const index = this.previewImages.findIndex(item => item === src);
      this.previewIndex = index;
      this.previewShow = true;
    },
    handleBlur(key) {
      const aa = ['borrowMoney', 'remainingRepaymentCycle'];
      if (aa.includes(key)) return;
      const { arriveMoney, periodMoney, repaymentCycle } = this.newDebtData;
      if (!arriveMoney || !periodMoney || !repaymentCycle) {
        this.newDebtData.annualizedInterest = '0.00%';
        return;
      }
      if (!regexpMap.regexp_thousand.test(arriveMoney)) {
        this.newDebtData.annualizedInterest = '0.00%';
        return;
      }
      if (!regexpMap.regexp_thousand.test(periodMoney)) {
        this.newDebtData.annualizedInterest = '0.00%';
        return;
      }
      const params = {
        arriveMoney: arriveMoney.replace(/,/g, '') * 100,
        periodMoney: periodMoney.replace(/,/g, '') * 100,
        repaymentCycle,
      };
      if (params.arriveMoney > params.periodMoney * repaymentCycle) {
        this.$toast.text('还款金额过小');
        this.newDebtData.annualizedInterest = '0.00%';
        return;
      }
      ajax.post('/platform/irr', params).then(res => {
        if (res.code === 0 && res.data) {
          this.newDebtData.annualizedInterest = res.data;
        } else {
          this.$toast.text(res.message);
        }
      });
    },
    handleInput(key, e) {
      const value = e.target.value;
      // 删除清空,不修改
      if (value === '') return;
      // 校验千位符, 不修改
      if (regexpMap.regexp_thousand.test(value)) {
        const ll = value.split('.');
        if (ll[1]) {
          this.newDebtData[key] = `${ll[0]}.${ll[1].slice(0, 2)}`;
        }
        return;
      }
      // 非数字，不修改
      if (isNaN(value)) return;
      this.newDebtData[key] = toThousands(value);
    },
    handleDelete() {
      let _this = this;
      const id = this.newDebtData.id;
      this.$dialog({
        title: '确定删除？',
        closeBtn: true, //显式右上角关闭按钮
        onOkBtn() {
          // 确定按钮点击事件
          ajax
            .post('/platform/delete', { id })
            .then(res => {
              if (res.code === 0) {
                _this.$toast.text('删除成功');
                return id;
              } else {
                this.$toast.text(res.message);
              }
            })
            .then(id => {
              if (id === undefined) return;
              const jsonData = {
                currentPage: 1,
                pageSize: 10,
              };
              ajax.post('/platform/list', jsonData).then(res => {
                if (res.code === 0) {
                  const { obj } = res.data;
                  obj.id = id;
                  cache.setSessionData('delete_info', obj);
                  this.close(); //关闭对话框
                  _this.$router.go(-1);
                }
              });
            });
        },
      });
    },
    handleDeleteImgSingle(key, src) {
      this.newDebtData[key] = '';
      const deleteIndex = this.previewImages.findIndex(item => item === src);
      this.previewImages.splice(deleteIndex, 1);
    },
    handleImgSingle(data) {
      const { key, file } = data;
      // const loading = this.$toast.loading('上传中...');
      const formData = new FormData();
      formData.append('files', file);
      ajax.post('/platform/uploadList', formData).then(res => {
        if (res.code === 0 && res.data) {
          const url = res.data[0];
          this.newDebtData[key] = url;
          this.previewImages.push(url);
        } else {
          this.$toast.text(res.message);
        }
        // loading.hide();
      });
    },
    handleDeleteImg(index, src) {
      this.newDebtData.imgList.splice(index, 1);
      const deleteIndex = this.previewImages.findIndex(item => item === src);
      this.previewImages.splice(deleteIndex, 1);
    },
    handleImg(data) {
      // 多图上传
      const { file } = data;
      const formData = new FormData();
      formData.append('files', file);
      ajax.post('/platform/uploadList', formData).then(res => {
        if (res.code === 0) {
          this.newDebtData.imgList.push(...res.data);
          this.previewImages.push(...res.data);
        } else {
          this.$toast.text(res.message);
        }
      });
    },
    handleSubmit() {
      if (this.btnText === '编辑') {
        this.btnText = '保存';
        this.noEditor = false;
        return;
      }
      // 表单校验
      if (!this.newDebtData.name) {
        this.$toast.text('请输入向您贷款的公司/app/公众号');
        return;
      }
      const check1 = this.checkList.find(({ key }) => !this.newDebtData[key]);
      if (check1) {
        this.$toast.text('请输入' + check1.text);
        return;
      }
      const check2 = this.checkListPicker.find(({ key }) => {
        return !this.newDebtData[key];
      });
      if (check2) {
        this.$toast.text('请选择' + check1.text);
        return;
      }
      const falseItem = this.checkList.find(({ key }) => {
        const value = this.newDebtData[key];
        return !regexpMap.regexp_thousand.test(value);
      });
      if (falseItem) {
        this.$toast.text(falseItem.text + '请输入数字');
        return;
      }
      const checkData = {};
      this.checkList.forEach(({ key }) => {
        checkData[key] = this.newDebtData[key].replace(/,/g, '') * 1;
      });
      if (checkData.arriveMoney > checkData.borrowMoney) {
        this.$toast.text('到账金额不能大于借款金额');
        return;
      }
      const falseItem1 = this.checkList.find(({ key }) => {
        return checkData[key] > 9999999.99;
      });
      if (falseItem1) {
        this.$toast.text(falseItem1.text + '大于9,999,999.99，请重新输入');
        return;
      }
      const falseItem2 = this.checkList.find(({ key }) => {
        return checkData[key] <= 0;
      });
      if (falseItem2) {
        this.$toast.text(falseItem2.text + '小于或等于0，请重新输入');
        return;
      }
      // 检查上传照片
      const checkImage = this.listInfo.find(({ key }) => {
        return !this.newDebtData[key];
      });
      if (checkImage) {
        this.$toast.text(`请上传${checkImage.name}照片`);
        return;
      }
      // 表单格式化
      const params = { ...this.newDebtData, ...checkData };
      this.checkList.forEach(({ key }) => {
        params[key] = params[key] * 100;
      });
      params.surplusMoney = this.debtMoney;
      ajax.post('/platform/update', params).then(res => {
        if (res.code === 0) {
          this.$toast.text('保存成功');
          this.btnText = '编辑';
          this.noEditor = true;
        } else {
          this.$toast.text(res.message);
        }
      });
    },
  },
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
.debt_detail {
  padding-bottom: 60px;
  position: relative;
  .my_delete {
    position: absolute;
    top: 26px;
    right: 15px;
    height: 24px;
    padding: 0 15px;
    border: none;
    background-color: #fff;
    border-radius: 6px;
    font-size: 12px;
  }
  .debt_info {
    background-color: #fff;
    padding: 10px 10px 10px 15px;
    font-size: 14px;
    border-radius: 4px;
    .fz_16 {
      font-size: 16px;
    }
    .fz_12 {
      font-size: 14px;
      text-align: left;
    }
    .small {
      text-align: left;
      padding: 4px 0;
    }
  }
  .more_mb {
    margin-top: -40px;
  }
  .color {
    color: #8f6b2e;
  }
  .debt_editor_title {
    color: #000;
    font-size: 18px;
    padding: 10px 0;
  }
  .debt_editor {
    background-color: #fff;
    margin-bottom: 10px;
    padding: 10px 15px;
    font-size: 14px;
    border-radius: 4px;
  }
  .new_input_item {
    padding: 8px 0;
  }
  .new_input_item .nut-textinput-label {
    width: 130px;
    text-align: right;
  }
  .new_input_item input {
    max-width: 184px;
  }
  .pick_xxx {
    height: 44px;
    .pick_title {
      width: 120px;
      padding-right: 10px;
      text-align: right;
    }
    .pick_num {
      flex: 1;
      display: flex;
      align-items: center;
    }
    .pick_btn {
      border: 1px solid #d4caca;
      width: 28px;
      height: 28px;
      line-height: 28px;
      text-align: center;
      margin-right: 15px;
    }
  }
  .img_list_xx {
    padding: 10px;
    justify-content: flex-start;
    flex-wrap: wrap;
    .img_item {
      margin: 10px 10px 0;
      .img_list {
        width: 60px;
        height: 60px;
      }
    }
    .img_title {
      text-align: center;
      font-size: 12px;
      padding: 3px 0;
    }
    .img_item_pic {
      display: block;
      width: 60px;
      height: 60px;
      border-radius: 6px;
    }
  }
}
</style>
