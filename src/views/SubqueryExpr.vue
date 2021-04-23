<template>
  <div>
    <Expr :expr="subqueryExpr.expr" />
    <TreeCommon >
      <template v-slot:connector>
        <div class="ast-connector ast-connector-up" style="top: -4px"></div>
      </template>
      <template v-slot:innerText>
        [<span class="ast-duration">{{ subqueryExpr.duration }}</span>:<span class="ast-duration">1m</span>]
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
</template>

<script lang="ts">
import TreeCommon from '@/components/TreeCommon.vue'
import {defineAsyncComponent} from "vue";

export default {
  name: "SubqueryExpr",
  props: ['subqueryExpr'],
  components: {
    TreeCommon,
    Expr: defineAsyncComponent(() => import('./Expr.vue'))
  },
}
</script>

<style scoped>

</style>
