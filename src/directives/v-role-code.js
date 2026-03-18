/**
 * 角色代码指令 v-role-code
 * @description 根据用户的 rolesCode 控制元素显示（如 PO, BRA 等角色）
 * @example
 * v-role-code="['PO']" // PO 角色可见
 * v-role-code="['PO', 'BRA']" // PO 或 BRA 角色可见
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
      // 获取用户的 rolesCode
      const rolesCode = user.rolesCode || [];

      if (value instanceof Array && value.length > 0) {
        // 只要命中其中任何一个 rolesCode，就视为有权限
        const hasPermission = rolesCode.some(code => {
          return value.includes(code);
        });

        if (!hasPermission) {
          el.parentNode && el.parentNode.removeChild(el);
        }
      } else {
        console.warn('v-role-code need array! Like v-role-code="[\'PO\',\'BRA\']"');
      }
    } catch (e) {
      console.error('v-role-code error:', e);
    }
  }
};
