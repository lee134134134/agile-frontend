<template>
    <div class="bread-content jus-start-end">
        <div class="path-father" @click="goFather">项目管理</div>
        <div class="space-line">/</div>
        <div class="path-children" v-if="type != 3">{{ type == 1 ? '项目树管理' : '迭代时间轴' }}</div>
        <div class="path-father" v-if="type == 3" @click="goTimeLine">迭代时间轴</div>
        <div class="space-line" v-if="type == 3">/</div>
        <div class="path-children" v-if="type == 3">迭代时间线</div>
        <div class="ment-operat-btn" @click="goBack">返回上一级</div>
    </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
const props = defineProps(['type']);
const router = useRouter();
const route = useRoute()
const goFather = () => {
    router.push('/project')
}
const goTimeLine = () => {
    router.push({ path: '/project/timeLine', query: { 'proId': route.query.proId } })
}
const goBack = () => {
    if (props.type == 3) {
        goTimeLine()
    } else {
        goFather()
    }
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