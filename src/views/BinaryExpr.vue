<template>
  <TreeCommon >
    <template v-slot:addExpr>
      <PlusOutlined @click="addExpr" class="ast-connector-plus ast-connector-plus-up" />
    </template>
    <template v-slot:nodeLeftChild>
      <div class="ast-node">
        <Expr :expr="binaryExpr.left" :isLeft="true" :showLeft="true" @updateValue="updateValue" :index="index" />
      </div>
    </template>
    <template v-slot:innerText>
      <PreviewBinary :preview="preview" :leftPreview="binaryExpr.left" :rightPreview="binaryExpr.right" />
<!--      <div>{{ binaryExpr.operator }}</div>-->
    </template>
    <template v-slot:nodeRightChild>
      <div class="ast-node">
        <Expr :expr="binaryExpr.right" @updateValue="updateValue" :index="index" />
      </div>
    </template>
  </TreeCommon>
</template>

<script lang="ts">
import {defineAsyncComponent, inject, provide} from "vue";
import TreeCommon from "@/components/TreeCommon.vue";
import PreviewBinary from "@/components/PreviewBinary.vue";
import {PlusOutlined} from "@ant-design/icons-vue";

export default {
  name: "BinaryExpr",
  props: ['binaryExpr', 'index'],
  components: {
    PlusOutlined,
    TreeCommon,
    PreviewBinary,
    Expr: defineAsyncComponent(() => import('./Expr.vue'))
  },
  emits: ['updateValue'],
  setup(props: any, content) {
    // console.log(props, 'binary')

    const preview = {
      operator: props.binaryExpr?.operator || '/',
      switchOpen: !!props.binaryExpr?.binModifiers,
      matchOn: props.binaryExpr?.binModifiers?.OnOrIgnoring.Ignoring ? 'ignoring' : 'on',
      ComparisonBehavior: props.binaryExpr?.binModifiers?.Bool ? 'bool' : 'filter',
      ignoreLabels: props.binaryExpr?.binModifiers?.OnOrIgnoring.On || props.binaryExpr?.binModifiers?.OnOrIgnoring.Ignoring,
      matchType: props.binaryExpr?.binModifiers?.group.GroupLeft ? 'many-to-one' : props.binaryExpr?.binModifiers?.group.GroupRight ? 'one-to-many' : 'one-to-one',
      includeLabels: props.binaryExpr?.binModifiers?.group.GroupRight || props.binaryExpr?.binModifiers?.group.GroupLeft,
    }

    const updateValue = (value) => {
      console.log(value, 'binary', props)
      const [v, str] = value
      let data = {
        left: props.binaryExpr.left,
        operator: props.binaryExpr.operator,
        right: props.binaryExpr.right,
      }
      if (v && v.showLeft || v[str] && v[str].showLeft) {
        data.left = v;
      } else {
        data.right = v;
      }
      content.emit('updateValue', [data, 'binaryExpr', props.index])
    }

    const addExpr = () => {
      const value = {
        unknownExpr: {
          binaryExpr: {
            left: props.binaryExpr.left,
            operator: props.binaryExpr.operator,
            right: props.binaryExpr.right,
          }
        }
      }
      content.emit('updateValue', [value, 'unknownExpr'])
    }

    return {
      preview,
      updateValue,
      addExpr,
    }
  },
}
</script>

<style scoped lang="less">
@import "../components/index.less";
</style>
