<template>
    <el-alert type="warning" show-icon :closable="false" class="info-tip" :class="{'warnBgColor': true}">
        <template #title>
            <div class="jus-start-center info-list">
                <span class="info-name">心情指数说明：</span>
                <span class="info1"> -5：非常糟糕 </span>
                <span class="info2"> -4：很糟糕 </span>
                <span class="info3"> -3：糟糕 </span>
                <span class="info4"> -2：不太好 </span>
                <span class="info5"> -1：稍差 </span>
                <span class="info6"> 0：一般 </span>
                <span class="info7"> 1：还不错 </span>
                <span class="info8"> 2：良好 </span>
                <span class="info9"> 3：很好 </span>
                <span class="info10"> 4：非常好 </span>
                <span class="info11"> 5：极好 </span>
            </div>
        </template>
    </el-alert>
</template>
<script setup>
import { ref } from 'vue';
const props = defineProps('bgColor')

const infoContent = ref('心情指数说明：-5：非常糟糕  -4：很糟糕  -3：糟糕   -2：不太好  -1：稍差   0：一般  1：还不错   2：良好  3：很好   4：非常好  5：极好')
</script>
<style lang="scss" scoped>
.info-tip {
    margin: 10px 0;
    // padding: 5px 10px;
    // background: #fff;
    // border-radius: 4px;

    // span {
    //     display: inline-block;
    //     margin-right: 10px;
    // }
    
    .info-list {
        flex-wrap: wrap;
        column-gap: 10px;
    }
    .info-name {
        color: #333;
    }
    .info1 {
        color: #DC3545;
    }
    .info2 {
        color: #FD7E14;
    }
    .info3 {
        color: #FFC107;
    }
    .info4 {
        color: #28A745;
    }
    .info5 {
        color: #20C997;
    }
    .info6 {
        color: #17A2B8;
    }
    .info7 {
        color: #007BFF;
    }
    .info8 {
        color: #6F42C1;
    }
    .info9 {
        color: #6610F2;
    }
    .info10 {
        color: #E83E8C;
    }
    .info11 {
        color: #28A745;
    }
}
.warnBgColor {
    background-color: #FFF;
}
</style>