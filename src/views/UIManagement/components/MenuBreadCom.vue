<template>
    <div class="bread-content jus-start-end">
        <div class="path-father" @click="goFather">UI管理</div>
        <div class="space-line">/</div>
        <div class="path-children">{{ pageName }}</div>
        <div class="ment-operat-btn" @click="goFather">返回上一级</div>
    </div>
</template>

<script setup>
import { ref, reactive, onBeforeMount } from 'vue';
import { useRouter, useRoute } from 'vue-router'
const props = defineProps(['pageName']);
const router = useRouter();
const goFather = () => {
    router.push('/uiManagement')
}

</script>

<style lang="scss" scoped>
.bread-content {
    .path-father {
        font-family: PingFang SC;
        font-weight: 400;
        font-size: 16px;
        color: #888888;
        cursor: pointer;
    }

    .space-line {
        margin: 0 16px;
        font-size: 16px;
        font-weight: bold;
        color: #888888;
    }

    .path-children {
        font-family: PingFang SC;
        font-weight: 500;
        font-size: 16px;
        color: #232323;
        cursor: pointer;
    }

    .ment-operat-btn {
        margin-left: 30px;
        font-weight: 400;
        font-size: 14px;
        color: var(--color-btn-theme);
        line-height: 22px;
        text-decoration-line: underline;
        cursor: pointer;
    }
}
</style>