<template>
    <el-dialog v-model="editShow" :show-close="false" @close="handleClose" fullscreen style="background: #f7fafc;">
        <template #header="{ close }">
            <div class="dia-header">
                <div class="bread-content jus-start-end">
                    <div class="path-father" @click="close">敏捷扑克</div>
                    <div class="space-line">/</div>
                    <div class="path-children">{{ type == "1" ? '出牌房间' : '亮牌房间' }}</div>
                    <div class="ment-operat-btn" @click="close">返回上一级</div>
                </div>
            </div>
        </template>
        <div class="dia-main">
            <estimateRoomVue v-if="type == 1" :data="detailInfo"></estimateRoomVue>
            <resultRoomVue v-if="type == 2" :data="detailInfo" @reFresh="handleClose"></resultRoomVue>
        </div>
    </el-dialog>
</template>
<script setup>
import { ref, reactive, watch, onBeforeUnmount, onMounted } from 'vue';
import { CircleCheck } from '@element-plus/icons-vue';
import estimateRoomVue from '../estimateRoom.vue';
import resultRoomVue from '../resultRoom.vue'
const props = defineProps(['type', 'isShow', 'info']);
const emits = defineEmits(['closeDiaFn'])
const editShow = ref(props.isShow ?? false)
const detailInfo = ref(null)
watch(() => props.info, (newName) => {
    detailInfo.value = newName
}, { immediate: true });
const handleClose = () => {
    editShow.value = false
    emits('closeDiaFn')
}
</script>
<style lang="scss" scoped>
.dia-header {

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
}

.dia-main {
    padding: 0 15px 10px 15px;

    .opt-text {
        margin-left: 15px;
        cursor: pointer;
        color: #7ca7ec;
        font-size: 14px;
        padding: 2px 5px;
        border: 1px solid #bdd1f3;
        border-radius: 4px;
    }

    .head-left {
        display: flex;
        justify-content: flex-start;
        align-items: center;

        .doc-title {
            max-width: 50%;
            margin-right: 15px;
            font-family: 'Microsoft YaHei', 'PingFang SC';
            font-size: 24px;
            font-weight: 600;
            color: #2d3748;
            text-align: left;
        }
    }

    .main-container {
        background: #fff;
        margin-top: 10px;
        width: 100%;
        border-radius: 8px;

        .container-left {
            padding: 20px 10px 20px 10px;
            width: 512px;
            background: #f0f5fc;
            border-radius: 8px;

            .left-title {
                font-size: 16px;
                color: #232323;
                font-weight: 600;
                margin-bottom: 10px;
            }

            .left-list {
                height: calc(100vh - 220px);
                padding-right: 20px;
                margin-right: 0px;
                overflow-y: auto;

                .list-item {
                    margin: 10px 0;
                    padding: 15px 10px;
                    background: #fff;
                    border-radius: 8px;

                    .btn-primary {
                        width: 50px;
                        height: 28px;
                        line-height: 28px;
                        font-size: 12px;
                    }

                    .btn-circle {
                        width: 50px;
                        height: 28px;
                        line-height: 28px;
                        font-size: 12px;
                    }
                }
            }
        }

        .container-right {
            width: 100%;
            height: calc(100vh - 150px);
        }
    }
}

/* 整个滚动条 */
::-webkit-scrollbar {
    width: 8px;
    /* 宽度 */
    height: 8px;
    /* 高度 */
}

/* 滚动条轨道 */
::-webkit-scrollbar-track {
    background: none;
    /* 颜色 */
}

/* 滚动条的滑块 */
::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.1);
    /* 颜色 */
    border-radius: 4px;
}

/* 滚动条的滑块：鼠标悬停时 */
::-webkit-scrollbar-thumb:hover {
    background: #e9e9e9;
    /* 颜色 */
}
</style>