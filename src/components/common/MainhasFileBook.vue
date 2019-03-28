<template>
  <div class="MainhasFileBook text-left mt30" v-loading="mainhasfileBookLoading" v-if="mainhasfileBookShow">
    <div class="MainhasFileBook1">
      <!-- 清除margin重叠 -->
      <div style="overflow: hidden;">
        <span class="inline-block font-bold ml20 mt20 font18" style="width: 85%">
          电子文件书籍书籍:
        </span>
        <div class="inline-block">
          <span class="ml40 mt10 font16 hvr-skew-forward" @click="returnhasFileArticle">
            查看所有
          </span>
        </div>
      </div>
      <div class="MainhasFileBook1-1 mt10 text-center">
        <div class="inline-block font-white MainhasFileBook1-2 ml30 mt10" v-for="item of MainhasFileBookList">
          <img style="vertical-align:middle" class="MainhasFile-book-img hvr-wobble-to-bottom-right" @click="lookArticle(item.title, item.username)" src="../../assets/Image/图片无法加载1.jpg" alt=""/>
          <div style="overflow: hidden; width: 150px;">
            <span class="font16 font-black MainhasFile-book-span inline-block hvr-pop mt10">{{item.title}}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      mainhasfileBookLoading: true,
      mainhasfileBookShow: true,
      MainhasFileBookList: []
    }
  },
  methods: {
    lookArticle (title, username) {
      window.open(`/lookArticle?bookusername=${username}&booktitle=${title}&ls=false`)
    },
    // 按分类查看
    returnhasFileArticle () {
      var ID = 2
      var type = '附件书籍'
      window.open(`/TypeArticle?typeID=${ID}&type=${type}`)
    },
    chooseBookType ($typeID, $nowPage) {
      this.$http.get('/api/BookType/GetBook', {
        params: {
          bookTypeID: $typeID,
          bookTypePage: $nowPage
        }
      }).then((json) => { 
        var result = json.data
        if (result.code !== '0') {
          return Promise.reject(result.msg)
        }
        this.MainhasFileBookList = result.data.BookList.slice(0,5)
        this.mainhasfileBookLoading = false
        this.mainhasfileBookShow = true
      }).catch((err) => {
        this.mainhasfileBookShow = false
      })
    }
  },
  mounted () {
    this.chooseBookType(2 ,1)
  }
}
</script>
<style lang="scss">
  .MainhasFileBook {
    width: 100%;
    height: 260px;
  }
  .MainhasFileBook1 {
    width: 98%;
    height: 240px;
    transform: translateX(8px);
    border-radius: 10px 10px 0 0;
    background: rgba(219, 219, 219, 0.356);
  }
  .MainhasFileBook1-1 {
    width: 100%;
    height: 205px;
  }
  .MainhasFileBook1-2 {
    height: 140px;
    width: 150px;
    vertical-align: top;
  }
  .MainhasFile-book-img {
    height: 140px;
    width: 110px;
  }
  .MainhasFile-book-span {
    line-height: 18px;
    width: 150px;
  }
</style>
