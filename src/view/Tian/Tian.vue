<template>
  <div>
    <LanguageSwitch></LanguageSwitch>
    <div>时时过滤搜索</div>
    <Select  v-model="couponData"  filterable  multiple  @input="limitcount" style="width:400px" @on-query-change="searchInner">
      <Option v-for="item in checkBoxCount" :value="item.id" :key="item.id" :disabled="disabledMax15">
        <span>{{item.name}}</span>
      </Option>
    </Select>
    <div>
    <Tabs>
        <TabPane label="macOS" icon="logo-apple">
          <DatePicker type="date" placeholder="Select date" style="width: 200px"></DatePicker>
            <Button class="mg-bt-20" type="success" size="large">点击新增</Button>
            <div class="formWrap">
              <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
                <FormItem label="Name" prop="name">
                     <Input v-model="formValidate.name" placeholder="Enter your name"></Input>
                </FormItem>
                 <FormItem label="Age" prop="age">
                     <Input v-model="formValidate.name" placeholder="Enter your name"></Input>
                </FormItem>
                 <FormItem label="Adderss" prop="adress">
                     <Input v-model="formValidate.name" placeholder="Enter your name"></Input>
                </FormItem>
                <FormItem>
                    <Button type="primary" @click="handleSubmit('formValidate')">Submit</Button>
                  <Button @click="handleReset('formValidate')" style="margin-left: 8px">Reset</Button>
                </FormItem>
              </Form>
            </div>
           <Table border :columns="columns1" :data="data1"></Table>
        </TabPane>
        <TabPane label="Windows" icon="logo-windows">

        </TabPane>
        <TabPane label="Linux" icon="logo-tux">标签三的内容</TabPane>
    </Tabs>
    </div>
  </div>
</template>

<script>
import LanguageSwitch from '../../components/common/LanguageSwitch/LanguageSwitch'
export default {
    components: {
      LanguageSwitch
  },
  data () {
    return {
      formValidate: {
        name: '',
      },
      ruleValidate: {
      name: [
            { required: true, message: 'The name cannot be empty', trigger: 'blur' }
        ],
      age: [
          { required: true, message: 'The age cannot be empty', trigger: 'blur' }
      ],
      adress: [
          { required: true, message: 'The adress cannot be empty', trigger: 'blur' }
      ],
      },
      columns1: [
          {
              title: 'Name',
              key: 'name'
          },
          {
              title: 'Age',
              key: 'age'
          },
          {
              title: 'Address',
              key: 'address'
          }
      ],
        data1: [
          {
              name: 'John Brown',
              age: 18,
              address: 'New York No. 1 Lake Park',
              date: '2016-10-03'
          },
          {
              name: 'Jim Green',
              age: 24,
              address: 'London No. 1 Lake Park',
              date: '2016-10-01'
          },
          {
              name: 'Joe Black',
              age: 30,
              address: 'Sydney No. 1 Lake Park',
              date: '2016-10-02'
          },
          {
              name: 'Jon Snow',
              age: 26,
              address: 'Ottawa No. 2 Lake Park',
              date: '2016-10-04'
          }
      ],
      disabledMax15: false,
      couponData: '',
      checkBoxCount: [
        {id: 1, name: '红包1'},
        {id: 2, name: '红包2'},
        {id: 3, name: '红包3'},
        {id: 4, name: '红包4'},
        {id: 5, name: '红包5'},
      ],
      checkBoxCount2: [
        {id: 1, name: '红包1'},
        {id: 2, name: '红包2'},
        {id: 3, name: '红包3'},
        {id: 4, name: '红包4'},
        {id: 5, name: '红包5'},
      ]
    }
  },
  methods: {
    // 根据输入的数字过滤搜索对应的红包id
    searchInner (query) {
      let fCheckBoxCount = this.checkBoxCount2.filter((item) => {
        return `${item.id}`.indexOf(query) !== -1
      })
    this.checkBoxCount = fCheckBoxCount
  },
    limitcount (e) {
      // 最多选择4个
      if (e.length > 3 && e instanceof Array) {
        this.disabledMax15 = true
        this.$Message.error('最多选4个')
      } else {
        this.disabledMax15 = false
      }
    },
                handleSubmit (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.$Message.success('Success!');
                    } else {
                        this.$Message.error('Fail!');
                    }
                })
            },
  }
}
</script>

<style>
.formWrap {
  /* border: 1px solid #000; */
  width: 40%;
}
</style>