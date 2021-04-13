<template>
  <div class='page_container'>
    <van-cell :title="date" is-link @click="show = true" />
    <van-calendar
      v-model="show"
      :round="false"
      @confirm="onConfirm"
      color="#1989fa"
      position="right"
      :min-date="minDate"/>

    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <div v-for="item in projectList" :key="item.id" >
        <h3>
          {{item.name}}
          <van-tag v-if="item.status" plain type="primary">进行中</van-tag>
          <van-tag v-else plain type="primary">已结束</van-tag>
        </h3>
        <div>
          <span>创建人：{{item.createUsername}}</span>
          <span>创建时间：{{item.createTime}}</span>
        </div>
      </div>
    </van-list>
  </div>
</template>

<script>
import { timeParse } from '@utils'
import { projectList } from '@/api/project'

export default {
  name: 'home-page',
  metaInfo: {
    title: '首页'
  },
  async serverPrefetch() {
    // serverPrefetch 必须返回 Promise
    this.queryList.pageNumber++
    const res = await projectList(this.queryList)

    this.projectList.push(
      ...res.list
    )
    this.total = res.total
  },
  data() {
    return {
      minDate: new Date(`2010/01/01 00:00:00`),
      date: timeParse(null, '{y}-{m}-{d}'),
      show: false,
      loading: false,
      finished: false,
      queryList: {
        pageNumber: 0,
        pageSize: 10,
        status: 1
      },
      projectList: []
    }
  },
  created() {

  },
  methods: {
    async onLoad() {
      this.queryList.pageNumber++
      const res = await projectList(this.queryList)

      this.projectList.push(
        ...res.list
      )
      this.total = res.total

      // 加载状态结束
      this.loading = false;

      // 数据全部加载完成
      if (this.projectList.length >= this.total) {
        this.finished = true;
      }
    },
    onConfirm(date) {
      this.show = false;
      this.date = timeParse(date, '{y}-{m}-{d}');
    }
  }
}
</script>

<style scoped>
.dl-calendar {
  margin-bottom: 10px;
}
.calendar-point {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #48a6fc;
}
</style>