<template>
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
                    <el-input style="width:70%;" placeholder="请输入相关书名">
                    </el-input>
                    <i class="icon iconfont icon-sousuo iconfont32 float-r mt5 ml10">
                    </i>
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
                    <i class="icon iconfont icon-denglu iconfont25">
                    </i>
                    /
                    <i class="icon iconfont icon-zhuce iconfont25">
                    </i>
                </div>
            </el-col>
        </el-row>
    </div>
</template>
<script>
export default {
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
</style>
