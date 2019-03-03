<template>
  <div>
    <div>
      <el-row class="text-left h40">
        <span class="font22 absolute ml10 mt10">当前系统公告</span>
      </el-row>
      <el-row class="ml10 font16 mt10 text-left">
        <div class="" style="height:0.7rem;">{{NowAnnounce.announce}}</div>
        <div class="mt5 float-r mr20">{{NowAnnounce.form}}</div>
        <div class="mt10 float-r mr20 clear">{{NowAnnounce.commitTime.split('T')[0]}}</div>
      </el-row>
    </div>
    <hr style="margin:20px 0;">
    <div>
      <el-row class="text-left h40">
        <span class="font22 absolute ml10 mt10">新公告发布</span>
      </el-row>
      <el-row class="ml10">
        <el-col :span="12">
          <el-form :model="commitAnnounceForm" :rules="commitAnnounceRule" ref="commitAnnounceForm">
            <el-form-item label="请输入新公告" prop="newAnnouncetextarea">
              <el-input
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 10}"
                placeholder="请输入内容"
                v-model="commitAnnounceForm.newAnnouncetextarea">
              </el-input>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="8" :offset="4" class="mt50">
          <el-button type="primary" @click="submitForm('commitAnnounceForm')">提交</el-button>
          <el-button @click="resetForm('commitAnnounceForm')">重置</el-button>
        </el-col>
      </el-row>
    </div>
  </div>  
</template>
<script>
export default {
  data () {
    return {
      NowAnnounce: '',
      commitAnnounceForm: {
        newAnnouncetextarea: ''
      },
      commitAnnounceRule: {
        newAnnouncetextarea: [
          {required: true, message: '请输入新公告', trigger: 'blur'},
          {min: 5, max: 250, message: '新公告长度在5-250个字符', trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    submitForm (commitAnnounceForm) {
      this.$refs[commitAnnounceForm].validate((valid) => {
        if (valid) {
          this.$http.post('/api/userCenter/newAnnounce', {
            params: {
              announce: this.commitAnnounceForm.newAnnouncetextarea,
              username: this.$store.state.DLusername
            }
          })
            .then((res) => {
              var json = res.data
              if (json.code !== '0') {
                return Promise.reject(json.msg)
              } else {
                this.$message.success(json.msg)
                this.getNowAnnounce()
              }
            })
            .catch((err) => {
              this.$message.error(err)              
            })
        } else {
          this.$message.error('新公告未填写')
        }
      })
    },
    resetForm (commitAnnounceForm) {
      this.$refs[commitAnnounceForm].resetFields()
    },
    // 获取当前最新公告
    getNowAnnounce () {
      this.$http.get('/api/userCenter/nowAnnounce')
        .then((res) => {
          var json = res.data
          if (json.code !== '0') {
            return Promise.reject(json.msg)
          } else {
            this.NowAnnounce = json.data.anno[0]
          }
        })
        .catch((err) => {
          this.$message.error(err)
        })
    }
  },
  mounted: function () {
    this.getNowAnnounce()
  }
}
</script>
<style>
</style>

