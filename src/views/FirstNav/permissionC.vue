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
            <el-button size="mini" type="" @click="changeUserPermissioin(scope.$index, scope.row)">
              {{scope.row.permission === '0' ? '设为管理员' : '设为普通用户'}}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="warning" @click="openConfirm(scope.$index, scope.row)">
              重置用户密保
            </el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">
              删除用户
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <pagination class="mt20" :parentTotalNum="totalUserNum" @sendNowPageToFather="getNowPagefromChild"></pagination>
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose">
      <span>这是一段信息</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
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
      tableData: [],
      dialogVisible: false
    }
  },
  methods: {
    // 修改用户权限
    changeUserPermissioin: function (index, row) {
      var CUTusername = row.username
      var CUTpermission = row.permission
      this.$http.post('/api/userCenter/changeUserPermission', {
        params: {
          username: this.$store.state.DLusername,
          cutusername: CUTusername,
          oldpermission: CUTpermission
        }
      }).then((res) => {
        var json = res.data
        if (json.code !== '0') {
          // console.log(json)
          this.$message({
            message: `警告，${json.msg}`,
            type: 'warning'
          })
        } else {
          this.$message.info(json.msg)
          this.getUserData(this.nowPage)
        }
      }).catch((err) => {
        this.$message.error(err)
      })
    },
    // 重置用户密保的警告框
    openConfirm: function (index, row) {
      this.dialogVisible = true
    },
    // 重置用户密保
    changeUserAnswer1: function (index, row) {
      console.log(row.username)
    },
    // 表单转换文字
    formatPermission (row, column) {
      return row.permission === '0' ? '普通用户' : row.permission === '1' ? '管理员' : ''
    },
    // 获取分页组件的页数
    getNowPagefromChild (nowpage) {
      this.nowPage = nowpage
      this.getUserData(nowpage)
    },
    // 获取用户数据
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
            this.getUserloading = false
            // console.log(json)
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
