<template>
  <div class="xx_img_item">
    <img class="xx_img" :src="imgUrl" alt="" @click="handlePreview" />
    <div class="xx_icont" @click="handleDeleteImg" v-show="!disabled">
      <img src="../assets/images/delete_icont.png" alt="" class="xx_delete" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'ImageItem',
  props: {
    imgUrl: {
      type: String,
      default: '',
    },
    disabled: {
      // 是否开启多图片上传
      type: [Boolean],
      default: false,
    },
  },
  methods: {
    handlePreview() {
      this.$emit('handlePreview');
    },
    handleDeleteImg() {
      this.$emit('deleteImg');
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.xx_img_item {
  position: relative;
  width: 100%;
  height: 100%;
  z-index: 100;
  .xx_img {
    display: block;
    width: 100%;
    height: 100%;
    border-radius: 6px;
    transition: all 5s ease-in-out;
  }

  .xx_icont {
    position: absolute;
    top: -6px;
    right: -6px;
    width: 20px;
    height: 20px;
    z-index: 100;
    background-color: #fff;
    border-radius: 50%;
  }

  .xx_delete {
    display: block;
    width: 100%;
    height: 100%;
  }
}
</style>
