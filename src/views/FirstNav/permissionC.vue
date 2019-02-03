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
            <el-button size="mini" type="danger" @click="openDeletefirm(scope.$index, scope.row)">
              删除用户
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <pagination class="mt20" :parentTotalNum="totalUserNum" @sendNowPageToFather="getNowPagefromChild"></pagination>
    <!-- 删除用户身份确认框 -->
    <el-dialog title='请确认您的身份' class="text-left normal-font-size"  :visible.sync="deleteuserDialog" width="40%" >
      <el-form label-width="20%" :model="deleteUserForm" :rules='Deleterules' ref="deleteUserForm" >
        <el-form-item label="问题" prop="Adminquestion">
          <el-input v-model='deleteUserForm.Adminquestion' disabled :placeholder="Adminquestion"></el-input>
        </el-form-item>
        <el-form-item label="答案" prop="Adminanswer">
          <el-input v-model='deleteUserForm.Adminanswer' clearable></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="LoginDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click='commitDelete("deleteUserForm")'>确 定</el-button>
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
      deleteuserDialog: false,
      deleteUsername: '',
      deleteRowName: '',
      Adminquestion: 'sss',
      deleteUserForm: {
        Adminanswer: '',
        Adminquestion: ''
      },
      Deleterules: {
        Adminanswer: [
          {required: true, message: '请回答问题', trigger: 'blur'},
          {min: 5, max: 20, message: '答案长度请保持在5-20个字符', trigger: 'blur'}
        ],
        Adminquestion: []
      }
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
      this.$confirm('此操作将重置用户密保，用于找回密码，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.changeUserAnswer1(index, row)
      }).catch(() => {
        console.log('取消重置密保')
      })
    },
    // 重置用户密保
    changeUserAnswer1: function (index, row) {
      // console.log(row.username)
      this.$http.post('/api/userCenter/changeUserAnswer', {
        params: {
          cutusername: row.username,
          username: this.$store.state.DLusername
        }
      }).then((res) => {
        var json = res.data
        if (json.code !== '0') {
          return Promise.reject(json.msg)
        } else {
          this.$message.info(json.msg)
          this.getUserData(this.nowPage)
        }
      }).catch((err) => {
        this.$message.error(err)
      })
    },
    // 删除用户弹出框
    openDeletefirm: function (index, row) {
      this.$confirm('此操作将删除系统用户，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        this.getAdminQuestion(index, row)
      }).catch(() => {
        console.log('取消重置密保')
      })
    },
    // 获取操作者密保问题
    getAdminQuestion: function (index, row) {
      // 正确情况--向后台拿问题
      this.$http.get('/api/user/findQuestion', {
        params: {
          username: this.$store.state.DLusername
        }
      }).then((res) => {
        // 将找回来的问题给与select,并且打开单选框的可编辑
        var json = res.data
        if (json.code !== '0') {
          return Promise.reject(json.msg)
        } else {
          this.deleteRowName = row.username
          var boolbool = json.data
          this.Adminquestion = this.$store.state.question[boolbool]
          this.deleteuserDialog = true
          // console.log(this.deleteRowName)
        }
      }).catch((err) => {
        this.$message.error(err)
      })
    },
    // 确认身份后提交删除
    commitDelete: function (deleteUserForm) {
      this.$refs[deleteUserForm].validate((valid) => {
        if (valid) {
          this.$http.post('/api/userCenter/deleteUser', {
            params: {
              cutusername: this.deleteRowName,
              username: this.$store.state.DLusername,
              answer: this.deleteUserForm.Adminanswer
            }
          }).then((res) => {
            var json = res.data
            if (json.code !== '0') {
              return Promise.reject(json.msg)
            } else {
              this.$message.success(json.msg)
              this.deleteRowName = ''
              this.deleteuserDialog = false
              this.getUserData(this.nowPage)
            }
          }).catch((err) => {
            this.$message.error(err)
          })
        } else {
          this.$message.error('表单错误')
          return false
        }
      })
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
