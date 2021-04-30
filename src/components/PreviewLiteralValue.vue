<template>
<span>
  <span class="ast-number" v-if="Number(preview)">{{ preview }}</span>
  <span class="ast-string" v-else >"{{ preview }}"</span>
</span>
</template>

<script lang="ts">
export default {
  name: "PreviewLiteralValue",
  props: ['preview'],
  setup() {

  },
}
</script>

<style scoped lang="less">
@import "index.less";
</style>
