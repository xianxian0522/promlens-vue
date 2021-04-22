<template>
<div>
  <div class="ast-node-inner-wrapper">
    <div class="ast-connector ast-connector-up" style="top: -4px"></div>
    <PlusOutlined class="ast-connector-plus ast-connector-plus-up" />
    <div class="ast-node-inner ast-node-inner-tree-view" style="opacity: 1;">
      <div class="ast-node-inner-top">
        <div class="ast-node-inner-text">
<!--          [<span class="ast-duration">1h</span>: <span class="ast-duration">1m</span>]-->
          <slot name="innerText"></slot>
        </div>
        <a-button class="ast-node-inner-action-btn btn btn-outline-secondary btn-sm">
          <SwapOutlined />Form
        </a-button>
        <a-button class="ast-node-inner-action-btn btn btn-outline-secondary btn-sm">
          <EditOutlined />PromQL
        </a-button>
      </div>
<!--      表单-->
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
<!--  <div class="ast-node">-->
<!--  </div>-->
</div>
</template>

<script lang="ts">
import {PlusOutlined, SwapOutlined, EditOutlined} from '@ant-design/icons-vue'

export default {
  name: "TreeCommon",
  components: {
    PlusOutlined,
    SwapOutlined,
    EditOutlined,
  },
  setup() {

  }
}
</script>

<style scoped lang="less">
@import "index.less";
</style>
