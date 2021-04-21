<template>
<div>
  <div>
    <span>{{vectorSelector.metricIdentifier}}</span>
    <span> { </span>
    <span v-for="(vector, index) in vectorSelector.labelMatchers" :key="index">
      {{ vector.labelName }} {{vector.matchOp}} {{vector.labelValue}},
      </span>
    <span> } </span>
  </div>
</div>
</template>

<script lang="ts">
export default {
  name: "VectorSelector",
  props: ['vectorSelector'],
  components: {

  },
  setup(props: any) {
    console.log(props, 've')

    return {

    }
  }
}
</script>

<style scoped lang="less">
@import "../components/index.less";
</style>
