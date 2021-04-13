<template>
  <div class='page_container p-0-30'>
    <h1 class="app-title">Dl-Worker</h1>
    <van-form class="login-form van-hairline--surround" @submit="onSubmit">
      <van-field
        v-model="form.telephone"
        name="手机号"
        label="手机号"
        type="tel"
        placeholder="手机号"
        :rules="rules.telephone"
      />
      <van-field
        v-model="form.password"
        type="password"
        name="密码"
        label="密码"
        placeholder="密码"
        :rules="rules.password"
      />
      <div style="margin: 16px;">
        <van-button round block type="info" native-type="submit">登陆</van-button>
      </div>

      <div class="login-tip">
        <router-link to="/register">没有帐号，立即注册</router-link>
      </div>
    </van-form>
  </div>
</template>

<script>
import { login } from '@/api/login'

const validatePhone = val => /^[1][3-9][0-9]{9}$/.test(val)
const validatePsd = val => /^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$)([^\u4e00-\u9fa5\s]){6,20}$/.test(val)

export default {
  name: 'login-page',
  metaInfo: {
    title: '登录'
  },
  data() {
    return {
      form: {
        telephone: '',
        password: ''
      },
      rules: {
        telephone: [
          { required: true, message: '请填写手机号' },
          { validator: validatePhone, message: '请填写正确的手机号' }
        ],
        password: [
          { required: true, message: '请填写密码' },
          { validator: validatePsd, message: '请输入6-20位英文字母、数字或者符号（除空格），且字母、数字和标点符号至少包含两种' }
        ]
      }
    }
  },
  created() {

  },
  methods: {
    async onSubmit(values) {
      try {
        const res = await login(this.form)
        
        this.$store.commit('SAVELOGININFO', res)
        this.$router.push('/home')
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style lang='less' scoped>
.app-title {
  font-size: 36px;
  margin-top: 15vh;
  margin-bottom: 40px;
  text-align: center;
}
.login-form {
  padding: 40px 30px;
  background-color: #fff;
  .login-tip {
    padding-right: 40px;
    font-size: 14px;
    text-align: right;
    text-decoration: underline;
    a {
      color: #576895;
    }
  }
}
/deep/.van-hairline--surround::after {
  border-radius: 20px;
  box-shadow: 0 0 20px 5px rgba(0, 0, 0, .1);
}
</style>