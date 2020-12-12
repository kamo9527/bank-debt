<template>
  <div
    :class="[
      'nut-collapse-item',
      { 'nut-collapse-item-left': classDirection == 'left' },
      { 'nut-collapse-item-icon': this.$parent.icon },
    ]"
  >
    <div
      :class="[
        'collapse-item',
        { 'item-expanded': openExpanded },
        { 'item-wrap': !openExpanded },
        { 'nut-collapse-item-disabled': disabled },
      ]"
      @click="toggleOpen"
    >
      <div class="collapse-title">
        {{ title }}
      </div>
      <div class="collapse-title_icon">
        <div class="my_gegergeg">{{ subTitle }}</div>
        <div v-if="isRead === 0" class="my_iconxxx" />
        <!-- <i
          v-if="this.$parent.icon"
          :class="[
            'collapse-icon',
            { 'col-expanded': openExpanded },
            { 'collapse-icon-disabled': disabled },
          ]"
          :style="iconStyle"
        ></i>
        <i
          v-else
          :class="[
            'collapse-icon',
            { 'col-expanded': openExpanded },
            { 'collapse-icon-disabled': disabled },
          ]"
        ></i> -->
      </div>
    </div>
    <!-- <div :class="['collapse-wrapper']" ref="wrapper">
      <div class="collapse-content" ref="content">
        <slot></slot>
      </div>
    </div> -->
  </div>
</template>
<script>
export default {
  name: 'nut-collapse-item',
  props: {
    title: {
      type: String,
      default: '',
    },
    subTitle: {
      type: String,
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    name: {
      type: Number,
      default: -1,
      required: true,
    },
  },
  mounted() {
    this.$nextTick(() => {
      let active = this.$parent && this.$parent.value;
      if (typeof active == 'number' || typeof active == 'string') {
        if (this.name == active) {
          this.defaultOpen();
        }
      }
      if (active instanceof Array) {
        let f = active.filter(item => item == this.name);
        if (f.length > 0) {
          this.defaultOpen();
        }
      }
    });
    this.classDirection = this.$parent.expandIconPosition;
    if (this.$parent.icon) {
      this.$set(
        this.iconStyle,
        'background-image',
        'url(' + this.$parent.icon + ')'
      );
    }
  },
  data() {
    return {
      openExpanded: false,
      classDirection: 'right',
      iconStyle: {
        'background-image':
          'url(https://img10.360buyimg.com/imagetools/jfs/t1/111306/10/17422/341/5f58aa0eEe9218dd6/28d76a42db334e31.png)',
        'background-repeat': 'no-repeat',
        'background-size': '100% 100%',
        transform: 'rotate(0deg)',
      },
    };
  },
  methods: {
    defaultOpen() {
      this.$parent.accordion
        ? this.$parent.accordionFun(this.name)
        : this.open();
      if (this.$parent.icon) {
        this.$set(
          this.iconStyle,
          'transform',
          'rotate(' + this.$parent.rotate + 'deg)'
        );
      }
    },
    toggleOpen() {
      // this.$parent.changeEvt(this.name);
      if (this.$parent.accordion) {
        this.$parent.changeVal(this.name);
        if (this.$parent.value == this.name) {
          this.$parent.accordionFun(this.name);
        }
        this.animation();
      } else {
        this.$parent.changeValAry(this.name);
        this.open();
      }
    },
    open() {
      this.openExpanded = !this.openExpanded;
      this.animation();
    },
    // 手风琴模式
    animation() {
      this.$nextTick(() => {
        const { content, wrapper } = this.$refs;
        if (!content || !wrapper) {
          return;
        }
        const { offsetHeight } = content;
        if (offsetHeight) {
          const contentHeight = `${offsetHeight}px`;
          wrapper.style.willChange = 'height';
          wrapper.style.height = !this.openExpanded ? 0 : contentHeight;
          if (this.$parent.icon && !this.openExpanded) {
            this.$set(this.iconStyle, 'transform', 'rotate(0deg)');
          } else {
            this.$set(
              this.iconStyle,
              'transform',
              'rotate(' + this.$parent.rotate + 'deg)'
            );
          }
        }
        if (!this.openExpanded) {
          this.onTransitionEnd();
        }
      });
    },
    // 更改子组件展示
    changeOpen(bol) {
      this.openExpanded = bol;
    },
    // 清除 willChange 减少性能浪费
    onTransitionEnd() {
      this.$refs.wrapper.style.willChange = 'auto';
    },
  },
};
</script>
<style lang="less" scoped>
.nut-collapse-item {
  position: relative;
  margin-bottom: 6px;
  // .collapse-item {
  //   &::after {
  //     position: absolute;
  //     box-sizing: border-box;
  //     content: ' ';
  //     pointer-events: none;
  //     right: 16px;
  //     bottom: 0;
  //     left: 16px;
  //     // border-bottom: 1px solid #ebedf0;
  //     -webkit-transform: scaleY(0.5);
  //     transform: scaleY(0.5);
  //   }
  // }
  .collapse-item {
    position: relative;
    width: 100%;
    overflow: hidden;
    padding: 10px 16px;
    color: #323233;
    font-size: 14px;
    line-height: 24px;
    background-color: #fff;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    .collapse-title {
      flex: 1;
    }

    .collapse-title_icon {
      width: 32px;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .my_gegergeg {
      font-size: 12px;
      line-height: 22px;
      color: #999999;
    }
    .collapse-title span {
      display: block;
      width: 100%;
    }
    .collapse-icon {
      display: block;
      position: absolute;
      top: 50%;
      margin-top: -10px;
      right: 16px;
      width: 20px;
      height: 20px;
      line-height: 24px;
      background-image: url(https://img10.360buyimg.com/imagetools/jfs/t1/111306/10/17422/341/5f58aa0eEe9218dd6/28d76a42db334e31.png);
      background-repeat: no-repeat;
      background-size: 100% 100%;
      transition: transform 0.3s;
    }
    .my_iconxxx {
      width: 6px;
      height: 6px;
      border-radius: 3px;
      background-color: red;
    }
    .col-expanded {
      transform: rotate(-180deg);
    }
    .subTitle {
      position: absolute;
      top: 50%;
      right: 40px;
      margin-top: -12px;
      color: #969799;
    }
  }
  .collapse-wrapper {
    position: relative;
    height: 0;
    overflow: hidden;
    transition: height 0.3s ease-in-out;
    .collapse-content {
      padding: 12px 16px;
      color: #969799;
      font-size: 14px;
      line-height: 1.5;
      background-color: #fff;
    }
  }
  .nut-collapse-item-disabled {
    color: #c8c9cc;
    cursor: not-allowed;
    pointer-events: none;
    .collapse-icon-disabled {
      background-image: url(https://img12.360buyimg.com/imagetools/jfs/t1/150037/5/8088/344/5f5b0bf2E214aac54/ec3e64ce3fc46200.png);
      background-repeat: no-repeat;
      background-size: 100% 100%;
    }
  }
  .nut-collapse-item-left {
    .collapse-item {
      padding: 10px 16px 10px 50px;
      .collapse-icon {
        left: 20px;
      }
      .subTitle {
        right: 16px;
      }
    }
  }
  .item-wrap .collapse-title {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  // .nut-collapse-item.nut-collapse-item-icon {
  //     .collapse-icon {
  //         transform: rotate(0deg);
  //     }
  // }
}
</style>
