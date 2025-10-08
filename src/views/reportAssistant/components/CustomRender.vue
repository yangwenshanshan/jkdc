<script>
export default {
  name: 'RenderFunction',

  props: {
    myRender: {
      type: Function,
      required: true
    },

    params: {
      type: Object,
      default: () => ({})
    },

    context: {
      type: Object,
      default: () => ({})
    }
  },

  render(h) {
    try {
      const result = this.myRender(h, this.params, this.context);
      if (Array.isArray(result) && result.length === 1) {
        return result[0];
      }

      return result;
    } catch (error) {

      // 出错时显示错误信息
      return h('div', {
        class: 'render-error',
        style: {
          color: 'red',
          padding: '10px',
          border: '1px solid red',
          backgroundColor: '#ffe6e6'
        }
      }, `渲染错误: ${error.message}`);
    }
  }
}
</script>