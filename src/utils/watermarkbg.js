import { ref, computed } from "vue";

/**
 * 创建水印背景图片的 composable 函数
 * @param {Object} options - 水印配置选项
 * @param {string} options.text - 水印文字内容
 * @param {number} options.fontSize - 字体大小
 * @param {number} options.gap - 水印间隔
 * @param {string} options.color - 文字颜色，默认为半透明灰色
 * @param {number} options.rotate - 旋转角度，默认为 -15 度
 * @param {string} options.fontFamily - 字体，默认为 Arial
 * @returns {Object} 返回包含 base64 和 size 的响应式对象
 */
function useWaterMarkBg(options = {}) {
  // 默认参数
  const defaultOptions = {
    text: "版权所有",
    fontSize: 25,
    gap: 20,
    color: "rgba(201, 35, 35, 0.5)",
    rotate: -20,
    fontFamily: "Arial, sans-serif",
  };

  // 合并用户参数和默认参数
  const waterMarkOptions = ref({ ...defaultOptions, ...options });

  // 计算水印尺寸和 base64 图片
  const waterMarkInfo = computed(() => {
    const { text, fontSize, gap, color, rotate, fontFamily } =
      waterMarkOptions.value;

    // 创建 canvas 元素
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      throw new Error("无法获取 canvas 上下文");
    }

    // 设置字体
    ctx.font = `${fontSize}px ${fontFamily}`;

    // 获取文字宽度
    const textWidth = ctx.measureText(text).width;

    // 计算 canvas 尺寸（包含文字和间隙）
    const width = textWidth + gap * 2;
    const height = fontSize * 2 + gap * 2;

    canvas.width = width;
    canvas.height = height;

    // 重置上下文（因为 canvas 尺寸改变了）
    ctx.font = `${fontSize}px ${fontFamily}`;
    ctx.fillStyle = color;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // 保存当前状态
    ctx.save();

    // 移动到 canvas 中心并旋转
    ctx.translate(width / 2, height / 2);
    ctx.rotate((Math.PI / 180) * rotate);

    // 绘制文字
    ctx.fillText(text, 0, 0);

    // 恢复之前的状态
    ctx.restore();

    // 转换为 base64
    const base64 = canvas.toDataURL("image/png");

    return {
      base64,
      size: {
        width,
        height,
      },
    };
  });

  // 如果传入的 options 发生变化，可以更新水印
  function updateOptions(newOptions) {
    waterMarkOptions.value = { ...waterMarkOptions.value, ...newOptions };
  }

  return {
    value: waterMarkInfo,
    updateOptions,
  };
}

export default useWaterMarkBg;
