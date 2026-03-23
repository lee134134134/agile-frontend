<template>
  <div class="room-content">
    <!-- <MenuBreadCom :type="2"></MenuBreadCom>/ -->
    <div class="page-header jus-bet-center">
      <div class="jus-start-center">
        <div class="title-icon"></div>
        <div class="title-1">{{ formData.name }}</div>
      </div>
      <div class="opt-btn" @click="handeNextFn">开启下一轮</div>
    </div>

    <div class="page-container jus-bet-start">
      <div class="container-left bg-color-1">
        <div v-if="jokerList && jokerList.length > 0" class="joker-list">
          <div v-for="item in jokerList" :key="item.id" class="joker-item">
            <div class="item-name title-1">{{ item.name }}</div>
            <div class="item-num">{{ item.value }}</div>
          </div>
        </div>
        <div v-else class="empty-content jus-clumn-center">
          <img alt="" class="empty-img" src="@/assets/images/home/null-icon.png">
          <div class="empty-text">暂无出牌人员</div>
        </div>
      </div>
      <div class="container-right bg-color-1">
        <section class="flex default-btn-content">
          <div class="title-1">出牌统计</div>
          <div v-if="data.status == 0" class="default-btn">保存故事点</div>
          <div v-if="data.status == 1" class="opt-default-btn" @click="handleSavePoint(data.mostCardValue)">保存故事点
          </div>
        </section>
        <div class="info-content">
          <div class="info-item jus-bet-end">
            <div class="info-lable">有效出牌人数</div>
            <div class="info-val">{{ data.pepCount }}</div>
          </div>
          <div class="info-item jus-bet-end">
            <div class="info-lable">达标阈值</div>
            <div class="info-val" style="font-weight:bold">{{ data.standardThreshold }}</div>
          </div>
          <div class="info-item jus-bet-end">
            <div class="info-lable">共识需得票数</div>
            <div class="info-val">{{ data.needTicketCount }}</div>
          </div>
          <div class="info-item jus-bet-end">
            <div class="info-lable">当前阈值</div>
            <div :class="data.status == 1 ? 'text-blue' : 'text-red'" class="info-val">{{ data.localThreshold }}
            </div>
          </div>
          <div class="info-item jus-bet-end">
            <div class="info-lable">出牌均值</div>
            <div class="info-val">{{ data.ave }}</div>
          </div>
          <div class="info-item jus-bet-end">
            <div class="info-lable">共识牌面</div>
            <div class="info-val">{{ data.mostCardValue }}</div>
          </div>
        </div>
        <div class="title-1" style="margin-bottom:12px;margin-top: 12px">牌面分布</div>
        <PieChart v-if="jokeredList" :data="jokeredList" class="mt44"/>
      </div>
    </div>
  </div>
</template>
<script setup>
import {onBeforeMount, reactive, ref, watch} from 'vue';
import {ElMessage} from 'element-plus';
import PieChart from './components/PieChart.vue';
import {gameRoundReveal, savePoint, startNextRound} from '@/api/agilePokerApi.js';

const emits = defineEmits(['reFresh'])
const props = defineProps(['data']);
const formData = reactive({
  name: '',
  code: '',
  sprintCode: ''
})
const jokerList = ref([
  {
    id: '1',
    name: '赵如月',
    num: '2'
  }, {
    id: '2',
    name: '罗婷',
    num: '2'
  }, {
    id: '3',
    name: '罗婷',
    num: '2'
  }, {
    id: '4',
    name: '罗婷',
    num: '2'
  }, {
    id: '5',
    name: '罗婷',
    num: '2'
  }
])
const data = reactive({
  pepCount: 0,
  standardThreshold: '-',
  needTicketCount: '',
  localThreshold: '',
  status: 0,//是否大于达标阈值（是否能保存故事点：0：不能，1：能）
  ave: 0,
  mostCardValue: '',
})
const jokeredList = ref(null)
watch(() => props.data, (newName) => {
  formData.name = newName.name
  formData.code = newName.code
  formData.sprintCode = newName.sprintCode
}, {immediate: true});

async function getInfo() {
  gameRoundReveal({storyCode: formData.code}).then(res => {
    if (res.success) {
      jokerList.value = res?.data?.names ?? []
      data.pepCount = res?.data?.pepCount ?? '-'
      data.standardThreshold = res?.data?.standardThreshold ?? '-'
      data.needTicketCount = res?.data?.needTicketCount ?? '-'
      data.localThreshold = res?.data?.localThreshold ?? '-'
      data.status = res?.data?.status ?? '0'
      data.ave = res?.data?.ave ?? '-'
      data.mostCardValue = res?.data?.mostCardValue ?? '-'
      if (res.data.cardValueDis) {
        jokeredList.value = []
        for (let key in res.data.cardValueDis) {
          let obj = {
            name: key,
            value: res.data.cardValueDis[key]
          }
          jokeredList.value.push(obj)
        }
      } else {
        jokeredList.value = null
      }
    }
  })
}

const handeNextFn = () => {
  startNextRound({storyCode: formData.code, 'sprintCode': formData.sprintCode,}).then(res => {
    if (res.success) {
      ElMessage.success('操作成功！')
      emits('reFresh')
    }
  })
}
const handleSavePoint = (point) => {
  let params = {
    'storyCode': formData.code,
    'sprintCode': formData.sprintCode,
    'point': point
  }
  savePoint(params).then(res => {
    if (res.success) {
      ElMessage.success('操作成功！')
    }
  })
}
onBeforeMount(async () => {
  getInfo()
})
</script>
<style lang="scss" scoped>
.room-content {
  .page-header {
    margin: 0 0 12px;

    .title-icon {
      width: 20px;
      height: 20px;
      background: url(@/assets/images/story-icon.png) no-repeat center;
      background-size: cover;
      margin-right: 10px;
    }
  }

  .page-container {
    width: 100%;

    .container-left {
      padding: 30px 20px;
      width: calc(100% - 450px);
      border-radius: 8px;
      height: calc(100vh - 250px);

      .joker-list {
        width: 100%;
        display: flex;
        justify-content: flex-start;
        flex-wrap: wrap;
        align-items: center;
        gap: 20px;

        .joker-item {
          width: 23%;
          padding: 30px 0;
          background: #fff;
          border-radius: 8px;

          .item-name {
            text-align: center;
          }


          .item-num {
            width: 100%;
            margin-top: 20px;
            height: 40px;
            line-height: 40px;
            font-size: 20px;
            color: #3ce060;
            text-align: center;
          }
        }
      }
    }

    .container-right {
      width: 430px;
      padding: 20px;
      border-radius: 8px;
      height: calc(100vh - 250px);
    }

    .info-content {
      margin-top: 12px;
      padding: 12px 24px;
      background: #fff;
      border-radius: 8px;

      .info-item {
        margin-bottom: 10px;

        .info-lable {
          width: 150px;
          font-family: PingFang SC;
          font-weight: 500;
          font-size: 14px;
          color: #666;
        }

        .info-val {
          font-family: PingFang SC;
          font-weight: 400;
          font-size: 14px;
          color: #333;
        }

        .text-red {
          color: #fc6565 !important;
          font-weight: 500 !important;
        }

        .text-blue {
          color: #65a6fc !important;
          font-weight: 500 !important;
        }

        .info-more {
          width: 200px;
        }
      }
    }
  }

  .default-btn-content{
    display: flex;
    justify-content: space-between;
  }

  .default-btn {
    display: inline-block;
    padding: 0 16px;
    height: 28px;
    line-height: 28px;
    background: #ccc;
    border-radius: 4px;
    font-size: 12px;
    color: #fff;
    cursor: default;
  }

  .opt-default-btn{
    display: inline-block;
    padding: 0 16px;
    height: 28px;
    line-height: 28px;
    background: #2173F7;
    border-radius: 4px;
    font-size: 12px;
    color: #fff;
    cursor: default;
  }

  .empty-content {
    margin-top: 50px;

    .empty-img {
      width: 246px;
      height: 180px;
      // margin-bottom: 10px;
    }
  }
}

.title-1{
  font-size: 16px;
}

.opt-btn{
  height: 32px;
  line-height: 32px;
  padding: 0 16px;
}
</style>