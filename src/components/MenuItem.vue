<template>
    <el-sub-menu :index="menu.path" v-if="menu.children && menu.children.length > 0"
        :class="menu.parentId == 0 ? '' : 'item-menu-back'">
        <template #title>{{ menu.metaVO.title }}</template>
        <menu-item :menus="items" v-for="items in menu.children" :key="items.id"></menu-item>
    </el-sub-menu>
    <template v-else>
        <el-menu-item :index="menu.path" :class="menu.parentId == 0 ? '' : 'item-menu-back'">{{
            menu.metaVO.title }}</el-menu-item>
    </template>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue';
const props = defineProps(['menus'])
const menu = ref(props.menus ?? null)
watch(() => props.menus, (newName) => {
    menu.value = newName
}, { immediate: true });
</script>
<style lang="scss" scoped></style>