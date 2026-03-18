<template>
    <div class="main-content">
        <div class="title-4">系统日志</div>
        <div class="view-container jus-bet-start">
            <div class="container-left bg-color-2 border-radius-4">
                <div class="container-left-header jus-bet-center">
                    <div class="title-4">日志列表</div>
                    <el-form :inline="true" class="date-form">
                        <el-form-item label="月度">
                            <el-date-picker :clearable="true" v-model="month" type="month" placeholder="请选择"
                                format="YYYY-MM" value-format="YYYY-MM" @change="getList"
                                style="width:160px"></el-date-picker>
                        </el-form-item>
                    </el-form>
                </div>
                <div class="tablelist-header jus-bet-center">
                    <div class="header-label w-1 text-left">日志名称</div>
                    <div class="header-label w-2 text-lefttext-left">文件大小</div>
                    <div class="header-label w-3 text-right">生成日期</div>
                </div>
                <div class="list-content">
                    <div class="list-item jus-bet-center" :class="{ 'activeItem': selectFile == item.files }"
                        v-for="item in tableList" :key="item.files" @click="handleSelectFile(item)">
                        <div class="list-item-icon"></div>
                        <div class="item-value w-4 text-left padding-7">{{ item.fileName.length > 13 ?
                            item.fileName.substr(0, 13) +
                            '...' :
                            item.fileName }}</div>
                        <div class="item-value w-2 text-left padding-10">{{ item.size }}</div>
                        <div class="item-value w-3 text-right padding-10">{{ item.createdAt.slice(0, 10) }}</div>
                    </div>
                </div>
            </div>
            <div class="container-right bg-color-2 border-radius-4">
                <div class="right-main" v-if="detailInfo">
                    <div class="rightcard bg-color-1 border-radius-8">
                        <div class="card-header jus-bet-center">
                            <div class="title-2">{{ detailInfo?.fileName || '-' }}</div>
                            <div class="opt-btn">下载</div>
                        </div>
                        <div class="card-info jus-bet-center">
                            <div class="info-item">生成时间：{{ detailInfo?.createdAt }}</div>
                            <div class="info-item">统计周期：{{ detailInfo?.createdAt + '~' + detailInfo?.endDate }}</div>
                            <div class="info-item">大小：{{ detailInfo?.size }}</div>
                        </div>
                    </div>
                    <div class="rightcard bg-color-1 border-radius-8">
                        <el-form ref="searchFormRef" :model="searchForm" label-width="100px">
                            <el-row :gutter="24">
                                <el-col :span="8">
                                    <el-form-item label="开始时间" prop="startTime">
                                        <el-date-picker :clearable="true" v-model="searchForm.startTime" type="datetime"
                                            placeholder="请选择" format="YYYY-MM-DD hh:mm" value-format="YYYY-MM-DD hh:mm"
                                            @change="handleCheckDate(1)"></el-date-picker>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="8">
                                    <el-form-item label="结束时间" prop="endTime">
                                        <el-date-picker :clearable="true" v-model="searchForm.endTime" type="datetime"
                                            placeholder="请选择" format="YYYY-MM-DD hh:mm" value-format="YYYY-MM-DD hh:mm"
                                            @change="handleCheckDate(1)"></el-date-picker>

                                    </el-form-item>

                                </el-col>
                                <el-col :span="8">
                                    <el-form-item label="日志级别" prop="logLeval">
                                        <el-select v-model="searchForm.logLeval" placeholder="全部" clearable
                                            style="width: 260px;">
                                            <el-option v-for="item in logLevalList" :key="item.value" :label="item.name"
                                                :value="item.value" />
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row :gutter="24">
                                <el-col :span="8">
                                    <el-form-item label="关键词" prop="keyWords">
                                        <el-input v-model="searchForm.keyWords" placeholder="请输入" clearable
                                            maxlength="10"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="8">
                                    <el-form-item label="正则表达式" prop="regularStr">
                                        <el-input v-model="searchForm.regularStr" placeholder="请输入" clearable
                                            maxlength="50"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="8">
                                    <div class="search-btn jus-flex-end">
                                        <div class="btn-primary btn-margin-right" @click="handleSerach">筛选</div>
                                        <div class="btn-circle" @click="handleReset">重置</div>
                                    </div>
                                </el-col>
                            </el-row>

                        </el-form>
                    </div>
                    <div class="title-2 title-space">日志详情</div>
                    <div class="rightcard bg-color-1 border-radius-8 log-content"></div>
                    <div class="right-footer ">
                        <div class="opt-btn">滚动到顶部</div>
                        <div class="opt-btn">滚动到底部</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue';
import EmptyDia from '../../components/EmptyDia.vue'
import { TableRowStyle2 } from '@/utils';
import { $yearMonth } from '@/utils/date.js';


const month = ref($yearMonth)
const selectFile = ref(undefined)
const tableList = ref([{
    files: '/files/flie1',
    fileName: '日志文件名称1日志文件名称件名称',
    size: '20M',
    createdAt: '2025-12-02 06:22',
    endDate: '2025-12-04 06:22',
}, {
    files: '/files/flie2',
    fileName: '日志文件名称2',
    size: '20M',
    createdAt: '2025-12-02 06:22',
    endDate: '2025-12-04 06:22',
}, {
    files: '/files/flie3',
    fileName: '日志文件名称3',
    size: '20M',
    createdAt: '2025-12-02 06:22',
    endDate: '2025-12-04 06:22',
},])
const detailInfo = ref(null)
const searchFormRef = ref(null)
const searchForm = reactive({
    startTime: '',
    endTime: '',
    logLeval: '',
    keyWords: '',
    regularStr: ''
})
const logLevalList = ref([])
const handleSelectFile = (data) => {
    selectFile.value = data.files
    detailInfo.value = data
}

const handleSerach = () => {
    //右侧查询获取日志
}
const handleReset = () => {
    searchFormRef.value.resetFields();
    //右侧查询获取日志
}
function getList() {
    //获取左侧列表
    selectFile.value = undefined
    detailInfo.value = null
}

</script>

<style lang="scss" scoped>
.main-content {
    padding: 20px;

    .view-container {
        margin-top: 12px;
        width: 100%;
        column-gap: 16px;

        .container-left {
            width: 564px;
            padding: 16px 12px;

            .container-left-header {
                margin-bottom: 12px;

                :deep(.el-form--inline) {
                    .el-form-item {
                        margin-right: 0 !important;
                    }

                }
            }

            :deep(.el-form-item) {
                margin-bottom: 0px !important;
            }

            .tablelist-header {
                width: 100%;
                height: 36px;
                line-height: 36px;
                background: #f5f6f7;
                padding-right: 16px;

                .header-label {
                    font-family: 'Microsoft YaHei', 'PingFang SC';
                    font-size: 14px;
                    color: #333;
                    font-weight: 500;
                    line-height: 20px;
                    padding-left: 10px;
                }

                // .w-3{
                //     width: calc(100% - 230px);
                // }
            }

            .list-content {
                height: calc(100vh - 308px);
                overflow-y: auto;

                .list-item {
                    width: 100%;
                    padding-right: 10px;
                    height: 37px;
                    line-height: 37px;
                    border-bottom: 1.5px solid #e2e4e887;
                    cursor: pointer;

                    .item-value {
                        font-size: 14px;
                        font-weight: 400;
                        color: #333;
                    }

                    .list-item-icon {
                        width: 3px;
                        height: 100%;
                    }
                }

                .list-item:nth-child(odd) {
                    background: #fff;

                    .list-item-icon {
                        background: #fff;
                    }
                }

                .list-item:nth-child(even) {
                    background: #fafafa;

                    .list-item-icon {
                        background: #fafafa;
                    }
                }

                .list-item:hover {
                    background: rgba(157, 189, 241, 0.1);

                    .list-item-icon {
                        background: rgba(239, 245, 254, 0.1);
                    }
                }

                .activeItem {
                    background: rgba(33, 115, 247, 0.1) !important;

                    .list-item-icon {
                        background: #2173f7 !important;
                    }
                }
            }

            .w-1 {
                width: calc(100% - 220px);
            }

            .w-2 {
                width: 100px;
            }

            .w-3 {
                width: 120px;
            }

            .w-4 {
                width: calc(100% - 233px);
            }
        }

        .container-right {
            width: calc(100% - 580px);

            .rightcard {
                padding: 20px;
                margin-bottom: 15px;

                .card-info {
                    margin-top: 20px;
                    font-size: 14px;
                    color: #333;
                    font-weight: 500;
                    gap: 15px;
                }
            }

            .title-space {
                margin-bottom: 15px;
            }

            .log-content {
                height: calc(100vh - 540px);
                overflow-y: auto;
            }

            .right-footer {
                margin-top: 15px;
                display: flex;
                justify-content: end;
                align-items: center;
                gap: 10px;
            }
        }

        :deep(.el-form-item__label) {
            font-size: 12px !important;
            font-weight: 400 !important;
            color: #666 !important;
            height: 28px;
            line-height: 28px;
        }

        :deep(.el-input__wrapper) {
            height: 28px;
            line-height: 28px;
            width: 160px;
        }

        :deep(.el-date-editor) {
            height: 28px;
            line-height: 28px;
            width: 160px;
            --el-input-border-radius: 4px !important;
            --el-input-border-color: #cccccc !important;
        }

        :deep(.el-input) {
            --el-input-height: 28px;
            --el-input-border-color: #cccccc;
            --el-input-border-radius: 4px;
            --el-input-padding-left: 10px;
            --el-input-padding-right: 10px;
            width: 260px;
        }

        :deep(.el-select__wrapper) {
            min-height: 28px;
            border-radius: 4px;
        }

        :deep(.el-select__wrapper) {
            border-radius: 4px !important;
            --el-input-border-color: #cccccc !important;
            box-shadow: 0 0 0 1px #cccccc inset !important;
        }
    }

    .bg-fff {
        background: #fff;
        border-radius: 4px;
    }

    .text-left {
        text-align: left;
    }

    .text-right {
        text-align: right;
    }

    .padding-7 {
        padding-left: 2px;
    }

    .padding-10 {
        padding-left: 10px;
    }
}
</style>