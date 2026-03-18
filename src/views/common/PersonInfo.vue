<template>
  <div class="person-content jus-center">
    <div class="menu-left">
      <div :class="{ 'active-menu': activeMenu == 1 }" class="menu-item" @click="activeMenu = 1">
        <el-icon class="menu-icon">
          <User/>
        </el-icon>
        个人资料
      </div>
      <div :class="{ 'active-menu': activeMenu == 2 }" class="menu-item" @click="activeMenu = 2">
        <el-icon class="menu-icon">
          <Lock/>
        </el-icon>
        修改密码
      </div>
    </div>
    <div v-show="activeMenu == 1" class="container-view">
      <div class="title-1">个人资料管理</div>
      <div class="main-container jus-center">
        <el-form ref="dataFromRef" :model="dataFrom" :rules="dataRule" class="dia-main-content"
                 hide-required-asterisk="true" label-position="right" label-width="100px" style="100%">
          <el-form-item label="账号">
            <el-input v-model="dataFrom.name" disabled style="width:500px"></el-input>
          </el-form-item>
          <el-form-item label="姓名" prop="nickname">
            <el-input v-model="dataFrom.nickname" :disabled="!isEditName" clearable placeholder="姓名（2-4个中文）"
                      style="width:500px">
            </el-input>
            <div class="opt-content">
              <el-button v-if="!isEditName" style="margin-bottom:2px" text type="primary"
                         @click="isEditName = !isEditName">修改
              </el-button>
              <div v-else class="opt-save jus-start-center">
                <img alt="" class="btn-margin-right" src="@/assets/webp/save_new.webp"
                     @click="handleSave(1)">
                <img alt="" src="@/assets/webp/cancel_new.webp" @click="handleCancelEdit('nickname')">
              </div>
            </div>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="dataFrom.email" :disabled="!isEditEmail" clearable
                      placeholder="邮箱（示例：zhangsan@hxjyam.com）" style="width:500px"></el-input>
            <div class="opt-content">
              <el-button v-if="!isEditEmail" style="margin-bottom:2px" text type="primary"
                         @click="isEditEmail = !isEditEmail">修改
              </el-button>
              <div v-else class="opt-save jus-start-center">
                <img alt="" class="btn-margin-right" src="@/assets/webp/save_new.webp"
                     @click="handleSave(2)">
                <img alt="" src="@/assets/webp/cancel_new.webp" @click="handleCancelEdit('email')">
              </div>
            </div>
          </el-form-item>
          <el-form-item class="form-w" label="当前角色">
            <div v-if="dataFrom.role.length > 0" class="role-list">
              <el-tag v-for="item in dataFrom.role" style="margin-right: 12px; margin-bottom: 12px;" type="primary">{{
                  item
                }}
              </el-tag>
            </div>
          </el-form-item>
          <el-form-item label="岗位">
            <div v-if="dataFrom.positionName" class="role-list">
              <el-tag type="primary">{{ dataFrom.positionName }}</el-tag>
            </div>
          </el-form-item>
          <el-form-item label="注册时间">
            <el-input v-model="dataFrom.createdAt" disabled style="width:500px"></el-input>
          </el-form-item>

        </el-form>
      </div>
    </div>
    <div v-show="activeMenu == 2" class="container-view">
      <div class="title-1">登录密码管理</div>
      <div class="main-container jus-center">
        <el-form ref="passwordFromRef" :model="passwordFrom" :rules="passwordRule" class="dia-main-content"
                 hide-required-asterisk="true" label-position="right" label-width="100px" style="100%">
          <el-form-item label="旧密码" prop="password">
            <el-input v-model="passwordFrom.password" clearable placeholder="请输入"
                      style="width:300px"></el-input>
          </el-form-item>
          <el-form-item label="新密码" prop="newpassword">
            <el-input v-model="passwordFrom.newpassword" clearable placeholder="请输入" style="width:300px">
            </el-input>
          </el-form-item>
          <el-form-item label="确认新密码" prop="newpassword2">
            <el-input v-model="passwordFrom.newpassword2" clearable placeholder="请输入"
                      style="width:300px"></el-input>
          </el-form-item>
        </el-form>
        <div class="opt-btn" @click="handleSubmit">修改密码</div>
      </div>
    </div>
  </div>
</template>
<script setup>
import {onBeforeMount, reactive, ref} from 'vue';
import {isValidChinese, isValidEmail, isValidPassWord} from '@/utils/index.js';
import {useDicStore} from '@/stores/dic.js';
import {updatePassword, updateUserInfo} from '@/api/api.js';
import Cookies from "js-cookie";
import {useRouter} from 'vue-router'

const router = useRouter()

const dicStore = useDicStore()
const activeMenu = ref(1)
const dataFromRef = ref(null)
const passwordFromRef = ref(null)

const dataFrom = reactive({
  name: '',
  nickname: '',
  email: '',
  createdAt: '',
  role: []
})
const isEditName = ref(false)
const isEditEmail = ref(false)
const passwordFrom = reactive({
  password: '',
  newpassword: '',
  newpassword2: ''
})
const checkName = (rule, value, callback) => {
  if (value == '') {
    return callback(new Error('请输入姓名！'))
  } else if (!isValidChinese(value)) {
    return callback(new Error('您输入的姓名格式不正确'))
  } else {
    return callback()
  }
}
const checkEmail = (rule, value, callback) => {
  if (value == '') {
    return callback(new Error('请输入邮箱！'))
  } else if (!isValidEmail(value)) {
    return callback(new Error('请输入正确的邮箱格式'))
  } else {
    return callback()
  }
}
const checkPassWord = (rule, value, callback) => {
  if (value == '') {
    return callback(new Error('请输入密码！'))
  } else if (!isValidPassWord(value)) {
    return callback(new Error('您输入的密码格式不正确'))
  } else {
    return callback()
  }
}
const checkPassWord2 = (rule, value, callback) => {
  if (value == '') {
    return callback(new Error('请输入确认密码！'))
  } else if (value != passwordFrom.newpassword) {
    return callback(new Error('两次输入密码不一致，请重新输入'))
  } else {
    return callback()
  }
}
const dataRule = {
  nickname: [{validator: checkName, trigger: 'submit'}],
  email: [{validator: checkEmail, trigger: 'submit'}],
}
const passwordRule = {
  password: [{required: true, message: '请输入旧密码', trigger: 'submit'}],
  newpassword: [{required: true, validator: checkPassWord, trigger: 'submit'}],
  newpassword2: [{required: true, validator: checkPassWord2, trigger: 'submit'}],
}
const handleSave = (type) => {
  if (dataFromRef.value) {
    dataFromRef.value.validate((valid) => {
      if (valid) {
        // let user = JSON.parse(localStorage.getItem("agiles_user"))
        // user.nickname = dataFrom.nickname
        let params
        if (type == 1) {
          params = {
            name: dataFrom.name,
            nickname: dataFrom.nickname,
          }
        } else {
          params = {
            name: dataFrom.name,
            email: dataFrom.email
          }
        }
        updateUserInfo(params).then(res => {
          if (res.success) {
            localStorage.setItem('agiles_user', JSON.stringify(res.data))
            dicStore.nickname = dataFrom.nickname
            if (type == 1) {
              isEditName.value = false
            } else {
              isEditEmail.value = false
            }
          }
        })

      } else {
        console.log('error submit!!')
        return false
      }
    })
  }
}

// 取消
const handleCancelEdit = (type) => {
  let user = JSON.parse(localStorage.getItem("agiles_user"))
  if (type == 'nickname') {
    dataFrom.nickname = user.nickname
    dataFromRef.value.clearValidate('nickname')
    isEditName.value = false
  } else {
    dataFrom.email = user.email
    dataFromRef.value.clearValidate('email')
    isEditEmail.value = false
  }
}

const handleSubmit = () => {
  if (passwordFromRef.value) {
    passwordFromRef.value.validate((valid) => {
      if (valid) {
        console.log(passwordFrom, '-个人信息保存')
        let params = {
          oldPassword: passwordFrom.password,
          newPassword: passwordFrom.newpassword
        }
        updatePassword(params).then(res => {
          if (res.success) {
            Cookies.remove('agiles_token')
            Cookies.remove('agiles_tokenType')
            localStorage.removeItem('agiles_token')
            localStorage.removeItem('agiles_tokenType')
            localStorage.removeItem('agiles_user')
            localStorage.removeItem("agiles_userInfo");
            localStorage.removeItem("agiles_router");
            localStorage.removeItem("agiles_menuList");
            router.push({path: '/login'})
            ElMessage.success('退出成功')
          }
        })
      } else {
        console.log('error submit!!')
        return false
      }
    })
  }
}
onBeforeMount(() => {
  let userInfo = JSON.parse(localStorage.getItem("agiles_user"))
  dataFrom.name = userInfo.name
  dataFrom.nickname = userInfo.nickname
  dataFrom.email = userInfo.email
  dataFrom.createdAt = userInfo.createdAt
  dataFrom.role = userInfo.role
  dataFrom.positionName = userInfo.positionName
})
</script>
<style lang="scss" scoped>
.person-content {
  padding: 30px 0;
  margin: 0 auto;
  align-items: flex-start;
  height: 100%;
  background: #f6f8fc;

  .menu-left {
    width: 224px;
    height: 130px;
    background: #fff;
    border-radius: 8px;
    padding: 20px;

    .active-menu {
      background: #eaf0fe;
    }

    .menu-item {
      padding: 0 10px;
      height: 40px;
      line-height: 40px;
      color: #333;
      font-size: 14px;
      font-family: 'Microsoft YaHei', 'PingFang SC';
      font-weight: 500;
      cursor: pointer;
      margin-bottom: 10px;
      border-radius: 8px;
    }
  }

  .container-view {
    padding: 20px 20px 70px;
    margin-left: 20px;
    width: 900px;
    background: #fff;
    border-radius: 12px;

    .opt-btn {
      margin-top: 0;
      height: 28px;
      line-height: 20px;
      padding: 4px 16px;
      margin-left: -111px;
    }
  }

  .title-1 {
    padding-bottom: 12px;
    border-bottom: 1px solid #e2e4e8;
  }

  .main-container {
    margin-top: 40px;
    flex-direction: column;

    .role-list {
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;
      align-items: self-start;
    }

    .opt-content {
      height: 28px;
      line-height: 28px;
      position: absolute;
      right: -69px;
      top: -1px;
      z-index: 999;
      box-sizing: border-box;

      :deep(.el-button){
        padding: 0;
        height: 28px;
        line-height: 28px;
        margin-left: -56px;
      }

      .opt-save {
        margin-top: 6px;
        margin-right: 15px;

        img {
          width: 16px;
          height: 16px;
          cursor: pointer;
          display: block;

          &.btn-margin-right{
            width: 16px;
            height: 16px;
          }
        }
      }

    }

    :deep(.el-input) {
      --el-input-height: 28px;
      --el-input-border-color: #DBDDE3;
      --el-input-border-radius: 4px;
      --el-input-padding-left: 10px;
      --el-input-padding-right: 10px;
    }


    :deep(.el-form-item__label) {
      color: #555 !important;
      font-weight: 400 !important;
    }

    :deep(.el-input.is-disabled .el-input__wrapper) {
      background-color: #fff !important;
    }

    :deep(.el-tag.el-tag--primary) {
      height: 28px !important;
    }
  }
}

.menu-icon {
  vertical-align: -1px;
  margin-right: 15px;
}

.form-w{
  width: 600px;
  margin-bottom: 4px;
}
</style>