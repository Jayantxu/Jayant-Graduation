<template>
<!-- 用户已经发布的文章 -->
  <div>
    <div>
      <el-table :data="tableData" style="width: 100%" v-loading="getUserloading">
        <el-table-column prop="commitTime" label="日期" width="190" :formatter="formatTime">
        </el-table-column>
        <el-table-column prop="title" label="标题" width="250">
        </el-table-column>
        <el-table-column prop="username" label="作者" width="200">
        </el-table-column>
        <el-table-column prop="fileLocation" label="附件" width="250" :formatter="formatHasFile">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" @click="lookArticle(scope.$index, scope.row)">
              查看
            </el-button>
            <el-button size="mini" type="danger" @click="DeleteBookMessage(scope.$index, scope.row)">
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
      nowPage: 0,
      getUserloading: false,
      tableData: []
    }
  },
  methods: {
    // 时间的转换
    formatTime (row, column) {
      // console.log(row.commitTime)
      var HHMMSS = row.commitTime.split('T')[1].split('.')[0]
      var YYMMDD = row.commitTime.split('T')[0]
      // console.log(`${YYMMDD} ${HHMMSS}`)
      return (`${YYMMDD} ${HHMMSS}`)
    },
    // 转换附件
    formatHasFile (row, column) {
      return row.fileLocation ? row.fileLocation : '无'
    },
    // 删除书籍
    DeleteBookMessage (index, row) {
      this.$confirm('您确认将删除此书籍吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        this.DeleteBook(index, row)
      }).catch(() => {
        console.log('取消删除')
      })
    },
    // 查看按钮
    lookArticle (index, row) {
      var bookusername = row.username
      var booktitle = row.title
      window.open(`/lookArticle?bookusername=${bookusername}&booktitle=${booktitle}&ls=false`)
    },
    DeleteBook (index, row) {
      this.$http.post('/api/userCenter/deletePersonBook', {
        params: {
          username: this.$store.state.DLusername,
          booktitle: row.title,
          bool: true
        }
      }).then((res) => {
        var json = res.data
        if (json.code !== '0') {
          return Promise.reject(json.msg)
        } else {
          console.log(json.msg)
          this.$message.warning(json.msg)
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
      this.$http.post('/api/userCenter/personfindAllBook', {
        params: {
          nowpage: nowPage,
          username: this.$store.state.DLusername,
          bool: true
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
