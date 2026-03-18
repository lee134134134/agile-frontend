<template>
    <div class="bread-content jus-start-end">
        <div class="path-father" @click="goFather">{{ fromPage == 'defectManage' ? '缺陷管理' : fromPage == 'agileBoard' ? '敏捷看板' : '' }}</div>
        <div class="space-line">/</div>
        <div class="path-children">{{name}}</div>
    </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue';
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
const props = defineProps(['name', 'fromPage']);
const router = useRouter();
const goFather = () => {
    if(props.fromPage == 'defectManage') {
        router.push('/defectManagement')
    }else if(props.fromPage == 'agileBoard') {
        localStorage.setItem('boardSelectTab', '3')
        router.push('/agileBoard')
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
}
</style>