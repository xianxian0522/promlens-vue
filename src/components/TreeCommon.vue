<template>
<div ref="childRef" >
  <slot name="nodeLeftChild"></slot>
  <div class="ast-node-inner-wrapper">
<!--    <slot name="connector"></slot>-->
    <div v-if="!outermost">
      <div v-if="isLeft" class="ast-connector ast-connector-down" :style="{bottom: '-' + heightBottom + 'px'}"></div>
      <div v-else class="ast-connector ast-connector-up" style="top: -4px"></div>
    </div>
<!--    <PlusOutlined @click="addExpr" class="ast-connector-plus ast-connector-plus-up" />-->
    <slot name="addExpr"></slot>
    <div class="ast-node-inner ast-node-inner-tree-view" style="opacity: 1;">
      <div class="ast-node-inner-top">
        <div class="ast-node-inner-text">
          <slot name="innerText"></slot>
        </div>
        <a-button @click.stop="isShowFormClick" class="ast-node-inner-action-btn btn btn-outline-secondary btn-sm">
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
        <div class="ast-node-stats" style="display: inline-block">
<!--          <slot name="infoLabel"></slot>-->
          <div style="display: inline-block" v-if="data.status === 'success'">
            <div style="display: inline-block" v-if="!data.isLoading">
              <div style="display: inline-block" v-if="data.resultType === 'vector'">
                {{ data.data.length }} results - 91ms -
                <div class="ast-node-label-stats" v-for="(item, index) in data.keyInfo" :key="index">
                  <span class="ast-label-name" style="color: green;">{{ item.name }}</span>
                  :{{ item.value }},
                </div>
              </div>
            </div>
            <span v-else><a-spin /></span>
          </div>
          <div style="display: inline-block" v-else>
            <span v-if="!data.isLoading">
              <span v-if="data.status === 'error'">
                <span class="ast-query-icon"></span>
                <span class="ast-node-query-error-message">Error executing query:{{ data.error }}</span>
              </span>
            </span>
            <span v-else><a-spin /></span>
          </div>
        </div>
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
import {queryData} from "@/api/promRepository";

export default {
  name: "TreeCommon",
  components: {
    // PlusOutlined,
    SwapOutlined,
    EditOutlined,
    FormCommon: defineAsyncComponent(() => import('./FormCommon.vue')),
  },
  props: ['showLeft', 'updateValue', 'outermost', 'isLeft' ],
  emits: ['nodeRefHeight'],
  setup(props, content) {
    const data = ref(queryData)

    const isShowForm = ref(false)
    const childRef = ref()
    const heightBottom = ref(36)

    const formValue: any = inject('exprChange')
    // const addExpr = () => {
    //   console.log('aa add child', formValue, props.showLeft)
    //   const value = {
    //     unknownExpr: formValue,
    //     showLeft: props.showLeft
    //   }
    //   console.log(value, 'value unknown')
    //   content.emit('updateValue', [value, 'unknownExpr'])
    // }

    const queryInfo = async () => {
      console.log(formValue(), 'expr change')
    }

    const isShowFormClick = (r) => {
      isShowForm.value = !isShowForm.value

      // setTimeout(() => content.emit('nodeRefHeight'), 0)
    }
    onMounted(() => {
      watch(isShowForm, () => {
        setTimeout(() => {
          // heightBottom.value = childRef.value.offsetHeight + 80
          heightBottom.value = childRef.value.offsetHeight
          console.log(childRef.value.offsetHeight, 'setTimeout',)
        }, 100)
      })
    })

    return {
      data,
      heightBottom,
      childRef,
      isShowForm,
      // addExpr,
      isShowFormClick,
      queryInfo,
    }
  }
}
</script>

<style scoped lang="less">
@import "index.less";
</style>
