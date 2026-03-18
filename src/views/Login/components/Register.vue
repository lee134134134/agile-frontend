<template>
  <div class="register-content jus-clumn-start-center zoomView">
    <div class="mian-title">用户注册</div>
    <el-form ref="registerFromRef" :model="registerFrom" :rules="registerRule" style="width:312px">
      <el-form-item prop="name">
        <el-input v-model="registerFrom.name" clearable placeholder="账号（4-30位姓名拼音或拼音+数字）">
          <template #prefix>
            <img alt="" class="input-icon" src="/user.svg">
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="nickname">
        <el-input v-model="registerFrom.nickname" clearable placeholder="姓名（2-4个中文）">
          <template #prefix>
            <img alt="" class="input-icon" src="/Postcard.svg">
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="email">
        <el-input v-model="registerFrom.email" clearable placeholder="邮箱（示例：zhangsan@hxjyam.com）">
          <template #prefix>
            <img alt="" class="input-icon" src="/message.svg">
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input v-model="registerFrom.password" clearable placeholder="密码（8-20位，需包括大写字母、小写字母与数字）"
                  show-password type="password">
          <template #prefix>
            <img alt="" class="input-icon" src="/lock.svg">
          </template>
        </el-input>
      </el-form-item>
      <div class="sub-btn" @click="register">
        注册
      </div>
      <div class="switch-btn">
        <slot name="switch"></slot>
      </div>
    </el-form>
  </div>
</template>
<script setup>
import {reactive, ref} from 'vue';
import SystemNameDia from '@/components/SystemNameDia.vue';
import {isValidAccount, isValidChinese, isValidEmail, isValidPassWord} from '@/utils/index.js';
import {registerFn} from '@/api/api.js'

const registerFromRef = ref(null)
const registerFrom = reactive({
  name: '',
  nickname: '',
  email: '',
  password: ''
})
const emits = defineEmits(['registerResult'])
const checkName = (rule, value, callback) => {
  if (value == '') {
    return callback(new Error('请输入姓名'))
  } else if (!isValidChinese(value)) {
    return callback(new Error('您输入的姓名格式不正确'))
  } else {
    return callback()
  }
}
const checkPassWord = (rule, value, callback) => {
  if (value == '') {
    return callback(new Error('请输入密码'))
  } else if (!isValidPassWord(value)) {
    return callback(new Error('您输入的密码格式不正确'))
  } else {
    return callback()
  }
}

const checkAccount = (rule, value, callback) => {
  if (value == '') {
    return callback(new Error('请输入账号'))
  } else if (!isValidAccount(value)) {
    return callback(new Error('您输入账号形式不正确'))
  } else {
    return callback()
  }
}
const checkEmail = (rule, value, callback) => {
  if (value == '') {
    return callback(new Error('请输入邮箱'))
  } else if (!isValidEmail(value)) {
    return callback(new Error('请输入正确的邮箱格式'))
  } else {
    return callback()
  }
}
const registerRule = ref({
  name: [{validator: checkAccount, trigger: 'submit'}],
  nickname: [{validator: checkName, trigger: 'submit'}],
  email: [{validator: checkEmail, trigger: 'submit'}],
  password: [{validator: checkPassWord, trigger: 'submit'}],

})

const register = () => {
  if (registerFromRef.value) {
    registerFromRef.value.validate((valid) => {
      if (valid) {
        registerFn(registerFrom).then(res => {
          emits('registerResult', res)
          registerFromRef.value.resetFields()
        })
      } else {
        console.log('error submit!!')
        return false
      }
    })
  }
}

</script>
<style lang="scss" scoped>
.register-content {
  :deep(.el-form--default) {
    .el-form-item {
      margin-bottom: 28px !important;
    }

  }
}

:deep(.el-input__wrapper){
  height: auto;
}
</style>