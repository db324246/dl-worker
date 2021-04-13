<template>
  <div class='page-layout'>
    
    <router-view></router-view>

    <van-tabbar v-model="active">
      <van-tabbar-item replace to="/" icon="home-o">首页</van-tabbar-item>
      <van-tabbar-item replace to="/about" icon="search">关于</van-tabbar-item>
      <van-tabbar-item replace to="/" icon="setting-o">标签</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {
  name: 'layout',
  data() {
    return {
      active: 0
    }
  },
  created() {

  },
  methods: {

  }
}
</script>

<style lang='less' scoped>
.page-layout {
  height: calc(100% - 100px);
}
</style>