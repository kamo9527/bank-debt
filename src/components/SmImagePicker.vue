<template>
  <div class="sm_imagePicker">
    <input type="file" accept="image/*" class="card_file" @change="change" />
    <img class="card_preview" v-if="previewSrc" :src="previewSrc" />
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
    accept: {
      type: [String],
      default: 'image/*',
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
      lrz(file)
        .then((rst) => {
          // 处理成功会执行
          const { base64, file, origin } = rst;
          const newFile = new File([file], origin.name, { type: origin.type });
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
    z-index: 0;
  }
  .slot {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    z-index: 1;
  }
}
</style>
