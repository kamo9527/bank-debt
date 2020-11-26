<template>
  <div class="my_imagepicker">
    <div class="img_list">
      <transition-group name="nutEase">
        <image-item
          v-show="showImage && imgUrl"
          :key="imgKey"
          :imgUrl="imgUrl"
          :disabled="disabled"
          @handlePreview="handlePreview"
          @deleteImg="deleteImg"
        />
      </transition-group>
      <div class="add_icon">
        <i>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
            <g fill-rule="evenodd">
              <rect y="6" width="16" height="4" rx="2"></rect>
              <rect
                transform="rotate(90 8 8)"
                y="6"
                width="16"
                height="4"
                rx="2"
              ></rect>
            </g>
          </svg>
        </i>
        <input
          type="file"
          name="files"
          :multiple="ismultiple ? 'multiple' : ''"
          :accept="accept"
          @change="addImg"
        />
      </div>
    </div>
    <div class="img_title">{{ title }}</div>
  </div>
</template>
<script>
import ImageItem from '@/components/ImageItem.vue';
import lrz from 'lrz';
export default {
  name: 'my-imagepicker',
  props: {
    accept: {
      type: [String],
      default: 'image/*',
    },
    max: {
      // 允许上传的最大数量
      type: [Number, String],
      default: 9,
    },
    showImage: {
      type: [Boolean],
      default: true,
    },
    ismultiple: {
      // 是否开启多图片上传
      type: [Boolean],
      default: false,
    },
    disabled: {
      // 是否开启多图片上传
      type: [Boolean],
      default: false,
    },
    imgKey: {
      type: [String],
      default: 'aa',
    },
    originImgUrl: {
      type: [String],
      default: '',
    },
    title: {
      type: [String],
      default: '',
    },
    // delMode: {
    //   //删除图片的方式，支持tap、longtap
    //   type: [String],
    //   default: 'tap',
    // },
    // imgList: {
    //   type: Array,
    //   default: () => {
    //     return [];
    //   },
    // },
  },
  data() {
    return {
      imgUrl: '',
    };
  },
  watch: {
    originImgUrl(val) {
      if (val) {
        this.imgUrl = val;
      }
    },
  },
  components: {
    ImageItem,
  },
  methods: {
    addImg(event) {
      let self = this;
      //限制图片上传数量
      const file = event.target.files;
      const fileArr = Array.from(file);
      const key = this.imgKey;
      fileArr.splice(this.max);
      fileArr.forEach(item => {
        lrz(item)
          .then(function(rst) {
            // 处理成功会执行
            const { base64, file } = rst;
            self.imgUrl = base64;
            self.$emit('getImg', {
              key,
              src: base64,
              file,
            });
          })
          .catch(function(err) {
            // 处理失败会执行
            console.log(err);
          })
          .always(function() {
            // 不管是成功失败，都会执行
          });
      });
      // fileArr.forEach(item => {
      //   let reader = new FileReader();
      //   reader.onload = function(evt) {
      //     self.$emit('getImgUrl', {
      //       key,
      //       src: evt.target.result,
      //     });
      //     event.target.value = '';
      //   };
      //   reader.readAsDataURL(item);
      // });
      // self.$emit('getImgFiles', {
      //   key,
      //   files: fileArr,
      // });
    },
    handlePreview() {
      this.$emit('handlePreview', this.imgUrl);
    },
    deleteImg() {
      this.$emit('deleteImg', this.imgKey, this.imgUrl);
      this.imgUrl = '';
    },
    // touchStart(id) {
    //   console.log(this.longTapTime);
    //   this.timeOutEvent = setTimeout(() => {
    //     this.deleteImg(id);
    //   }, this.longTapTime);
    //   return false;
    // },
    // touchMove() {
    //   clearTimeout(this.timeOutEvent);
    //   return false;
    // },
    // touchEnd() {
    //   clearTimeout(this.timeOutEvent); //清除定时器
    //   this.timeOutEvent = 0;
    // },
  },
};
</script>
<style lang="less" scoped>
.my_imagepicker {
  .img_list {
    width: 110px;
    height: 110px;
    position: relative;
    .add_icon {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      z-index: 50;
      border: 1px dashed #f97a79;
      border-radius: 6px;
      box-sizing: border-box;
      cursor: pointer;
      i {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        margin: auto;
        width: 20px;
        height: 20px;
        color: #f97a79;
        svg {
          vertical-align: top;
          fill: currentColor;
        }
      }
      input[type='file'] {
        position: absolute;
        width: 100%;
        height: 100%;
        opacity: 0;
        top: 0;
        left: 0;
      }
    }
  }
  .img_title {
    text-align: center;
    padding: 5px 0;
  }
}
</style>
