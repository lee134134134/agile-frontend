// import {saveLog} from "/@/api/admin/log";

class Tracker {
    constructor() {
        // 存储点击信息的对象
        this.clickInfo = null;
        //初始化
        this.initGlobalClickListener();
    }
    //初始化全局点击事件监听器
    initGlobalClickListener() {
        document.addEventListener('click', (event) => {
            const target = this.findTrackElement(event.target);
            if(!target) return;
            const trackData=this.collectTrackData(target);
            //数据上报
            this.sendTrackData(trackData);
        },true);
    }
    // 查找最近的包含data-track属性的元素
    findTrackElement(element) {
        let target = element;
        while (target) {
            if(target.hasAttribute('data-track-id')||target.hasAttribute('v-auth')) return target;
            const shadowParent=target.getRootNode()?.host;
            target=shadowParent || target.parentElement;
        }
        return null;
    }
    //整理数据
    collectTrackData(element){
        return {
            eventType:'click',
            elementId:element.getAttribute('data-track-id'),
            elementName:element.getAttribute('data-track-name')||element.innerText,
            timestamp:Date.now(),
            path:window.location.pathname,
        }
    }
    //数据上报
    sendTrackData(data){
        console.log('埋点数据上报======', data, window.location)
        // saveLog({
        //     logType: '0',
        //     operateType: '3', //按钮日志
        //     title: data.elementName,
        //     requestUri: data.elementId,
        //     // beforeLog: fromPath,
        //     // afterLog: toPath,
        //     tenantId: '1',
        //     method: 'GET',
        //     userAgent: navigator.userAgent,
        // });
    }
}
export const tracker = new Tracker();