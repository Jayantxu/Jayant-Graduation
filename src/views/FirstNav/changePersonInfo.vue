<template>
  <div>
    <div class="changeInfoCenter">
      <div class="changeInfoCenterFirst">
        <el-row class="text-left h40">
          <span class="font22 absolute ml10 mt10">密码修改</span>
        </el-row>
        <el-row class="text-left ml10 mt10 h60">
          <el-switch class="mt20" style="vertical-align: top;" v-model="changeAbout" active-text="密保修改" inactive-text="旧密码修改">
          </el-switch>
        </el-row>
        <!-- 密码修改的密保部分 -->
        <el-row class="ml10" v-if="changeAbout">
          <el-col :span="8">
            <el-form :model="centerCPWDForm" :rules="CPWDrules" ref="centerCPWDForm">
              <el-form-item label="密保问题：" prop="userAnswer" >
                <span class="absolute ml100">{{userSqlquestion}}</span>
                <el-input v-model="centerCPWDForm.userAnswer">
                </el-input>
              </el-form-item>
              <el-form-item label="新密码" prop="newPassword">
                <el-input type="password" v-model="centerCPWDForm.newPassword"  clearable></el-input>
              </el-form-item>
              <el-form-item label="确认新密码" prop="doublenewPassword">
                <el-input type="password"  v-model="centerCPWDForm.doublenewPassword" clearable></el-input>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="8" :offset="8" class="text-center">
            <el-button type="primary" @click="submitChangeForm('centerCPWDForm')">提交</el-button>
            <el-button @click="resetForm('centerCPWDForm')">重置</el-button>
          </el-col>
        </el-row>
        <!-- 密码修改的旧密码部分 -->
        <el-row class="ml10" v-if="!changeAbout">
          <el-col :span="8">
            <el-form :model="centerCPWDForm2" :rules="CPWDrules2" ref="centerCPWDForm2">
              <el-form-item label="旧密码" prop="oldPassword2" >
                <el-input type="password"  v-model="centerCPWDForm2.oldPassword2" clearable>
                </el-input>
              </el-form-item>
              <el-form-item label="新密码" prop="newPassword2">
                <el-input type="password" v-model="centerCPWDForm2.newPassword2"  clearable></el-input>
              </el-form-item>
              <el-form-item label="确认新密码" prop="doublenewPassword2">
                <el-input type="password"  v-model="centerCPWDForm2.doublenewPassword2" clearable></el-input>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="8" :offset="8" class="text-center">
            <el-button type="primary" @click="submitChangeForm2('centerCPWDForm2')">提交</el-button>
            <el-button @click="resetForm2('centerCPWDForm2')">重置</el-button>
          </el-col>
        </el-row>
      </div>
      <div class="changeInfoCenterSecond">
        <el-row class="text-left h40">
          <span class="font22 absolute ml10 mt10">密保修改</span>
        </el-row>
        <el-row class="ml10">
          <el-col :span="8">
            <el-form :model="centerCQUESForm" :rules="CQUESrules" ref="centerCQUESForm">
              <el-form-item label="请回答旧密保问题：" prop="oldAnswer">
                <span class="absolute ml140">{{userSqlquestion}}</span>
                <el-input v-model="centerCQUESForm.oldAnswer">
                </el-input>
              </el-form-item>
              <el-form-item label="请选择新问题" prop="newQuestion">
                <template>
                  <el-select v-model="centerCQUESForm.newQuestion" placeholder="请选择">
                    <el-option
                      v-for="item in allQuestion"
                      :key="item"
                      :value="item">
                      <span style="float: left">{{item}}</span>
                    </el-option>
                  </el-select>
                </template>
              </el-form-item>
              <el-form-item label="请输入新答案" prop="newAnswer">
                <el-input v-model="centerCQUESForm.newAnswer" clearable></el-input>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="8" :offset="8" class="mt50">
            <el-button type="primary" @click="submitCQUESForm('centerCQUESForm')">提交</el-button>
            <el-button @click="resetCQUESForm('centerCQUESForm')">重置</el-button>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    var validatorPass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else if (value !== this.centerCPWDForm.newPassword) {
        callback(new Error('两次输入密码不一致'))
      } else {
        callback()
      }
    }
    var validatorPass4 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else if (value !== this.centerCPWDForm2.newPassword2) {
        callback(new Error('两次输入密码不一致'))
      } else {
        callback()
      }
    }
    return {
      changeAbout: true,
      userSqlquestion: '',
      allQuestion: [],
      centerCPWDForm: {
        userAnswer: '',
        newPassword: '',
        doublenewPassword: ''
      },
      centerCPWDForm2: {
        oldPassword2: '',
        newPassword2: '',
        doublenewPassword2: ''
      },
      centerCQUESForm: {
        oldAnswer: '',
        newQuestion: '',
        newAnswer: ''
      },
      CPWDrules: {
        newPassword: [
          {required: true, message: '请输入密码', trigger: 'blur'},
          {min: 5, max: 15, message: '密码长度在5-15个字符', trigger: 'blur'}
        ],
        doublenewPassword: [
          {required: true, message: '请输入密码', trigger: 'blur'},
          {min: 5, max: 15, message: '密码长度在5-15个字符', trigger: 'blur'},
          {validator: validatorPass2, trigger: 'blur'}
        ],
        userAnswer: [
          {required: true, message: '请回答问题', trigger: 'blur'},
          {min: 5, max: 20, message: '答案长度请保持在5-20个字符', trigger: 'blur'}
        ]
      },
      CPWDrules2: {
        oldPassword2: [
          {required: true, message: '请输入密码', trigger: 'blur'},
          {min: 5, max: 15, message: '密码长度在5-15个字符', trigger: 'blur'}
        ],
        newPassword2: [
          {required: true, message: '请输入密码', trigger: 'blur'},
          {min: 5, max: 15, message: '密码长度在5-15个字符', trigger: 'blur'}
        ],
        doublenewPassword2: [
          {required: true, message: '请输入密码', trigger: 'blur'},
          {min: 5, max: 15, message: '密码长度在5-15个字符', trigger: 'blur'},
          {validator: validatorPass4, trigger: 'blur'}
        ]
      },
      CQUESrules: {
        oldAnswer: [
          {required: true, message: '请回答问题', trigger: 'blur'},
          {min: 5, max: 20, message: '答案长度请保持在5-20个字符', trigger: 'blur'}
        ],
        newQuestion: [
          {required: true, message: '请回答问题', trigger: 'blur'},
          {min: 5, max: 20, message: '答案长度请保持在5-20个字符', trigger: 'blur'}
        ],
        newAnswer: [
          {required: true, message: '请回答问题', trigger: 'blur'},
          {min: 5, max: 20, message: '答案长度请保持在5-20个字符', trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    // 密保表单
    submitChangeForm (centerCPWDForm) {
      this.$refs[centerCPWDForm].validate((valid) => {
        if (valid) {
          this.sendChangePWDForm()
        } else {
          this.$message.error('表单错误')
          return false
        }
      })
    },
    // 密码表单
    submitChangeForm2 (centerCPWDForm2) {
      this.$refs[centerCPWDForm2].validate((valid) => {
        if (valid) {
          this.sendChangePWDForm()
        } else {
          this.$message.error('表单错误')
          return false
        }
      })
    },
    // 向后台发送提交表单
    sendChangePWDForm () {
      var toBackparams = {}
      if (this.changeAbout) {
        toBackparams = {
          userchangeAbout: this.changeAbout,
          username: this.$store.state.DLusername,
          useranswer: this.centerCPWDForm.userAnswer,
          usernewpassWD: this.centerCPWDForm.newPassword
        }
      } else {
        toBackparams = {
          userchangeAbout: this.changeAbout,
          username: this.$store.state.DLusername,
          useroldpassWD: this.centerCPWDForm2.oldPassword2,
          usernewpassWD: this.centerCPWDForm2.newPassword2
        }
      }
      this.$http.post('/api/userCenter/changePWD', {
        params: toBackparams
      })
      .then((res) => {
        var json = res.data
        if (json.code !== '0') {
          return Promise.reject(json.msg)
        } else {
          // 密码修改需要退出登录，重新登录
          // ----->
          this.$store.commit('LoginIn', {
            username: ''
          })
          this.$message.success(json.msg)
          setTimeout(function () {
            location.href = '/'
          }, 2000)
        }
      })
      .catch((err) => {
        this.$message.error(err)
        })
    },
    resetForm (centerCPWDForm) {
      this.$refs[centerCPWDForm].resetFields()
    },
    resetForm2 (centerCPWDForm2) {
      this.$refs[centerCPWDForm2].resetFields()
    },
    submitCQUESForm (centerCQUESForm) {
      this.$refs[centerCQUESForm].validate((valid) => {
        if (valid) {
          this.sendChangeuserQUESForm(centerCQUESForm)
        } else {
          this.$message.error('密保修改表单错误')
          return false
        }
      })
    },
    // 修改密保表单
    sendChangeuserQUESForm (centerCQUESForm) {
      var arr = this.$store.state.question
      var newQUA = this.centerCQUESForm.newQuestion
      for (var item in arr) {
        if (arr[item] === newQUA) {
          newQUA = item    
        }
      }
      this.$http.post('/api/userCenter/changeQUES', {
        params: {
          username: this.$store.state.DLusername,
          newQU: newQUA,
          newAN: this.centerCQUESForm.newAnswer,
          oldAN: this.centerCQUESForm.oldAnswer
        }
      })
      .then((res) => {
        var json = res.data
        if (json.code !== '0') {
          return Promise.reject(json.msg)
        } else {
          this.$refs[centerCQUESForm].resetFields()
          this.getUserQuestion()
          this.$message.success(json.msg)
        }
      })
      .catch((err) => {
        this.$message.error(err)
      })
    },
    resetCQUESForm (centerCQUESForm) {
      this.$refs[centerCQUESForm].resetFields()
    },
    // 挂载时获取用户问题
    getUserQuestion () {
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
          var boolbool = json.data
          this.userSqlquestion = this.$store.state.question[boolbool]
          this.allQuestion = this.$store.state.question
        }
      }).catch((err) => {
        this.$message.error(err)
      })
    }
  },
  mounted: function () {
    this.getUserQuestion()
  }
}
</script>
<style lang="scss">
  .changeInfoCenter {
    width: 100%;
    height: 100vh;
    .changeInfoCenterFirst {
      width: 100%;
      height: 65vh;
      border: 1px solid #E4E7ED;
    }
    .changeInfoCenterSecond {
      width: 100%;
      margin-top:0.3rem;
      height: 55vh;
      border: 1px solid #E4E7ED;
    }
  }
</style>
