<template>
<!-- 用户已经发布的文章 -->
  <div>
    <div>
      <el-table :data="tableData" style="width: 100%" v-loading="getUserloading">
        <el-table-column prop="commitTime" label="日期" width="120">
        </el-table-column>
        <el-table-column prop="title" label="标题" width="250">
        </el-table-column>
        <el-table-column prop="username" label="作者" width="200">
        </el-table-column>
        <el-table-column prop="fileLocation" label="附件" width="250" :formatter="formatHasFile">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">
              编辑
            </el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <pagination class="mt20" :parentTotalNum="totalUserNum" @sendNowPageToFather="getNowPagefromChild"></pagination>
  </div>
</template>
<script>
import pagination from '../../components/common/pagination'
export default {
  components: {
    pagination
  },
  data () {
    return {
      totalUserNum: 0,
      getUserloading: false,
      tableData: []
    }
  },
  methods: {
    // 转换附件的显示
    formatHasFile (row, column) {
      return row.fileLocation ? row.fileLocation : '无'
    },
    // 获取分页组件的页数
    getNowPagefromChild (nowpage) {
      this.nowPage = nowpage
      this.getUserData(nowpage)
    },
    getUserData: function (nowPage) {
      this.getUserloading = true
      this.$http.post('/api/userCenter/findAllLSBook', {
        params: {
          nowpage: nowPage,
          username: this.$store.state.DLusername
        }
      }).then((res) => {
        var json = res.data
        if (json.code !== '0') {
          this.getUserloading = false
          return Promise.reject(json.msg)
        } else {
          console.log(json)
          this.getUserloading = false
          this.totalUserNum = json.data.Total
          // console.log(json.data.data)
          this.tableData = json.data.data
        }
      }).catch((err) => {
        this.getUserloading = false
        this.$message.error(err)
      })
    }
  },
  mounted: function () {
    // 挂载时获取一遍数据
    this.getUserData(1)
  }
}
</script>
<style lang="scss">
</style>
