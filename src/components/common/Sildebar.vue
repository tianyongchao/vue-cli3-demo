<template>
<div class="lauoutWrap">
    <Row>
        <Col >
            <Menu>
                <Submenu name="1">
                    <template slot="title">
                        <Icon type="ios-paper" />
                        常用功能demo
                    </template>
                    <MenuItem name="1-1" to="/market/tian">input时时搜索</MenuItem>
                    <MenuItem name="1-2">评论管理</MenuItem>
                    <MenuItem name="1-3">举报管理</MenuItem>
                </Submenu>
                <Submenu name="2">
                    <template slot="title">
                        <Icon type="ios-people" />
                        用户管理
                    </template>
                    <MenuItem name="2-1">新增用户</MenuItem>
                    <MenuItem name="2-2">活跃用户</MenuItem>
                </Submenu>
                <Submenu name="3">
                    <template slot="title">
                        <Icon type="ios-stats" />
                        统计分析
                    </template>
                    <MenuGroup title="使用">
                        <MenuItem name="3-1">新增和启动</MenuItem>
                        <MenuItem name="3-2">活跃分析</MenuItem>
                        <MenuItem name="3-3">时段分析</MenuItem>
                    </MenuGroup>
                    <MenuGroup title="留存">
                        <MenuItem name="3-4">用户留存</MenuItem>
                        <MenuItem name="3-5">流失用户</MenuItem>
                    </MenuGroup>
                </Submenu>
            </Menu>
        </Col>
    </Row>
    </div>
</template>
<script>
    export default {
        data () {
            return {

            }
        }
    }
</script>
<style scoped lang="scss">
.lauoutWrap {
  background-color: #fff;
  box-shadow: 0px 2px 16px -11px rgba(0,0,0,0.5);
  position: fixed;
  top: 0;
  left: 15px;
  height: 100%;
  max-width: 300px;
  z-index: 10;

}
.ivu-menu-vertical.ivu-menu-light:after {
  background: none;
}
</style>
