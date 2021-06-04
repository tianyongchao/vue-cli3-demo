<template>
  <div class="report timeList" @click.stop>
    <div class="search">
      {{ $t("system35") }}
      <Select v-model="dataType" class="selectType">
        <Option
          value="Events Data"
          @click.stop.native="dataSelectType('Events Data', 0)"
          >Events Data</Option
        >
        <Option
          value="User Data"
          @click.stop.native="dataSelectType('User Data', 1)"
          >User Data</Option
        >
        <Option
          value="Depositor Data"
          @click.stop.native="dataSelectType('Depositor Data', 2)"
          >Depositor Data</Option
        >
        <Option
          value="Leads Data"
          @click.stop.native="dataSelectType('Leads Data', 3)"
          >Leads Data</Option
        >
        <Option
          value="Coupon Data"
          @click.stop.native="dataSelectType('Coupon Data', 4)"
          >Coupon Data</Option
        >
      </Select>
      <span v-if="dataType !== 'Leads Data'">{{ listId == '2' ? $t("firstDepositTime") : $t("system7") }}</span>
      <span v-if="dataType == 'Leads Data'">{{ $t("entryTime") }}</span>
      <DatePicker
        :open="open"
        :value="dates"
        confirm
        type="daterange"
        class="fixation"
        @on-change="handleChange"
        @on-clear="handleClear"
        @on-ok="handleOk"
      >
        <a href="javascript:void(0)" @click.stop="handleClick" class="times">
          <span>{{ month }}</span>
        </a>
      </DatePicker>
      <template v-if="dataType === 'Events Data'">
        {{ $t("system19") }}
        <DatePicker
          style="margin-left: 10px"
          @click.stop
          v-model="EventsStartingTime"
          type="datetime"
          placeholder="Starting time"
          lang="en"
          confirm
        ></DatePicker>
        -
        <DatePicker
          @click.stop
          v-model="EventsEndTime"
          type="datetime"
          placeholder="End Time"
          lang="en"
          confirm
        ></DatePicker>
      </template>
      <Form>
        <div class="redenvelopeWrap">
          红包名称
          <Select v-if="dataType === 'Coupon Data'" v-model="couponData"  filterable  multiple :remote-method="searchInner" style="width:500px">
            <Option v-for="item in checkBoxCount" :value="item.id" :key="item.id" >{{item.operation_name}}</Option>
          </Select>
        </div>
      </Form>
      <Button type="primary" shape="circle" @click="reportSearch">{{
        $t("system43")
      }}</Button>
      <!--<selection></selection>-->
    </div>
        <Modal v-model="modalCouponData" class="modalWrap">
          <div>
            <span>已选择</span>
            <div id="chatContainer" class="tagWrap mg-tp-10">
              <Tag class="modalTags" v-for="item in tagCount" :key="item.id" size="medium" :name="item" closable  @on-close="handleClose2">{{ getOperationName(item)}}</Tag>
            </div>
          </div>
          <div class="searchWrap display-flex">
            <Input v-model="checkBoxCountName" />
            <Icon class="icon" type="ios-search-outline" @click="searchInner"/>
          </div>
          <div class="checkBoxWrap">
            <CheckboxGroup v-model="tagCount" @on-change="handleClose2">
                <div class="mg-tp-10" v-for="item in checkBoxCount" :key="item.id">
                  <Checkbox :label="item.id" >{{item.operation_name}}</Checkbox>
                </div>
            </CheckboxGroup>
          </div>
        </Modal>
    <div class="content" id="sourceConrent" v-show="!isLoading">
      <ul>
        <!--  1.报告文件名称 2.注册日期（Leads Data时候名字改为录入时间） 3.事件发生时间 4.下载链接 5.链接生成时间 6.操作人-->
        <li>{{ $t("rportName1") }}</li>
        <li>
          <span v-if="dataType !== 'Leads Data'">{{ listId == '2' ? $t("firstDepositTime") : $t("system7") }}</span>
          <span v-if="dataType == 'Leads Data'">{{ $t("entryTime") }}</span>
        </li>
        <li v-if="evensShow && dataType === 'Events Data'">
          {{ $t("system19") }}
        </li>
        <li>{{ $t("rportName2") }}</li>
        <li>{{ $t("rportName5") }}</li>
        <li
          v-if="
            evensShow
          "
        >
          {{ $t("rportNameCreator") }}
        </li>
      </ul>
      <ul v-for="item in list" :key="item.id">
        <li>{{ item.file_name || "Getting..." }}</li>
        <li>{{ item.reg_start }} - {{ item.reg_end }}</li>
        <li v-if="evensShow && dataType === 'Events Data'">
          {{ item.event_start }} - {{ item.event_end }}
        </li>
        <li v-if="item.type === 0 && item.file_name !== ''">
          <a href="javascript:void(0);" @click="reportDownloadx(item.id)"
            >www.tigerwitEvents.com</a
          >
        </li>
        <li v-else-if="item.file_name == ''">generating...</li>
        <li v-else-if="item.type === 1 && item.file_name !== ''">
          <a href="javascript:void(0);" @click="reportDownloadx(item.id)"
            >www.tigerwitUser.com</a
          >
        </li>
        <li v-else-if="item.type == 2 && item.file_name !== ''">
          <a href="javascript:void(0);" @click="reportDownloadx(item.id)"
            >www.tigerwitUser.com</a
          >
        </li>
        <li v-else-if="item.type == 3 && item.file_name !== ''">
          <a href="javascript:void(0);" @click="reportDownloadx(item.id)"
            >www.tigerwitUser.com</a
          >
        </li>
        <li>{{ item.updated_at }}</li>
        <li
          v-if="
            evensShow
          "
        >
          {{ item.user_name }}
        </li>
      </ul>
    </div>
    <Row v-if="isLoading">
      <Col class="demo-spin-col" span="50" style="margin-top: 50px">
        <Spin fix class="demo-spin-loading">
          <Icon type="load-c" size="35" class="demo-spin-icon-load"></Icon>
          <div>{{ $t("Loading") }}...</div>
        </Spin>
      </Col>
    </Row>
  </div>
</template>

<script>
import { bindBusEvent, selectLang, times } from '@/util'
import { rawDataIndex, rawDataEvent, rawDataDownloadx, getBonus } from '@/http/power'
export default {
  name: 'report',
  destroyed () {
    clearTimeout(this.windowTime)
  },
  mounted () {
    let _this = this
    _this.EventsEndTime = this.timeType(new Date())
    const start = new Date(new Date(new Date().toLocaleDateString()).getTime())
    _this.EventsStartingTime = this.timeType(start)
    if (localStorage.getItem('time')) {
      let month = JSON.parse(localStorage.getItem('time')).start.split('-')
      this.ismonth = JSON.parse(localStorage.getItem('time')).ismonth
      if (this.ismonth) {
        let time = JSON.parse(localStorage.getItem('time'))
        console.log(time.start.length)
        this.month = time.start + '-' + time.end
        // this.month = month[0] + '-' + month[1]
        console.log(this.month)
        this.regStart = month[0]
        this.regEnd = month[1]
      } else {
        // 这里不需要时分秒 去掉
        let startTime = JSON.parse(localStorage.getItem('time')).start
        let endTime = JSON.parse(localStorage.getItem('time')).end
        let isStartTime = startTime.length > 11 ? startTime.split(' ')[0] : startTime
        let isEndTime = endTime.length > 11 ? startTime.split(' ')[0] : endTime
        this.month = isStartTime + '-' + isEndTime
        this.regStart = JSON.parse(localStorage.getItem('time')).start
        this.regEnd = JSON.parse(localStorage.getItem('time')).end
      }
    }
    if (sessionStorage.getItem('dates')) {
      let querydate = JSON.parse(sessionStorage.getItem('dates'))
      if (querydate === 0) {
        _this.text = selectLang().PerDay
      } else if (querydate === 1) {
        _this.text = selectLang().PerWeek
      } else if (querydate === 2) {
        _this.text = selectLang().PerMonth
      } else {
        _this.text = selectLang().PerYear
      }
    }
    _this.TIGER_BI.BUS.$on('Layout.closeDatePicker', function (data) {
      _this.open = false
      _this.openDate = false
      _this.isdate = false
      _this.yearOpen = false
      _this.Cancel()
    })
    bindBusEvent('vanishTime', function (data) {
      let path = data.path.split('/')
      if (path.indexOf('finances_index') === -1) {
        _this.isshow = true
      } else {
        _this.isshow = false
      }
    })
    bindBusEvent('particulars.isshow', function (data) {
      _this.fixed = data
    })
    this.refresh()
  },
  created () {
    this.getBonusList()
    this.rawDataList()
    if (
      !localStorage.getItem('selectTypeListId') &&
      !localStorage.getItem('selectType')
    ) {
      localStorage.setItem('selectType', 'User Data')
      localStorage.setItem('selectTypeListId', 1)
    }
  },
  data () {
    return {
      checkBoxCountName: '', // 搜索（红包）时候内容
      checkBoxCount: [], // checkBox（红包）数量
      checkBoxCount2: [],
      tagCount: [],  // 选中标签（红包）的数量
      modalCouponData: false,  // 红包弹框状态
      couponData: '',
      windowTime: null,
      listId: localStorage.getItem('selectTypeListId'),
      list: [],
      evensShow: true,
      regStart: null,
      regEnd: null,
      createTime: true,
      isLoading: false,
      dataType: localStorage.getItem('selectType'),
      EventsStartingTime: null,
      EventsEndTime: null,
      openDate: false,
      isshow: true,
      fixed: true,
      text: selectLang().AbscissaUnit,
      lists: this.list,
      open: false,
      dates: [times().start, times().end],
      srt: selectLang().Customized,
      month: times().month,
      //      month: null,
      ismonth: true,
      year: times().year,
      yearOpen: false,
      section: [],
      isdate: false,
      start: null,
      end: null,
      months: [
        {
          name: selectLang().Jan,
          value: '01',
          status: false,
          bgcolor: false
        },
        {
          name: selectLang().Feb,
          value: '02',
          status: false,
          bgcolor: false
        },
        {
          name: selectLang().Mar,
          value: '03',
          status: false,
          bgcolor: false
        },
        {
          name: selectLang().Apr,
          value: '04',
          status: false,
          bgcolor: false
        },
        {
          name: selectLang().May,
          value: '05',
          status: false,
          bgcolor: false
        },
        {
          name: selectLang().Jun,
          value: '06',
          status: false,
          bgcolor: false
        },
        {
          name: selectLang().Jul,
          value: '07',
          status: false,
          bgcolor: false
        },
        {
          name: selectLang().Aug,
          value: '08',
          status: false,
          bgcolor: false
        },
        {
          name: selectLang().Sep,
          value: '09',
          status: false,
          bgcolor: false
        },
        {
          name: selectLang().Oct,
          value: '10',
          status: false,
          bgcolor: false
        },
        {
          name: selectLang().Nov,
          value: '11',
          status: false,
          bgcolor: false
        },
        {
          name: selectLang().Dec,
          value: '12',
          status: false,
          bgcolor: false
        }
      ]
    }
  },
  methods: {
        // 过滤搜索
    searchInner (query) {
      let fCheckBoxCount = this.checkBoxCount2.filter((item) => {
        return `${item.id}`.indexOf(query) !== -1
        // return `${item.id}` === this.checkBoxCountName
      })
      this.checkBoxCount = fCheckBoxCount
    },
    // 根据红包id获取到红包名字
    getOperationName (id) {
      let data = this.checkBoxCount.find((item) => {
        return item.id === id
      })
      return data.operation_name
    },
    getBonusList () {
      getBonus().then((res) => {
        console.log(res)
        let data = res.data
        console.log(data)
        if (data.is_succ) {
          this.checkBoxCount = data.data
          this.checkBoxCount2 = data.data
          console.log(this.checkBoxCount)
        }
      })
    },
    handleClose2 (event, name) {
      if (name) {
        const index = this.tagCount.indexOf(name)
        this.tagCount.splice(index, 1)
      }
    },
    refresh () {
      this.windowTime = setTimeout(() => {
        let oParam = {
          type: this.listId
        }
        rawDataIndex(oParam).then((res) => {
          if (oParam.type === this.listId) {
            this.list = res.data.data
          }
        })
        this.refresh()
      }, 3000)
    },
    dataSelectType (type, id) {
      console.log(id, this.listId)
      if (id === this.listId) return
      clearTimeout(this.windowTime)
      this.list = []
      localStorage.setItem('selectType', type)
      this.dataType = localStorage.getItem('selectType')
      localStorage.setItem('selectTypeListId', id)
      this.listId = localStorage.getItem('selectTypeListId')
      let oParam = {
        type: this.listId
      }

      rawDataIndex(oParam).then((res) => {
        if (oParam.type === this.listId) {
          this.list = res.data.data
        }
        this.refresh()
      })
    },
    handleClick () {
      this.open = !this.open
      this.openDate = false
      this.isdate = false
    },
    handleChange (date) {
      this.dates = date
    },
    handleClear () {
      this.open = false
    },
    handleOk () {
      if (!(this.dates[0] === '' || this.dates[1] === undefined)) {
        //        let times = {
        //          start: this.dates[0],
        //          end: this.dates[1],
        //          ismonth: false
        //        }
        //        localStorage.setItem('time', JSON.stringify(times))
        //        sessionStorage.setItem('form', JSON.stringify(1))
        this.month = this.dates[0] + '-' + this.dates[1]
        this.ismonth = false
        this.open = false
        this.TIGER_BI.BUS.$emit('selection.Date', {
          start: this.dates[0],
          end: this.dates[1]
        })
        this.date = []
        this.months.forEach((item) => {
          item.status = false
          item.bgcolor = false
        })
        this.regStart = this.dates[0]
        this.regEnd = this.dates[1]
      }
    },
    time (item) {
      // 选择时间
      this.section.push(this.year + '-' + item.value)
      if (this.section.length > 2) {
        this.section.shift()
      }
      //
      if (this.section.length === 1) {
        let start = this.section[0].split('-')
        this.months.forEach((item) => {
          if (item.value === start[1]) {
            item.status = true
          }
        })
      } else if (this.section.length === 2) {
        let start = null
        let end = null
        let d1 = new Date(this.section[0])
        let d2 = new Date(this.section[1])
        if (Date.parse(d1) > Date.parse(d2)) {
          start = this.section[1].split('-')
          end = this.section[0].split('-')
        } else {
          start = this.section[0].split('-')
          end = this.section[1].split('-')
        }
        this.start = start
        this.end = end
        // 判断是否跨年选择月份
        if (start[0] === end[0]) {
          this.months.forEach((item) => {
            if (item.value === start[1] || item.value === end[1]) {
              item.status = true
            } else {
              item.status = false
            }
            if (
              parseInt(item.value) > parseInt(start[1]) &&
              parseInt(item.value) < parseInt(end[1])
            ) {
              item.bgcolor = true
            } else {
              item.bgcolor = false
            }
          })
        } else {
          this.months.forEach((item) => {
            if (Date.parse(d1) > Date.parse(d2)) {
              if (item.value === this.start[1]) {
                item.status = true
              } else {
                item.status = false
              }
              if (item.value > this.start[1]) {
                item.bgcolor = true
              } else {
                item.bgcolor = false
              }
            } else {
              if (item.value === this.end[1]) {
                item.status = true
              } else {
                item.status = false
              }
              if (item.value < this.end[1]) {
                item.bgcolor = true
              } else {
                item.bgcolor = false
              }
            }
          })
        }
      }
    },
    Cancel () {
      // 取消
      this.year = times().year
      this.isdate = false
      this.section = []
      this.start = null
      this.end = null
      this.months.forEach((item) => {
        item.status = false
        item.bgcolor = false
      })
    },
    rawDataList () {
      this.isLoading = true
      let oParam = {
        type: this.listId
      }
      rawDataIndex(oParam).then((res) => {
        this.list = res.data.data
        this.isLoading = false
      })
    },
    timeType (time) {
      let timsddd = time
      let dataTime = new Date(timsddd)
      let month = dataTime.getMonth() + 1
      let strDate = dataTime.getDate()
      let hours = dataTime.getHours()
      let minutes = dataTime.getMinutes()
      let seconds = dataTime.getMinutes()
      if (month >= 1 && month <= 9) {
        month = '0' + month
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = '0' + strDate
      }
      if (hours >= 0 && hours <= 9) {
        hours = '0' + hours
      }
      if (minutes >= 0 && minutes <= 9) {
        minutes = '0' + minutes
      }
      if (seconds >= 0 && seconds <= 9) {
        seconds = '0' + seconds
      }
      return (
        dataTime.getFullYear() +
        '-' +
        month +
        '-' +
        strDate +
        ' ' +
        hours +
        ':' +
        minutes +
        ':' +
        minutes
      )
    },
    reportSearch (name, type) {
      let dateValueStarting = this.timeType(this.EventsStartingTime)
      let dateValueEnd = this.timeType(this.EventsEndTime)
      this.evensShow = true
      let oParam = {
        type: this.listId,
        reg_start: this.regStart,
        reg_end: this.regEnd,
        event_start: dateValueStarting,
        event_end: dateValueEnd
      }
      rawDataEvent(oParam).then((res) => {
        this.rawDataList()
      })
    },
    reportDownloadx (id) {
      Response.Charset = 'GB2312'
      window.open(window.location.origin + rawDataDownloadx + '?id=' + id)
    }
  },
  computed: {
  },
  watch: {
    tagCount () {
      console.log(this.tagCount)
      let chatContainer = document.getElementById('chatContainer')
      this.$nextTick(() => {
        // 超过最大高度，出现滚动条后，新增的标签始终在后面追加时候，滚动条在最下面
        chatContainer.scrollTop = chatContainer.scrollHeight
      })
    }
  }
}
</script>

<style scoped lang="scss">
.report {
  .search {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    padding: 0 20px;
    width: 100%;
    height: 56px;
    line-height: 56px;
  }
  .selectType {
    width: 196px;
    margin: 0 10px;
  }
  .fixation {
    margin: 0 10px;
    display: inline-block;
    width: 196px;
    height: 32px;
    background: #ffffff;
    box-sizing: border-box;
    outline: none;
    user-select: none;
    cursor: pointer;
    background-color: #fff;
    border-radius: 4px;
    line-height: 30px;
    border: 1px solid #dddee1;
    a {
      box-sizing: border-box;
      display: block;
      width: 100%;
      height: 100%;
      padding: 0 5px;
      color: #495060;
      span {
        display: inline-block;
        width: 100%;
        height: 100%;
      }
    }
  }
  .ivu-btn-primary {
    margin-left: 20px;
    width: 89px;
    font-size: 14px;
    padding: 5px 0px;
    font-weight: 500;
    color: $font-color;
    @include gradient-horizontal($brand-primary-light, $brand-primary-mid);
    box-shadow: 0px 2px 10px lighten($brand-primary-mid, 30%);
    border: 1px solid $brand-primary-light;
    &:hover {
      color: $font-color;
    }
  }
  .content {
    padding: 10px;
    ul {
      box-sizing: border-box;
      /*padding: 0 26px;*/
      background: $white;
      display: flex;
      justify-content: space-around;
      height: 80px;
      line-height: 80px;
      margin-bottom: 10px;
      li {
        width: 20%;
        text-align: center;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      &:first-child {
        height: 50px;
        line-height: 50px;
        color: #4a4a4a;
      }
    }
  }
  .redenvelopeWrap {
     /deep/.ivu-select-selection {
        overflow-y: auto;
        max-height: 75px;
    }
  }
}
.modalWrap {
    .tagWrap {
      overflow-y: auto;
      max-height: 200px;
    .modalTags {
      text-align: center;
      // width: 100px;
      margin:  5px 10px;
      background: $brand-primary-mid;
      }
    }
  .searchWrap {
    align-items: center;
    padding: 20px 10px;
    width: 280px;
    .icon {
      font-size: 18px;
      margin: 0 5px;
    }
  }
  .checkBoxWrap {
    max-height: 300px;
    overflow-y: auto;
    padding:  0 10px;
  }
}
.timeList /deep/ .mx-datepicker-popup {
  top: 35px !important;
  left: -24px !important;
}
.timeList /deep/ .mx-calendar-content .cell.actived {
  background: $brand-primary-mid;
}
.timeList /deep/ .mx-datepicker-btn-confirm:hover {
  color: $brand-primary-mid;
  border-color: $brand-primary-mid;
}
.timeList /deep/ .mx-input {
  border: 1px solid #dddee1;
  border-radius: 4px;
  height: 32px;
  font-size: 12px;
}
</style>