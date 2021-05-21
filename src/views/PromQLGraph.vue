<template>
  <div class="node-visualizer-wrapper row">
    <div class="col node-editor">
      <a-tabs v-model:activeKey="activeKey" type="card">
        <a-tab-pane key="1" tab="Table">
          <div class="tab-content">
            <div class="fade tab-pane active show">
              <div v-if="state === 'init'" class="fade alert alert-light show">Selected query is incomplete. To visualize it, please fill out the placeholders.</div>
              <div v-else-if="state === 'noQuery'" class="fade alert alert-light show">Select part of a query above to visualize it.</div>
              <div v-else>llll</div>
            </div>
          </div>
        </a-tab-pane>
        <a-tab-pane key="2" tab="Graph">
          <div class="tab-content">
            <div class="fade tab-pane active show">
              <div v-if="state === 'init'" class="fade alert alert-light show">Selected query is incomplete. To visualize it, please fill out the placeholders.</div>
              <div v-else-if="state === 'noQuery'" class="fade alert alert-light show">Select part of a query above to visualize it.</div>
              <div v-else>xxx</div>
            </div>
          </div>
        </a-tab-pane>
        <a-tab-pane key="3" tab="Explain">
          <div class="tab-content">
            <div class="fade tab-pane active show">
              <div v-if="state === 'init'" class="fade alert alert-secondary show">A placeholder node that needs to be filled out. </div>
              <div v-else-if="state === 'noQuery'" class="fade alert alert-light show">Select part of a query above to visualize it.</div>
              <div v-else>nnnnn</div>
            </div>
          </div>
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>

<script lang="ts">

import {reactive, ref, toRefs} from "vue";
import {graphData} from "@/utils/store";

export default {
  name: "PromQLGraph",
  props: [],
  components: {},
  setup(props: any) {
    console.log(props, 'matrix')
    const activeKey = ref('1')
    const state = reactive({
      data: graphData.data,
      state: graphData.state,
    })

    return {
      activeKey,
      ...toRefs(state),
    }
  }
}
</script>

<style scoped lang="less">
@import "../components/index.less";
</style>
