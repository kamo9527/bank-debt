<template>
  <div class="sing_image_picker">
    <img
      class="phongg"
      src="~@/assets/images/personInfo/xiangji@2x.png"
      alt=""
    />
    <input
      class="mgegergger"
      type="file"
      name="files"
      :multiple="ismultiple ? 'multiple' : ''"
      :accept="accept"
      @change="addImg"
    />
  </div>
</template>
<script>
import lrz from 'lrz';
export default {
  name: 'my-imagefefffpicker',
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
  methods: {
    addImg(event) {
      let self = this;
      //限制图片上传数量
      const file = event.target.files;
      const fileArr = Array.from(file);
      const key = this.imgKey;
      fileArr.splice(this.max);
      let quality = 1;
      if (file.size <= 1 * 1024 * 1024) {
        quality = 1;
      } else if (1 * 1024 * 1024 < file.size && file.size <= 2 * 1024 * 1024) {
        quality = 0.7;
      } else if (2 * 1024 * 1024 < file.size && file.size <= 3 * 1024 * 1024) {
        quality = 0.5;
      } else if (3 * 1024 * 1024 < file.size && file.size <= 4 * 1024 * 1024) {
        quality = 0.3;
      } else if (4 * 1024 * 1024 < file.size && file.size <= 5 * 1024 * 1024) {
        quality = 0.2;
      } else if (5 * 1024 * 1024 < file.size) {
        quality = 0.1;
      }
      fileArr.forEach((item) => {
        lrz(item, { quality })
          .then(function (rst) {
            // 处理成功会执行
            const { base64, file, origin } = rst;
            const newFile = new File([file], origin.name, {
              type: origin.type,
            });
            self.imgUrl = base64;
            self.$emit('getImg', {
              key,
              src: base64,
              file: newFile,
            });
          })
          .catch(function (err) {
            // 处理失败会执行
            console.log(err);
          })
          .always(function () {
            // 不管是成功失败，都会执行
          });
      });
    },
  },
};
</script>
<style lang="less" scoped>
.sing_image_picker {
  // width: 40px;
  position: relative;
  .phongg {
    display: block;
    width: 17px;
  }
  .mgegergger {
    position: absolute;
    width: 17px;
    opacity: 0;
    top: 0;
    left: 0;
  }
}
</style>
