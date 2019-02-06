<template>
<!-- 用户已经发布的文章 -->
  <div>
    <div>
      <el-table :data="tableData" style="width: 100%" v-loading="getUserloading">
        <el-table-column prop="commitTime" label="日期" width="200" :formatter="formatTime">
        </el-table-column>
        <el-table-column prop="title" label="标题" width="250">
        </el-table-column>
        <el-table-column prop="username" label="所有用户" width="200">
        </el-table-column>
        <el-table-column prop="fileLocation" label="附件" width="250" :formatter="formatHasFile">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">
              查看
            </el-button>
            <el-button size="mini" type="danger" @click="deleteUserBookALLMessage(scope.$index, scope.row)">
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
      nowPage: 1,
      tableData: []
    }
  },
  methods: {
    // 转换附件的显示
    formatHasFile (row, column) {
      return row.fileLocation ? row.fileLocation : '无'
    },
    formatTime (row, column) {
      // console.log(row.commitTime)
      var HHMMSS = row.commitTime.split('T')[1].split('.')[0]
      var YYMMDD = row.commitTime.split('T')[0]
      // console.log(`${YYMMDD} ${HHMMSS}`)
      return (`${YYMMDD} ${HHMMSS}`)
    },
    // 删除用户书籍
    deleteUserBookALLMessage (index, row) {
      this.$confirm('此操作将删除用户书籍，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        this.deleteUserBookALL(index, row)
      }).catch(() => {
        console.log('取消删除')
      })
    },
    deleteUserBookALL (index, row) {
      // console.log(row)
      this.$http.post('/api/userCenter/deleteAllBook', {
        params: {
          username: this.$store.state.DLusername,
          bookusername: row.username,
          booktitle: row.title,
          bool: true
        }
      }).then((res) => {
        var json = res.data
        if (json.code !== '0') {
          return Promise.reject(json.msg)
        } else {
          this.$message.success(json.msg)
          this.getUserData(this.nowPage)
        }
      }).catch((err) => {
        this.$message.error(err)
      })
    },
    // 获取分页组件的页数
    getNowPagefromChild (nowpage) {
      this.nowPage = nowpage
      this.getUserData(nowpage)
    },
    getUserData: function (nowPage) {
      this.getUserloading = true
      this.$http.post('/api/userCenter/findAllBook', {
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
