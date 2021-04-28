<template>
<span>
  <TreeCommon >
    <template v-slot:innerText>
      <span>start query:</span>
    </template>
    <template v-slot:addExpr>
      <PlusOutlined @click="addExpr" class="ast-connector-plus ast-connector-plus-up" />
    </template>
    <template v-slot:connector>
      <div v-if="isLeft" class="ast-connector ast-connector-down" style="bottom: -80px"></div>
      <div v-else class="ast-connector ast-connector-up" style="top: -4px"></div>
    </template>
  </TreeCommon>
  <div class="ast-node">
    <Expr :expr="unknownExpr" @updateValue="updateValue" :showLeft="showLeft" :index="index" />
  </div>
</span>
</template>

<script lang="ts">
import TreeCommon from "@/components/TreeCommon.vue";
import {defineAsyncComponent} from "vue";
import {PlusOutlined} from "@ant-design/icons-vue";
export default {
  name: "UnknownExpr",
  props: ['unknownExpr', 'showLeft', 'isLeft', 'index'],
  emits: ['updateValue'],
  components: {
    PlusOutlined,
    TreeCommon,
    Expr: defineAsyncComponent(() => import('./Expr.vue'))
  },
  setup(props, content) {
    const addExpr = () => {
      const value = {
        unknownExpr: {
          unknownExpr: props.unknownExpr,
          showLeft: props.showLeft,
        }
      }
      content.emit('updateValue', [value, 'unknownExpr', props.index])
    }

    const updateValue = (value) => {
      const [v, str, index] = value
      const data = {
        [str]: v,
        showLeft: props.showLeft
      }
      console.log(data, 'unk')
      content.emit('updateValue', [data, str, index])
    }

    return {
      addExpr,
      updateValue,
    }
  }
}
</script>

<style scoped lang="less">
@import "../components/index.less";
</style>
