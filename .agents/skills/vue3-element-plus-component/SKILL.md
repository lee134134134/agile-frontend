---
name: Vue3+ElementPlus组件封装
description: 用于封装基于 Vue 3 + Element Plus 的通用业务组件，提供标准化的组件封装模板和最佳实践。当用户需要封装可复用的业务组件时调用。
---

你是一个资深的前端架构师，请按照 AGENTS.md 规范执行：

必须严格按照以下流程：
1. architect 设计
2. coder 实现
3. reviewer 审查
4. tester 测试

禁止跳过任何步骤。

请按照以下规范为用户封装 Vue 3 + Element Plus 业务组件。

## 1. 核心规范

### 1.1 技术栈
- **框架**: Vue 3.4+
- **UI库**: Element Plus
- **语言**: TypeScript
- **样式**: SCSS
- **构建**: Vite

### 1.2 命名规范
- **文件夹名**: 使用 kebab-case，例如 `search-form`、`data-table`
- **组件文件名**: 使用 PascalCase，例如 `SearchForm.vue`、`DataTable.vue`
- **组件名**: 使用 PascalCase，例如 `SearchForm`、`DataTable`
- **Props/Events**: 使用 camelCase
- **CSS类名**: 使用 kebab-case，前缀为组件名，例如 `.search-form-container`

### 1.3 文件结构
```
ComponentName/
├── index.vue              # 主组件文件
├── types.ts               # 类型定义（可选）
├── composables/           # 组合式函数（可选）
│   └── useXXX.ts
├── components/            # 子组件（可选）
│   └── SubComponent.vue
└── index.ts               # 入口文件，用于导出
```

## 2. 代码结构模板

### 2.1 基础组件模板

```vue
<template>
  <div class="component-name-container">
    <!-- 组件内容 -->
    <el-card class="component-card" :loading="loading">
      <template #header>
        <div class="card-header">
          <span>{{ title }}</span>
          <div class="header-actions">
            <slot name="header-actions" />
          </div>
        </div>
      </template>
      
      <!-- 主内容区 -->
      <div class="card-content">
        <slot />
      </div>
      
      <!-- 底部操作区 -->
      <div v-if="showFooter" class="card-footer">
        <slot name="footer">
          <el-button @click="handleCancel">取消</el-button>
          <el-button type="primary" :loading="submitLoading" @click="handleSubmit">
            确定
          </el-button>
        </slot>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';

// ==================== 类型定义 ====================
/**
 * 组件Props接口
 */
interface Props {
  /** 标题 */
  title?: string;
  /** 加载状态 */
  loading?: boolean;
  /** 是否显示底部 */
  showFooter?: boolean;
  /** 提交加载状态 */
  submitLoading?: boolean;
  /** 自定义数据 */
  data?: Record<string, any>;
}

/**
 * 组件Events接口
 */
interface Emits {
  (e: 'update:loading', value: boolean): void;
  (e: 'submit', data: Record<string, any>): void;
  (e: 'cancel'): void;
  (e: 'change', data: Record<string, any>): void;
}

// ==================== Props & Emits ====================
const props = withDefaults(defineProps<Props>(), {
  title: '',
  loading: false,
  showFooter: true,
  submitLoading: false,
  data: () => ({})
});

const emit = defineEmits<Emits>();

// ==================== 状态定义 ====================
/** 内部加载状态 */
const internalLoading = ref<boolean>(false);

/** 计算属性：实际加载状态 */
const actualLoading = computed<boolean>({
  get: () => props.loading ?? internalLoading.value,
  set: (val) => {
    internalLoading.value = val;
    emit('update:loading', val);
  }
});

// ==================== 方法定义 ====================
/**
 * 处理提交
 */
const handleSubmit = async (): Promise<void> => {
  try {
    actualLoading.value = true;
    // 业务逻辑处理
    emit('submit', props.data);
  } catch (error) {
    console.error('提交失败:', error);
  } finally {
    actualLoading.value = false;
  }
};

/**
 * 处理取消
 */
const handleCancel = (): void => {
  emit('cancel');
};

// ==================== 监听器 ====================
watch(
  () => props.data,
  (newVal) => {
    emit('change', newVal);
  },
  { deep: true }
);

// ==================== 暴露属性 ====================
defineExpose({
  loading: actualLoading,
  handleSubmit,
  handleCancel
});
</script>

<style lang="scss" scoped>
.component-name-container {
  width: 100%;
  
  .component-card {
    :deep(.el-card__header) {
      padding: 15px 20px;
    }
    
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      
      .header-actions {
        display: flex;
        gap: 10px;
      }
    }
    
    .card-content {
      padding: 10px 0;
    }
    
    .card-footer {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      padding-top: 20px;
      border-top: 1px solid var(--el-border-color-light);
    }
  }
}
</style>
```

### 2.2 表单组件模板

```vue
<template>
  <div class="form-component-container">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      :label-width="labelWidth"
      :disabled="disabled"
      @submit.prevent
    >
      <el-row :gutter="20">
        <el-col
          v-for="(field, index) in fields"
          :key="field.prop"
          :span="field.span || 24"
        >
          <el-form-item :label="field.label" :prop="field.prop">
            <!-- 输入框 -->
            <el-input
              v-if="field.type === 'input'"
              v-model="formData[field.prop]"
              :placeholder="field.placeholder || `请输入${field.label}`"
              :clearable="field.clearable !== false"
              :disabled="field.disabled"
              @change="(val) => handleFieldChange(field.prop, val)"
            />
            
            <!-- 选择器 -->
            <el-select
              v-else-if="field.type === 'select'"
              v-model="formData[field.prop]"
              :placeholder="field.placeholder || `请选择${field.label}`"
              :clearable="field.clearable !== false"
              :disabled="field.disabled"
              :multiple="field.multiple"
              style="width: 100%"
              @change="(val) => handleFieldChange(field.prop, val)"
            >
              <el-option
                v-for="opt in field.options"
                :key="opt.value"
                :label="opt.label"
                :value="opt.value"
              />
            </el-select>
            
            <!-- 日期选择器 -->
            <el-date-picker
              v-else-if="field.type === 'date'"
              v-model="formData[field.prop]"
              :type="field.dateType || 'date'"
              :placeholder="field.placeholder || `请选择${field.label}`"
              :disabled="field.disabled"
              style="width: 100%"
              @change="(val) => handleFieldChange(field.prop, val)"
            />
            
            <!-- 自定义插槽 -->
            <slot
              v-else-if="field.type === 'custom'"
              :name="`field-${field.prop}`"
              :field="field"
              :value="formData[field.prop]"
              :onChange="(val) => handleFieldChange(field.prop, val)"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    
    <!-- 操作按钮 -->
    <div v-if="showActions" class="form-actions">
      <el-button @click="handleReset">重置</el-button>
      <el-button type="primary" :loading="loading" @click="handleSubmit">
        {{ submitText }}
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted } from 'vue';
import type { FormInstance, FormRules } from 'element-plus';

// ==================== 类型定义 ====================
/**
 * 表单字段配置
 */
interface FormField {
  /** 字段标识 */
  prop: string;
  /** 字段标签 */
  label: string;
  /** 字段类型 */
  type: 'input' | 'select' | 'date' | 'custom';
  /** 占位提示 */
  placeholder?: string;
  /** 栅格宽度 */
  span?: number;
  /** 是否可清空 */
  clearable?: boolean;
  /** 是否禁用 */
  disabled?: boolean;
  /** 选择器选项 */
  options?: Array<{ label: string; value: any }>;
  /** 日期类型 */
  dateType?: string;
  /** 是否多选 */
  multiple?: boolean;
  /** 验证规则 */
  rules?: any[];
}

/**
 * 组件Props
 */
interface Props {
  /** 表单字段配置 */
  fields: FormField[];
  /** 初始数据 */
  modelValue?: Record<string, any>;
  /** 标签宽度 */
  labelWidth?: string;
  /** 是否禁用 */
  disabled?: boolean;
  /** 是否显示操作按钮 */
  showActions?: boolean;
  /** 提交按钮文字 */
  submitText?: string;
  /** 加载状态 */
  loading?: boolean;
}

/**
 * 组件Events
 */
interface Emits {
  (e: 'update:modelValue', value: Record<string, any>): void;
  (e: 'submit', data: Record<string, any>): void;
  (e: 'reset'): void;
  (e: 'change', prop: string, value: any): void;
}

// ==================== Props & Emits ====================
const props = withDefaults(defineProps<Props>(), {
  modelValue: () => ({}),
  labelWidth: '100px',
  disabled: false,
  showActions: true,
  submitText: '提交',
  loading: false
});

const emit = defineEmits<Emits>();

// ==================== Refs ====================
const formRef = ref<FormInstance>();

// ==================== 状态定义 ====================
/** 表单数据 */
const formData = reactive<Record<string, any>>({});

/** 表单验证规则 */
const formRules = reactive<FormRules>({});

// ==================== 方法定义 ====================
/**
 * 初始化表单数据
 */
const initFormData = (): void => {
  props.fields.forEach((field) => {
    if (!(field.prop in formData)) {
      formData[field.prop] = props.modelValue[field.prop] ?? '';
    }
    if (field.rules) {
      formRules[field.prop] = field.rules;
    }
  });
};

/**
 * 处理字段变化
 * @param prop - 字段名
 * @param value - 字段值
 */
const handleFieldChange = (prop: string, value: any): void => {
  formData[prop] = value;
  emit('update:modelValue', { ...formData });
  emit('change', prop, value);
};

/**
 * 表单验证
 * @returns 验证结果
 */
const validate = async (): Promise<boolean> => {
  if (!formRef.value) return false;
  try {
    await formRef.value.validate();
    return true;
  } catch {
    return false;
  }
};

/**
 * 处理提交
 */
const handleSubmit = async (): Promise<void> => {
  const valid = await validate();
  if (valid) {
    emit('submit', { ...formData });
  }
};

/**
 * 处理重置
 */
const handleReset = (): void => {
  formRef.value?.resetFields();
  props.fields.forEach((field) => {
    formData[field.prop] = '';
  });
  emit('reset');
};

// ==================== 监听器 ====================
watch(
  () => props.modelValue,
  (newVal) => {
    Object.assign(formData, newVal);
  },
  { deep: true, immediate: true }
);

// ==================== 生命周期 ====================
onMounted(() => {
  initFormData();
});

// ==================== 暴露属性 ====================
defineExpose({
  formRef,
  formData,
  validate,
  handleSubmit,
  handleReset
});
</script>

<style lang="scss" scoped>
.form-component-container {
  .form-actions {
    display: flex;
    justify-content: center;
    gap: 15px;
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid var(--el-border-color-light);
  }
}
</style>
```

### 2.3 表格组件模板

```vue
<template>
  <div class="table-component-container">
    <!-- 工具栏 -->
    <div v-if="showToolbar" class="table-toolbar">
      <div class="toolbar-left">
        <slot name="toolbar-left" />
      </div>
      <div class="toolbar-right">
        <slot name="toolbar-right" />
        <el-button
          v-if="showRefresh"
          :icon="Refresh"
          circle
          size="small"
          @click="handleRefresh"
        />
      </div>
    </div>
    
    <!-- 表格 -->
    <el-table
      ref="tableRef"
      v-loading="loading"
      :data="tableData"
      :stripe="stripe"
      :border="border"
      :height="height"
      :max-height="maxHeight"
      :row-key="rowKey"
      :tree-props="treeProps"
      @selection-change="handleSelectionChange"
      @row-click="handleRowClick"
    >
      <!-- 选择列 -->
      <el-table-column
        v-if="showSelection"
        type="selection"
        width="55"
        align="center"
      />
      
      <!-- 序号列 -->
      <el-table-column
        v-if="showIndex"
        type="index"
        label="序号"
        width="60"
        align="center"
      />
      
      <!-- 动态列 -->
      <el-table-column
        v-for="col in columns"
        :key="col.prop"
        :prop="col.prop"
        :label="col.label"
        :width="col.width"
        :min-width="col.minWidth"
        :align="col.align || 'left'"
        :fixed="col.fixed"
        :sortable="col.sortable"
        :show-overflow-tooltip="col.showOverflowTooltip !== false"
      >
        <template #default="{ row, $index }">
          <!-- 自定义渲染 -->
          <slot
            v-if="col.slot"
            :name="col.prop"
            :row="row"
            :index="$index"
          />
          <!-- 默认渲染 -->
          <span v-else>{{ formatCellValue(row, col) }}</span>
        </template>
      </el-table-column>
      
      <!-- 操作列 -->
      <el-table-column
        v-if="showOperation"
        label="操作"
        :width="operationWidth"
        align="center"
        fixed="right"
      >
        <template #default="{ row, $index }">
          <slot name="operation" :row="row" :index="$index">
            <el-button
              type="primary"
              link
              size="small"
              @click="handleEdit(row)"
            >
              编辑
            </el-button>
            <el-button
              type="danger"
              link
              size="small"
              @click="handleDelete(row)"
            >
              删除
            </el-button>
          </slot>
        </template>
      </el-table-column>
    </el-table>
    
    <!-- 分页 -->
    <div v-if="showPagination" class="table-pagination">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="pageSizes"
        :total="total"
        :layout="paginationLayout"
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { Refresh } from '@element-plus/icons-vue';
import type { TableInstance } from 'element-plus';

// ==================== 类型定义 ====================
/**
 * 表格列配置
 */
interface TableColumn {
  /** 字段名 */
  prop: string;
  /** 列标题 */
  label: string;
  /** 列宽 */
  width?: number | string;
  /** 最小列宽 */
  minWidth?: number | string;
  /** 对齐方式 */
  align?: 'left' | 'center' | 'right';
  /** 固定位置 */
  fixed?: 'left' | 'right';
  /** 是否可排序 */
  sortable?: boolean;
  /** 是否显示省略提示 */
  showOverflowTooltip?: boolean;
  /** 是否使用自定义插槽 */
  slot?: boolean;
  /** 格式化函数 */
  formatter?: (row: any, value: any) => string;
}

/**
 * 组件Props
 */
interface Props {
  /** 表格数据 */
  data: any[];
  /** 列配置 */
  columns: TableColumn[];
  /** 加载状态 */
  loading?: boolean;
  /** 是否显示斑马纹 */
  stripe?: boolean;
  /** 是否显示边框 */
  border?: boolean;
  /** 表格高度 */
  height?: number | string;
  /** 最大高度 */
  maxHeight?: number | string;
  /** 行数据的Key */
  rowKey?: string;
  /** 树形数据配置 */
  treeProps?: { children: string; hasChildren: string };
  /** 是否显示工具栏 */
  showToolbar?: boolean;
  /** 是否显示刷新按钮 */
  showRefresh?: boolean;
  /** 是否显示选择列 */
  showSelection?: boolean;
  /** 是否显示序号列 */
  showIndex?: boolean;
  /** 是否显示操作列 */
  showOperation?: boolean;
  /** 操作列宽度 */
  operationWidth?: number | string;
  /** 是否显示分页 */
  showPagination?: boolean;
  /** 当前页 */
  currentPage?: number;
  /** 每页条数 */
  pageSize?: number;
  /** 每页条数选项 */
  pageSizes?: number[];
  /** 总条数 */
  total?: number;
  /** 分页布局 */
  paginationLayout?: string;
}

/**
 * 组件Events
 */
interface Emits {
  (e: 'update:currentPage', value: number): void;
  (e: 'update:pageSize', value: number): void;
  (e: 'selection-change', selection: any[]): void;
  (e: 'row-click', row: any): void;
  (e: 'refresh'): void;
  (e: 'edit', row: any): void;
  (e: 'delete', row: any): void;
  (e: 'size-change', size: number): void;
  (e: 'current-change', page: number): void;
}

// ==================== Props & Emits ====================
const props = withDefaults(defineProps<Props>(), {
  loading: false,
  stripe: true,
  border: true,
  rowKey: 'id',
  treeProps: () => ({ children: 'children', hasChildren: 'hasChildren' }),
  showToolbar: true,
  showRefresh: true,
  showSelection: true,
  showIndex: true,
  showOperation: true,
  operationWidth: 150,
  showPagination: true,
  currentPage: 1,
  pageSize: 10,
  pageSizes: () => [10, 20, 50, 100],
  total: 0,
  paginationLayout: 'total, sizes, prev, pager, next, jumper'
});

const emit = defineEmits<Emits>();

// ==================== Refs ====================
const tableRef = ref<TableInstance>();

// ==================== 状态定义 ====================
/** 选中行数据 */
const selectedRows = ref<any[]>([]);

// ==================== 计算属性 ====================
/** 表格数据 */
const tableData = computed(() => props.data);

/** 当前页 */
const currentPage = computed({
  get: () => props.currentPage,
  set: (val) => emit('update:currentPage', val)
});

/** 每页条数 */
const pageSize = computed({
  get: () => props.pageSize,
  set: (val) => emit('update:pageSize', val)
});

// ==================== 方法定义 ====================
/**
 * 格式化单元格值
 * @param row - 行数据
 * @param col - 列配置
 * @returns 格式化后的值
 */
const formatCellValue = (row: any, col: TableColumn): string => {
  const value = row[col.prop];
  if (col.formatter) {
    return col.formatter(row, value);
  }
  return value ?? '-';
};

/**
 * 处理选择变化
 * @param selection - 选中的行
 */
const handleSelectionChange = (selection: any[]): void => {
  selectedRows.value = selection;
  emit('selection-change', selection);
};

/**
 * 处理行点击
 * @param row - 行数据
 */
const handleRowClick = (row: any): void => {
  emit('row-click', row);
};

/**
 * 处理刷新
 */
const handleRefresh = (): void => {
  emit('refresh');
};

/**
 * 处理编辑
 * @param row - 行数据
 */
const handleEdit = (row: any): void => {
  emit('edit', row);
};

/**
 * 处理删除
 * @param row - 行数据
 */
const handleDelete = (row: any): void => {
  emit('delete', row);
};

/**
 * 处理每页条数变化
 * @param size - 每页条数
 */
const handleSizeChange = (size: number): void => {
  emit('size-change', size);
};

/**
 * 处理页码变化
 * @param page - 页码
 */
const handleCurrentChange = (page: number): void => {
  emit('current-change', page);
};

/**
 * 清空选择
 */
const clearSelection = (): void => {
  tableRef.value?.clearSelection();
};

/**
 * 获取选中行
 * @returns 选中行数据
 */
const getSelectionRows = (): any[] => {
  return tableRef.value?.getSelectionRows() || [];
};

// ==================== 暴露属性 ====================
defineExpose({
  tableRef,
  selectedRows,
  clearSelection,
  getSelectionRows
});
</script>

<style lang="scss" scoped>
.table-component-container {
  .table-toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
    
    .toolbar-left,
    .toolbar-right {
      display: flex;
      align-items: center;
      gap: 10px;
    }
  }
  
  .table-pagination {
    display: flex;
    justify-content: flex-end;
    margin-top: 15px;
  }
}
</style>
```

## 3. 注意事项

### 3.1 组件设计原则
- **单一职责**：每个组件只负责一个明确的功能
- **可配置性**：通过 Props 提供足够的配置选项
- **可扩展性**：使用插槽机制允许用户自定义内容
- **类型安全**：所有 Props 和 Events 都必须有完整的 TypeScript 类型定义

### 3.2 性能优化
- 使用 `v-memo` 或 `computed` 缓存计算结果
- 大数据量时使用虚拟滚动
- 避免不必要的重渲染
- 合理使用 `watch` 和 `watchEffect`

### 3.3 代码规范
- 所有方法必须包含 JSDoc 注释
- Props 必须设置默认值或使用 `required: true`
- 复杂逻辑抽取到 composables 中
- 样式使用 SCSS，避免深度选择器滥用

### 3.4 禁止事项
- 禁止在组件中直接修改 Props
- 禁止使用 `any` 类型
- 禁止在模板中写复杂表达式
- 禁止硬编码样式值，使用 CSS 变量

## 4. 执行步骤

1. **确认组件类型**：询问用户需要封装哪种类型的组件（基础组件/表单组件/表格组件/其他）
2. **收集需求信息**：
   - 组件名称和功能描述
   - 需要的 Props 和 Events
   - 是否需要插槽
   - 特殊的业务逻辑
3. **选择模板**：根据组件类型选择合适的代码模板
4. **生成代码**：按照规范生成组件代码
5. **提供使用示例**：给出组件的使用示例和注意事项

## 5. 使用示例

### 5.1 基础组件使用

```vue
<template>
  <BaseCard
    title="用户信息"
    :loading="loading"
    @submit="handleSubmit"
    @cancel="handleCancel"
  >
    <p>这是卡片内容</p>
    <template #header-actions>
      <el-button type="primary">新增</el-button>
    </template>
  </BaseCard>
</template>
```

### 5.2 表单组件使用

```vue
<template>
  <DynamicForm
    v-model="formData"
    :fields="formFields"
    :loading="submitting"
    @submit="handleSubmit"
    @reset="handleReset"
  >
    <template #field-custom>
      <!-- 自定义字段 -->
    </template>
  </DynamicForm>
</template>

<script setup lang="ts">
const formFields = [
  { prop: 'name', label: '姓名', type: 'input', span: 12 },
  { prop: 'gender', label: '性别', type: 'select', span: 12, options: [
    { label: '男', value: 'male' },
    { label: '女', value: 'female' }
  ]},
  { prop: 'birthday', label: '生日', type: 'date', span: 12 }
];
</script>
```

### 5.3 表格组件使用

```vue
<template>
  <DataTable
    :data="tableData"
    :columns="columns"
    :loading="loading"
    :total="total"
    v-model:current-page="page"
    v-model:page-size="pageSize"
    @refresh="loadData"
    @edit="handleEdit"
    @delete="handleDelete"
  >
    <template #toolbar-left>
      <el-button type="primary">新增</el-button>
    </template>
    <template #status="{ row }">
      <el-tag :type="row.status === 1 ? 'success' : 'danger'">
        {{ row.status === 1 ? '启用' : '禁用' }}
      </el-tag>
    </template>
  </DataTable>
</template>
```
