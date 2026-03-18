<template>
    <el-drawer v-model="showDrawer" :before-close="handleClose">
        <template #header>
            <div class="title-1">详情</div>
        </template>
        <template #default>
            <div class="drawer-content">
                <el-form ref="detailFromRef" :model="detailFrom" :rules="detailRule" label-width="110px"
                    label-position="left">
                    <el-form-item label="名称：" prop="name">
                        <el-input v-model="detailFrom.name" placeholder="请输入名称" maxlength="20" clearable
                            :disabled="!isEdit"></el-input>
                    </el-form-item>
                    <el-form-item label="描述" prop="desc">
                        <el-input v-model="detailFrom.desc" placeholder="请输入" type="textarea" maxlength="200"
                            :disabled="!isEdit" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="版本：" prop="verision">
                        <el-input v-model="detailFrom.verision" placeholder="请输入" clearable :disabled="!isEdit"></el-input>
                    </el-form-item>
                    <el-form-item label="文件大小：" prop="imgSize">
                        <el-input v-model="detailFrom.imgSize" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="文件类型：" prop="imgType">
                        <el-input v-model="detailFrom.imgType" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="所属节点：" prop="path">
                        <el-input v-model="detailFrom.path" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="上传人：" prop="creatBy">
                        <el-input v-model="detailFrom.creatBy" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="上传时间：" prop="creatTime">
                        <el-input v-model="detailFrom.creatTime" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="最新更新时间：" prop="updateTime">
                        <el-input v-model="detailFrom.updateTime" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="评审状态：" prop="status">
                        <el-select v-model="detailFrom.status" placeholder="请选择" :disabled="!isEdit">
                            <el-option v-for="item in statusList" :key="item.value" :label="item.name"
                                :value="item.value" />
                        </el-select>

                    </el-form-item>
                </el-form>
                <div class="dia-footer jus-center" v-show="!isEdit">
                    <div class="btn-cancel" @click="handlEdit">编辑</div>
                    <div class="btn-submit" @click="handleDele">删除</div>
                </div>
                <div class="dia-footer jus-center" v-show="isEdit">
                    <div class="btn-cancel" @click="handleCancle">取消</div>
                    <div class="btn-submit" @click="handleSubmit">保存</div>
                </div>
            </div>
        </template>
    </el-drawer>
</template>
<script setup>
import { ref, reactive, onBeforeMount } from 'vue';
import { isValidVersion } from "@/utils/index.js";
const props = defineProps(['isShow', 'detailInfo']);
const emits = defineEmits([
    'closeDiaFn',
    'editConfirmFn', 'deleConfirmFn'])
const showDrawer = ref(props.isShow ?? false)
const detailFromRef = ref(null)
const detailFrom = reactive({
    id: 1,
    name: 'ui图文件名称',
    status: '通过',
    verision: '1.0',
    imgType: 'iamge/png',
    imgSize: '12kb',
    creatBy: '管理员',
    updateTime: '2025-12-12 12:13:12',
    creatTime: '2025-12-01 12:12:12',
    imgUrl: 'https://iam-int.hxjyam.com/em-invest/em-invest/css/logo@2x.C3YGXZA6.css',
    desc: '描述描述描述',
    path: '菜单/个人登录'
})
const statusList = ref([])
const baseData = reactive({
    id: undefined,
    name: undefined,
    status: undefined,
    verision: undefined,
    desc: undefined,
    menu: undefined
})
const checkVersion = (rule, value, callback) => {
    if (value == '') {
        return callback(new Error('请输入版本！'))
    } else if (!isValidVersion(value)) {
        return callback(new Error('您输入的版本格式不正确，请按照提示格式输入'))
    } else {
        return callback()
    }
}
const detailRule = {
    name: [
        { required: true, message: '请输入名称', trigger: 'blur' },
        { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
    ],
    verision: [{ required: true, validator: checkVersion, trigger: 'blur' }],
    state: [{ required: true, message: '请选择评审状态', trigger: 'change' }]

}
const isEdit = ref(false)
const handleClose = () => {
    showDrawer.value = false
    emits('closeDiaFn')
}
const handlEdit = () => {
    baseData.id = detailFrom.id
    baseData.name = detailFrom.name
    baseData.status = detailFrom.status
    baseData.verision = detailFrom.verision
    baseData.desc = detailFrom.desc
    isEdit.value = true
}
const handleDele = () => {
    emits('deleConfirmFn')
}
const handleCancle = () => {
    detailFrom.id = baseData.id
    detailFrom.name = baseData.name
    detailFrom.status = baseData.status
    detailFrom.verision = baseData.verision
    detailFrom.desc = baseData.desc
    baseData.id = undefined
    baseData.name = undefined
    baseData.status = undefined
    baseData.verision = undefined
    baseData.desc = undefined
    baseData.menu = undefined
    isEdit.value = false
}
const handleSubmit = () => {
    if (detailFromRef.value) {
        detailFromRef.value.validate((valid) => {
            if (valid) {
                emits('editConfirmFn', detailFrom)
            }
        })
    }
}
</script>
<style scoped lang="scss"></style>