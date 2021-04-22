<template>
<div>
  <div>
    <Expr :expr="matrixSelector.expr" />
<!--    <div>[ {{matrixSelector.duration}} ]</div>-->
    <TreeCommon >
      <template v-slot:innerText>
        [<span class="ast-duration">{{ matrixSelector.duration }}</span>:<span class="ast-duration">1m</span>]
      </template>
      <template v-slot:infoLabel>
        16 results - 91ms -
        <div class="ast-node-label-stats">
          <span class="ast-label-name" style="color: green;">host</span>
          :16,
        </div>
        <div class="ast-node-label-stats">
          <span class="ast-label-name" style="color: green;">instance</span>
          :16,
        </div>
      </template>
    </TreeCommon>
  </div>
</div>
</template>

<script lang="ts">
import {defineAsyncComponent} from "vue";
import TreeCommon from "@/components/TreeCommon.vue";

export default {
  name: "MatrixSelector",
  props: ['matrixSelector'],
  components: {
    TreeCommon,
    Expr: defineAsyncComponent(() => import('./Expr.vue'))
  },
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
