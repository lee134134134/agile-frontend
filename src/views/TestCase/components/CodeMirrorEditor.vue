<template>
    <div class="sql-editor cm-s-robot">
      <!-- CodeMirror 编辑器组件 -->
      <!-- <Codemirror
        v-model:value="sqlContent"
        :options="cmOptions"
        :border="false"
        placeholder="请输入SQL语句..."
        @blur="handleChange"
        class="code-mirror"
        ref="editorRef"
      /> -->
      <textarea class="code-mirror" id="code-mirror"></textarea>
    </div>
  </template>
  
  <script setup>
  import { ref, watch, onMounted, shallowRef, nextTick } from 'vue'
  // 引入组件和所需的模式、主题
  import Codemirror from 'codemirror-editor-vue3'
  import 'codemirror/mode/sql/sql.js' // SQL 语法模式
  // import 'codemirror/theme/material.css' // 主题样式，可替换其他主题
  // 导入补全相关模块
  import 'codemirror/addon/hint/show-hint.css'
  import 'codemirror/addon/hint/show-hint.js'
  import 'codemirror/addon/hint/sql-hint.js'
  import '@/utils/robotframework.js'
  import '@/utils/robot-framework.css'

  const props = defineProps(['defaultEditorText', 'insertEditorText'])
  
  const sqlContent = ref('')
//   const editorRef = ref()
  let codemirror = shallowRef()
  let code = ref()

  watch(() => props.defaultEditorText, (newName) => {
    // console.log('默认值变化了==', newName)
    nextTick(() => {
        if(codemirror.value) {
            codemirror.value.setValue(newName)
        }
    })   
  }, {deep: true, immediate: true});

//   watch(() => props.insertEditorText, (newName) => {
//     nextTick(() => {
//         if(codemirror.value) {
//             insertVariable(newName)
//         }
//     })   
//   }, {deep: true});


  
  
  // CodeMirror 配置项
  const cmOptions = {
    mode: 'text/x-robotframework', // 指定 SQL 模式
    theme: 'robot-framework', // 对应引入的主题
    lineNumbers: true, // 显示行号
    autoCloseBrackets: true, // 自动补全括号
    matchBrackets: true, // 括号匹配高亮
    // lineWrapping: true, // 自动换行
    hintOptions: {
      completeSingle: false // 禁止单个字符自动补全
    },
    extraKeys: {
      'Tab': 'autocomplete'
    }
  }
  
  // 内容变化回调
  const handleChange = (val) => {
    console.log('SQL内容变化：', val, typeof(val))
  }

  const init = () => {
    codemirror.value = CodeMirror.fromTextArea(document.getElementById('code-mirror'), {
            mode: 'text/x-robotframework', // 指定 SQL 模式
            theme: 'robot-framework', // 对应引入的主题
            lineNumbers: true, // 显示行号
            autoCloseBrackets: true, // 自动补全括号
            matchBrackets: true, // 括号匹配高亮
            // lineWrapping: true, // 自动换行
            hintOptions: {
                completeSingle: false // 禁止单个字符自动补全
            },
            extraKeys: {
                'Tab': 'autocomplete'
            },
    })
    // insertVariable(props.editorText)
    codemirror.value.refresh()
    // setTimeout(() => {
    //     codemirror.value.replaceSelection(props.editorText)
    // }, 10)
    
  }

  const insertVariable = (content) => {
        if(!content) return
        const state = codemirror.value.state
        const cursor = codemirror.value.getCursor()
        // console.log('codemirror1===', codemirror.value)
        // console.log('codemirror2==', cursor)
        codemirror.value.replaceSelection(content)
        codemirror.value.setCursor(cursor)
        codemirror.value.focus()
  }

  const getEditorValue = () => {
     return codemirror.value.getValue()
  }

    // 插入内容
    const handleInsertEditor = (text) => {
        if(codemirror.value) {
            insertVariable(text)
        }
    }

    // 刷新编辑器内容
    const handleRefreshEditor = () => {
        if(codemirror.value) {
            codemirror.value.setValue(props.defaultEditorText)
        }
    }

    // 覆盖编辑器内容
    const handleCoverEditor = (text) => {
        if(codemirror.value) {
            codemirror.value.setValue(text)
        }
    }

  defineExpose({ getEditorValue, handleInsertEditor, handleRefreshEditor, handleCoverEditor })

  onMounted(() => {
    init()
  })
  </script>
  
  <style lang="scss" scoped>
  .sql-editor {
    width: 100%;
    height: calc(100% - 6px);
    .code-mirror {
      font-size: 16px;
      line-height: 30px;
      background-color: #FFF;
    }
    :deep(.CodeMirror) {
        height: 100% !important;
    }
    :deep(.CodeMirror-scroll) {
        margin-right: 0;
        padding-bottom: 0;
    }
  }
  </style>