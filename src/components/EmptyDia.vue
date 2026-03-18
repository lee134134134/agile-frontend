<template>
    <div class="empty-content" v-for="item in emptyList" :key="item.type">
        <el-empty v-if="item.type === type" :description="item.description" :image="getUrl(item.type)" />
    </div>
</template>

<script setup>
import { ref, defineProps } from 'vue'
import noData from '@/assets/images/noData@2x.png'
const props = defineProps([
    'type'
]);
const type = ref(props.type)
const emptyList = ref([
    {
        type: 'zwsj',
        description: '暂时没有任何内容',
        imageUrl: noData
    },
])
const getUrl = (type) => {
    let file = emptyList.value.find(ele => ele.type == type)
    if (file) {
        return file.imageUrl
    } else {
        return ''
    }
}

</script>

<style lang="scss" scoped></style>