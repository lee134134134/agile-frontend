<template>
    <el-dialog v-model="addShow" :show-close="false" width="996px" @close="handleClose" :close-on-click-modal="false" :close-on-press-escape="false" class="edit-dia">
        <template #header="{ close }">
            <div class="dia-header">
                <div class="dia-header-title">
                    <div class="title-icon"></div>
                    <div class="title-text">{{ title }}迭代</div>
                </div>
                <el-icon class="dia-header-close" size="16px" @click="close">
                    <Close />
                </el-icon>
            </div>
        </template>
        <div class="dia-main">
            <el-form ref="detailFromRef" :model="detailFrom" :rules="detailRule" class="dia-main-content"
                label-width="120px" label-position="right">
                <el-row :gutter="24">
                    <el-col :span="24">
                        <el-form-item label="迭代名称" prop="name">
                            <el-input v-model="detailFrom.name" placeholder="请输入迭代名称" maxlength="20" clearable show-word-limit>
                                <!-- <template #suffix>
                                  最多20字符
                                </template> -->
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="24">
                    <el-col :span="12">
                        <el-form-item label="迭代周期" prop="proDate">
                           <el-date-picker v-model="detailFrom.proDate" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" value-format="YYYY-MM-DD" format="YYYY-MM-DD"
						   clearable style="height:32px;border-radius: 4px;" :disabled="!canDateEdit" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="可用工作日" prop="period">
                            <el-input-number v-model="detailFrom.period" placeholder="请输入" min="1" style="width:100%;" :controls="false" align="left"
                                clearable :precision="0"></el-input-number>
                        </el-form-item>

                    </el-col>
                </el-row>
                <el-row :gutter="24">
                    <el-col :span="24">
                        <el-form-item label="所属项目" prop="projectCode">
                            <el-select v-model="detailFrom.projectCode" placeholder="请选择" clearable>
                              <el-option v-for="item in projectList" :key="item.projectId" :label="item.name" :value="item.projectId" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
				<el-row :gutter="24">
				    <el-col :span="24">
				        <el-form-item label="团队" prop="teamName">
				            <el-input v-model="detailFrom.teamName" placeholder="请输入团队"  maxlength="20" clearable show-word-limit>
                                <!-- <template #suffix>
                                最多20字符
                                </template> -->
                            </el-input>
				        </el-form-item>
				    </el-col>
				</el-row>
                <el-row :gutter="24"  v-for="(domain, index) in detailFrom.members" :key="domain">
                    <el-col :span="12">
                        <el-form-item :label="index==0?'团队成员':''" :prop="'members.' + index + '.userAccount'">
                            <el-select v-model="domain.userAccount" placeholder="请选择人员" clearable>
                                <el-option v-for="item in otherRemainUserOptions" :key="item.username" :label="item.nickname"
                                    :value="item.username" :disabled="assoUserOptions.some(opt => opt.username == item.username)" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="9">
                        <el-form-item label-width="0px" :prop="'members.' + index + '.availability'">
                         <el-input-number v-model="domain.availability" placeholder="请填写可用工时" min="0.1" max="1" style="width:100%;" :controls="false" align="left"
                             clearable :precision="1"></el-input-number>
                        </el-form-item>
                    </el-col>
					<el-col :span="3">
						<div style="display: flex;justify-content: end;">
							<el-button class="mini-btn" @click="addDomain(domain)" type="" icon="Plus" ></el-button>
							<el-button class="mini-btn" @click="removeDomain(domain)" type="" icon="Minus" :disabled="detailFrom.members.length===1"></el-button>
						</div>
					</el-col>
                </el-row>
                <el-row :gutter="24">
                    <el-col :span="12">
                        <el-form-item label="需求分析人" prop="productOwnerAccount">
                            <el-select v-model="detailFrom.productOwnerAccount" placeholder="请选择" clearable>
                                <el-option v-for="item in assoUserOptions" :key="item.username" :label="item.nickname"
                                    :value="item.username" />
                            </el-select>
                        </el-form-item>
                    </el-col>
					<el-col :span="12">
					    <el-form-item label="Scrum Master" prop="scrumMasterAccount">
					        <el-select v-model="detailFrom.scrumMasterAccount" placeholder="请选择" clearable>
					            <el-option v-for="item in assoUserOptions" :key="item.username" :label="item.nickname"
					                :value="item.username" />
					        </el-select>
					    </el-form-item>
					</el-col>
                </el-row>
            </el-form>
            <div class="dia-footer jus-flex-end">
                <div class="btn-cancel" @click="handleClose">取消</div>
                <div class="btn-submit" @click="handleSubmit">保存</div>
            </div>
        </div>
    </el-dialog>
</template>

<script setup>
import { ref, reactive, watch, onBeforeMount, onMounted } from 'vue';
import { Close } from '@element-plus/icons-vue';
import { isValidEChar } from "@/utils/index.js";
import { ElMessage } from 'element-plus';


const props = defineProps(['type', 'isShow', 'projectInfo', 'statusList', 'defaultStatus', 'projectList', 'userOptions']);
const emits = defineEmits([
    'closeDiaFn',
    'confirmFn',
    'editConfirmFn'])
const addShow = ref(props.isShow ?? false)
const title = ref(props.type || '新增')
const detailFromRef = ref(null)
const detailFrom = reactive({
  name: '',
  proDate: [],
	period: undefined,
	projectCode:'',
	teamName:'',
	members: [
		{
			userAccount: '',
			availability: undefined,
		}
	],
	productOwnerAccount:'',
	scrumMasterAccount:''
})
const statusList = ref([])
const assoUserOptions = ref([])
const otherRemainUserOptions = ref([])
otherRemainUserOptions.value = props.userOptions
const canDateEdit = ref(false) // 迭代周期字段是否可修改

const detailRule = {
    name: [
        { required: true, message: '请输入迭代名称', trigger: 'submit' },
        { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'submit' }
    ],
    proDate: [{ required: true, message: '请选择迭代周期', trigger: 'submit' }],
    period: [{ required: true, message: '请输入可用工作日', trigger: 'submit' }],
    projectCode: [{ required: true, message: '请选择所属项目', trigger: 'submit' }],
    teamName: [{ required: true, message: '请输入团队', trigger: 'submit' }],
}

watch(() => detailFrom.members, (newName) => {
    assoUserOptions.value = props.userOptions.filter(itemA => 
      newName.some(itemB => itemB.userAccount === itemA.username)
    )
    let flag1 = assoUserOptions.value.some(item => item.username == detailFrom.productOwnerAccount)
    let flag2 = assoUserOptions.value.some(item => item.username == detailFrom.scrumMasterAccount)
    if(!flag1) {
      detailFrom.productOwnerAccount = ''
    }
    if(!flag2) {
      detailFrom.scrumMasterAccount = ''
    }

},{deep: true});
watch(() => props.type, (newName) => {
    title.value = newName
});
watch(() => props.statusList, (newName) => {
    statusList.value = newName
    detailFrom.state = props.defaultStatus ?? ''
}, { immediate: true })
const handleClose = () => {
    addShow.value = false
    emits('closeDiaFn')
}
const handleSubmit = () => {
    if (detailFromRef.value) {
        detailFromRef.value.validate((valid) => {
            if (valid) {
              // console.log('detailFrom===', detailFrom)
              let flag = handleDatas()
              if(!flag) {
                ElMessage.error('请填写团队成员：人员及可用工时！')
                return
              }
              detailFrom.productOwnerAccount = detailFrom.productOwnerAccount || ''
              detailFrom.scrumMasterAccount = detailFrom.scrumMasterAccount || ''
              if (props.type == '添加') {
                  emits('confirmFn', detailFrom)
              } else {
                  detailFrom.sprintId = props.projectInfo.sprintId
                  emits('editConfirmFn', detailFrom)
              }
            }
        })
    }
}

const handleDatas = () => {
  // 成员和可用性必须全填
  // 一条：判断全空或全填，否则提示
  // 多条：判断全空，否则提示
  if(detailFrom.members.length == 1) {
    if((detailFrom.members[0].userAccount && !detailFrom.members[0].availability) || (!detailFrom.members[0].userAccount && detailFrom.members[0].availability)) {
      return false
    }else {
      return true
    }
  }else {
    let result = true
    for(let i = 0; i < detailFrom.members.length; i++) {
      if(!detailFrom.members[i].userAccount || !detailFrom.members[i].availability) {
        result = false
        return result
      }
    }
    return result
  }
}

// 添加账户
const addDomain = (item) => {
	const index = detailFrom.members.indexOf(item)
	if (index !== -1) {
		detailFrom.members.splice(index+1, 0,{
			userAccount: '',
			availability: undefined,
		})
	}
}
// 删除子账户
const removeDomain = (item) => {
		const index = detailFrom.members.indexOf(item)
		if (index !== -1) {
			detailFrom.members.splice(index, 1)
		}
}

const checkDateEdit = () => {
  if(props.type == '编辑') {
    // 只有关键操作审核员可以编辑开始日期和结束日期
    let userInfo = JSON.parse(localStorage.getItem('agiles_user'))
    if(userInfo.rolesCode.includes('keyReview')) {
      canDateEdit.value = true 
    }else {
      canDateEdit.value = false 
    }
  }else {
    canDateEdit.value = true
  }
}

onMounted(() => {
    // 判断权限
    checkDateEdit()
    if (props.type == '编辑') {
        detailFrom.name = props.projectInfo.name
        detailFrom.proDate = [props.projectInfo.startDate, props.projectInfo.endDate]
        detailFrom.period = props.projectInfo.period
        detailFrom.projectCode = props.projectInfo.projectCode
        detailFrom.teamName = props.projectInfo.teamName
        if(props.projectInfo.teamMembers && props.projectInfo.teamMembers.length > 0) {
          detailFrom.members = props.projectInfo.teamMembers.map(item => {
            return {
              userAccount: item.userAccount,
              availability: item.availability || undefined,
            }
          })
        }else {
          detailFrom.members = [
            {
              userAccount: '',
              availability: undefined,
            }
          ]
        }
        detailFrom.productOwnerAccount = props.projectInfo.productOwnerAccount
        detailFrom.scrumMasterAccount = props.projectInfo.scrumMasterAccount
    }else if(props.type == '添加') {
        detailFrom.projectCode = localStorage.getItem('global_ProjectCode')
    }
})

</script>
<style lang="scss" scoped>
.dia-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 15px 20px;

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
    // padding-left: 48px;
    // padding-right: 48px;

    // .dia-main-content {
    //     margin-bottom: 30px;
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

.mini-btn{
  height: 28px;
}
</style>