<template>
<div class="loginWrap">
    <div class="loginInner">
      <h2>{{ $t('login.login') }}</h2>
      <div class="dropdown">
          <LanguageSwitch></LanguageSwitch>
      </div>
        <Form ref="formInline" :model="formInline" :rules="ruleInline" inline>
          <div>
              <FormItem prop="user">
                  <Input type="text" v-model="formInline.user" :placeholder="$i18n.t('login.userName')">
                      <Icon type="ios-person-outline" slot="prepend"></Icon>
                  </Input>
              </FormItem>
            </div>
            <div>
              <FormItem prop="password">
                  <Input type="password" v-model="formInline.password" :placeholder="$i18n.t('login.password')">
                      <Icon type="ios-lock-outline" slot="prepend"></Icon>
                  </Input>
              </FormItem>
            </div>
            <div>
              <FormItem>
                  <Button type="primary" long @click="handleSubmit('formInline')">{{$t('login.signin')}}</Button>
              </FormItem>
            </div>
        </Form>
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
                formInline: {
                    user: '',
                    password: ''
                },
                ruleInline: {
                    user: [
                        { required: true, message: 'Please fill in the user name', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: 'Please fill in the password.', trigger: 'blur' },
                        { type: 'string', min: 6, message: 'The password length cannot be less than 6 bits', trigger: 'blur' }
                    ]
                }
            }
        },
        methods: {
            handleSubmit(name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.$Message.success('Success!');
                        this.$router.push('/market/tian')
                    } else {
                        this.$Message.error('Fail!');
                    }
                })
            },
        }
    }
</script>
<style scoped lang="less">
  .loginWrap {
    text-align: center;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgb(243, 241, 239);
  }
  .loginInner {
    border-radius: 10px;
    padding: 70px 0;
    width: 500px;
    height: 500px;
    position: absolute;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
    top: 50%;
    background-color: white;
    background-image: url('./img/login.jpeg');
    background-size: auto;
    background-position: 0 130px;
    .dropdown {
        position: absolute;
        right: 15px;
        top: 10px;
    }
  }
  .ivu-form-inline .ivu-form-item {
    margin-top: 20px;
    width: 80%;

  }
</style>