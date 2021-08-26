<template>
  <div>
      <Dropdown>
          <a href="javascript:void(0)">
              {{currrentLauage}}
              <Icon type="ios-arrow-down"></Icon>
          </a>
      <DropdownMenu slot="list">
          <DropdownItem @click.stop.native="switchLanguage('简体中文')">简体中文</DropdownItem>
          <DropdownItem @click.stop.native="switchLanguage('English')">English</DropdownItem>
      </DropdownMenu>
      </Dropdown>
  </div>
</template>

<script>
export default {
  data () {
    return {
      currrentLauage: '简体中文',
      objLauage :{'zh': '简体中文', 'en': 'English'}
    }
  },
  created () {
      this.currrentLauage = this.objLauage[localStorage.getItem('lang')]
  },
  methods: {
    switchLanguage (lauage) {
        this.$router.go(0)
        if (lauage == '简体中文') {
            localStorage.setItem('lang', 'zh')
        } else {
            localStorage.setItem('lang', 'en')
        }
        this.currrentLauage = this.objLauage[localStorage.getItem('lang')]
    }
  }
}
</script>

<style>

</style>