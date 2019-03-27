<template>
  <div class="font16 outside1 text-right">
    <div class="outside2 float-r">
      <i class="icon iconfont icon-laba iconfont16 outside3 ml5"></i>
      <span class="outside3">:</span>
      <span class="outside3 ml5">
        亲爱的用户{{username}}，{{NowTime}}欢迎浏览-书趣享电子图书分享系统，感谢使用!
      </span>
    </div>
  </div>  
</template>
<script>
export default {
  data() {
    return {
      username: '',
      NowTime: '',
      bookType: ''
    }
  },
  methods: {
    getNowTime: function () {
      var day = new Date()
      var Hour = day.getHours()
      this.NowTime = Hour < 12 ? '上午好！' : '下午好！'
    }
  },
  mounted () {
    this.getNowTime()
    this.username = this.$store.state.DLusername
  }
}
</script>
<style lang="scss">
  .outside1 {
    height: 32px;
    border-radius: 10px;
    overflow: hidden;
    background-color: rgba(162, 137, 137, 0.35)
  }
  .outside3 {
    display: inline-block;
    line-height: 32px;
  }
  .outside2 {
    width: auto;
    height: 32px;
    position: relative;
    left: 580px;
    animation: wordMove 18s linear infinite;
  }
  @keyframes wordMove 
  {
  0% {transform: translate(0, 0)}
  50% {transform: translate(-1010px, 0)}
  75% {transform: translate(-1010px, 0)}
  100% {transform: translate(-1620px, 0)}
  }
  
</style>
