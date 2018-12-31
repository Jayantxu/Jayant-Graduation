<template>
    <el-row >
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <div class="col-content bg-purple">
                顶部栏
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
        border-radius: 1px;
    }
    .bg-purple {
        background: #d3dce6;
    }
    .col-content {
        border-radius: 4px;
        min-height: 36px;
    }
</style>
