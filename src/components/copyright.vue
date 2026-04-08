<template>
  <div class="copyright">
    <p>
      <span class="company">北京奈凡信息科技有限公司</span>　
      <span class="icp mg-h5px">京ICP备19058569号-2</span>
      <span class="gongan">
        <img class="mg-h5px" src="@/assets/images/icon-gongan.png" alt="ICP图标" width="16" height="16">
        <a href="https://beian.mps.gov.cn/#/query/webSearch?code=11010602201848" rel="noreferrer" target="_blank">京公网安备11010602201848号</a>
      </span>
    </p>
  </div>
</template>

<style lang="scss" scoped>
.copyright {
  font-size: inherit;
  
  p {
    margin: 0;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  .mg-h5px {
    margin: 0 5px;
  }

  .gongan img {
    vertical-align: bottom;
  }
}
</style>