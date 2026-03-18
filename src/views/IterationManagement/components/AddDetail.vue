<template>
	<el-dialog v-model="addShow" :show-close="false" width="1080px" @close="handleClose" :close-on-click-modal="false" :close-on-press-escape="false" class="edit-dia">
		<template #header="{ close }">
			<div class="dia-header">
				<div class="dia-header-title">
					<div class="title-icon"></div>
					<div class="title-text">添加用户故事到迭代</div>
				</div>
				<el-icon class="dia-header-close" size="16px" @click="close">
					<Close />
				</el-icon>
			</div>
		</template>
		<div class="dia-main">
			<div class="search-content jus-bet-center bg-color-1 border-radius-8">
				<el-form ref="searchFromRef" :model="searchFrom" :inline="true">
					<el-form-item label="所属项目" prop="projectId">
						<el-select v-model="searchFrom.projectCode" placeholder="请选择" clearable style="width: 260px;"  @change="handleModel">
							<el-option v-for="item in iterProjectList" :key="item.projectCode" :label="item.projectName"
								:value="item.projectCode" />
						</el-select>
					</el-form-item>
					<el-form-item label="功能模块" prop="moduleId">
						<!-- <el-select v-model="searchFrom.moduleId" placeholder="请选择" clearable style="width: 260px;" :disabled="!searchFrom.projectCode">
							<el-option v-for="item in modelList" :key="item.id" :label="item.name"
								:value="item.id" />
						</el-select> -->
            <el-cascader v-model="searchFrom.moduleId" :options="modelList" :props="defaultProps"
                        :loading="modelListLoad" :reserve-keyword="false" clearable placeholder="请选择" filterable
                        style="width:100%" :disabled="!searchFrom.projectCode"></el-cascader>
					</el-form-item>
				</el-form>
				<div class="search-btn jus-flex-end">
					<div class="btn-primary btn-margin-right" @click="getStoryListFn">筛选</div>
					<div class="btn-circle" @click="handleReset">重置</div>
				</div>
			</div>
			<div style="margin-top: 16px;margin-bottom: 32px;">
				<AddDetailTable  :list="tableData"  @operateFn="handleSelectStory"></AddDetailTable>
			</div>
			<div class="dia-footer jus-flex-end">
				<div class="btn-cancel" @click="handleClose">取消</div>
				<div class="btn-submit" @click="handleSubmit">保存</div>
			</div>
		</div>
	</el-dialog>
</template>

<script setup>
	import { ref, reactive, watch, onMounted } from 'vue';
	import { Close } from '@element-plus/icons-vue';
	import { getStoryList } from '@/api/iterationApi.js';
	import { getModelList } from '@/api/demand.js';
	import AddDetailTable from './AddDetailTable.vue';
  import { ElMessage } from 'element-plus';
	const props = defineProps(['isShow', 'iterProjectList', 'projectCode']);
	const emits = defineEmits([ 'closeDiaFn', 'confirmFn' ])

	const addShow = ref(props.isShow ?? false)
  const modelList = ref([]) // 功能模块
	const tableData = ref([]);
	const searchFrom = reactive({
    projectCode: undefined,
    moduleId: undefined,
	});
  let storyCodes = []
  const modelListLoad = ref(false)
  const defaultProps = ref({
    children: 'children',
    label: 'name',
    value: 'id',
    // multiple: true,
    emitPath: false
})

  // 获取功能模块下拉
  const handleModel = () => {
    if (searchFrom.projectCode) {
        modelListLoad.value = true
        searchFrom.moduleId = undefined
        getModelListFn()
    } else {
      searchFrom.moduleId = undefined
    }
}
  const getModelListFn = () => {
      let params = {
          projectCode: searchFrom.projectCode
      }
      getModelList(params).then(res => {
        if(res.success) {
          modelList.value = res?.data ?? []
        }
      })
  }

  // 查询未绑定迭代的用户故事列表
  const getStoryListFn = () => {
    getStoryList(searchFrom).then(res => {
      if(res.success) {
        tableData.value = res.data
      }
    })
  }
  // 重置
  const handleReset = () => {
    searchFrom.projectCode = props.projectCode
    searchFrom.moduleId = undefined
    getStoryListFn()
  }

  // 选择故事
  const handleSelectStory = (codes) => {
    storyCodes = codes
  }

  
	const handleClose = () => {
		addShow.value = false
		emits('closeDiaFn')
	}
	const handleSubmit = () => {
		if (storyCodes.length > 0) {
			emits('confirmFn', storyCodes)
		}else {
      ElMessage.warning('请选择要添加的用户故事')
    }
	}

  onMounted(() => {
    searchFrom.projectCode = props.projectCode
    getStoryListFn()
    handleModel()
  })
</script>
<style lang="scss" scoped>
	.dia-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 8px 15px 0px;

		.dia-header-title {
			display: flex;
			align-items: center;

			.title-icon {
				margin-right: 10px;
				width: 4px;
				height: 20px;
				background: #2173F7;
				border-radius: 2px 2px 2px 2px;
			}

			.title-text {
				font-family: PingFang SC;
				font-weight: 600;
				font-size: 18px;
				color: #1D1D1D;
				line-height: 22px;
				text-align: left;
				font-style: normal;
				text-transform: none;
			}
		}

		.dia-header-close {
			cursor: pointer;

			svg {
				width: 1.5em;
				height: 1.5em;
			}
		}
	}

	.dia-main {
		// padding-bottom: 30px;
		// padding-left: 20px;
		// padding-right: 20px;

		// .dia-main-content {
		// 	margin-bottom: 30px;
		// }

		.dia-footer {
            gap: 12px;
			.btn-cancel {
				margin-left: 12px;
			}
		}

		:deep(.el-input) {
			--el-input-height: 28px;
			--el-input-border-color: #DBDDE3;
			--el-input-border-radius: 4px;
			--el-input-padding-left: 10px;
			--el-input-padding-right: 10px;
		}

		:deep(.el-select__wrapper) {
			min-height: 28px;
			border-radius: 4px;
		}

		:deep(.el-textarea) {
			--el-input-border-color: #DBDDE3;
			--el-input-border-radius: 4px;
			--el-input-padding-left: 10px;
			--el-input-padding-right: 10px;

			.el-textarea__inner {
				height: 88px !important;
			}
		}

		:deep(.el-form-item__label) {
			color: #555 !important;
			font-weight: 400 !important;
		}
	}


	.search-content {
		margin-top: 25px;
		padding: 0 20px;
		height: 72px;

		.search-btn {
			margin-left: 20px;
			// padding-right: 20px;
		}

	}

	:deep(.el-form-item) {
		margin-bottom: 0;
	}

	:deep(.el-input) {
		--el-input-height: 28px;
		--el-input-border-color: #DBDDE3;
		--el-input-border-radius: 4px;
		--el-input-padding-left: 10px;
		--el-input-padding-right: 10px;
		width: 260px;
	}

	:deep(.el-select__wrapper) {
		min-height: 28px;
		border-radius: 4px;
	}
</style>