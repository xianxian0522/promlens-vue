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
      <PreviewBinary :preview="binaryExpr" :leftPreview="binaryExpr.left" :rightPreview="binaryExpr.right" />
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
  props: ['binaryExpr', 'index', 'outermost'],
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
      const [v, str, index] = value
      // let data = {
      //   left: props.binaryExpr.left,
      //   operator: props.binaryExpr.operator,
      //   right: props.binaryExpr.right,
      //   binModifiers: props.binaryExpr.binModifiers,
      // }
      const data = props.binaryExpr
      if (v && v.showLeft || v[str] && v[str].showLeft || v.unknownExpr && v.unknownExpr.showLeft) {
        data.left = v;
      } else {
        data.right = v;
      }
      console.log(v, str, data, '+++++++update binary')
      content.emit('updateValue', [data, 'binaryExpr', index])
    }

    const addExpr = () => {
      // const value = {
      //   unknownExpr: {
      //     binaryExpr: {
      //       left: props.binaryExpr.left,
      //       operator: props.binaryExpr.operator,
      //       right: props.binaryExpr.right,
      //       binModifiers: props.binaryExpr.binModifiers,
      //     }
      //   }
      // }
      const value = {
        // binaryExpr: {
        //   left: props.binaryExpr.left,
        //   operator: props.binaryExpr.operator,
        //   right: props.binaryExpr.right,
        //   binModifiers: props.binaryExpr.binModifiers,
        // }
        binaryExpr: props.binaryExpr
      }
      content.emit('updateValue', [value, 'unknown', props.index])
    }

    return {
      // preview,
      updateValue,
      addExpr,
    }
  },
}
</script>

<style scoped lang="less">
@import "../components/index.less";
</style>
