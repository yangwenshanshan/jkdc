import debounce from 'lodash/debounce';


const resizeDirective = {
  bind(el, binding) {
    const { value } = binding;

    // 检查是否提供了回调函数
    if (typeof value !== 'function') {
      console.warn('v-resize 指令需要接收一个函数');
      return;
    }

    // 配置参数
    const delay = binding.arg ? parseInt(binding.arg) : 200; // 从指令参数获取延迟时间，默认200ms
    const options = binding.modifiers || {}; // 其他配置可以通过修饰符传递

    // 创建防抖处理函数
    const debouncedHandler = debounce(function (entries) {
      const entry = entries[0];
      const { width, height } = entry.contentRect;
      value({ width, height, entry });
    }, delay, options);

    // 创建 ResizeObserver 实例
    const observer = new ResizeObserver(debouncedHandler);

    // 开始观察元素
    observer.observe(el);

    // 将 observer 存储在元素上，以便在 unbind 时使用
    el._resizeObserver = observer;
    el._debouncedHandler = debouncedHandler;
  },

  unbind(el) {
    // 清理工作
    if (el._resizeObserver) {
      el._resizeObserver.disconnect();
      delete el._resizeObserver;
    }

    if (el._debouncedHandler) {
      el._debouncedHandler.cancel(); // 取消 lodash 防抖函数的待执行操作
      delete el._debouncedHandler;
    }
  }
};

export default resizeDirective;