<template>
    <div class="tree-item"
        :class="node.nodeType == 'menu' ? 'tree-item-menu' : 'tree-item-page', node.showChild ? '' : 'isCollect'">
        <div class="tree-node-line" :class="node.nodeType == 'menu' ? 'tree-line-menu' : ''">
            <div class="tree-node-left jus-start-center">
                <div class="more-btn" v-if="node.children && node.children.length > 0"
                    @click="node.showChild = !node.showChild">
                    <el-icon v-if="node.showChild">
                        <CaretBottom />
                    </el-icon>
                    <el-icon v-else>
                        <CaretRight />
                    </el-icon>
                </div>
                <div v-else class="more-btn" style="width: 14px;"></div>
                <div class="node-icon">
                    <div class="node-type" :class="node.nodeType == 'menu' ? 'node-icon-menu' : 'node-icon-page'"></div>
                </div>

                <div class="node-name" :style="{ 'font-weight': node.nodeType == 'menu' ? 'bold' : '400' }">{{
                    node.name }}</div>
                <!-- <div class="node-time">{{ node.time }}</div> -->
            </div>
            <div class="tree-node-right jus-start-center">
                <div class="btn-add" v-show="node.nodeType == 'menu'">
                    <span class="btn-icon-menu"></span>
                    <span @click.stop="addMenuFn(node.id)">添加菜单</span>
                </div>
                <div class="btn-add" v-show="node.nodeType == 'menu'">
                    <span class="btn-icon-page"></span>
                    <span @click.stop="addPageFn(node.id)">添加页面</span>

                </div>
                <el-icon class="btn-add" @click.stop="moveUpFn(node.id)">
                    <ArrowUp />
                </el-icon>
                <el-icon class="btn-add" @click.stop="moveDownFn(node.id)">
                    <ArrowDown />
                </el-icon>
                <el-icon class="btn-add" @click.stop="editFn(node)">
                    <Edit />
                </el-icon>
                <el-icon class="btn-add" @click.stop="deleteFn(node.id)">
                    <Delete />
                </el-icon>
            </div>
        </div>
        <tree-node v-for="(items, index) in node.children" :key="index" :nodes="items"
            v-show="node.showChild && node.children && node.children.length > 0" @add-menu-node="addMenuFn"
            @add-page-node="addPageFn" @edit-node="editFn" @move-up-node="moveUpFn" @move-down-node="moveDownFn"
            @delete-node="deleteFn"></tree-node>
    </div>
</template>
<script setup>
import { ref, reactive, onMounted, watch } from 'vue';
import { Menu, Document, ArrowUp, ArrowDown, Edit, Delete, CaretBottom, CaretTop } from '@element-plus/icons-vue';
const props = defineProps(['nodes'])
const node = ref(props.nodes ?? null)
watch(() => props.nodes, (newName) => {
    node.value = newName
}, { immediate: true });
const emits = defineEmits(['add-menu-node', 'add-page-node', 'edit-node', 'move-up-node', 'move-down-node'])
const addMenuFn = (id) => {
    emits('add-menu-node', id)
}
const addPageFn = (id) => {
    emits('add-page-node', id)
}
const editFn = (node) => {
    emits('edit-node', node)
}
const moveUpFn = (id) => {
    emits('move-up-node', id)
}
const moveDownFn = (id) => {
    emits('move-down-node', id)
}
const deleteFn = (id) => {
    emits('delete-node', id)
}
</script>
<style lang="scss" scoped>
.tree-node-line {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.tree-line-menu {
    margin-bottom: 10px;
    // padding-right: 15px;
}

.more-btn {
    cursor: pointer;
    margin-right: 15px;
}

.node-type {
    width: 20px;
    height: 20px;
    margin-left: 5px;
    border-radius: 4px;
    cursor: pointer;
}

.node-icon-menu {
    background: url('/menu.svg') no-repeat center;
    background-size: 100% 100%;
}

.node-icon-page {
    background: url('/page.svg') no-repeat center;
    background-size: 100% 100%;
}

.node-name {
    margin: 0 10px;
    font-size: 16px;
    font-family: Source Sans 3;
    color: #1d1d1d;
}

.node-time {
    font-size: 14px;
    font-family: Source Sans 3;
    font-weight: 400;
    color: #888;
}

.tree-item {
    padding: 15px;
    // padding-right: 0;
    border-radius: 8px;
    margin-bottom: 10px;
}

// .tree-node-right {
//     margin-right: 15px;
// }

.tree-item-menu {
    background: #f5f7fa;
    border: 1px solid #f5f7fa;
    margin-left: 35px;
    padding-bottom: 10px;
    // .tree-node-line {
    //     .tree-node-right {
    //         padding-right: 20px;
    //     }

    // }
}

.tree-item-page {
    background: #fff;
    border: 1px solid #fff;
    margin-left: 35px;
}

.tree-item-page:hover {
    background: #eef4ff;
    border-color: #2173f7;
}

.isCollect:hover {
    background: #eef4ff;
    border-color: #2173f7;
}

.btn-icon-menu {
    display: inline-block;
    margin-right: 4px;
    width: 20px;
    height: 20px;
    background: url('/add-menu.svg') no-repeat center;
    background-size: 100% 100%;
    vertical-align: middle;
}

.btn-icon-page {
    display: inline-block;
    margin-right: 4px;
    width: 20px;
    height: 20px;
    background: url('/add-page.svg') no-repeat center;
    background-size: 100% 100%;
    vertical-align: middle;
}

.btn-add {
    cursor: pointer;
    margin: 0 10px;
    font-size: 20px !important;

    svg {
        width: 1.5em !important;
        height: 1.5em !important;
    }
}
</style>