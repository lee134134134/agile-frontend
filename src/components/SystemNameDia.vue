<template>
    <div class="system-name">
        <!-- <img src="@/assets/images/logo.png" alt="" class="logo-icon">
        <div class="name-main">
            <div class="name-cn">敏捷开发平台</div>
            <div class="name-en">Agile Development Platform</div>
        </div> -->
    </div>
</template>
<script setup></script>
<style scoped lang="scss">
.system-name {
    width: 268px;
    height: 47px;
    background: url('@/assets/images/Login/logo.png');
    background-size: 100% 100%;
    // display: flex;
    // justify-content: flex-start;
    // align-items: flex-start;

    .logo-icon {
        display: block;
        width: 46px;
        height: 52px;
        margin-right: 16px;
    }

    .name-main {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;

        .name-cn {
            margin-bottom: 10px;
            font-family: 'Microsoft YaHei', 'PingFang SC';;
            font-weight: bold;
            font-size: 30px;
            line-height: 30px;
            color: #1a202c;
            letter-spacing: 3px;
        }

        .name-en {
            font-family: 'Microsoft YaHei', 'PingFang SC';;
            font-weight: bold;
            font-size: 15px;
            color: #a0aec0;
            white-space: pre;
        }
    }
}
</style>