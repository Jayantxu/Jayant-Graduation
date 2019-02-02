<template>
<!-- 用户已经发布的文章 -->
  <div>
    <div>
      <el-table :data="tableData" style="width: 100%" v-loading="getUserloading">
        <el-table-column prop="registertime" label="注册时间" width="160">
        </el-table-column>
        <el-table-column prop="username" label="用户名" width="200">
        </el-table-column>
        <el-table-column prop="permission" label="用户角色" width="200" :formatter="formatPermission">
        </el-table-column>
        <el-table-column label="权限配置">
          <template slot-scope="scope">
            <el-button size="mini" type="" @click="handleDelete(scope.$index, scope.row)">
              设为管理员
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">
              重置用户密保
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
      nowPage: 1,
      totalUserNum: 0,
      getUserloading: false,
      tableData: [{
        date: '2016-05-02',
        title: '王小虎',
        author: '上海市普陀区金沙江路 1518 弄',
        hasFile: '上海市普陀区金沙江路 1518 弄'
      }]
    }
  },
  methods: {
    handleDelete: function (a, b) {
      console.log(`${a}****${b.author}`)
    },
    formatPermission (row, column) {
      return row.permission == '0' ? '普通用户' : row.permission == '1' ? '管理员' : ''
    },
    // 获取分页组件的页数
    getNowPagefromChild (nowpage) {
      this.getUserData(nowpage)
    },
    getUserData: function (nowPage) {
      this.getUserloading = true
      this.$http.post('/api/userCenter/findAllUser', {
        params: {
          page: nowPage,
          username: this.$store.state.DLusername
        }
      })
        .then((res) => {
          var json = res.data
          if (json.code !== '0') {
            this.$message({
              message: `警告，${json.msg}`,
              type: 'warning'
            })
          } else {
            this.getUserloading = false
            this.totalUserNum = json.data.Total
            // console.log(json.data.data)
            this.tableData = json.data.data
          }
        })
        .catch((err) => {
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
