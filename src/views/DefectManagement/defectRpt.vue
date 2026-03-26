<template>
  <div class="main-content flex-column">
    <div class="fixed-header">
      <MenuBreadCom :fromPage="fromPage" :name="'缺陷报告'"></MenuBreadCom>
      <div class="jus-bet-center mt10">
        <div class="title-1 font24">{{ detailObj.sprintName }}</div>
        <div class="btn-list jus-start-center gap12">
          <div class="opt-btn" @click="handleExportPDF">导出PDF</div>
          <div class="opt-btn" @click="handleClose">关闭</div>
        </div>
      </div>
    </div>

    <div id="exportArea" class="rpt-overview-view flex-1" ref="scrollContainer">
      <div class="rpt-overview">
        <div class="overview-title">报告概览</div>
        <div class="jus-bet-center gap12 mt10">
          <div class="card-item">
            <div class="card-title">缺陷总数</div>
            <div class="card-val">{{ detailObj.total }}</div>
          </div>
          <div class="card-item">
            <div class="card-title">实际缺陷数</div>
            <div class="card-val">{{ detailObj.actualDefect }}</div>
          </div>
          <div class="card-item">
            <div class="card-title">用户故事点数</div>
            <div class="card-val">{{ detailObj.storyCount }}</div>
          </div>
          <div class="card-item">
            <div class="card-title">缺陷率</div>
            <div class="card-val">{{ detailObj.defectRate }}%</div>
          </div>
          <div class="card-item card-item-lg">
            <div class="card-title">迭代周期</div>
            <div class="card-val">
              {{ detailObj.sprintStart ? detailObj.sprintStart.replaceAll('-', '.') : '' }}
              -
              {{ detailObj.sprintEnd ? detailObj.sprintEnd.replaceAll('-', '.') : '' }}
            </div>
          </div>
        </div>
      </div>
<!--      <div class="nav-bar jus-start-center gap12">-->
<!--        <div class="nav-item" @click="scrollToSection('severity')">按严重程度统计</div>-->
<!--        <div class="nav-item" @click="scrollToSection('type')">按缺陷类型统计</div>-->
<!--        <div class="nav-item" @click="scrollToSection('personnel')">人员缺陷统计</div>-->
<!--        <div class="nav-item" @click="scrollToSection('story')">用户故事缺陷分布</div>-->
<!--      </div>-->
      <section class="rpt-overview-view-scroll">
        <div class="item" id="severity">
          <BarChart v-if="detailObj.severityList" :chartTitle="'按严重程度统计'" :data="detailObj.severityList"/>
        </div>

        <div class="item" id="type">
          <BarLineChart v-if="detailObj.defectTypeList" :chartTitle="'按缺陷类型统计'" :data="detailObj.defectTypeList"/>
        </div>

        <div class="item" id="personnel">
          <BarLineChart v-if="detailObj.leaderList" :chartTitle="'人员缺陷统计'" :data="detailObj.leaderList"
                        class="splitPages"/>
        </div>

        <div class="item" id="story">
          <BarChart v-if="detailObj.storyList" :chartTitle="'用户故事缺陷分布'" :data="detailObj.storyList" class="splitPages"/>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router'
import MenuBreadCom from './components/MenuBreadCom.vue';
import BarChart from './components/BarChart.vue';
import BarLineChart from './components/BarLineChart.vue';
import htmlToPdf from '@/utils/pdf.js';
import { geneDefectRpt, getDefectRptInfo } from '@/api/defectApi.js';
import { $today } from '@/utils/date.js'

const route = useRoute();
const router = useRouter();
const sprintId = ref()
const fromPage = ref()
const scrollContainer = ref(null) // 滚动容器引用
const detailObj = ref({})

// 快速定位函数
const scrollToSection = (id) => {
  const element = document.getElementById(id);
  if (element && scrollContainer.value) {
    // 使用 scrollIntoView 实现平滑滚动
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

const handleExportPDF = () => {
  const suc = () => {};
  let dom = document.querySelector('#exportArea');
  let pdf = new htmlToPdf(dom, '', 'splitPages', false, 'break_page', suc, 5);
  pdf.outPutPdfFn('').then((res) => {
    geneDefectRpt(res).then(res => {
      const blob = new Blob([res], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `缺陷报告${$today}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    })
  });
}

const handleClose = () => {
  router.go(-1)
}

const getDefectRptInfoFn = () => {
  let params = { sprintId: sprintId.value }
  getDefectRptInfo(params).then(res => {
    if (res.success) {
      detailObj.value = res.data
      let obj = { data: [], defectRate: [], xaxis: [] }
      detailObj.value.defectTypeList.forEach(item => {
        obj.data.push(item.value)
        obj.defectRate.push(item.rate)
        obj.xaxis.push(item.name)
      })
      detailObj.value.defectTypeList = obj
    }
  })
}

onMounted(() => {
  sprintId.value = route.query.id
  fromPage.value = route.query.from
  getDefectRptInfoFn()
})
</script>

<style lang="scss" scoped>
// 基础布局调整
.flex-column { display: flex; flex-direction: column; }
.flex-1 { flex: 1; }

.main-content {
  height: 100vh; // 撑满视口高度
  overflow: hidden; // 整体不滚动
  padding: 16px; // 根据实际样式调整

  .fixed-header {
    flex-shrink: 0; // 头部不压缩
  }

  .nav-bar {
    padding: 8px 0;

    .nav-item {
      padding: 2px 12px;
      background: #f0f5ff;
      color: #2173f7;
      border: 1px solid #2173f7;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      transition: all 0.3s;

      &:hover {
        border: 1px solid #006ed3;
        background: #006ed3;
        color: #fff;
      }
    }
  }

  .rpt-overview-view {
    padding-right: 8px;
  }

  // 保持原有样式
  .gap12 { gap: 12px; }
  .mt10 { margin-top: 10px; }
  .mt44 { margin-top: 14px; }
  .mb24 { margin-bottom: 16px; }
  .mb16 { margin-bottom: 16px; }
  .font24 { font-size: 16px; font-weight: 600; }

  .rpt-overview {
    padding: 12px;
    border-radius: 8px;

    .overview-title {
      font-size: 14px;
      color: #333;
      font-weight: 600;
    }

    .card-item {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      gap: 8px;
      width: calc((100% - 450px) / 4);
      height: 90px;
      border-radius: 8px;
      background-color: #FFF;

      .card-title { color: #8EA3B7; }
      .card-val {
        height: 30px;
        line-height: 30px;
        font-size: 16px;
        color: #006ED3;
        font-weight: bold;
      }
    }

    .card-item-lg {
      min-width: 450px;
      flex-shrink: 0;
    }
  }
}

.rpt-overview-view-scroll{
  overflow-y: auto;
  height: calc(100vh - 280px);
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  padding: 0 10px;
  align-content: flex-start;

  .item{
    flex: 0 0 calc(50% - 8px);
  }



  &::-webkit-scrollbar {
    width: 4px;
  }
}

.opt-btn{
  height: 30px;
  line-height: 30px;
  padding: 0 12px;
  font-size: 12px;
}
</style>