<template>
  <div id="app" style="height:100%;">
    <transition :name="transitionName">
      <router-view class="router-view" />
    </transition>
  </div>
</template>
<script>
// @ is an alias to /src
// import { postClient } from '@/rest/goods'
// import HelloWorld from '@/components/HelloWorld.vue';
export default {
  data() {
    return {
      historyCount: 0,
      routerInfo: {},
      transitionName: 'slide-in',
    };
  },
  watch: {
    // 转场动画
    $route(to, from) {
      // 转场动画方向控制
      const toIndex = this.routerInfo[to.path];
      const fromIndex = this.routerInfo[from.path];

      if (toIndex) {
        this.transitionName = toIndex > fromIndex ? 'slide-in' : 'slide-out';
      } else {
        this.historyCount++;
        if (to.path !== '/') this.routerInfo[to.path] = this.historyCount;
        this.transitionName = 'slide-in';
      }
    },
  },
};
</script>
<style lang="less">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #333333;
}
.page_w {
  height: 100%;
  box-sizing: border-box;
  .page_title {
    padding-top: 26px;
    font-size: 18px;
    color: #fff;
    height: 100px;
    background: url('./assets/images/home_bg@2x.png') top center no-repeat;
    background-size: 100% 126px;
  }
  .pd_15 {
    padding: 0 15px;
  }
}
.foot_btn {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  z-index: 500;
  padding: 0 15px;
  padding-bottom: 10px;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  justify-content: space-between;
  box-sizing: border-box;
  background-color: #f7f7f7;
  .my_btn {
    width: 47%;
    height: 50px;
    border-radius: 4px;
    border: none;
    font-size: 18px;
    color: #f97a79;
    background-color: #fff;
  }
  .my_btn_single {
    width: 100%;
  }
}
.my_tips {
  padding-top: 10px;

  .my_checkbox {
    display: inline-block;
    margin-right: 6px;
    &:checked {
      background-color: #f97a79;
    }
  }

  .contract {
    color: #8181ea;
  }

  .middle {
    vertical-align: middle;
    font-size: 12px;
  }
}
.router-view {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
}
.slide-in-leve {
  transform: translateX(0);
}
.slide-in-leave-active {
  height: 100%;
  transform: translateX(-100%);
}
.slide-out-leve {
  transform: translateX(0);
}
.slide-out-leave-active {
  height: 100%;
  transform: translateX(-100%);
}
.slide-in-enter {
  height: 100%;
  transform: translateX(100%);
}
.slide-out-enter {
  height: 100%;
  transform: translateX(-100%);
}
.slide-in-enter-active,
.slide-out-enter-active {
  transition: transform 0.65s ease;
}
</style>
