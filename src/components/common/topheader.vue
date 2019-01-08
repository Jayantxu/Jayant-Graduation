<template>
    <div>
        <div class="TOPhead">
            <el-row :gutter="10" class="headRow-bg">
                <el-col :xs="4" :sm="4" :md="4" :lg="4" :xl="4">
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
                <el-col :xs="10" :sm="7" :md="6" :lg="6" :xl="8">
                    <div class="col-content font22 mt10">
                        <el-input style="width:70%;" placeholder="请输入相关书名" suffix-icon="el-icon-search">
                        </el-input>
                    </div>
                </el-col>
                <!-- 撑位置用 -->
                <el-col :xs="1" :sm="1" :md="3" :lg="2" :xl="4">
                    <div class="col-content font22 mt10">
                    </div>
                </el-col>
                <!-- 首页icon -->
                <el-col :xs="2" :sm="2" :md="1" :lg="1" :xl="4">
                    <div class="col-content font22 mt10">
                        <i class="icon iconfont icon-home_icon iconfont32">
                        </i>
                    </div>
                </el-col>
                <!-- 用户icon -->
                <el-col :xs="0" :sm="2" :md="1" :lg="1" :xl="4">
                    <div class="col-content font22 mt10">
                        <i class="icon iconfont icon-tubiaozhizuomobanyihuifu- iconfont32 ">
                        </i>
                    </div>
                </el-col>
                <!-- 登录/注册 -->
                <el-col :xs="7" :sm="4" :md="3" :lg="3" :xl="4">
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
        <el-dialog title='用户登录' class="text-left normal-font-size" :visible.sync="LoginDialogVisible" width="30%" >
            <el-form label-width="20%">
                <el-form-item label="账户" >
                    <el-input ></el-input>
                </el-form-item>
                <el-form-item label="密码 " >
                    <el-input ></el-input>
                </el-form-item>
            </el-form>
            <span @click='returnfindPWD()' class="text-right inline-block vw100 hover-click">忘记密码？</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="LoginDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="LoginDialogVisible = false">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
export default {
  name: 'topheader',
  data () {
    return {
      LoginDialogVisible: false
    }
  },
  methods: {
    returnRegister: function () {
      location.href = './register'
    },
    returnfindPWD: function () {
      location.href = './findPWD'
    }
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
<<<<<<< HEAD
    /*悬浮变色与下划线*/
=======
>>>>>>> 分享系统--找回密码
    .hover-click {
        cursor: pointer;
        &:hover {
            text-decoration: underline;
            color: rgb(149, 153, 152);
        }
    }
</style>
