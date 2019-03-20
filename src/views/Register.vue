<template>
    <div class="registerhtml">
        <topheader></topheader>
        <div class="registerForm font16">
          <el-row >
            <!-- 撑位置用 -->
            <el-col :xs="2" :sm="7" :md="8" :lg="8" :xl="8">
              <div class="col-content font22 mt10">
                </div>
            </el-col>
            <el-col :xs="20" :sm="10" :md="8" :lg="8" :xl="8" class="mt40">
              <el-form :model="registerRuleForm" :rules="rules" ref="registerRuleForm" label-width="80px">
                <el-form-item label="账户" prop="username">
                  <el-input v-model="registerRuleForm.username" clearable></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                  <el-input type="password" v-model="registerRuleForm.password" :disabled="isExist" clearable></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="doublepassword">
                  <el-input type="password" v-model="registerRuleForm.doublepassword" :disabled="isExist" clearable></el-input>
                </el-form-item>
                <el-form-item label="选择问题" prop="question">
                  <el-select v-model="registerRuleForm.question" style="width:100%;" :disabled="isExist" placeholder="请选择问题">
                    <el-option
                      v-for="item in Cquestion"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                      <span style="float: left">{{ item.label }}</span>
                      <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="回答" prop="answer">
                  <el-input v-model="registerRuleForm.answer" :disabled="isExist" clearable></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="submitForm('registerRuleForm')" :disabled="isExist">注册</el-button>
                  <el-button @click="resetForm('registerRuleForm')">重置</el-button>
                </el-form-item>
              </el-form>
            </el-col>
            <!-- 撑位置用 -->
            <el-col :xs="2" :sm="7" :md="8" :lg="8" :xl="8">
              <div class="col-content font22 mt10">
                </div>
            </el-col>
          </el-row>
        </div>
    </div>
</template>
<script>
import topheader from '../components/common/topheader'
export default {
  name: 'register',
  components: {
    topheader
  },
  data () {
    var validatorPass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else if (value !== this.registerRuleForm.password) {
        callback(new Error('两次输入密码不一致'))
      } else {
        callback()
      }
    }
    var validatorCheckUser = (rule, value, callback) => {
      this.$http.post('/api/user/registerCheck', {
        params: {
          username: value
        }
      })
        .then((res) => {
          var json = res.data
          if (json.code !== '0') {
            return Promise.reject(json.msg)
          } else {
            this.isExist = false
          }
        })
        .catch((err) => {
          this.isExist = true
          this.$message.error(err)
        })
    }
    return {
      isExist: true,
      registerRuleForm: {
        username: '',
        password: '',
        doublepassword: '',
        question: '',
        answer: ''
      },
      rules: {
        username: [
          {required: true, message: '请输入用户名', trigger: 'blur'},
          {min: 3, max: 10, message: '长度在3-10个字符', trigger: 'blur'},
          {validator: validatorCheckUser, trigger: 'blur'}
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'},
          {min: 5, max: 15, message: '密码长度在5-15个字符', trigger: 'blur'}
        ],
        doublepassword: [
          {required: true, message: '请输入密码', trigger: 'blur'},
          {min: 5, max: 15, message: '密码长度在5-15个字符', trigger: 'blur'},
          {validator: validatorPass2, trigger: 'blur'}
        ],
        question: [
          {required: true, message: '请选择相关问题', trigger: 'change'}
        ],
        answer: [
          {required: true, message: '请回答问题', trigger: 'blur'},
          {min: 5, max: 20, message: '答案长度请保持在5-20个字符', trigger: 'blur'}
        ]
      },
      Cquestion: [{
        value: 'Q001',
        label: '你最喜欢的歌手?'
      }, {
        value: 'Q002',
        label: '你的工作？'
      }, {
        value: 'Q003',
        label: '你最喜欢的书籍？'
      }
      ]
    }
  },
  methods: {
    submitForm (registerRuleForm) {
      this.$refs[registerRuleForm].validate((valid) => {
        if (valid) {
          this.$http.post(
            '/api/user/registeruser',
            {
              params: {
                username: this.registerRuleForm.username,
                password: this.registerRuleForm.password,
                question: this.registerRuleForm.question,
                answer: this.registerRuleForm.answer
              }
            }
          )
            .then((res) => {
              console.log(res)
              if (res.data.code === '0') {
                this.$message({
                  message: `恭喜，${res.data.msg}，将跳转主页`,
                  type: 'success'
                })
                setTimeout(function () {
                  location.href = '/'
                }, 2000)
              } else {
                this.$message({
                  message: `警告，${res.data.msg}`,
                  type: 'warning'
                })
                this.$refs[registerRuleForm].resetFields()
              }
            })
            .then((err) => {
              console.log(err)
            })
          //  this.$message({message: '注册成功', type: 'success'})
        } else {
          this.$message.error('表单错误')
          return false
        }
      })
    },
    resetForm (registerRuleForm) {
      this.$refs[registerRuleForm].resetFields()
    }
  }
}
</script>
<style lang="scss">
  .registerhtml {
    height: 100vh;
    position: relative;
    background-color: #b5b7bd;
  }
  .registerForm {
    top: 1rem;
    position: relative;
  }
</style>
