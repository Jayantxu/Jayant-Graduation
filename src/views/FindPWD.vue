<template>
    <div class='findPWDhtml'>
        <topheader></topheader>
        <div class="findPWDForm">
            <el-row>
                <!-- 撑位置用 -->
                <el-col :xs="2" :sm="7" :md="8" :lg="8" :xl="8">
                <div class="col-content font22 mt10">
                    </div>
                </el-col>
                <el-col :xs="20" :sm="10" :md="8" :lg="8" :xl="8" class="mt40">
                <el-form :model="findPWDRuleForm" :rules="rules" ref="findPWDRuleForm" label-width="80px">
                    <el-form-item label="账户" prop="username">
                        <el-input v-model="findPWDRuleForm.username" @blur="findquestion('findPWDRuleForm')" placeholder="请输入您的用户名" clearable ></el-input>
                    </el-form-item>
                    <el-form-item label="选择问题" prop="question">
                    <el-select v-model="findPWDRuleForm.question" style="width:100%;" :disabled="find" placeholder="请选择问题">
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
                        <el-input v-model="findPWDRuleForm.answer" :disabled="find" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="newpassword">
                        <el-input type="password" v-model="findPWDRuleForm.newpassword" placeholder="请输入新密码" :disabled="find" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="确认密码" prop="doublenewpassword">
                        <el-input type="password" v-model="findPWDRuleForm.doublenewpassword" placeholder="请再次确认新密码" :disabled="find" clearable></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" >确认更改</el-button>
                        <el-button >重置</el-button>
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
import topheader from '@/components/common/topheader'
export default {
  name: 'findPWD',
  components: {
    topheader
  },
  data () {
    var validatorPass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else if (value !== this.registerRuleForm.newpassword) {
        callback(new Error('两次输入密码不一致'))
      } else {
        callback()
      }
    }
    return {
      find: true, // 判断俩密码框是否有禁用,在问题回答正确的前提下
      findPWDRuleForm: {
        username: '',
        newpassword: '',
        doublenewpassword: '',
        question: '',
        answer: ''
      },
      rules: {
        username: [
          {required: true, message: '请输入用户名', trigger: 'blur'},
          {min: 3, max: 10, message: '长度在3-10个字符', trigger: 'blur'}
        ],
        newpassword: [
          {required: true, message: '请输入密码', trigger: 'blur'},
          {min: 5, max: 15, message: '密码长度在5-15个字符', trigger: 'blur'}
        ],
        doublenewpassword: [
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
    findquestion (findPWDRuleForm) {
      this.$refs[findPWDRuleForm].validateField('username', (valid) => {
        if (!valid) {
          // 正确情况--向后台拿问题
          this.$http.get('/api/findPWD/findQuestion',{
              params: {
                  username: this.findPWDRuleForm.username
              }
          })
          .then((res) => {
              console.log(res)
          })
          .then((err) => {
              console.log(err)
          }) 
        } else {
          // 表单错误情况
          this.$message.error('表单错误')
          return false
        }
      })
    }
  }
}
</script>
<style lang='scss'>
.findPWDhtml {
    height: 100vh;
    position: relative;
    background-color: #b5b7bd;
  }
.findPWDForm {
    top: 1rem;
    position: relative;
}
</style>
