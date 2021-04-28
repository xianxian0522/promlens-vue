<template>
  <div>
<!--    <Expr :expr="subqueryExpr.expr" />-->
    <TreeCommon >
      <template v-slot:connector>
        <div v-if="isLeft" class="ast-connector ast-connector-down" style="bottom: -80px"></div>
        <div v-else class="ast-connector ast-connector-up" style="top: -4px"></div>
      </template>
      <template v-slot:addExpr>
        <PlusOutlined @click="addExpr" class="ast-connector-plus ast-connector-plus-up" />
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
import {PlusOutlined} from "@ant-design/icons-vue";

export default {
  name: "SubqueryExpr",
  props: ['subqueryExpr', 'isLeft', 'showLeft', 'index'],
  components: {
    TreeCommon,
    PlusOutlined,
    // Expr: defineAsyncComponent(() => import('./Expr.vue'))
  },
  emits: ['updateValue'],
  setup(props, content) {
    const addExpr = () => {
      const value = {
        unknownExpr: {
          subqueryExpr: props.subqueryExpr,
          showLeft: props.showLeft,
        }
      }
      content.emit('updateValue', [value, 'unknownExpr'])
    }

    return {
      addExpr,
    }
  }
}
</script>

<style scoped>

</style>
