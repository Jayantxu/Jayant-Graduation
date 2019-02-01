<template>
  <div class="myselfArticleCenter">
    <el-row class="text-left ml10 mt10 h60">
      <el-switch class="mt20" style="vertical-align: top;" v-model="changeAbout" active-text="待发布文章" inactive-text="已发布文章">
      </el-switch>
    </el-row>
  <noArticle v-show="changeAbout"></noArticle>
  <yesArticle v-show="!changeAbout"></yesArticle>
  </div>
</template>
<script>
import noArticle from '../myselfArticle/noArticle'
import yesArticle from '../myselfArticle/yesArticle'
export default {
  components: {
    noArticle,
    yesArticle
  },
  data () {
    return {
     changeAbout: false
    }
  }
}
</script>
<style lang="scss">
  .myselfArticleCenter {
    width: 100%;
    height: 100vh;
    border: 2px solid black;
  }
</style>
