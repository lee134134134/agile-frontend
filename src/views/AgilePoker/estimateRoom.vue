<template>
    <div class="room-content">
        <div class="page-header jus-start-center">
            <div class="title-icon"></div>
            <div class="title-1">{{ formData.name }}</div>
        </div>
        <div class="page-container jus-bet-start">
            <div class="container-left bg-color-1">
                <div class="joker-list" v-if="jokerList && jokerList.length > 0">
                    <div class="joker-item jus-center" v-for="item in jokerList" :key="item.id">
                        <div class="item-name title-1">{{ item.name }}</div>
                        <div class="item-num">
                            <el-icon>
                                <CircleCheck></CircleCheck>
                            </el-icon>
                        </div>
                    </div>
                </div>
                <div class="empty-content jus-clumn-center" v-else>
                    <img src="@/assets/images/home/null-icon.png" alt="" class="empty-img">
                    <div class="empty-text">暂无出牌人员</div>
                </div>

            </div>
            <div class="container-right bg-color-1">
                <div class="title-1">请选择牌面</div>
                <div class="card-list">
                    <div class="card-item" :class="selectItem == item ? 'active-card' : ''"
                        :style="{ 'cursor': checkedItem ? 'default' : 'pointer' }" v-for="(item, index) in jokerNumList"
                        :key="index" @click="handleSelect(item)">{{ item }}</div>
                </div>
                <div class="card-btn">
                    <div :class="checkedItem ? 'noopt-btn' : 'opt-btn'" @click="handleSubmit">出牌</div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref, reactive, watch, onBeforeMount } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import MenuBreadCom from './components/MenuBreadCom.vue';
import { getPepCard, gameRoundVote } from '@/api/agilePokerApi.js';
// import { useRoute } from 'vue-router';
const props = defineProps(['data']);
// const route = useRoute();
// const pageName = ref(route.query.name ?? '')

const formData = reactive({
    name: '',
    code: ''
})
const jokerList = ref([])
const jokerNumList = ref(['0', '1', '2', '3', '5', '8', '13', '21', '34', '55', '?', '∞', 'coffee'])
const selectItem = ref('')
const checkedItem = ref('')
const userAccount = ref('')
watch(() => props.data, (newName) => {
    formData.name = newName.name
    formData.code = newName.code
}, { immediate: true });
const handleSelect = (data) => {
    if (checkedItem.value) {
        return
    } else {
        selectItem.value = data
    }
}
const handleSubmit = () => {
    if (checkedItem.value) {
        return
    } else {
        checkedItem.value = selectItem.value
        let params = {
            "storyCode": formData.code,// route.query.code,
            "cardValue": checkedItem.value
        }
        gameRoundVote(params).then(res => {
            if (res.success) {
                ElMessage.success('操作成功！')
                getCardList()
            }
        })
    }

}
function getCardList() {
    getPepCard({ code: formData.code }).then(res => {
        if (res.success) {
            jokerList.value = res?.data ?? []
            if (jokerList.value.length > 0) {
                jokerList.value.forEach(item => {
                    if (item.account == userAccount.value) {
                        checkedItem.value = item.value
                        selectItem.value = item.value
                    }
                });
            }
        }
    })
}
onBeforeMount(() => {
    userAccount.value = JSON.parse(localStorage.getItem("agiles_user")).name
    getCardList()
})
</script>
<style lang="scss" scoped>
.room-content {
    .page-header {
        margin: 20px 0;

        .title-icon {
            width: 20px;
            height: 20px;
            background: url(@/assets/images/story-icon.png) no-repeat center;
            background-size: cover;
            margin-right: 10px;
        }
    }

    .page-container {
        column-gap: 20px;

        .container-left {
            padding: 30px 20px;
            width: 70%;
            border-radius: 8px;
            height: calc(100vh - 200px);

            .joker-list {
                width: 100%;
                display: flex;
                justify-content: flex-start;
                flex-wrap: wrap;
                align-items: center;
                gap: 20px;

                .joker-item {
                    width: 23%;
                    padding: 30px 0;
                    background: #fff;
                    border-radius: 8px;


                    .item-num {
                        font-size: 20px;
                        color: #3ce060;
                        margin-left: 10px;

                        :deep(.el-icon) {
                            width: 2em;
                            height: 2em;
                            line-height: 2em;

                            svg {
                                width: 1.5em;
                                height: 1.5em;
                                line-height: 1.5em;
                            }
                        }
                    }
                }
            }
        }

        .container-right {
            padding: 20px;
            width: 30%;
            border-radius: 8px;
            height: calc(100vh - 200px);

            .card-list {
                margin-top: 20px;
                width: 100%;
                display: flex;
                justify-content: flex-start;
                flex-wrap: wrap;
                align-items: center;
                gap: 10px;

                .card-item {
                    width: 18%;
                    height: 50px;
                    line-height: 50px;
                    text-align: center;
                    border: 1px solid #fff;
                    color: #1d1d1d;
                    cursor: pointer;
                    background: #fff;
                    border-radius: 8px;
                }

                .card-item:hover {
                    border: 1px solid #2173f7;
                }

                .active-card {
                    background: #2173f7;
                    border: 1px solid #2173f7;
                    color: #FFF
                }
            }

            .card-btn {
                margin: 30px auto !important;
                width: 100px;
                // height: 32px;
                // line-height: 32px;
                text-align: center;

                .noopt-btn {
                    padding: 5px 20px;
                    padding-top: 7px;
                    background: #cacacb;
                    border-radius: 8px 8px 8px 8px;
                    font-family: PingFang SC;
                    font-weight: 400;
                    font-size: 14px;
                    color: #FFFFFF;
                    cursor: default;
                    opacity: 0.8;
                }
            }

        }
    }

    .empty-content {
        margin-top: 50px;

        .empty-img {
            width: 246px;
            height: 180px;
            // margin-bottom: 10px;
        }
    }
}
</style>