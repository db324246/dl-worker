module.exports = {
  plugins: {
    autoprefixer: {
      // browsers: ['Android >= 4.0', 'iOS >= 8'],
    },
    'postcss-pxtorem': {
      rootValue: 32, // 设计稿750px下，23.4375rem
      propList: ['*', '!font*'],
      minPixelValue: 2, // 最小像素值
      selectorBlackList: ['van-'] // 排除van-开头(即vant库中的css样式)的class名
    }
  }
}