<template>
<span>
  <TreeCommon>
    <template v-slot:innerText>
      <span>start query:</span>
    </template>
    <template v-slot:connector>
      <div v-if="isLeft" class="ast-connector ast-connector-down" style="bottom: -80px"></div>
      <div v-else class="ast-connector ast-connector-up" style="top: -4px"></div>
    </template>
  </TreeCommon>
  <div class="ast-node">
    <Expr :expr="unknownExpr" @updateValue="updateValue" />
  </div>
</span>
</template>

<script lang="ts">
import TreeCommon from "@/components/TreeCommon.vue";
import {defineAsyncComponent} from "vue";
export default {
  name: "UnknownExpr",
  props: ['unknownExpr', 'isLeft'],
  emits: ['updateValue'],
  components: {
    TreeCommon,
    Expr: defineAsyncComponent(() => import('./Expr.vue'))
  },
  setup(props, content) {
    const updateValue = (value) => {
      const [v, str] = value
      const data = {
        [str]: v
      }
      console.log(data, 'unk')
      content.emit('updateValue', [data, 'unknownExpr'])
    }

    return {
      updateValue,
    }
  }
}
</script>

<style scoped lang="less">
@import "../components/index.less";
</style>
