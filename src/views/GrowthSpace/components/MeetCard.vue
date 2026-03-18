<template>
    <div class="meet-card-container">
        <div class="meet-header">
            <div class="jus-bet-center">
                    <img class="wh40" src="../../../assets/images/growthSpace/user.png" alt="">
                    <div class="header-info">
                        <div class="jus-bet-center">
                            <span class="user-postion ellipsis">{{ meetInfo.userName }} - {{ meetInfo.userPosition }}</span>
                            <div class="line-one-right jus-end-center">
                                <div class="jus-start-center" @click="handleLike">
                                    <img v-if="meetInfo.liked == 0" class="wh14" src="../../../assets/images/growthSpace/gray-heart_icon@2x.png" alt="">
                                    <img v-else class="wh14" src="../../../assets/images/growthSpace/blue-heart_icon.png" alt="">
                                    <span>{{ meetInfo.likeCount }}</span>
                                </div>
                                <div class="see-detail jus-start-center" @click="handleShowMeetDetail">
                                    <span>查看详情</span>
                                    <el-icon><ArrowRight /></el-icon>
                                </div>
                            </div>
                        </div>
                        <div class="create-time">创建时间：{{ meetInfo.createdAt }}</div>
                    </div>
                <!-- </div> -->
            </div>
        </div>
        <div class="card-bottom">
            <div class="fields-box">
                <div class="info-item ellipsis" v-for="(item, index) in meetInfo.registrationData" :key="index" >
                    <span class="info-key">{{ item.fieldName }}：</span>
                    <span class="info-val">{{ item.fieldValue || '-' }}</span>
                </div>
            </div>
            <div class="delete-img">
                <img v-if="meetInfo.createdBy == userInfo.name" src="@/assets/images/growthSpace/dele_icon.png" alt="" style="margin-left: 16px;"
                                        @click="handleDeleFn()">
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus';
const props = defineProps(['meetInfo'])
const emits = defineEmits(['optShowDetail', 'optDeleteInfo', 'optLike'])

const userInfo = ref()
userInfo.value = JSON.parse(localStorage.getItem('agiles_user'))

const handleShowMeetDetail = () => {
    emits('optShowDetail', props.meetInfo)
}

const handleDeleFn = () => {
    ElMessageBox.confirm('删除后不可恢复，请谨慎操作', '', {
        cancelButtonText: '取消',
        confirmButtonText: '确认',
        center: false,
        closeOnClickModal: false,
        autofocus: false,
        type: 'warning',
    }).then(() => {
        emits('optDeleteInfo', props.meetInfo)
    }).catch(() => {
        console.log('已取消')
    })
    
}

const handleLike = () => {
    emits('optLike', props.meetInfo)
}

</script>

<style lang="scss" scoped>
.meet-card-container {
    min-width: 330px;
    background-color: #FFF;
    padding: 11px 16px 20px;
    border-radius: 8px;
    font-family: 'PingFangSC';
    .wh14 {
        width: 14px;
        height: 14px;
    }
    .wh16 {
        width: 16px;
        height: 16px;
    }
    .wh40 {
        width: 32px;
        height: 32px;
    }

    .meet-header {
        margin-bottom: 26px;

        .header-left {
            gap: 5px;
            span {
                color: #000;
                font-weight: 600;
            }
        }
    
        .header-right {
            gap: 24px;
            img {
                margin-right: 3px;
                cursor: pointer;
            }
            .see-detail {
                color: var(--el-color-primary);
                cursor: pointer;
            }
        }

        .header-info {
            width: calc(100% - 40px);
            img {
                margin-right: 3px;
                cursor: pointer;
            }
            .user-postion {
                color: #000;
                font-weight: 600;
            }
            .line-one-right {
                width: 135px;
                gap: 24px;
            }
            .see-detail {
                color: var(--el-color-primary);
                cursor: pointer;
            }
        }


        .create-time {
            color: #666;
            font-size: 12px;
        }
    }

    .card-bottom {
        display: flex;
        justify-content: space-between;
        align-items: end;
    }
    
    .fields-box .info-item:last-child {
        margin-bottom: 0;
    }
        
    .info-item {
        margin-bottom: 8px;
        line-height: 20px;
        .info-key {
            color: #666;
        }

        .info-val {
            color: #333;
            font-weight: bold;
        }
    }
    .delete-img {
        height: 18px;
        line-height: 18px;
        text-align: right;
        img {
            cursor: pointer;
        }
    }

    .ellipsis {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    
}
</style>