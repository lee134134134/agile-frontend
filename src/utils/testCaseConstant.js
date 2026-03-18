export const testCaseConstant = {
    // 设置项表格列
    SettingColumns: [
        {
            label: '名称',
            prop: 'name',
            isSelect: true,
            width: '200',
        },
        {
            label: '描述',
            prop: 'description',
            isSelect: true,
            width: '300',
        },
    ],
    VariableColumns: [
        {
            label: '名称',
            prop: 'name',
            isSelect: true,
            width: '120',
        },
        {
            label: '描述',
            prop: 'description',
            isSelect: true,
            width: '200',
        },
        {
            label: '默认值',
            prop: 'varDefaultVal',
            isSelect: true,
            width: '120',
        },
        {
            label: '作用域',
            prop: 'varScopeType',
            isSelect: true,
            width: '120',
        },
    ],
    KeywordColumns: [
        {
            label: '名称',
            prop: 'name',
            isSelect: true,
            width: '120',
        },
        {
            label: '参数',
            prop: 'kwParameters',
            isSelect: true,
            width: '200',
        },
        {
            label: '所属库名',
            prop: 'libraryName',
            isSelect: true,
            width: '120',
        },
    ]
}

export const getEleTabType = (tabVal) => {
    let typeName
    if(tabVal == 1) {
        typeName = 'setting'
    }else if(tabVal == 2) {
        typeName = 'variable'
    }else if(tabVal == 3) {
        typeName = 'keyword'
    }else if(tabVal == 4) {
        typeName = 'tag'
    }
    return typeName
} 