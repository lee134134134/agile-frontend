<template>
  <div class="cron-editor">
    <el-popover placement="right-start" popper-class="cron-popper" trigger="click" width="650" :disabled="disabled" @show="handlePopoverShow">
      <template #reference>
        <el-input :model-value="modelValue" class="cron-input" :class="{ 'is-disabled': disabled }" placeholder="* * * * * ? *" readonly>
          <template #append>
            <el-button icon="Edit" :disabled="disabled"/>
          </template>
        </el-input>
      </template>

      <div class="cron-container">
        <el-tabs v-model="activeTab" class="fixed-tabs">
          <el-tab-pane label="秒" name="second">
            <div class="tab-scroll-content">
              <el-radio-group v-model="state.second.type" class="radio-group-vertical">
                <el-radio label="every">每秒 [ * ]</el-radio>
                <el-radio label="cycle">
                  周期 从
                  <el-input-number v-model="state.second.cycle[0]" :max="58" :min="0" size="small"/>
                  -
                  <el-input-number v-model="state.second.cycle[1]" :max="59" :min="1" size="small"/>
                  秒
                </el-radio>
                <el-radio label="loop">
                  从
                  <el-input-number v-model="state.second.loop[0]" :max="59" :min="0" size="small"/>
                  秒开始, 每
                  <el-input-number v-model="state.second.loop[1]" :max="59" :min="1" size="small"/>
                  秒执行一次
                </el-radio>
                <el-radio label="specify">指定</el-radio>
              </el-radio-group>
              <el-checkbox-group v-model="state.second.specify" :disabled="state.second.type !== 'specify'"
                                 class="checkbox-list">
                <el-checkbox v-for="i in 60" :key="i-1" :label="String(i-1)">{{
                    (i - 1).toString().padStart(2, '0')
                  }}
                </el-checkbox>
              </el-checkbox-group>
            </div>
          </el-tab-pane>

          <el-tab-pane label="分钟" name="minute">
            <div class="tab-scroll-content">
              <el-radio-group v-model="state.minute.type" class="radio-group-vertical">
                <el-radio label="every">每分钟 [ * ]</el-radio>
                <el-radio label="cycle">
                  周期 从
                  <el-input-number v-model="state.minute.cycle[0]" :max="58" :min="0" size="small"/>
                  -
                  <el-input-number v-model="state.minute.cycle[1]" :max="59" :min="1" size="small"/>
                  分钟
                </el-radio>
                <el-radio label="loop">
                  从
                  <el-input-number v-model="state.minute.loop[0]" :max="59" :min="0" size="small"/>
                  分开始, 每
                  <el-input-number v-model="state.minute.loop[1]" :max="59" :min="1" size="small"/>
                  分执行一次
                </el-radio>
                <el-radio label="specify">指定</el-radio>
              </el-radio-group>
              <el-checkbox-group v-model="state.minute.specify" :disabled="state.minute.type !== 'specify'"
                                 class="checkbox-list">
                <el-checkbox v-for="i in 60" :key="i-1" :label="String(i-1)">{{
                    (i - 1).toString().padStart(2, '0')
                  }}
                </el-checkbox>
              </el-checkbox-group>
            </div>
          </el-tab-pane>

          <el-tab-pane label="小时" name="hour">
            <div class="tab-scroll-content">
              <el-radio-group v-model="state.hour.type" class="radio-group-vertical">
                <el-radio label="every">每小时 [ * ]</el-radio>
                <el-radio label="cycle">
                  周期 从
                  <el-input-number v-model="state.hour.cycle[0]" :max="22" :min="0" size="small"/>
                  -
                  <el-input-number v-model="state.hour.cycle[1]" :max="23" :min="1" size="small"/>
                  小时
                </el-radio>
                <el-radio label="loop">
                  从
                  <el-input-number v-model="state.hour.loop[0]" :max="23" :min="0" size="small"/>
                  时开始, 每
                  <el-input-number v-model="state.hour.loop[1]" :max="23" :min="1" size="small"/>
                  小时执行一次
                </el-radio>
                <el-radio label="specify">指定</el-radio>
              </el-radio-group>
              <el-checkbox-group v-model="state.hour.specify" :disabled="state.hour.type !== 'specify'"
                                 class="checkbox-list">
                <el-checkbox v-for="i in 24" :key="i-1" :label="String(i-1)">{{
                    (i - 1).toString().padStart(2, '0')
                  }}
                </el-checkbox>
              </el-checkbox-group>
            </div>
          </el-tab-pane>

          <el-tab-pane label="日" name="day">
            <div class="tab-scroll-content">
              <el-radio-group v-model="state.day.type" class="radio-group-vertical" @change="handleDayChange">
                <el-radio label="every">每日 [ * ]</el-radio>
                <el-radio label="unspecified">不指定 [ ? ]</el-radio>
                <el-radio label="cycle">周期 从
                  <el-input-number v-model="state.day.cycle[0]" :max="30" :min="1" size="small"/>
                  -
                  <el-input-number v-model="state.day.cycle[1]" :max="31" :min="2" size="small"/>
                  日
                </el-radio>
                <el-radio label="loop">从
                  <el-input-number v-model="state.day.loop[0]" :max="31" :min="1" size="small"/>
                  日开始, 每
                  <el-input-number v-model="state.day.loop[1]" :max="31" :min="1" size="small"/>
                  天一次
                </el-radio>
                <el-radio label="workday">每月
                  <el-input-number v-model="state.day.workday" :max="31" :min="1" size="small"/>
                  号最近工作日
                </el-radio>
                <el-radio label="lastDay">本月最后一天</el-radio>
                <el-radio label="specify">指定</el-radio>
              </el-radio-group>
              <el-checkbox-group v-model="state.day.specify" :disabled="state.day.type !== 'specify'"
                                 class="checkbox-list">
                <el-checkbox v-for="i in 31" :key="i" :label="String(i)">{{
                    i.toString().padStart(2, '0')
                  }}
                </el-checkbox>
              </el-checkbox-group>
            </div>
          </el-tab-pane>

          <el-tab-pane label="月" name="month">
            <div class="tab-scroll-content">
              <el-radio-group v-model="state.month.type" class="radio-group-vertical">
                <el-radio label="every">每月 [ * ]</el-radio>
                <el-radio label="unspecified">不指定 [ ? ]</el-radio>
                <el-radio label="cycle">周期 从
                  <el-input-number v-model="state.month.cycle[0]" :max="11" :min="1" size="small"/>
                  -
                  <el-input-number v-model="state.month.cycle[1]" :max="12" :min="2" size="small"/>
                  月
                </el-radio>
                <el-radio label="loop">从
                  <el-input-number v-model="state.month.loop[0]" :max="12" :min="1" size="small"/>
                  月开始, 每
                  <el-input-number v-model="state.month.loop[1]" :max="12" :min="1" size="small"/>
                  月一次
                </el-radio>
                <el-radio label="specify">指定</el-radio>
              </el-radio-group>
              <el-checkbox-group v-model="state.month.specify" :disabled="state.month.type !== 'specify'"
                                 class="checkbox-list">
                <el-checkbox v-for="i in 12" :key="i" :label="String(i)">{{
                    i.toString().padStart(2, '0')
                  }}
                </el-checkbox>
              </el-checkbox-group>
            </div>
          </el-tab-pane>

          <el-tab-pane label="周" name="week">
            <div class="tab-scroll-content">
              <el-radio-group v-model="state.week.type" class="radio-group-vertical" @change="handleWeekChange">
                <el-radio label="every">每周 [ * ]</el-radio>
                <el-radio label="unspecified">不指定 [ ? ]</el-radio>
                <el-radio label="specify">指定</el-radio>
              </el-radio-group>
              <el-checkbox-group v-model="state.week.specify" :disabled="state.week.type !== 'specify'"
                                 class="checkbox-list">
                <el-checkbox v-for="i in 7" :key="i" :label="String(i)">
                  周{{ ['日', '一', '二', '三', '四', '五', '六'][i === 7 ? 0 : i] }}
                </el-checkbox>
              </el-checkbox-group>
            </div>
          </el-tab-pane>

          <el-tab-pane label="年" name="year">
            <div class="tab-scroll-content">
              <el-radio-group v-model="state.year.type" class="radio-group-vertical">
                <el-radio label="every">每年 [ * ]</el-radio>
                <el-radio label="unspecified">不指定 [空]</el-radio>
                <el-radio label="cycle">
                  周期 从
                  <el-input-number v-model="state.year.cycle[0]" :max="2098" :min="2024" size="small"/>
                  -
                  <el-input-number v-model="state.year.cycle[1]" :max="2099" :min="2025" size="small"/>
                  年
                </el-radio>
              </el-radio-group>
            </div>
          </el-tab-pane>
        </el-tabs>

        <div class="preview-section">
          <div class="preview-header">
            <span class="title">表达式预览:</span>
            <el-tag effect="dark" size="small" type="success">{{ cronString }}</el-tag>
          </div>
          <ul v-if="previewTimes.length > 0">
            <li v-for="(time, index) in previewTimes" :key="index">
              <el-icon class="time-icon">
                <Clock/>
              </el-icon>
              {{ time }}
            </li>
          </ul>
          <div v-else class="error-msg">Cron 表达式格式有误或暂无后续执行时间</div>
        </div>
      </div>
    </el-popover>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { Clock } from '@element-plus/icons-vue'
import {CronExpressionParser} from 'cron-parser'
import dayjs from 'dayjs'

const props = defineProps({
  modelValue: { type: String, default: '0 0 0 * * ? *' },
  disabled: { type: Boolean, default: false }
})
const emit = defineEmits(['update:modelValue'])
const activeTab = ref('second')
const hasOpened = ref(false)

// 默认 cron 表达式
const DEFAULT_CRON = '0 0 0 * * ? *'

// 第一次打开弹窗时，如果值为空，设置默认值
const handlePopoverShow = () => {
  if (!hasOpened.value) {
    hasOpened.value = true
    if (!props.modelValue || props.modelValue.trim() === '') {
      emit('update:modelValue', DEFAULT_CRON)
      updateStateFromCron(DEFAULT_CRON)
    }
  }
}

const currentYear = dayjs().year()

// --- 状态定义 ---
const state = reactive({
  second: { type: 'every', cycle: [1, 2], loop: [0, 1], specify: [] },
  minute: { type: 'every', cycle: [1, 2], loop: [0, 1], specify: [] },
  hour: { type: 'every', cycle: [0, 2], loop: [0, 1], specify: [] },
  day: { type: 'every', cycle: [1, 2], loop: [1, 1], workday: 1, specify: [] },
  month: { type: 'every', cycle: [1, 2], loop: [1, 1], specify: [] },
  week: { type: 'unspecified', cycle: [1, 2], specify: [] },
  year: { type: 'every', cycle: [currentYear, currentYear + 10] }
})

// --- 解析逻辑：还原 UI 状态 ---
const updateStateFromCron = (value) => {
  if (!value) return
  const parts = value.trim().split(/\s+/)

  const parsePart = (val, target) => {
    if (!val || val === '*') target.type = 'every'
    else if (val === '?') target.type = 'unspecified'
    else if (val.includes('-')) {
      target.type = 'cycle'
      target.cycle = val.split('-').map(Number)
    } else if (val.includes('/')) {
      target.type = 'loop'
      target.loop = val.split('/').map(Number)
    } else if (val.includes('W')) {
      target.type = 'workday'
      target.workday = Number(val.replace('W', ''))
    } else if (val === 'L') {
      target.type = 'lastDay'
    } else {
      target.type = 'specify'
      target.specify = val.split(',')
    }
  }

  if (parts[0]) parsePart(parts[0], state.second)
  if (parts[1]) parsePart(parts[1], state.minute)
  if (parts[2]) parsePart(parts[2], state.hour)
  if (parts[3]) parsePart(parts[3], state.day)
  if (parts[4]) parsePart(parts[4], state.month)
  if (parts[5]) parsePart(parts[5], state.week)

  // 处理年份 (第7位)
  if (parts[6]) {
    parsePart(parts[6], state.year)
  } else {
    state.year.type = 'unspecified'
  }
}

// --- 生成逻辑 ---
const generateSegment = (s, isYear = false) => {
  if (s.type === 'every') return '*'
  if (s.type === 'unspecified') return isYear ? '' : '?'
  if (s.type === 'cycle') return `${s.cycle[0]}-${s.cycle[1]}`
  if (s.type === 'loop') return `${s.loop[0]}/${s.loop[1]}`
  if (s.type === 'workday') return `${s.workday}W`
  if (s.type === 'lastDay') return 'L'
  if (s.type === 'specify') return s.specify.length ? [...s.specify].sort((a, b) => Number(a) - Number(b)).join(',') : '*'
  return '*'
}

const cronString = computed(() => {
  const segs = [
    generateSegment(state.second),
    generateSegment(state.minute),
    generateSegment(state.hour),
    generateSegment(state.day),
    generateSegment(state.month),
    generateSegment(state.week)
  ]
  const y = generateSegment(state.year, true)
  if (y) segs.push(y)
  return segs.join(' ').trim()
})

// --- 监听 ---
onMounted(() => updateStateFromCron(props.modelValue))

watch(() => props.modelValue, (newVal) => {
  if (newVal && newVal !== cronString.value) updateStateFromCron(newVal)
}, { immediate: true })

watch(cronString, (newVal) => emit('update:modelValue', newVal))

const handleDayChange = (v) => {
  if (v !== 'unspecified') state.week.type = 'unspecified'
}
const handleWeekChange = (v) => {
  if (v !== 'unspecified') state.day.type = 'unspecified'
}

// --- 预览近期运行时间 ---
const previewTimes = computed(() => {
  try {
    const str = cronString.value.trim();
    const parts = str.split(/\s+/);
    // 如果包含年份（7位），截取前6位进行计算，以确保兼容性
    const parseStr = parts.length > 6 ? parts.slice(0, 6).join(' ') : str;
    const interval = CronExpressionParser.parse(parseStr);
    return Array.from({length: 5}).map(() => dayjs(interval.next().toDate()).format('YYYY-MM-DD HH:mm:ss'))
  } catch (e) {
    return [];
  }
})
</script>

<style lang="scss" scoped>
/* 样式部分保持不变 */
.cron-container {
  height: 400px;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  .fixed-tabs {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;

    :deep(.el-tabs__header) {
      margin-bottom: 0;
    }

    :deep(.el-tabs__content) {
      flex: 1;
      overflow: hidden;
    }

    :deep(.el-tab-pane) {
      height: 100%;
    }
  }

  .tab-scroll-content {
    height: 100%;
    overflow-y: auto;
    padding: 15px;

    &::-webkit-scrollbar {
      width: 4px;
    }

    &::-webkit-scrollbar-thumb {
      background: #e0e0e0;
      border-radius: 2px;
    }
  }

  .radio-group-vertical {
    display: flex;
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;

    :deep(.el-radio) {
      height: auto;
      margin-right: 0;

      .el-radio__label {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
      }
    }

    :deep(.el-input-number) {
      margin: 0 8px;
      width: 100px;
    }
  }

  .checkbox-list {
    margin-top: 20px;
    display: grid;
    grid-template-columns: repeat(10, 1fr);
    gap: 5px;
    border-top: 1px dashed #eee;
    padding-top: 15px;

    :deep(.el-checkbox) {
      margin-right: 0;
    }
  }

  .preview-section {
    background: #fcfcfc;
    padding: 12px;
    border-top: 1px solid #eee;

    .preview-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;

      .title {
        font-size: 13px;
        font-weight: bold;
        color: #606266;
      }
    }

    ul {
      list-style: none;
      padding: 0;
      margin: 0;

      li {
        font-size: 12px;
        color: #666;
        font-family: monospace;
        display: flex;
        align-items: center;
        margin-bottom: 2px;

        .time-icon {
          margin-right: 6px;
        }
      }
    }

    .error-msg {
      color: #f56c6c;
      font-size: 12px;
    }
  }
}
</style>