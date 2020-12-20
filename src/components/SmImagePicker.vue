<template>
  <div class="sm_imagePicker">
    <input type="file" accept="image/*" class="card_file" @change="change" />
    <img
      class="card_preview"
      v-if="previewSrc || initPreview"
      :src="previewSrc || initPreview"
    />
    <span class="slot">
      <slot></slot>
    </span>
  </div>
</template>
<script>
import lrz from 'lrz';
export default {
  name: 'sm_imagePicker',
  props: {
    initPreview: {
      type: [String],
      default: '',
    },
  },
  data() {
    return {
      previewSrc: '',
    };
  },
  methods: {
    change(e) {
      const file = e.target.files[0];
      this.previewSrc = URL.createObjectURL(file);
      // this.$emit('getImg', {
      //   file,
      // });
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
      lrz(file, { quality })
        .then(rst => {
          // 处理成功会执行
          const { base64, file, origin } = rst;
          const newFile = new File([file], origin.name, { type: origin.type });
          console.log('newFile', newFile);
          this.$emit('getImg', {
            file: newFile,
          });
        })
        .catch(function(err) {
          // 处理失败会执行
          console.log(err);
        })
        .always(function() {
          // 不管是成功失败，都会执行
        });
    },
  },
};
</script>
<style lang="less" scoped>
.sm_imagePicker {
  .card_file {
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0;
    width: 100%;
    height: 100%;
    z-index: 2;
  }
  .card_preview {
    position: absolute;
    top: 0;
    left: 0;
    width: 100% !important;
    height: 100% !important;
    z-index: 1;
    object-fit: contain;
  }
  .slot {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    // z-index: 1;
  }
}
</style>
