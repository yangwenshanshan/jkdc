<template>
  <div class="progress">
    <div class="name">{{name}}</div>
    <div class="circle">
      <svg
        :width="options.width"
        :height="options.width"
        :viewbox="'0 0 '+ options.width + ' ' + options.width"
      >
        <circle
          :cx="options.radius"
          :cy="options.radius"
          :r="options.radius - options.strokeWidth / 2"
          :stroke-width="options.strokeWidth"
          :stroke="options.bgColor"
          fill="none"
        />
        <circle
          :cx="options.radius"
          :cy="options.radius"
          :r="options.radius - options.strokeWidth / 2"
          :stroke-width="options.strokeWidth"
          :stroke="options.color"
          fill="none"
          :transform="'matrix(-1,0,0,1,'+ options.width +',0) rotate(-90,'+ options.radius +',' +  options.radius+ ') '"
          :stroke-dasharray="options.perimeter * options.percent +' '+ options.perimeter * (1 - options.percent)"
        />
      </svg>
      <div class="val">
        <div style="margin-bottom: 5px;text-align: center;">{{val}}张</div>
        <div class="total">{{total}}张</div>
      </div>
      <div class="percent">{{(options.percent * 100).toFixed(2) + '%'}}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Progress',
  props: ['option', 'val', 'total', 'name', 'bgColor', 'color', 'text'],
  data: function () {
    return {
      options: {
        width: 134,
        strokeWidth: 16,
        bgColor: '#CEEAE8',
        color: '#09958D',
        radius: 34,
        percent: 0,
        perimeter: 100,
      },
    }
  },
  watch: {
    val() {
      this.init()
    },
  },
  methods: {
    init() {
      let options = Object.assign({}, this.options, this.option)
      options.radius = this.options.width / 2
      options.percent = this.val / this.total
      options.perimeter =
        Math.PI * 2 * (options.radius - options.strokeWidth / 2)
      // options.perimeter = Math.PI * 2 * options.radius;
      options.bgColor = this.bgColor || options.bgColor
      options.color = this.color || options.color
      options.text = this.text || options.text
      this.options = options
    },
    click() {
      this.$emit('click')
    },
  },
  mounted() {
    this.init()
  },
}
</script>

<style scoped lang="scss">
.progress {
  position: relative;
}

.circle {
  // position: relative;
  // // display: flex;
  // align-items: center;
  // justify-content: center;
  // cursor: pointer;

  &:hover .percent {
    opacity: 1;
  }
}

circle {
  transition: all 0.25s ease-out;
}

.name {
  margin-bottom: 20px;
  width: 100%;
  text-align: center;
  font-size: 16px;
}

.val {
  width: 80px;
  position: absolute;
  font-size: 20px;
  color: #ec9b44;
  left: 27px;
  top: 75px;
}
.percent {
  position: absolute;
  background: rgba(0, 0, 0, 0.6);
  padding: 6px 10px;
  border-radius: 4px;
  left: -20px;
  top: 0;
  color: #fff;
  opacity: 0;
  transition: 0.25s;
}
.total {
  color: #333;
  border-top: 1px solid #ccc;
  text-align: center;
  padding-top: 5px;
  line-height: 1;
}
</style>
