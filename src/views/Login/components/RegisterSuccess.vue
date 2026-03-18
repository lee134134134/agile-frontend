<template>
    <div class="register-content jus-clumn-start-center zoomView">
        <img src="@/assets/images/Login/success.png" alt="" class="success-icon">
        <div class="defult-text">您的账户：</div>
        <div class="main-info">
            <div class="info-item">账号：{{ info.name }}</div>
            <div class="info-item">姓名：{{ info.nickname }}</div>
            <div class="info-item">邮箱：{{ info.email }}</div>
        </div>
        <div class="defult-text">注册成功！</div>
        <div class="back-box">
            <slot name="backbtn"></slot>
        </div>
    </div>
</template>
<script setup>
import { ref, reactive, watch, onMounted, onUnmounted } from 'vue';
import SystemNameDia from '@/components/SystemNameDia.vue';
const props = defineProps(['info']);
const data = ref({
    name:'',
    nickname:'',
    email:''
});
watch(() => props.info, (newName) => {
      data.value = newName 
    });
</script>
