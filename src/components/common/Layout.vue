<template>
  <div class="layoutWrap">
    <Sidebar></Sidebar>
    <div class="routerView">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import Sidebar from './Sildebar'
export default {
    components: {
      Sidebar
    }
}
</script>

<style lang="less">
.layoutWrap {
  overflow-y: auto;
  padding: 10px 20px;
  background-color: #fff;
  height: 100%;
  max-width: calc(100% - 10px);
  margin-left: 270px;
  box-shadow: 0px 2px 16px -11px rgba(0,0,0,0.5);
}
</style>