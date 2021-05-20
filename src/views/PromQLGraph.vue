<template>
  <div class="node-visualizer-wrapper row">
    <div class="col">

    </div>
  </div>
</template>

<script lang="ts">

export default {
  name: "MatrixSelector",
  props: ['matrixSelector'],
  components: {},
  setup(props: any) {
    console.log(props, 'matrix')

    return {

    }
  }
}
</script>

<style scoped lang="less">
@import "../components/index.less";
</style>
