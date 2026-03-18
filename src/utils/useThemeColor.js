import { watchEffect, ref } from 'vue'
//获取主题变量
console.log(localStorage.getItem('data-theme'),'--data-theme')
let appearance = ref(localStorage.getItem('data-theme') || 'auto')
//查询当前系统的主题颜色
const match = window.matchMedia('(prefers-color-scheme:dark)')
//监听系统主题变化
match.addEventListener('change',followSystem)

function followSystem(){
    const theme = match.matches ? 'dark':'linght'
    document.documentElement.setAttribute('data-theme',theme)
}

watchEffect(()=>{
    //如果主题变量为auto，则跟随系统主题
    if(appearance.value === 'auto'){
        followSystem()
    }else{
        document.documentElement.setAttribute('data-theme',appearance.value)
    }
})


export default function useThemeColor(){
    return {
        appearance
    }
}