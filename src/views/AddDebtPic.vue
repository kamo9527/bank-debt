<template>
  <section class="page_w upload_pic">
    <div class="page_title">上传合同照片</div>
    <div class="pd_15">
      <div class="debt_info">
        <p class="tips">
          *温馨提示：为了更准确评您的负债资产，可选择上传合同照片;
        </p>

        <div class="my_flex upload_list">
          <image-picker
            class="upload_item"
            v-for="item in listInfo"
            :key="item.key"
            :imgKey="item.key"
            :max="1"
            :title="item.name"
            @handlePreview="handlePreview"
            @deleteImg="handleDeleteImgSingle"
            @getImg="handleImgSingle"
          />
          <div
            class="upload_item"
            v-for="(item, index) in imgList"
            :key="index"
          >
            <image-item
              class="upload_item_pic"
              :imgUrl="item"
              @handlePreview="() => handlePreview(item)"
              @deleteImg="handleDeleteImg(index, item)"
            />
            <div class="img_title">其他合同页</div>
          </div>
          <image-picker
            v-if="imgLength > 0"
            class="upload_item"
            :ismultiple="true"
            :showImage="false"
            :max="imgLength"
            @getImg="handleImg"
            title="其他合同页"
          />
        </div>
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
        提交
      </button>
    </div>
  </section>
</template>

<script>
import { ImagePreview } from 'vant';
import ImageItem from '@/components/ImageItem.vue';
import ImagePicker from '@/components/ImagePicker.vue';
import cache from '@/utils/cache';
import ajax from '@/rest/ajax';
export default {
  name: 'AddDebtPic',
  data() {
    return {
      previewShow: false,
      previewIndex: 0,
      previewImages: [],
      listInfo: [
        { key: 'img1', name: '借款金额页' },
        { key: 'img2', name: '到款金额页' },
        { key: 'img3', name: '还款分期页' },
        { key: 'img4', name: '每期还款页' },
      ],
      imgInfoFile: {
        img1: null,
        img2: null,
        img3: null,
        img4: null,
      },
      imgList: [],
      imgListFile: [],
      keyList: ['borrowMoney', 'arriveMoney', 'periodMoney'],
    };
  },
  components: {
    ImagePicker,
    ImageItem,
    [ImagePreview.Component.name]: ImagePreview.Component,
  },
  computed: {
    imgLength() {
      return 4 - this.imgList.length;
    },
  },
  methods: {
    handlePreview(src) {
      const index = this.previewImages.findIndex(item => item === src);
      this.previewIndex = index;
      this.previewShow = true;
    },
    handleDeleteImgSingle(key, src) {
      this.imgInfoFile[key] = null;
      const deleteIndex = this.previewImages.findIndex(item => item === src);
      this.previewImages.splice(deleteIndex, 1);
    },
    handleImgSingle(data) {
      const { key, src, file } = data;
      this.imgInfoFile[key] = file;
      this.previewImages.push(src);
      // const formData = new FormData();
      // formData.append('files', file);
      // ajax.post('/platform/uploadList', formData).then(res => {
      //   if (res.code === 0 && res.data) {
      //     console.log(res.data);
      //   } else {
      //     this.$toast.text(res.message);
      //   }
      // });
    },
    handleDeleteImg(index, src) {
      this.imgList.splice(index, 1);
      this.imgListFile.splice(index, 1);
      const deleteIndex = this.previewImages.findIndex(item => item === src);
      this.previewImages.splice(deleteIndex, 1);
    },
    handleImg(data) {
      const { src, file } = data;
      this.imgList.push(src);
      this.imgListFile.push(file);
      this.previewImages.push(src);
    },
    handleSubmit() {
      // 检查上传照片
      const checkImage = this.listInfo.find(({ key }) => {
        return !this.imgInfoFile[key];
      });
      if (checkImage) {
        this.$toast.text(`请上传${checkImage.name}照片`);
        return;
      }
      // 检查表单
      const params = cache.getSessionData('new_debt_data') || {};
      const checkParams = Object.keys(params).length === 0;
      if (checkParams) {
        this.$toast.text('请填写新增债务信息');
        this.$router.push('add_new_debt');
        return;
      }
      // 表单格式化
      this.keyList.forEach(key => {
        params[key] = params[key].replace(/,/g, '') * 100;
      });
      // ['repaymentCycle', 'remainingRepaymentCycle'].forEach(key => {
      //   params[key] = params[key] * 1;
      // });
      // 多图上传
      const formData = new FormData();
      for (const key in this.imgInfoFile) {
        formData.append('files', this.imgInfoFile[key]);
      }
      this.imgListFile.forEach(item => {
        formData.append('files', item);
      });
      ajax
        .post('/platform/uploadList', formData)
        .then(res => {
          if (res.code === 0 && res.data) {
            params.imgList = res.data.splice(4);
            res.data.forEach((item, index) => {
              const key = `img${index + 1}`;
              params[key] = item;
            });
            return params;
          } else {
            this.$toast.text(res.message);
          }
        })
        .then(jsonData => {
          if (!jsonData) return;
          ajax.post('/platform/add', jsonData).then(res => {
            if (res.code === 0) {
              cache.clearSessionData('new_debt_data');
              const { status } = cache.getSessionData('person_info') || {};
              const url = status === 1 ? '/success' : '/personal_certify';
              const tips = status === 1 ? '已认证' : '未认证';
              this.$toast.text(tips);
              this.$router.push(url);
            } else {
              this.$toast.text(res.message);
            }
          });
        });
    },
  },
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.upload_pic {
  padding-bottom: 60px;
  .debt_info {
    background-color: #fff;
    padding: 6px 10px 0;
    margin-top: -50px;
    margin-bottom: 10px;
    font-size: 16px;
    border-radius: 4px;
    text-align: left;
    .tips {
      font-size: 14px;
      color: #ff3232;
      padding-bottom: 15px;
    }
  }
  .upload_list {
    justify-content: flex-start;
    flex-wrap: wrap;
    .upload_item {
      margin: 0 26px 8px;
    }
    .upload_item_pic {
      width: 110px;
      height: 110px;
    }
    .img_title {
      text-align: center;
      padding: 6px 0;
    }
  }
}
</style>
