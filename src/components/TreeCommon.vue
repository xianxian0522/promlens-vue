<template>
<div ref="childRef">
  <slot name="nodeLeftChild"></slot>
  <div class="ast-node-inner-wrapper">
    <slot name="connector"></slot>
<!--    <div class="ast-connector ast-connector-up" style="top: -4px"></div>-->
<!--    <PlusOutlined @click="addExpr" class="ast-connector-plus ast-connector-plus-up" />-->
    <slot name="addExpr"></slot>
    <div class="ast-node-inner ast-node-inner-tree-view" style="opacity: 1;">
      <div class="ast-node-inner-top">
        <div class="ast-node-inner-text">
<!--          [<span class="ast-duration">1h</span>: <span class="ast-duration">1m</span>]-->
          <slot name="innerText"></slot>
        </div>
        <a-button @click="isShowFormClick" class="ast-node-inner-action-btn btn btn-outline-secondary btn-sm">
          <SwapOutlined />Form
        </a-button>
        <a-button class="ast-node-inner-action-btn btn btn-outline-secondary btn-sm">
          <EditOutlined />PromQL
        </a-button>
      </div>
      <FormCommon v-if="isShowForm" />
    </div>
    <div class="ast-node-infos">
      <div class="ast-node-query-info">
        <span class="ast-node-stats">
          <slot name="infoLabel"></slot>
<!--          16 results - 91ms - -->
<!--          <div class="ast-node-label-stats">-->
<!--            <span class="ast-label-name" style="color: green;">host</span>-->
<!--            :16,-->
<!--          </div>-->
<!--          <div class="ast-node-label-stats">-->
<!--            <span class="ast-label-name" style="color: green;">instance</span>-->
<!--            :16,-->
<!--          </div>-->
        </span>
      </div>
    </div>
  </div>
  <slot name="nodeRightChild"></slot>
<!--  <div class="ast-node">-->
<!--  </div>-->
</div>
</template>

<script lang="ts">
import {PlusOutlined, SwapOutlined, EditOutlined} from '@ant-design/icons-vue'
import FormCommon from "@/components/FormCommon.vue";
import {defineAsyncComponent, inject, onMounted, ref, watch} from "vue";

export default {
  name: "TreeCommon",
  components: {
    // PlusOutlined,
    SwapOutlined,
    EditOutlined,
    FormCommon: defineAsyncComponent(() => import('./FormCommon.vue')),
  },
  props: ['showLeft', 'updateValue'],
  setup(props, content) {
    const isShowForm = ref(false)
    const childRef = ref()

    const formValue = inject('exprChange')
    // const addExpr = () => {
    //   console.log('aa add child', formValue, props.showLeft)
    //   const value = {
    //     unknownExpr: formValue,
    //     showLeft: props.showLeft
    //   }
    //   console.log(value, 'value unknown')
    //   content.emit('updateValue', [value, 'unknownExpr'])
    // }
    const isShowFormClick = (r) => {
      isShowForm.value = !isShowForm.value
      // console.log(childRef.value.offsetHeight, 'refchild', childRef.value.clientHeight)
    }
    onMounted(() => {

    })

    return {
      childRef,
      isShowForm,
      // addExpr,
      isShowFormClick,
    }
  }
}
</script>

<style scoped lang="less">
@import "index.less";
</style>
