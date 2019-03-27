<template>
  <div class="recentLooking text-left mt15">
    <div class="recent1">
      <span class="font18 inline-block font-white ml10 mt10">您的最近阅读：</span>
      <div class="inline-block font-white recent1-1 ml30 mt20 hvr-float-shadow"></div>
      <span class="inline-block font-white ml40 mt10 font18">可能感兴趣：</span>
      <div class="inline-block font-white recent1-2 ml40 mt20 hvr-float-shadow"></div>
      <div class="inline-block font-white recent1-2 ml40 mt20 hvr-float-shadow"></div>
      <div class="inline-block font-white recent1-2 ml40 mt20 hvr-float-shadow"></div>
    </div>
    <div class="recent2"></div>
  </div>
</template>
<script>
export default {
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
  .recent1-2 {
    height: 140px;
    width: 110px;
    vertical-align: top;
    background: white;
  }
</style>
