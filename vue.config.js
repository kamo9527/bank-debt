const pxtorem = require('postcss-pxtorem');
const isProduction = process.env.NODE_ENV === 'production';
const isDev = process.env.NODE_ENV === 'development';
module.exports = {
  productionSourceMap: false, // 生存环境关闭sourceMap
  css: {
    loaderOptions: {
      postcss: {
        plugins: [
          pxtorem({
            // rootValue: 37.5,
            rootValue: 75,
            propList: ['*'],
            exclude: '/node_modules/@nutui/nutui/dist/packages/picker',
          }),
        ],
      },
    },
  },
  publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
  devServer: {
    open: true, // 配置自动启动浏览器
    // proxy: 'http://ydtapi.kuaikuaifu.net:9087', // 配置跨域处理,只有一个代理
    proxy: 'http://120.79.102.97:9000/', // 配置跨域处理,只有一个代理
  },
  chainWebpack: config => {
    // 当处于开发环境时，删除prefetch特性：prefetch会使macbook中的clarles无法正常工作。
    if (isDev) {
      config.plugins.delete('prefetch');
    }
    if (isProduction) {
      config.optimization
        .runtimeChunk({
          name: 'runtime',
        })
        .splitChunks({
          cacheGroups: {
            vue: {
              test: /[\\/]node_modules[\\/](vue|vuex|vue-router)[\\/]/,
              priority: -1,
              name: 'vue',
              chunks: 'all',
            },
            nutui: {
              test: /[\\/]node_modules[\\/]@nutui[\\/]/,
              priority: -2,
              name: 'nutui',
              chunks: 'all',
            },
            vant: {
              test: /[\\/]node_modules[\\/]vant[\\/]/,
              priority: -3,
              name: 'vant',
              chunks: 'all',
            },
            default: {
              minChunks: 2,
              priority: -20,
              reuseExistingChunk: true,
            },
          },
        });
    }
  },
};
