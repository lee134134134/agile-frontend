<template>
  <div class="parent-test">
    <!-- <div class="opt-btn" @click="handleSaveContent2">保存</div> -->
    <!-- <div class="opt-btn" @click="handleSaveContent">保存</div> -->
    <CanvasEditor ref="canvasEditor" :parentContent="parentContent" :view="view"
                  @save-content="handleSaveCanvasEditorContent" @save-docx="saveDocx"/>
  </div>
</template>

<script lang="ts" setup>
import {defineExpose, onBeforeUnmount, onMounted, ref} from 'vue';
import CanvasEditor from '../../canvas-editor/index.vue';
// 
const props = defineProps(['info']);
const emits = defineEmits([
  'closeDiaFn',
  'confirmFn', 'confirmAutoFn', 'confirmSaveFn'])

// 存放父组件传递的数据
const parentContent = ref<any>(undefined);
// 存放子组件数据
const content = ref<any>(undefined);
// 标识符
const view = ref<string | undefined>(undefined);

// 组件引用
const canvasEditor = ref<InstanceType<typeof CanvasEditor> | null>(null);
// 初始化数据
onMounted(() => {
  console.log("模拟父组件向后端请求数据, 传递给子组件");
  getEditorContent();
  view.value = "parent";
});
onBeforeUnmount(() => {
  if (canvasEditor.value) {
    canvasEditor.value = null
  }
})
// 模拟后端获取数据的方法
const getEditorContent = () => {
  if (props.info) {
    parentContent.value = props.info.data
  } else {
    parentContent.value = {
      header: [],
      main: [
        {
          value: ""
        },
      ],
    };

  }

};


// 保存内容方法
// const handleSaveContent = () => {
//     // 访问子组件的方法
//     (canvasEditor.value as any).saveContent();
// };
const handleSaveContent = () => {
  // 访问子组件的方法
  (canvasEditor.value as any).saveDoc();
};

// 处理子组件传递的数据
const handleSaveCanvasEditorContent = (data: any) => {
  // console.log("从子组件接收到的数据:", data);
  // // 将data数据转换为 json 格式的数据, 方便入库处理
  content.value = JSON.stringify(data);
  console.log("转换后的数据 content 为: ", content.value);
};
const saveDocx = (data: any) => {
  const htmlContent = data;
  console.log("htmlContent: ", htmlContent);
  emits('confirmSaveFn', htmlContent)
};

defineExpose({
  handleSaveContent
})

</script>

<style lang="scss" scoped>
.parent-test {
  position: relative;
  width: 100%;
  height: 100%;
  background: #fff;

  .opt-btn {
    position: absolute;
    right: 0;
    top: -50px;
    z-index: 9999;
  }
}
</style>
