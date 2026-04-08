import debounce from 'lodash/debounce';

const resizeDirective = {
  bind(el, binding) {
    const { value, modifiers } = binding;

    // 检查是否提供了回调函数
    if (typeof value !== 'function') {
      console.warn('v-resize 指令需要接收一个函数');
      return;
    }

    // 配置参数
    const delay = binding.arg ? parseInt(binding.arg) : 200; // 从指令参数获取延迟时间，默认200ms
    
    // 通过修饰符确定监听类型，默认监听宽度
    const watchWidth = !modifiers.height; // 没有 height 修饰符就监听宽度
    const watchHeight = modifiers.height; // 有 height 修饰符就监听高度
    const watchBoth = modifiers.both; // 有 both 修饰符就同时监听

    // 存储上一次的尺寸
    let lastWidth = el.offsetWidth;
    let lastHeight = el.offsetHeight;

    // 创建防抖处理函数
    const debouncedHandler = debounce(function (entries) {
      const entry = entries[0];
      const { width, height } = entry.contentRect;
      
      // 检查尺寸是否发生变化
      const widthChanged = width !== lastWidth;
      const heightChanged = height !== lastHeight;
      
      // 根据修饰符决定是否触发回调
      let shouldTrigger = false;
      
      if (watchBoth && (widthChanged || heightChanged)) {
        shouldTrigger = true;
      } else if (watchWidth && widthChanged) {
        shouldTrigger = true;
      } else if (watchHeight && heightChanged) {
        shouldTrigger = true;
      }
      
      if (shouldTrigger) {
        value({ width, height, entry, widthChanged, heightChanged });
      }
      
      // 更新上一次的尺寸
      lastWidth = width;
      lastHeight = height;
    }, delay);

    // 创建 ResizeObserver 实例
    const observer = new ResizeObserver(debouncedHandler);

    // 开始观察元素
    observer.observe(el);

    // 将 observer 和相关信息存储在元素上
    el._resizeObserver = observer;
    el._debouncedHandler = debouncedHandler;
    el._lastWidth = lastWidth;
    el._lastHeight = lastHeight;
  },

  unbind(el) {
    // 清理工作
    if (el._resizeObserver) {
      el._resizeObserver.disconnect();
      delete el._resizeObserver;
    }

    if (el._debouncedHandler) {
      el._debouncedHandler.cancel();
      delete el._debouncedHandler;
    }
    
    delete el._lastWidth;
    delete el._lastHeight;
  }
};

export default resizeDirective;