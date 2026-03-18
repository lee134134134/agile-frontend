<template>
  <div class="user-content jus-end-center">
    <!-- <div class="bell-content">
        <el-badge :is-dot="isDot">
            <el-icon color="#2173f7" size="16px" class="bell-icon">
                <BellFilled />
            </el-icon>
        </el-badge>
    </div> -->
    <img alt="" class="bell" src="@/assets/images/Menu/bell.png">
    <div class="userinfo-content jus-end-center" @mouseenter="handleShowList" @mouseleave="hideShowList">
      <img alt="" class="user-icon" src="@/assets/images/Menu/user.png">
      <div class="jus-bet-around username-content">
        <div class="user-name">{{ userInfo.nikename }}</div>
        <div class="select-btn">
          <el-icon class="arrow-icon arrow-up" color="#FFF" size="14px">
            <ArrowUp/>
          </el-icon>
          <el-icon class="arrow-icon arrow-down" color="#FFF" size="14px">
            <ArrowDown/>
          </el-icon>
        </div>
      </div>
      <div v-show="isShowList" class="userdown-list">
        <div class="list-item jus-center">
          <div class="item-icon usercard-icon"></div>
          <div class="item-text" @click="handleInfo">个人信息</div>
        </div>
        <div class="list-item jus-center">
          <div class="item-icon out-icon"></div>
          <div class="item-text" @click="logout">退出平台</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import {onMounted, reactive, ref, watch} from 'vue';
import Cookies from "js-cookie";
import {ElMessage} from 'element-plus';
import {useRouter} from 'vue-router'
import {useDicStore} from '@/stores/dic.js';
import {logoutAPI} from "@/api/api.js";

const dicStore = useDicStore()
const router = useRouter();
const isDot = ref(true)
const isShowList = ref(false)
const handleShowList = () => {
  isShowList.value = true
}
const hideShowList = () => {
  isShowList.value = false
}
const userInfo = reactive({
  nikename: ''
})
const logout = async () => {
  const res = await logoutAPI()
  if (res.success) {
    Cookies.remove('agiles_token')
    Cookies.remove('agiles_tokenType')
    localStorage.removeItem('agiles_token')
    localStorage.removeItem('agiles_tokenType')
    localStorage.removeItem('agiles_user')
    localStorage.removeItem("agiles_userInfo");
    localStorage.removeItem("agiles_router");
    localStorage.removeItem("agiles_menuList");
    router.push({path: '/login'})
    ElMessage.success('退出成功')
  }
}
const handleInfo = () => {
  router.push({path: '/personInfo'})
}
watch(() => dicStore.nickname, (newName) => {
  if (newName) {
    userInfo.nikename = newName
    console.log(newName, '--newName')
  }

}, {immediate: true});
onMounted(() => {
  let user = localStorage.getItem('agiles_user') || ''
  if (user) {
    userInfo.nikename = JSON.parse(localStorage.getItem('agiles_user')) ? JSON.parse(localStorage.getItem('agiles_user')).nickname : ''
    if (userInfo.nikename) {
      isDot.value = false
    }
  } else {
    router.push('/login')
  }

})
</script>
<style lang="scss" scoped>
.user-content {
  margin-left: 30px;
  padding-right: 0px;

  // .bell-content {
  //     width: 40px;
  //     height: 40px;
  //     text-align: center;
  //     padding-top: 10px;
  //     background: #fff;
  //     border-radius: 20px;
  //     cursor: pointer;

  //     :deep(.bell-icon) {
  //         svg {
  //             width: 2em;
  //             height: 2em;
  //         }
  //     }
  // }
  .bell {
    width: 22px;
  }

  .userinfo-content {
    margin-left: 20px;
    position: relative;
    // width: 180px;
    height: 40px;
    // background: #fff;
    border-radius: 20px;

    .user-icon {
      width: 16px;
      padding: 2px;
      box-sizing: content-box;
      border: 1px solid #FFF;
      border-radius: 50%;
      margin-right: 8px;
      margin-left: 3px;
    }

    .username-content {
      width: 80px;
    }

    .user-name {
      font-family: 'Microsoft YaHei', 'PingFang SC';
      font-weight: 500;
      font-size: 14px;
      color: #FFF;
    }

    :deep(.arrow-icon) {
      // svg {
      //     width: 1.2em;
      //     height: 1.2em;
      // }
    }

    .select-btn {
      margin-left: 0px;
      padding-bottom: 2px;

      .arrow-up {
        display: block;
      }

      .arrow-down {
        display: none;
      }
    }

    // .userdown-list {
    //     display: none;
    // }
    .userdown-list {
      position: absolute;
      top: 40px;
      right: 0;
      z-index: 999999;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      width: 112px;
      height: 78px;
      padding: 6px;
      background: #fff;
      box-shadow: 4px 4px 4px 0px rgba(4, 95, 157, 0.1);
      border-radius: 8px;
      border: 1px solid #edf5ff;

      .list-item {
        cursor: pointer;
        padding: 6px 0;

        .item-icon {
          width: 16px;
          height: 16px;
          margin-right: 8px;
        }

        .usercard-icon {
          background: url(@/assets/webp/personal.webp) no-repeat center;
          background-size: 100% 100%;
        }

        .out-icon {
          background: url(@/assets/webp/quit.webp) no-repeat center;
          background-size: 100% 100%;
        }

        .item-text {
          font-family: 'Microsoft YaHei', 'PingFang SC';
          font-weight: 400;
          font-size: 14px;
          color: #232323;
        }
      }

      .list-item:hover {
        background: #f3f4f7;
        border-radius: 4px;

        .usercard-icon {
          background: url(@/assets/webp/personal-hover.webp) no-repeat center;
          background-size: 100% 100%;
        }

        .out-icon {
          background: url(@/assets/webp/quit-hover.webp) no-repeat center;
          background-size: 100% 100%;
        }

        .item-text {
          color: #2173f4;
        }
      }
    }
  }

  .userinfo-content:hover {
    .select-btn {
      .arrow-up {
        display: none;
      }

      .arrow-down {
        display: block;
      }
    }

    // .userdown-list {
    //     display: block;
    //     position: absolute;
    //     top: 41px;
    //     left: 0;
    //     z-index: 999999;
    //     display: flex;
    //     flex-direction: column;
    //     justify-content: space-around;
    //     width: 152px;
    //     height: 136px;
    //     padding: 20px 0;
    //     background: #fff;
    //     box-shadow: 4px 4px 4px 0px rgba(4, 95, 157, 0.1);
    //     border-radius: 20px;
    //     border: 1px solid #edf5ff;

    //     .list-item {
    //         padding: 0 28px;
    //         cursor: pointer;

    //         .item-icon {
    //             width: 20px;
    //             height: 20px;
    //             margin-right: 16px;
    //         }

    //         .usercard-icon {
    //             background: url(@/assets/images/Menu/usercard.png) no-repeat center;
    //             background-size: 100% 100%;
    //         }

    //         .out-icon {
    //             background: url(@/assets/images/Menu/out.png) no-repeat center;
    //             background-size: 100% 100%;
    //         }

    //         .item-text {
    //             font-family: 'Microsoft YaHei', 'PingFang SC';
    //             font-weight: 400;
    //             font-size: 14px;
    //             color: #232323;
    //         }
    //     }

    //     .list-item:hover {
    //         .usercard-icon {
    //             background: url(@/assets/images/Menu/usercard-selected.png) no-repeat center;
    //             background-size: 100% 100%;
    //         }

    //         .out-icon {
    //             background: url(@/assets/images/Menu/out-selected.png) no-repeat center;
    //             background-size: 100% 100%;
    //         }

    //         .item-text {
    //             color: #2173f4;
    //         }
    //     }
    // }
  }
}
</style>