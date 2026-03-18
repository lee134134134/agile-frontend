<template>
    <div class="bread-content jus-start-end">
        <div class="path-father" @click="goFather">首页</div>
        <div class="space-line">/</div>
        <div class="path-children">{{name}}</div>
    </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue';
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
const props = defineProps(['name']);

const router = useRouter();
const goFather = () => {
    router.push('/growthSpace')
}

</script>

<style lang="scss" scoped>
.bread-content {

    .path-father {
        font-family: PingFang SC;
        font-weight: 400;
        font-size: 14px;
        color: var(--el-color-primary);
        cursor: pointer;
    }

    .space-line {
        margin: 0 16px;
        font-size: 14px;
        font-weight: bold;
        color: #888888;
    }

    .path-children {
        font-family: PingFang SC;
        font-weight: 500;
        font-size: 14px;
        color: #232323;
        cursor: pointer;
    }
}
</style>