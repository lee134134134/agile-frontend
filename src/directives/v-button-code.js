/**
 * 按钮权限指令 v-button-code
 * @description 根据用户的 buttons 控制元素显示（如 demand_add 等按钮权限）
 * @example
 * v-button-code="['demand_add']" // 拥有 demand_add 权限可见
 * v-button-code="['demand_add', 'demand_edit']" // 拥有任一权限可见
 */
export default {
  mounted(el, binding) {
    const { value } = binding;

    // 如果没有传入值，不做处理
    if (!value) {
      return;
    }

    const userStr = localStorage.getItem('agiles_user');

    // 如果没有用户信息，隐藏元素
    if (!userStr) {
      el.parentNode && el.parentNode.removeChild(el);
      return;
    }

    try {
      const user = JSON.parse(userStr);
      // 获取用户的 buttons
      const buttons = user.buttons || [];

      if (value instanceof Array && value.length > 0) {
        // 只要命中其中任何一个 button，就视为有权限
        const hasPermission = buttons.some(btn => {
          return value.includes(btn);
        });

        if (!hasPermission) {
          el.parentNode && el.parentNode.removeChild(el);
        }
      } else {
        console.warn('v-button-code need array! Like v-button-code="[\'demand_add\',\'demand_edit\']"');
      }
    } catch (e) {
      console.error('v-button-code error:', e);
    }
  }
};
