<template>
    <el-row :gutter="20" class="headRow-bg">
        <el-col :xs="4" :sm="4" :md="4" :lg="4" :xl="4">
            <div class="col-content font22 mt5">
                <i class="icon iconfont icon-shu iconfont48">
                </i>
            </div>
        </el-col>
        <!-- 撑位置用 -->
        <el-col :xs="1" :sm="4" :md="6" :lg="8" :xl="4">
            <div class="col-content font22 mt10">
            </div>
        </el-col>
        <el-col :xs="6" :sm="6" :md="6" :lg="5" :xl="8">
            <div class="col-content font22 mt10">
                <el-input v-model="findArticle" placeholder="请输入相关书名">
                </el-input>
            </div>
        </el-col>
        <!-- 撑位置用 -->
        <el-col :xs="1" :sm="3" :md="3" :lg="2" :xl="4">
            <div class="col-content font22 mt10">
            </div>
        </el-col>
        <el-col :xs="3" :sm="2" :md="2" :lg="2" :xl="4">
            <div class="col-content font22 mt10">
                <i class="icon iconfont icon-tubiaozhizuomobanyihuifu- iconfont32">
                </i>
            </div>
        </el-col>
        <el-col :xs="8" :sm="4" :md="3" :lg="3" :xl="4">
            <div class="col-content font16 mt15">
                <i class="icon iconfont icon-denglu iconfont25">
                </i>
                /
                <i class="icon iconfont icon-zhuce iconfont25">
                </i>
            </div>
        </el-col>
    </el-row>
</template>
<script>
export default {
}
</script>
<style lang="scss">
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
