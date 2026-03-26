<template>
  <el-form label-position="left">
    <el-row :gutter="20" class="row-content" style="align-items: center; display: flex;">
      <el-col :span="6">
        <el-form-item label="用户故事" prop="storyId" style="margin-bottom: 0;">
          <el-select v-model="storyId" class="cond-select" clearable placeholder="请选择" @change="getTaskDataList">
            <el-option v-for="item in iterUserStoryList" :key="item.storyId" :label="item.name" :value="item.storyId"/>
          </el-select>
        </el-form-item>
      </el-col>

      <el-col :span="18">
        <div class="leader-filter-container">
          <span class="filter-label">负责人</span>
          <div class="filter-options">
            <div
                :class="{ 'is-active': selectedLeaders.includes('ALL') }"
                class="filter-item"
                @click="toggleLeader('ALL')"
            >
              全部
            </div>

            <div
                v-for="opt in leaderOptions"
                :key="opt.value"
                :class="{
                'is-active': selectedLeaders.includes(opt.value),
                'is-unassigned': opt.value === 'UNASSIGNED'
              }"
                class="filter-item"
                @click="toggleLeader(opt.value)"
            >
              {{ opt.label }}
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </el-form>

  <div class="tab-content jus-bet-start">
    <div class="column drag-comp">
      <DraggableComp
          :listCompleted="listCompleted"
          :listNotStart="listNotStart"
          :listProgress="listProgress"
          @getTaskList="getTaskDataList"
      />
    </div>
    <div class="column column-right">
      <div class="task-status not-warning">
        阻塞问题<span class="task-tag"><el-icon><WarnTriangleFilled/></el-icon>{{ problemList.length }}</span>
        <div class="add-btn" @click="openAddProblemDia()">
          <el-icon>
            <Plus/>
          </el-icon>
        </div>
      </div>
      <div class="column-section">
        <ProblemCard
            v-for="item in problemList" :key="item.id" :problemInfo="item" class="mb12"
            @click="getProblemDetailFn('view', item)"
            @opearteDeleteFn="opearteDeleteFn"
            @opearteEditFn="getProblemDetailFn"
        />
      </div>
    </div>

    <AddProblem
        v-if="isShowAddProblemDia"
        :detailInfo="detailInfo"
        :isShow="isShowAddProblemDia"
        :type="problemType"
        @closeDiaFn="handleCloseProblemDia"
        @confirmFn="handleConfirmSubFn"
        @editConfirmFn="handleEditSubFn"
    />
  </div>
</template>

<script setup>
import {computed, ref, watch, nextTick} from 'vue';
import DraggableComp from './DraggableComp.vue';
import ProblemCard from './ProblemCard.vue';
import AddProblem from './AddProblem.vue';
import {useDicStore} from '@/stores/dic.js';
import {addBlockIssue, deleteBlockIssue, editBlockIssue, getBlockIssueList, getTaskList} from '@/api/agileBoardApi.js';
import {ElMessageBox} from 'element-plus';
import {Plus, WarnTriangleFilled} from "@element-plus/icons-vue";

const dicStore = useDicStore();
const props = defineProps(['iterUserStoryList', 'curSprintId']);

const storyId = ref('');
const selectedLeaders = ref(['ALL']);

const allTaskList = ref([]);
let listNotStart = ref([]);
let listProgress = ref([]);
let listCompleted = ref([]);
let isShowAddProblemDia = ref(false);
let problemType = ref('');
let detailInfo = ref({});
let problemList = ref([]);

/**
 * 核心逻辑修改：根据新数据更新筛选状态
 */
const updateFilterAfterDataLoad = () => {
  // 1. 获取当前新数据中存在的所有负责人
  const currentAvailableLeaders = leaderOptions.value.map(opt => opt.value);
  
  // 2. 找出那些依然有效的已选负责人（排除 ALL，保留 UNASSIGNED 或具体姓名）
  const validSelections = selectedLeaders.value.filter(leader => 
    leader !== 'ALL' && currentAvailableLeaders.includes(leader)
  );

  // 3. 如果还有有效的选中项，则保留；否则回退到 ALL
  if (validSelections.length > 0) {
    selectedLeaders.value = validSelections;
  } else {
    selectedLeaders.value = ['ALL'];
  }
};

const toggleLeader = (val) => {
  if (val === 'ALL') {
    selectedLeaders.value = [val];
  } else {
    let newList = selectedLeaders.value.filter(item => item !== 'ALL');
    const index = newList.indexOf(val);
    if (index > -1) {
      newList.splice(index, 1);
    } else {
      newList.push(val);
    }
    if (newList.length === 0) {
      selectedLeaders.value = ['ALL'];
    } else {
      selectedLeaders.value = newList;
    }
  }
};

const getTaskDataList = () => {
  let params = {
    storyId: storyId.value || undefined,
    sprintId: props.curSprintId
  };
  getTaskList(params).then(res => {
    if (res.success) {
      allTaskList.value = res.data || [];
      // 数据加载后，尝试恢复之前的负责人筛选
      nextTick(() => {
        updateFilterAfterDataLoad();
      });
    }
  });
};

// --- 计算属性 ---

const leaderOptions = computed(() => {
  const options = [];
  const leaders = new Set();
  let hasNull = false;

  allTaskList.value.forEach(item => {
    if (item.leader) {
      leaders.add(item.leader);
    } else {
      hasNull = true;
    }
  });

  leaders.forEach(l => {
    options.push({label: l, value: l});
  });

  if (hasNull) {
    options.push({label: '无负责人', value: 'UNASSIGNED'});
  }
  return options;
});

const finalFilteredTasks = computed(() => {
  let tasks = allTaskList.value;
  if (selectedLeaders.value.includes('ALL')) {
    return tasks;
  }
  return tasks.filter(item => {
    return selectedLeaders.value.some(sel => {
      if (sel === 'UNASSIGNED') return !item.leader;
      return item.leader === sel;
    });
  });
});

// --- 监听与辅助逻辑 ---

watch(finalFilteredTasks, (tasks) => {
  listNotStart.value = [];
  listProgress.value = [];
  listCompleted.value = [];

  tasks.forEach(item => {
    const task = {...item};
    if (task.taskStatus == 'not_started') {
      listNotStart.value.push(task);
    } else if (task.taskStatus == 'in_progress') {
      listProgress.value.push(task);
    } else if (task.taskStatus == 'completed') {
      listCompleted.value.push(task);
    }
  });
}, {immediate: true});

const openAddProblemDia = () => {
  problemType.value = '新增';
  detailInfo.value = null;
  isShowAddProblemDia.value = true;
};
const getProblemDetailFn = (type, info) => {
  detailInfo.value = info;
  problemType.value = type == 'edit' ? '编辑' : '查看';
  isShowAddProblemDia.value = true;
};
const handleCloseProblemDia = () => {
  isShowAddProblemDia.value = false;
};
const handleConfirmSubFn = (form) => {
  form.sprintId = props.curSprintId;
  delete form.resolveDate;
  addBlockIssue(form).then(res => {
    if (res.success) {
      handleCloseProblemDia();
      getBlockIssueListFn();
    }
  });
};
const handleEditSubFn = (form) => {
  delete form.resolveDate;
  editBlockIssue(form).then(res => {
    if (res.success) {
      handleCloseProblemDia();
      getBlockIssueListFn();
    }
  });
};
const opearteDeleteFn = (id) => {
  ElMessageBox.confirm('该问题将实时移除，请确认是否删除', '', {type: 'warning'}).then(() => {
    deleteBlockIssue({id}).then(res => {
      if (res.success) getBlockIssueListFn();
    });
  });
};
const getBlockIssueListFn = () => {
  getBlockIssueList({sprintId: props.curSprintId}).then(res => {
    if (res.success) problemList.value = res.data;
  });
};

// 监听迭代切换：不直接重置选中项，让 getTaskDataList 内部逻辑处理
watch(() => props.curSprintId, () => {
  storyId.value = '';
  getTaskDataList();
  getBlockIssueListFn();
}, {immediate: true, deep: true});
</script>

<style lang="scss" scoped>
/* 样式部分保持不变 */
.leader-filter-container {
  display: flex;
  align-items: center;
  margin-bottom: 5px;

  .filter-label {
    font-size: 14px;
    color: #606266;
    margin-right: 15px;
    white-space: nowrap;
    font-weight: 500;
  }

  .filter-options {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
  }

  .filter-item {
    padding: 2px 8px;
    font-size: 12px;
    cursor: pointer;
    border-radius: 4px;
    color: #303133;
    background: #edf1f6;
    transition: all 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
    border: 1px solid transparent;
    user-select: none;

    &:hover {
      color: #2173f7;
      background: #e5eefe;
    }

    &.is-active {
      background-color: #fff;
      color: #2173f7;
      border: 1px solid #2173f7;
    }
  }
}

.tab-content {
  gap: 16px;
  box-sizing: border-box;
  height: calc(100vh - 220px);
  border-radius: 8px;
  margin-top: 10px;

  .mb12 {
    margin-bottom: 12px;
  }

  .column {
    height: calc(100% - 10px);
    border-radius: 8px;
    overflow: hidden;
  }

  .drag-comp {
    flex: 3.36;
  }

  .column-right {
    flex: 1;
    box-sizing: border-box;

    .task-status {
      position: relative;
      width: 100%;
      height: 40px;
      line-height: 40px;
      margin-bottom: 12px;
      border-radius: 8px;
      text-align: left;
      font-size: 14px;
      font-weight: 600;
      padding: 0 16px;

      &.not-warning {
        background: #f3d6d8;
        color: #4b0000;
      }

      .task-tag {
        font-size: 12px;
        display: inline-block;
        padding: 0 6px;
        height: 20px;
        line-height: 20px;
        border-radius: 8px;
        margin-left: 8px;
        color: #fff;
        background: #f53f3f;

        i {
          margin-right: 2px;
          vertical-align: -2px;
        }
      }
    }

    .add-btn {
      position: absolute;
      top: 7px;
      right: 0;
      width: 32px;
      height: 32px;
      line-height: 32px;
      border-radius: 4px;
      color: #303133;
      cursor: pointer;

      &:hover {
        opacity: 0.8;
      }
    }
  }
}

.column-section {
  background: #f6f8fc;
  padding: 12px;
  border-radius: 8px;
  height: calc(100% - 50px);
  overflow-y: auto;
}
</style>