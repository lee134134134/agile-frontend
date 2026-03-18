<template>
    <div class="bread-content jus-start-end">
        <div class="path-father" @click="goFather">迭代管理</div>
        <div class="space-line">/</div>
        <div class="path-father" @click="goSecond" v-if="isThreeLevel">{{ secName }}</div>
        <div class="space-line" v-if="isThreeLevel">/</div>
        <div class="path-children">{{name}}</div>
    </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue';
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
// const props = defineProps(['name', 'isThreeLevel']);
const props = defineProps({
    name: { type: String, default: '' },
    isThreeLevel: { type: Boolean, default: false },
    secName: { type: String, default: '' },
});
const router = useRouter();
const goFather = () => {
    router.push('/iterationManagement')
}
const goSecond = () => {
    router.go(-1)
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