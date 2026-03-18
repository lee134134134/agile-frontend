<template>
    <div class="configListPageContainer">
        <div class="left-content">
            <div class="left-header">
                <el-input v-model="searchKeyword" :prefix-icon="Search" placeholder="请输入搜索内容" clearable @blur="getManageEleListFn" @keydown.enter="getManageEleListFn" />
            </div>
            <div class="left-list-content">
                <div class="tip-line jus-start-center">
                    <el-icon><Warning /></el-icon>
                    <span>
                        示例元素：
                        <span v-if="tabVal == 1 || tabVal == 4">元素名称 | 描述</span>
                        <span v-else-if="tabVal == 2">元素名称 | 描述 | 默认值 | 作用域</span>
                        <span v-else-if="tabVal == 3">元素名称 | 参数 | 所属库名</span>
                    </span>
                </div>
                <div class="list-item jus-bet-center" v-if="listData.length > 0" v-for="(item, index) in listData" :key="index" 
                @mouseenter="handleShowBtn(index, true)" @mouseleave="handleShowBtn(index, false)"
               >
               <!-- @click="handleInsertContent(item)" -->
                    <span v-if="tabVal == 1 || tabVal == 4">
                        <span class="boldFont">{{ item.name || '-' }}</span> | {{ item.description || '-' }}
                    </span>
                    <span v-else-if="tabVal == 2">
                        <span class="boldFont"> {{ item.name || '-' }}</span> | {{ item.description || '-' }} | {{ item.varDefaultVal || '-' }} | {{ item.varScopeType || '-' }}
                    </span>
                    <span v-else-if="tabVal == 3">
                        <span class="boldFont"> {{ item.name || '-' }}</span> | {{ item.kwParameters || '-' }} | {{ item.libraryName || '-' }}
                    </span>
                    <div v-show="item.showInsertBtn" class="insert-btn" @click="handleInsertContent(item)">插入</div>
                </div>
                <EmptyDia v-else :type="'zwsj'" />
            </div>
        </div>
        <div class="right-content">
            <div class="tab-content" :class="{'tab-content-active': tabVal == 1}" @click="handleChangeTab(1)">
                <img v-if="tabVal == 1" src="../../../assets/images/testCase/config-option-active.png" alt="">
                <img v-else src="../../../assets/images/testCase/config-option.png" alt="">
                <span>设置项</span>
            </div>
            <div class="tab-content" :class="{'tab-content-active': tabVal == 2}" @click="handleChangeTab(2)">
                <img v-if="tabVal == 2" src="../../../assets/images/testCase/variable-active.png" alt="">
                <img v-else src="../../../assets/images/testCase/variable.png" alt="">
                <span>变量</span>
            </div>
            <div class="tab-content" :class="{'tab-content-active': tabVal == 3}" @click="handleChangeTab(3)">
                <img v-if="tabVal == 3" src="../../../assets/images/testCase/keyword-active.png" alt="">
                <img v-else src="../../../assets/images/testCase/keyword.png" alt="">
                <span>关键字</span>
            </div>
            <div class="tab-content" :class="{'tab-content-active': tabVal == 4}" @click="handleChangeTab(4)">
                <img v-if="tabVal == 4" src="../../../assets/images/testCase/tag-active.png" alt="">
                <img v-else src="../../../assets/images/testCase/tag.png" alt="">
                <span>标签</span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { getManageEleList } from '@/api/testCaseApi';
import { getEleTabType } from '@/utils/testCaseConstant.js'
import EmptyDia from '@/components/EmptyDia.vue';

const emits = defineEmits(['optInsert'])

const tabVal = ref(1)
const listData = ref([])
const searchKeyword = ref('')

const handleChangeTab = (val) => {
    tabVal.value = val
    searchKeyword.value = ''
    getManageEleListFn()
}

// 双击插入元素
// const clickNumber = ref(0)
// let timer

// const handleInsertContent = (item) => {
//     clickNumber.value++
//     timer = setTimeout(() => {
//         if(clickNumber.value == 2) {
//             console.log('双击')
//             clearTimeout(timer)
//             emits('optInsert', item.title)
//         }
//         clickNumber.value = 0
//     }, 300);
// }

const handleShowBtn = (index, val) => {
    listData.value[index].showInsertBtn = val
}

const handleInsertContent = (item) => {
    emits('optInsert', item.insertData)
}

const getManageEleListFn = () => {
    let params = {
        type: getEleTabType(tabVal.value),
        fuzzySearch: searchKeyword.value || undefined,
    }
    getManageEleList(params).then(res => {
        if(res.success) {
            listData.value = res.data
        }
    })
}

onMounted(() => {
    getManageEleListFn()

})

</script>

<style lang="scss" scoped>
.configListPageContainer {
    height: 100%;
    display: flex;
    .left-content {
        width: calc(100% - 73px);
        height: 100%;
        border-top: 1px solid #E2E2E2;
        border-bottom: 1px solid #E2E2E2;
        padding: 16px 12px 12px 12px;
        box-sizing: border-box;
        
        .left-header {
            padding-right: 5px;
            margin-bottom: 8px;
        }
        .left-list-content {
            height: calc(100% - 40px);
            overflow: auto;
            padding-right: 5px;
            
            .tip-line {
                gap: 6px;
                margin: 5px 0 10px;
                font-size: 16px;
                color: #969696;
                span {
                    font-size: 12px
                }
            }
            .list-item {
                gap: 8px;
                background-color: #EDF6FF;
                padding: 10px 10px;
                box-sizing: border-box;
                border-radius: 8px;
                margin-top: 8px;
                cursor: pointer;
                user-select: none;

                >span {
                    color: #888;
                    display: -webkit-box;
                    -webkit-box-orient: vertical;
                    -webkit-line-clamp: 1;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                .boldFont {
                    font-weight: bold;
                    color: #333;
                }
            }
            .insert-btn {
                width: 44px;
                height: 22px;
                background-color: #FFF;
                border-radius: 3px;
                text-align: center;
                line-height: 22px;
                color: #2173F7;
                font-size: 12px;
                flex-shrink: 0;
            }
        }
    }

    .right-content {
        width: 73px;
        height: 100%;
        background-color: #DDEDFF;

        .tab-content {
            width: 70px;
            height: 70px;
            margin-top: 13px;
            border-radius: 0 10px 10px 0;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            gap: 4px;
            cursor: pointer;
            user-select: none;

            img {
                width: 32px;
            }
            .span {
                font-size: 12px;
                color: var(--el-color-primary);
            }
        }
        .tab-content-active {
            background-color: #FFF;
        }
    }

    .ellipsis {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    :deep(.el-input .el-input__icon) {
        color: var(--el-color-primary) !important;
    }
    :deep(.el-input__inner) {
        height: 32px;
    }
}
</style>