// 表格头部颜色字号
export function TableRowStyle({ row, column, rowIndex, columnIndex }) {
  return {
    background: "#E6EEFF",
    fontSize: "14px",
    color: "#333",
    height: "36px",
    fontWeight: "bold",
  };
}

export function TableRowStyleHide({ row, column, rowIndex, columnIndex }) {
  return {
    background: "#E6EEFF",
    fontSize: "14px",
    color: "#333",
    height: "36px",
    fontWeight: "bold",
    display: "none",
  };
}
export function TableRowStyleFixed({ row, column, rowIndex, columnIndex }) {
  return {
    background: "#E6EEFF",
    fontSize: "14px",
    color: "#333",
    height: "36px",
    fontWeight: "bold",
  };
}
export function TableRowStyle2({ row, column, rowIndex, columnIndex }) {
  return {
    background: "#f6f9ff",
    fontSize: "14px",
    color: "#2C60A4",
    height: "60px",
    fontWeight: "bold",
  };
}
export function TableRowStyle3({ row, column, rowIndex, columnIndex }) {
  return {
    background: "#E4EFFF",
    fontSize: "14px",
    color: "#333",
    height: "36px",
    fontWeight: "bold",
  };
}
export function TableRowStyle3Fixed({ row, column, rowIndex, columnIndex }) {
  return {
    background: "#f4f6fa",
    fontSize: "14px",
    color: "#727682",
    height: "36px",
    fontWeight: "normal",
  };
}
export function TableRowStyle4({ row, column, rowIndex, columnIndex }) {
  return {
    background: "#E6EEFF",
    fontSize: "14px",
    color: "#333",
    height: "36px",
    fontWeight: "bold",
  };
}
export function btnAuthFileter(btnId) {
  const userInfo = localStorage.getItem("agiles_user");
  let btnList = JSON.parse(userInfo).buttons;
  const hasVal = btnList.includes(btnId);
  return hasVal;
}

// 验证邮箱、密码、账号、中文
export function isValidEmail(email) {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}
//大小写和数字，8-20位
export function isValidPassWord(val) {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,20}$/;
  return passwordRegex.test(val);
}
//小写字符，可加数字
export function isValidAccount(account) {
  const accountRegex = /^(?=.*[a-z])[a-z0-9]{4,30}$/;
  return accountRegex.test(account);
}
//中文字符校验
export function isValidChinese(val) {
  const regex = /^[\u4e00-\u9fa5]{2,4}$/;
  return regex.test(val);
}

//验证编码格式：必须大写字母，可下划线分割，下划线不能连续、开头结尾
export function hasUppercaseAndUnderscore(str) {
  return /^[A-Z]+(?:_[A-Z]+)*$/.test(str);
}
//验证编码格式：必须小写字母，可下划线分割，下划线不能连续、开头结尾
export function hasLowercaseAndUnderscore(str) {
  return /^[a-z]+(?:_[a-z]+)*$/.test(str);
}
export function isValidEChar(val) {
  const char = /^[a-zA-Z]+$/;
  return char.test(val);
}
//只有中英文
export function isOnlyEnglishOrChinese(val) {
  const char = /^(?!_)(?!.*?_$)[a-zA-Z\u4e00-\u9fa5]+$/;
  return char.test(val);
}
//故事描述固定格式校验
export function isValidStoryDec(val) {
  const regex = /^(?=.*作为)(?=.*我希望)(?=.*以便).+$/;
  return regex.test(val);
}
//处理获取字典默认值
export function getDicDefaultVal(list) {
  let value = "";
  if (list && list.length > 0) {
    list.forEach((item) => {
      if (item.isDefault == 1) {
        value = item.value;
      }
    });
  }
  return value;
}
//版本号格式
export function isValidVersion(val) {
  const regex = /^\d+\.\d+\.\d+$/;
  return regex.test(val);
}
//处理字典值页面回显中文值
export function filterDicName(list, key) {
  let value = "";
  if (list && list.length > 0) {
    list.forEach((item) => {
      if (item.value == key) {
        value = item.name;
      }
    });
  }
  return value;
}
// export function setCookie(name,value,days){
//   var expires = ""
//   if(days){
//     var date = new Date()
//     date.setTime(date.getTime()+(days * 24 *60*60*1000))
//     expires = ";expires=" +date.toUTCString()
//   }
//   document.cookie = name+'='+(value || '')+expires+"; path=/"
// }
