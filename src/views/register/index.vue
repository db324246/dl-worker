<template>
  <div class='page_container'>
    <van-nav-bar
      title="注册用户"
      left-text="返回登录"
      left-arrow
      @click-left="onClickLeft"
    />

    <van-form @submit="onSubmit">
      <van-field
        v-model="form.username"
        name="用户名"
        label="用户名"
        type="text"
        placeholder="用户名"
        required
        :rules="rules.username"
      />
      <van-field name="sex" label="单选框" required>
        <template #input>
          <van-radio-group v-model="form.sex" direction="horizontal">
            <van-radio :name="1">男</van-radio>
            <van-radio :name="2">女</van-radio>
          </van-radio-group>
        </template>
      </van-field>
      <van-field
        v-model="form.telephone"
        name="手机号"
        label="手机号"
        type="tel"
        required
        placeholder="手机号"
        :rules="rules.telephone"
      />
      <van-field
        v-model="form.password"
        type="password"
        name="密码"
        label="密码"
        required
        placeholder="密码"
        :rules="rules.password"
      />
      <van-field
        v-model="form.checkPassword"
        type="password"
        name="确认密码"
        label="确认密码"
        required
        placeholder="确认密码"
        :rules="rules.checkPassword"
      />
      <div style="margin: 16px;">
        <van-button round block type="info" native-type="submit">提交</van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
// import { register } from '@/api/login'

const validatePhone = val => /^[1][3-9][0-9]{9}$/.test(val)
const validatePsd = val => /^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$)([^\u4e00-\u9fa5\s]){6,20}$/.test(val)

export default {
  name: 'register-page',
  metaInfo: {
    title: '注册'
  },
  data() {
    const _this = this
    const validateSamePsd = () => {
      if (_this.form.password && _this.form.checkPassword) {
        return _this.form.password === _this.form.checkPassword
      }
      return true
    }
    return {
      form: {
        username: '',
        sex: 1,
        telephone: '',
        password: '',
        checkPassword: ''
      },
      rules: {
        username: [{ required: true, message: '请填写用户名' }],
        telephone: [
          { required: true, message: '请填写手机号' },
          { validator: validatePhone, message: '请填写正确的手机号' }
        ],
        password: [
          { required: true, message: '请填写密码' },
          { validator: validatePsd, message: '请输入6-20位英文字母、数字或者符号（除空格），且字母、数字和标点符号至少包含两种' },
          { validator: validateSamePsd, message: '两次密码输入不一致' }
        ],
        checkPassword: [
          { required: true, message: '请填写确认的密码' },
          { validator: validatePsd, message: '请输入6-20位英文字母、数字或者符号（除空格），且字母、数字和标点符号至少包含两种' },
          { validator: validateSamePsd, message: '两次密码输入不一致' }
        ]
      }
    }
  },
  created() {

  },
  methods: {
    onClickLeft() {
      this.$router.replace('/login')
    },
    onSubmit(values) {
      console.log('submit', values)
    }
  }
}
</script>

<style lang='less' scoped>

</style>