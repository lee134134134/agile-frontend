<template>
  <div class="main-content">
    <div class="page-search">
      <div class="title-1">用户管理</div>
    </div>
    <section class="table-wrapper">
      <div class="search-content jus-bet-start">
        <el-form ref="userFromRef" :model="userFrom" label-position="left">
          <div class="flex">
            <el-form-item label="账号" prop="name">
              <el-input v-model="userFrom.name" clearable placeholder="请输入账号" style="width: 160px;"></el-input>
            </el-form-item>
            <el-form-item label="姓名" prop="nickname">
              <el-input v-model="userFrom.nickname" clearable placeholder="请输入姓名" style="width: 160px;"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="userFrom.email" clearable placeholder="请输入邮箱" style="width: 220px;"></el-input>
            </el-form-item>
            <el-form-item label="角色" prop="roleId">
              <el-select v-model="userFrom.roleId" clearable placeholder="全部" style="width: 100px;">
                <el-option v-for="item in roleList" :key="item.id" :label="item.displayName"
                           :value="item.id"/>
              </el-select>
            </el-form-item>
            <el-form-item label="用户状态" prop="status">
              <el-select v-model="userFrom.status" clearable placeholder="全部" style="width: 100px;">
                <el-option v-for="item in statusOptions" :key="item.value" :label="item.name"
                           :value="item.value"/>
              </el-select>
            </el-form-item>
            <el-form-item label="岗位" prop="position">
              <el-select v-model="userFrom.position" clearable placeholder="全部" style="width: 100px;">
                <el-option v-for="item in workList" :key="item.value" :label="item.name"
                           :value="item.value"/>
              </el-select>
            </el-form-item>
            <div class="search-btn">
              <div class="btn-primary btn-margin-right" @click="handleSerach">
                <el-icon class="mr-3">
                  <Search/>
                </el-icon>
                筛选
              </div>
              <div class="btn-circle-fix" @click="handleReset">
                <el-icon class="mr-3">
                  <RefreshLeft/>
                </el-icon>
                重置
              </div>
            </div>
          </div>
        </el-form>
      </div>
      <div class="page-table">
        <!--      <div class="title-2">用户列表</div>-->
        <el-table v-loading="loading" :data="tableData" :header-cell-style="TableRowStyle" fit
                  max-height="calc(100vh - 430px)" scrollbar-always-on
                  stripe style="width: 100%">
          <!-- <el-table-column prop="id" label="ID" min-width="100" align="center"></el-table-column> -->
          <el-table-column align="left" label="用户状态" min-width="100">
            <template #default="scope">
              <div v-if="scope.row.status == '1'" class="status-on ">启用中</div>
              <div v-else class="status-off">禁用中</div>
            </template>
          </el-table-column>

          <el-table-column align="left" label="账号" min-width="200" prop="name">
            <template #default="scope">
              <div class="jus-start-center">
                <div class="cell-content">{{ scope.row.name }}</div>
                <div v-show="scope.row.name == userName" class="current-user">当前用户</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="left" label="姓名" min-width="120" prop="nickname"></el-table-column>
          <el-table-column align="left" label="邮箱" min-width="200" prop="email"></el-table-column>
          <el-table-column align="left" label="岗位" min-width="120" prop="positionName"></el-table-column>
          <el-table-column align="left" label="角色" min-width="400" prop="role" show-overflow-tooltip></el-table-column>
          <el-table-column align="left" label="操作" width="150">
            <template #default="scope">
              <div v-if="scope.row.name != userName">
                <el-button :class="scope.row.name == userName ? 'disabled-btn' : 'text-btn'" class="btn-text-primary"
                           type="text"
                           @click="handleResetWord(scope.row)">
                  <el-tooltip content="重置密码" effect="light" popper-class="fix-tooltip" placement="top">
                    <img :src="passwordIcon" alt="重置密码" class="table-icon"/>
                  </el-tooltip>
                </el-button>
                <el-button :class="scope.row.name == userName ? 'disabled-btn' : 'text-btn'" class="btn-text-primary"
                           type="text"
                           @click="handleRole(scope.row)"><el-tooltip content="分配角色" effect="light" popper-class="fix-tooltip" placement="top">
                  <img :src="roleIcon" alt="分配角色" class="table-icon"/>
                </el-tooltip>
                </el-button>
                <el-button :class="scope.row.name == userName ? 'disabled-btn' : 'text-btn'" class="btn-text-primary"
                           type="text"
                           @click="handleWork(scope.row)"><el-tooltip content="分配岗位" effect="light" popper-class="fix-tooltip" placement="top">
                  <img :src="positionIcon" alt="分配岗位" class="table-icon"/>
                </el-tooltip>
                </el-button>
                <el-button :class="scope.row.name == userName ? 'disabled-btn' : 'text-btn'" class="btn-text-danger"
                           type="text"
                           @click="handleDelete(scope.row)">
                  <el-tooltip :content="scope.row.status == 1 ? '禁用' : '启用'" effect="light" popper-class="fix-tooltip" placement="top">
                    <img v-if="scope.row.status == 1" :src="disabelIcon" alt="禁用" class="table-icon"/>
                    <img v-else :src="archivedIcon" alt="启用" class="table-icon"/>
                  </el-tooltip>
                </el-button>
              </div>
              <div v-else class="disable-text">当前用户禁止操作</div>
            </template>
          </el-table-column>
        </el-table>
        <div class="paginationg-box">
          <pagination :currentPage="userFrom.current" :pageSize="userFrom.size" :total="total"
                      @currentPageCurrent="currentPageCurrent" @currentPageSize="currentPageSize">
          </pagination>
        </div>
      </div>
    </section>
    <ConfirmDia v-if="showResetWordDia" :diaWidth="'600'" :isShow="showResetWordDia" :title="'重置密码'"
                @closeDiaFn="showResetWordDia = false" @confirmFn="handleResetWordDia">
      <template #infoContent>
        <div class="info-content">
          <el-icon color="orange" size="20px" style="vertical-align: sub;">
            <WarningFilled/>
          </el-icon>
          <span class="dialog-password-text">密码重置确认</span><br/>
          <div class="dialog-password-sub-text">您即将为账号 <span class="color-blue">[{{ passWordResetInfo.name }}]</span> 姓名 <span class="color-blue">[{{
              passWordResetInfo.nickname
            }}]</span> 进行密码重置</div>
        </div>
      </template>
    </ConfirmDia>
    <ConfirmDia v-if="showResetResultDia" :diaWidth="'600'" :isCanCle="false" :isShow="showResetResultDia"
                :title="'重置密码'" @closeDiaFn="showResetResultDia = false" @confirmFn="showResetResultDia = false">
      <template #infoContent>
        <div class="info-content">临时密码已生成：<span class="color-blue">[{{ newWord }}]</span><br/>为保障账户安全，请提示用户及时修改个人密码
        </div>
      </template>
    </ConfirmDia>
    <RoleConfig v-if="configShow" :data="configInfo" :isShow="configShow" :list="roleList"
                @closeDiaFn="configShow = false" @confirmFn="handleConfigSuccess"></RoleConfig>
    <WorkConfig v-if="workConfigShow" :data="workInfo" :isShow="workConfigShow" :list="workList"
                @closeDiaFn="workConfigShow = false" @confirmFn="handleWorkConfigSuccess"></WorkConfig>
  </div>
</template>
<script setup>
import {onBeforeMount, onMounted, reactive, ref} from 'vue';
import {TableRowStyle} from '@/utils';
import pagination from '@/components/pagination.vue';
import {ElMessageBox} from 'element-plus';
import ConfirmDia from '@/components/ConfirmDia.vue';
import RoleConfig from './components/RoleConfig.vue';
import WorkConfig from './components/WorkConfig.vue'
import {resetPassword, roleSelectList, userDisable, userList} from '@/api/userManage.js';
import {getDicList} from '@/api/api.js';
import passwordIcon from "@/assets/webp/ico-password.webp";
import roleIcon from "@/assets/webp/ico-role.webp";
import positionIcon from "@/assets/webp/ico-position.webp";
import disabelIcon from "@/assets/webp/ico-disable.webp";
import archivedIcon from "@/assets/webp/archived.webp";

const userFrom = reactive({
  name: '',
  nickname: '',
  email: '',
  roleId: '',
  status: undefined,
  position: undefined,
  size: 10,
  current: 1,
});
const total = ref(100);
const userFromRef = ref(null);
const loading = ref(false);
const userName = ref('');
const showResetWordDia = ref(false);
const passWordResetInfo = ref(null);
const showResetResultDia = ref(false);
const newWord = ref(null);
const roleList = ref([]);
const tableData = ref([]);
const configShow = ref(false)
const configInfo = ref(null)
const workConfigShow = ref(false)
const workInfo = ref(null)
const workList = ref([])
const statusOptions = ref([
  {
    value: 1,
    name: '启用中'
  },
  {
    value: 0,
    name: '禁用中'
  }
])
/*查询相关功能: 
 * 查询操作 @handleSerach
 * 重置操作 @handleReset
 * 分页功能 @currentPageCurrent @currentPageSize
 * 获取list 
*/

const handleSerach = () => {
  userFrom.current = 1;
  getList()
};

const handleReset = () => {
  userFromRef.value.resetFields();
  userFrom.current = 1;
  getList()
};
const currentPageCurrent = (val) => {
  userFrom.current = val
  getList()
}
const currentPageSize = (val) => {
  userFrom.size = val
  userFrom.current = 1
  getList()
}

function getList() {
  loading.value = true
  userList(userFrom).then(res => {
    tableData.value = res.data.records;
    total.value = res.data.total;
    loading.value = false;
  }).catch(() => {
    loading.value = false;
  })
}

/*禁用功能:
 * 禁用确认弹窗 @handleDelete
 * 禁用功能 @handleDiableDia
*/
const handleDelete = (data) => {
  let message = ''
  if (data.status == 1) {
    message = `禁用后该用户" ${data.nickname} "将无法登录本平台，是否确认禁用？`
  } else if (data.status == 0) {
    message = `确认启用该用户" ${data.nickname} "吗？`
  }
  ElMessageBox.confirm(message, '', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    center: false,
    closeOnClickModal: false,
    autofocus: false,
    type: 'warning',
  }).then(() => {
    let params = {
      userId: data.id,
      status: data.status == 1 ? 0 : 1
    }
    userDisableFn(params)
  }).catch(() => {
    console.log('catch')
  })
};

function userDisableFn(data) {
  userDisable(data).then(res => {
    if (res.success) {
      getList()
    }
  }).catch(() => {
    console.log('catch')
  })
}

/*重置密码功能: 
 * 重置密码确认弹窗 @handleResetWord
 * 重置密码调用 @handleResetWordDia
*/
const handleResetWord = (data) => {
  passWordResetInfo.value = data;
  showResetWordDia.value = true;
};
const handleResetWordDia = () => {
  let params = {
    userId: passWordResetInfo.value.id
  }
  resetPassword(params).then(res => {
    if (res.success) {
      showResetWordDia.value = false;
      newWord.value = res.data.newPassword;
      showResetResultDia.value = true;
    }
  })

};
const handleRole = (data) => {
  configInfo.value = data
  configShow.value = true
}
const handleConfigSuccess = (data) => {
  configInfo.value = null
  configShow.value = false
  getList()
}
const handleWork = (data) => {
  workInfo.value = data
  workConfigShow.value = true
}
const handleWorkConfigSuccess = (data) => {
  workInfo.value = null
  workConfigShow.value = false
  getList()
}
const getRoleList = async () => {
  roleSelectList().then(res => {
    if (res.success) {
      roleList.value = res?.data ?? []
    }
  })
}
const getDicListFn = async (code) => {
  await getDicList(code).then(res => {
    if (res.success) {
      workList.value = res?.data ?? []
    }
  })
}
onBeforeMount(async () => {
  await getRoleList()
  await getDicListFn('POSITION_TYPE')
})
onMounted(() => {
  userName.value = JSON.parse(localStorage.getItem('agiles_user')).name
  getList()
})
</script>
<style lang="scss" scoped>
.main-content {
  background-color: #f6f8fc;
  height: 100%;

  .search-content {
    margin-top: 12px;
    padding: 12px 16px;

    .search-btn {
      display: flex;
      padding-right: 20px;
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
    height: 28px;
    border-radius: 4px;
  }

  .page-search {
    margin-bottom: 16px;
  }

  .page-table {
    padding: 0 16px;

    .title-2 {
      margin-bottom: 12px;
    }

    .status-content {
      text-align: center;
    }

    .current-user {
      margin-left: 5px;
      padding: 0 8px;
      height: 22px;
      background: #E0EEFF;
      border-radius: 4px;
      border: 1px solid #2173F7;
      color: #2173F7;
      font-size: 12px;
      line-height: 20px;
      text-align: center;
    }

    .btn-text-primary {
      color: #2173F7 !important;
    }

    .btn-text-danger {
      color: #F53F3F !important;
    }

    .disabled-btn {
      color: #B2B2B2 !important;
      cursor: default;
    }

    .text-btn:hover {
      opacity: 0.8 !important;
    }

    .disable-text {
      width: 175px;
      margin: 0 auto;
      font-size: 14px;
      color: #B2B2B2;
      font-family: PingFang SC;
      text-align: left;
    }
  }

  .info-content {
    text-align: left;
    font-family: PingFang SC;
    font-weight: 400;
    font-size: 16px;
    color: #555555;
    line-height: 28px;

    .color-blue {
      color: #2173F7;
    }

    svg {
      width: 1.5em;
      height: 1.5em;
    }
  }
}

.mr-3 {
  vertical-align: -1px;
}

.btn-primary {
  width: 64px;
  height: 28px;
  line-height: 28px;
  border-radius: 3px;
}

.btn-circle-fix {
  padding: 0 6px;
  width: 64px;
  height: 28px;
  line-height: 28px;
  border-radius: 3px;
  border: 1px solid #e2e4e8;
}

.flex {
  gap: 16px;
  align-items: center;
  flex-wrap: wrap;
}

.table-wrapper{
  border-radius: 8px;
  background: #fff;
}

.dialog-password-text{
  margin-left: 6px;
  color: #333;
  font-size: 14px;
  margin-bottom: 8px;
  display: inline-block;
}

.dialog-password-sub-text{
  color: #666;
  font-size: 12px;
}
</style>