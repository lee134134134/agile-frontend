<template>
  <div class="group" :class="{ 'is-root': isRoot }">
    <div class="group-header">
      <div v-if="!isRoot" class="group-type-tag">关联模块</div>
      <el-select v-model="group.module" class="module-select">
        <el-option label="进销模块（主表）" value="进销模块（主表）" />
        <el-option label="关联订单明细" value="关联订单明细" />
      </el-select>
    </div>

    <div class="group-body">
      <div
          v-for="(item, index) in group.items"
          :key="item.id"
          :class="['row-container', `type-${item.type}`]"
      >
        <div class="row-main">
          <div class="tree-line">
            <span class="vertical"></span>
            <span class="horizontal"></span>
          </div>

          <div class="join-wrapper">
            <el-select
                v-model="item.join"
                class="join-select"
            >
              <template v-if="item.type === 'aggregate'">
                <el-option label="聚合" value="aggregate" />
              </template>
              <template v-else>
                <el-option label="且" value="and" />
                <el-option label="或" value="or" />
              </template>
            </el-select>
          </div>

          <div class="content-wrapper">
            <template v-if="item.type === 'group'">
              <ConditionGroup
                  :group="item"
                  :is-root="false"
                  @remove="removeChildGroup"
              />
            </template>

            <template v-else-if="item.type === 'aggregate'">
              <div class="condition-inputs aggregate-style">
                <el-select v-model="item.aggFunc" class="w-120" placeholder="计数 (Count)">
                  <el-option label="计数 (Count)" value="count" />
                  <el-option label="求和 (Sum)" value="sum" />
                </el-select>
                <el-select v-model="item.operator" class="w-100" placeholder="操作符">
                  <el-option label="等于" value="等于" />
                  <el-option label="大于" value="大于" />
                </el-select>
                <el-input v-model="item.value" class="w-140" placeholder="数值" />
              </div>
            </template>

            <template v-else>
              <div class="condition-inputs normal-style">
                <el-select v-model="item.field" class="w-120" placeholder="字段">
                  <el-option label="状态" value="状态" />
                  <el-option label="产品类型" value="产品类型" />
                </el-select>
                <el-select v-model="item.operator" class="w-100" placeholder="操作符">
                  <el-option label="等于" value="等于" />
                  <el-option label="包含" value="包含" />
                </el-select>
                <el-input v-model="item.value" class="w-140" placeholder="输入值" />
              </div>
            </template>
          </div>

          <div class="action-bar">
            <el-button
                v-if="!(isRoot && index === 0)"
                type="danger"
                link
                :icon="Delete"
                class="action-btn del-btn"
                @click="removeItem(index)"
            />
            <div v-else class="action-placeholder"></div>

            <el-dropdown trigger="hover" @command="(cmd) => handleAddCommand(cmd as string, index)">
              <el-button type="primary" link :icon="Plus" class="action-btn add-btn" />
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="normal">添加普通条件</el-dropdown-item>
                  <el-dropdown-item command="aggregate">添加聚合条件</el-dropdown-item>
                  <el-dropdown-item command="group" divided>添加关联模块</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { nanoid } from 'nanoid'
import { Plus, Delete } from '@element-plus/icons-vue'
import ConditionGroup from './ConditionGroup.vue'

interface ConditionItem {
  id: string
  join: string
  type: 'normal' | 'group' | 'aggregate'
  field?: string
  aggFunc?: string
  operator?: string
  value?: string
  module?: string
  items?: ConditionItem[]
}

const props = defineProps<{
  group: { id: string; module: string; items: ConditionItem[] }
  isRoot?: boolean
}>()

const emit = defineEmits<{ (e: 'remove', id: string): void }>()

// 创建普通条件
const createCondition = (): ConditionItem => ({
  id: nanoid(), type: 'normal', join: 'and', field: '', operator: '', value: '',
})

// 创建聚合条件：核心逻辑是将 join 设为 aggregate
const createAggregateCondition = (): ConditionItem => ({
  id: nanoid(), type: 'aggregate', join: 'aggregate', aggFunc: 'count', operator: '', value: '',
})

// 创建嵌套组
const createGroup = (): ConditionItem => ({
  id: nanoid(), type: 'group', join: 'and', module: '关联订单明细', items: [createCondition()],
})

const handleAddCommand = (command: string, index: number) => {
  const factory: Record<string, () => ConditionItem> = {
    normal: createCondition,
    aggregate: createAggregateCondition,
    group: createGroup
  }
  props.group.items.splice(index + 1, 0, factory[command]())
}

const removeItem = (index: number) => {
  props.group.items.splice(index, 1)
}

const removeChildGroup = (id: string) => {
  const index = props.group.items.findIndex((item) => item.id === id)
  if (index !== -1) props.group.items.splice(index, 1)
}
</script>

<style scoped lang="scss">
/* 基础容器：强化层级感 */
.group {
  border-radius: 4px;
  padding: 12px;
  background: #fff;

  &.is-root {
    border: none;
    background: transparent;
    padding: 0;
  }
}

/* 组头部样式 */
.group-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;

  .group-type-tag {
    background: #409eff;
    color: #fff;
    font-size: 12px;
    padding: 2px 8px;
    border-radius: 4px;
    font-weight: bold;
  }
  .module-select { width: 180px; }
}

/* 每一行的容器逻辑 */
.row-container {
  position: relative;
  margin-bottom: 8px;

  /* 嵌套组底部间距加大 */
  &.type-group { margin-bottom: 16px; }
}

.row-main {
  display: flex;
  align-items: stretch;
  gap: 0;
}

/* 树形连接线优化 */
.tree-line {
  position: relative;
  width: 28px;
  flex-shrink: 0;

  .vertical {
    position: absolute;
    left: 12px;
    top: -12px;
    bottom: -12px;
    border-left: 1px dashed #dcdfe6;
  }
  .horizontal {
    position: absolute;
    top: 15px;
    left: 12px;
    width: 14px;
    border-top: 1px dashed #dcdfe6;
  }
}

.row-container:last-child > .row-main > .tree-line .vertical {
  bottom: auto;
  height: 28px;
}

/* 连接符下拉框样式 */
.join-wrapper {
  width: 75px;
  flex-shrink: 0;
  margin-right: 12px;
  display: flex;
  align-items: flex-start;
  padding-top: 2px;
}

.join-select {
  :deep(.el-input__inner) {
    text-align: center;
    font-weight: bold;
    color: #606266;
  }

  /* 聚合状态下的下拉框特殊样式 */
  &.el-select:has(option[value="aggregate"]),
  &:deep(.el-input.is-disabled .el-input__wrapper) {
    background-color: #e6a23c !important; /* 聚合专用橙色 */
    .el-input__inner { color: white !important; -webkit-text-fill-color: white !important; }
    .el-input__suffix { display: none; } /* 隐藏聚合时的箭头 */
  }
}

/* 内容区域 */
.content-wrapper {
  flex: 1;
  min-width: 0;
}

/* 统一条件输入框样式 */
.condition-inputs {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 6px 12px;
  border-radius: 4px;
  min-height: 40px;
  border: 1px solid #ebeef5;
  transition: all 0.3s;

  /* 普通条件背景 */
  &.normal-style {
    background: #fff;
  }

  /* 聚合条件背景：淡橙色 */
  &.aggregate-style {
    background: #fffaf3;
    border-color: #f5dab1;
  }
}

/* 嵌套组的内容块区分：淡蓝色背景和虚线框 */
.type-group > .row-main > .content-wrapper > .group {
  background: #f0f7ff;
  border: 1px dashed #409eff;
}

/* 统一输入框宽度 */
.w-120 { width: 140px; }
.w-100 { width: 110px; }
.w-140 { width: 180px; }

/* 统一右侧操作栏：保证所有按钮对齐 */
.action-bar {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-left: 16px;
  padding-top: 6px;
  width: 80px;
  flex-shrink: 0;
}

.action-btn {
  font-size: 16px;
  width: 32px;
  height: 32px;
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover { background: #f5f7fa; border-radius: 4px; }
}

.del-btn { color: #f56c6c; }
.add-btn { color: #409eff; }
.action-placeholder { width: 32px; }
</style>