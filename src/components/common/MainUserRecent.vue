<template>
  <div class="recentLooking text-left mt15" v-if="successBack" v-loading="recentBookLoading">
    <div class="recent1">
      <span class="font18 inline-block font-white ml10 mt10">您的最近阅读：</span>
      <div class="inline-block font-white recent1-1 ml30 mt20 hvr-float-shadow">
        <img style="vertical-align:middle" class="recent-book-img" @click="lookArticle('recent', true)" src="../../assets/Image/图片无法加载1.jpg" alt=""/>
      </div>
      <span class="inline-block font-white ml40 mt10 font18">可能感兴趣：</span>
      <div class="inline-block font-white recent1-2 ml60 mt20 hvr-float-shadow" v-for="i of Recommend">
        <img style="vertical-align:middle" class="recommend-book-img" @click="lookArticle(i, false)" src="../../assets/Image/图片无法加载1.jpg" alt=""/>
      </div>
    </div>
    <div class="recent2">
      <div class="recent2-1 text-center float-l">
        <span class="inline-block ml40 font18 font-white hvr-wobble-top">{{Recent.looktitle}}</span>
      </div>
      <div class="recent2-2 text-center float-r">
        <div style="width: 33.3%" class="text-center float-l" v-for="i of Recommend">
          <span class="inline-block  font18 font-white hvr-wobble-top" >
            {{i.title}}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      Recent: {},
      Recommend: {},
      successBack: true,
      recentBookLoading: true
    }
  },
  methods: {
    lookArticle (item, bool) {
      var bookusername
      var booktitle
      if (bool) {
        bookusername = this.Recent.lookauthor
        booktitle = this.Recent.looktitle
      } else {
        bookusername = item.username
        booktitle = item.title
      }
      window.open(`/lookArticle?bookusername=${bookusername}&booktitle=${booktitle}&ls=false`)
    },
    getRecentLookAndRecommend () {
      this.$http.get('/api/main/findRecentRecommend',{
        params: {
          username: this.$store.state.DLusername
        }
      }).then((json) => {
        var json = json.data
        if (json.code !== '0') {
          return Promise.reject(json.msg)
        }
        this.Recent = json.data.recentResultData
        this.Recommend = json.data.recommendResultData
        this.successBack = true
        this.recentBookLoading = false
        console.log(this.Recent)
        console.log(this.Recommend)
      }).catch((err) => {
        this.successBack = false
        console.log(err)
      })
    }
  },
  mounted () {
    this.getRecentLookAndRecommend()
  }
}
</script>
<style lang="scss">
  .recentLooking {
    width: 100%;
    height: 215px;
  }
  .recent1 {
    width: 98%;
    height: 180px;
    border-radius: 10px 10px 0 0;
    transform: translateX(8px);
    background-image: url(../../assets/Image/背景.png);
    background-repeat: no-repeat;
    background-size: 100% 180px;
    background-color: rgba(240, 248, 255, 0.116);
  }
  .recent2 {
    width: 98%;
    height: 30px;
    transform: skew(-30deg);
    border-radius:0 0 5px 5px;
    background-image: url(../../assets/Image/书架.png);
  }
  .recent1-1 {
    height: 140px;
    width: 110px;
    vertical-align: top;
    background: white;
  }
  .recent-book-img {
    height: 140px;
    width: 110px;
  }
  .recent1-2 {
    height: 140px;
    width: 110px;
    vertical-align: top;
    background: white;
  }
  .recommend-book-img {
    height: 140px;
    width: 110px;
  }
  .recent2-1 {
    width: 40%;
    height: 30px;
  }
  .recent2-2 {
    width: 55%;
    height: 30px;
  }
</style>
