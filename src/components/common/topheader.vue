<template>
    <div>
        <div class="TOPhead">
            <el-row :gutter="10" class="headRow-bg">
                <el-col :xs="2" :sm="4" :md="4" :lg="4" :xl="4">
                    <div class="col-content font22 mt5">
                        <i class="icon iconfont icon-shu iconfont48">
                        </i>
                    </div>
                </el-col>
                <!-- 撑位置用 -->
                <el-col :xs="0" :sm="3" :md="6" :lg="7" :xl="4">
                    <div class="col-content font22 mt10">
                    </div>
                </el-col>
                <!-- 搜索框 -->
                <el-col :xs="7" :sm="7" :md="6" :lg="6" :xl="8">
                    <div class="col-content font22 mt10">
                        <el-input style="width:70%;" placeholder="请输入相关书名" suffix-icon="el-icon-search">
                        </el-input>
                    </div>
                </el-col>
                <!-- 撑位置用 -->
                <el-col :xs="0" :sm="0" :md="1" :lg="2" :xl="4">
                    <div class="col-content font22 mt10">
                    </div>
                </el-col>
                <!-- 编辑与首页icon -->
                <el-col :xs="4" :sm="4" :md="3" :lg="2" :xl="4">
                    <div class="col-content font22 mt10">
                        <i @click='returnWrite()' v-show="isLogin" class="mr20 icon iconfont icon-shuxie iconfont32 hover-click">
                        </i>
                        <i @click='returnHome()' class="icon iconfont icon-home_icon iconfont32 hover-click">
                        </i>
                    </div>
                </el-col>
                <!-- 用户icon -->
                <el-col v-if="isLogin" :xs="5" :sm="4" :md="3" :lg="3" :xl="4">
                    <div class="col-content font22 mt10">
                        <p class="font16 inline-block">用户{{DLusername}}</p>
                        <el-dropdown @command='UserPersonClick' >
                          <i class="icon iconfont icon-tubiaozhizuomobanyihuifu- iconfont32 hover-click">
                            <span class="el-dropdown-link">
                            </span>
                          </i>
                          <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item command='PersonHome'>个人主页</el-dropdown-item>
                            <el-dropdown-item command='LoginOut'>退出登录</el-dropdown-item>
                          </el-dropdown-menu>
                        </el-dropdown>
                    </div>
                </el-col>
                <!-- 登录/注册 -->
                <el-col v-if="!isLogin" :xs="7" :sm="4" :md="3" :lg="3" :xl="4">
                    <div class="col-content font16 mt15">
                        <i @click='LoginDialogVisible = true' class="icon iconfont icon-denglu iconfont25 hover-click">
                        </i>
                        /
                        <i @click='returnRegister()' class="icon iconfont icon-zhuce iconfont25 hover-click">
                        </i>
                    </div>
                </el-col>
            </el-row>
        </div>
        <!-- 登录框 -->
        <el-dialog title='用户登录' class="text-left normal-font-size"  :visible.sync="LoginDialogVisible" width="30%" >
            <el-form label-width="20%" :model="loginUserForm" :rules='rules' ref="loginUserForm" >
                <el-form-item label="账户" >
                    <el-input v-model='loginUserForm.username' clearable></el-input>
                </el-form-item>
                <el-form-item label="密码 " >
                    <el-input v-model='loginUserForm.password' type='password' clearable></el-input>
                </el-form-item>
            </el-form>
            <span @click='returnfindPWD()' class="text-right inline-block vw100 hover-click">忘记密码？</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="LoginDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click='commitLogin("loginUserForm")'>确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
export default {
  name: 'topheader',
  data () {
    return {
      isLogin: false,
      // 记录登录的用户名
      DLusername: '',
      // 记录登录对话框的展示与否
      LoginDialogVisible: false,
      loginUserForm: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          {required: true, message: '请输入用户名', trigger: 'blur'},
          {min: 3, max: 10, message: '长度在3-10个字符', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'},
          {min: 5, max: 15, message: '密码长度在5-15个字符', trigger: 'blur'}
        ]
      }
    }
  },
  computed: {
    // checkLogin () {
    //   return this.$store.state.isLogin
    // }
  },
  methods: {
    checkLogin: function () {
      this.isLogin = this.$store.state.isLogin
      this.DLusername = this.$store.state.DLusername
    },
    returnRegister: function () {
      location.href = './register'
    },
    returnfindPWD: function () {
      location.href = './findPWD'
    },
    returnHome: function () {
      location.href = '/'
    },
    returnWrite: function () {
      location.href = '/writeNewComment'
    },
    // 识别用户对el-dropdown的时间 @command='UserPersonClick'
    UserPersonClick (command) {
      if (command === 'PersonHome') {
        location.href = '/userCenter'
      }
      if (command === 'LoginOut') {
        this.LoginOut()
      }
    },
    commitLogin (loginUserForm) {
      this.$refs[loginUserForm].validate((valid) => {
        if (valid) {
          this.$http.post('/api/user/loginIn', {
            params: {
              username: this.loginUserForm.username,
              password: this.loginUserForm.password
            }
          }).then((res) => {
            let json = res.data
            if (json.code !== '0') {
              return Promise.reject(json.msg)
            } else {
              this.$message({
                message: `${json.msg}`,
                type: 'success'
              })
              // 修改登录态保存至store中
              this.$store.commit('LoginIn', {
                username: json.data.username
              })
              // 记录该用户名
              this.DLusername = json.data.username
              // 隐藏登录对话框
              this.LoginDialogVisible = !this.LoginDialogVisible
              // 调用获取某些state
              this.checkLogin()
            }
          }).catch((err) => {
            this.$message({
              message: `${err}`,
              type: 'warning'
            })
          })
        } else {
          this.$message.error('用户名密码不正确')
          return false
        }
      })
    },
    LoginOut () {
      this.$confirm('您将退出登录?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 此处逻辑,请求删除了cookie之后,前端更改store中的状态
        this.$http.post('/api/user/loginOut', {
          params: {
            username: this.DLusername
          }
        })
          .then((res) => {
            var json = res.data
            console.log(json)
            if (json.code !== '0') {
              this.$message({
                type: 'info',
                message: '未知错误'
              })
            } else {
              // 改变store状态
              this.$store.commit('LoginIn', {
                username: json.data.username
              })
              this.checkLogin()
              // 提示信息
              this.$message({
                type: 'success',
                message: '登出成功'
              })
            }
          })
          .catch((err) => {
            console.log(err)
          })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消登出'
        })
      })
    }
  },
  mounted () {
    // 执行一遍该函数,目的是前往store中获取登录态
    this.checkLogin()
  }
}
</script>
<style lang="scss">
    .TOPhead {
        width: 100%;
        top: 0;
        position: fixed;
    }
    .el-col {
        border-radius: 0.01rem;
    }
    .headRow-bg {
        height: 0.64rem;
        background: #d3dce6;
    }
    .col-content {
        border-radius: 0.04rem;
    }
    .topHeadUserPic {
        width: 0.45rem;
        height: 0.45rem;
        border-radius: 1rem;
    }
    .hover-click {
        cursor: pointer;
        &:hover {
            text-decoration: underline;
            color: rgb(149, 153, 152);
        }
    }
    .el-message-box__wrapper {
      z-index: 10000 !important
    }
</style>
