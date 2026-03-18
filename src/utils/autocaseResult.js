export const autoCaseSuccessText = `
        <div class="dia-main-execute">
            <div class="header-line">
                <span class="header-title">测试执行详情</span>
                <span class="refresh-btn" onclick="refreshStatus('##resultInfo.autoCaseId##')">
                    <img src="/refresh.png"  alt=""/>
                    <span>刷新状态</span>
                </span>
            </div>
            <div class="dia-main-content-execute">
                <div class="case-basic-info">
                    <div class="info-item">
                        <span class="info-title">执行名称</span>
                        <span class="info-value">##resultInfo.name##</span>
                    </div>
                    <div class="jus-flex-start gap30">
                        <div class="info-item">
                            <span class="info-title">开始时间</span>
                            <span class="info-value">##resultInfo.startTime##</span>
                        </div>
                        <div class="info-item">
                            <span class="info-title">结束时间</span>
                            <span class="info-value">##resultInfo.endTime##</span>
                        </div>
                    </div>
                    <div class="info-item">
                        <span class="info-title">状态</span>
                        <div class="status-tag success-tag">
                            成功
                        </div>
                    </div>
                </div>
                <div class="area-title">执行结果</div>
                <pre class="result-content">##resultInfo.result##</pre>

                <div class="area-title">报告</div>
                <div class="jus-flex-start gap12">
                    ###rptBtn###
                </div>

            </div>
        </div>
    `

export const autoCaseFailText = `
        <div class="dia-main-execute">
            <div class="header-line">
                <span class="header-title">测试执行详情</span>
                <span class="refresh-btn" onclick="refreshStatus('##resultInfo.autoCaseId##')">
                    <img src="/refresh.png" />
                    <span>刷新状态</span>
                </span>
            </div>
            <div class="dia-main-content-execute">
                <div class="case-basic-info">
                    <div class="info-item">
                        <span class="info-title">执行名称</span>
                        <span class="info-value">##resultInfo.name##</span>
                    </div>
                    <div class="jus-flex-start gap30">
                        <div class="info-item">
                            <span class="info-title">开始时间</span>
                            <span class="info-value">##resultInfo.startTime##</span>
                        </div>
                        <div class="info-item">
                            <span class="info-title">结束时间</span>
                            <span class="info-value">##resultInfo.endTime##</span>
                        </div>
                    </div>
                    <div class="info-item">
                        <span class="info-title">状态</span>
                        <div class="status-tag fail-tag">
                            失败
                        </div>
                    </div>
                </div>
                <div class="area-title">执行结果</div>
                <pre class="result-content">##resultInfo.result##</pre>

                <div class="area-title">报告</div>
                <div class="jus-flex-start gap12">
                    ###rptBtn###
                </div>

            </div>
        </div>
    `


{/* <div class="jus-flex-start gap12">
    <div class="opt-btn" onclick="viewReport('##resultInfo.report##')">查看报告</div>
    <div class="opt-btn" onclick="viewReport('##resultInfo.log##')">查看日志</div>
</div> */}
export const getAutoCaseResultText = (type, obj) => {
    // console.log('obj===', obj)
    let text
    if(type == 'success') {
        text = autoCaseSuccessText
    }else {
        text = autoCaseFailText
    }
    let hasReport = false
    let reportUrl = ''
    let hasLog = false
    let logUrl = ''
    if(!obj.execFilelist || obj.execFilelist.length == 0) {
        hasReport = false
        hasLog = false
    }else {
        obj.execFilelist.forEach(item => {
            if(item.artifactType == 'report') {
                hasReport = true
                reportUrl = item.artifactPath
            }else if(item.artifactType == 'log') {
                hasLog = true
                logUrl = item.artifactPath
            }
        });
    }

    let repBtnEle = ''
    if(hasReport && hasLog) {
        repBtnEle = `
            <div class="opt-btn" onclick="viewReport('##resultInfo.report##')">查看报告</div>
            <div class="opt-btn" onclick="viewReport('##resultInfo.log##')">查看日志</div>`
    }else if(hasReport && !hasLog) {
        repBtnEle = `
            <div class="opt-btn" onclick="viewReport('##resultInfo.report##')">查看报告</div>
            <div class="opt-btn opt-disabled-btn">日志文件不存在</div>`
    }else if(!hasReport && hasLog) {
        repBtnEle = `
            <div class="opt-btn opt-disabled-btn">报告文件不存在</div>
            <div class="opt-btn" onclick="viewReport('##resultInfo.log##')">查看日志</div>`
    }
    else if(!hasReport && !hasLog) {
        repBtnEle = `
            <div class="opt-btn opt-disabled-btn">报告文件不存在</div>
            <div class="opt-btn opt-disabled-btn">日志文件不存在</div>`
    }
    text = text.replaceAll('###rptBtn###', repBtnEle)
    
    text = text.replaceAll('##resultInfo.autoCaseId##', (obj.autoCaseId))
    text = text.replaceAll('##resultInfo.name##', (obj.execName || '-'))
    text = text.replaceAll('##resultInfo.startTime##', (obj.startTime || '-'))
    text = text.replaceAll('##resultInfo.endTime##', (obj.endTime || '-'))
    text = text.replaceAll('##resultInfo.result##', (obj.execResult || ''))
    text = text.replaceAll('##resultInfo.report##', (reportUrl || ''))
    text = text.replaceAll('##resultInfo.log##', (logUrl || ''))
    // console.log('text', text)
    return text
}