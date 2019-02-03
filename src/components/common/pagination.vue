<template>
  <div>
    <div class="block">
      <el-pagination
      background
      layout="prev, pager, next"
      :total="totalNum"
      @current-change="handleCurrentChange">
      </el-pagination>
    </div>
  </div>
</template>
<script>
export default {
  props: ['parentTotalNum'],
  data () {
    return {
      page: 1,
      totalNum: 1
    }
  },
  watch: {
    'parentTotalNum': function () {
      this.totalNum = this.parentTotalNum
    }
  },
  methods: {
    handleCurrentChange (val) {
      this.page = val
      this.backFather()
    },
    backFather () {
      this.$emit('sendNowPageToFather',
        this.page
      )
    }
  }
}
</script>
