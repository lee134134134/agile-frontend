<template>
    <div class="register-content jus-clumn-start-center zoomView">
        <div class="mian-title">用户登录</div>
        <el-form ref="loginFromRef" :model="loginFrom" :rules="loginRule" style="width:312px">
            <el-form-item prop="name">
                <el-input v-model="loginFrom.name" clearable placeholder="账号">
                    <template #prefix>
                        <img src="@/assets/webp/logo/logo-account.webp" alt="" class="input-icon">
                    </template>
                </el-input>
            </el-form-item>

            <el-form-item prop="password">
                <el-input v-model="loginFrom.password" type="password" placeholder="密码" show-password clearable>
                    <template #prefix>
                        <img src="@/assets/webp/logo/logo-password.webp" alt="" class="input-icon">
                    </template>
                </el-input>
            </el-form-item>
            <div class="sub-btn" @click="handleLogin" @keydown.enter.native="keyDown($event)">
                登录
            </div>
            <!-- jus-bet-center style="margin-top:12px" 忘记密码功能需要-->
            <div class="switch-btn">
                <slot name="switch"></slot>
            </div>
        </el-form>
    </div>
</template>
<script setup>
import { ref, reactive, onBeforeMount, onMounted, onUnmounted } from 'vue';
import SystemNameDia from '@/components/SystemNameDia.vue';
import { loginFn } from '@/api/api.js'
const loginFromRef = ref(null)
const loginFrom = reactive({
    name: '',
    password: ''
})
const emits = defineEmits(['loginResult'])
const loginRule = ref({
    name: [{ required: true, message: '请输入账号', trigger: 'blur' }],
    password: [{ required: true, message: '请输入密码', trigger: 'blur' }],

})
const handleLogin = () => {
    loginFromRef.value.validate((valid) => {
        if (valid) {
            loginFn(loginFrom).then(res => {
                emits('loginResult', res)
                loginFromRef.value.resetFields()
            })
        } else {
            console.log('error')
        }
    })
}
// 点击回车键
function keyDown(e) {
    if (e.keyCode === 13 || e.keyCode === 100) {
        handleLogin()
    }
}
onMounted(async () => {
    window.addEventListener('keydown', keyDown)
});
onUnmounted(() => {
    // 销毁事件
    window.removeEventListener('keydown', keyDown, false)
})

</script>
<style lang="scss" scoped>
.register-content {
    :deep(.el-form--default) {
        .el-form-item {
            margin-bottom: 20px !important;
        }

    }
}

:deep(.el-input__wrapper){
  height: auto;
}
</style>