<template>
  <div class="node-visualizer-wrapper row">
    <div class="col node-editor">
      <a-tabs v-model:activeKey="activeKey" type="card">
        <a-tab-pane key="1" tab="Table">
          <TabPaneTable />
<!--          <div class="tab-content">-->
<!--            <div class="fade tab-pane active show">-->
<!--              <div v-if="state === 'init'" class="fade alert alert-light show">Selected query is incomplete. To visualize it, please fill out the placeholders.</div>-->
<!--              <div v-else-if="state === 'noQuery'" class="fade alert alert-light show">Select part of a query above to visualize it.</div>-->
<!--              <div v-else>-->
<!--                <div class="table-controls">-->
<!--                  <a-date-picker v-model:value="startTime" format="YYYY-MM-DD HH:mm:ss" show-time placeholder="Select Time" @ok="selectTime" @change="changeTime" />-->
<!--                </div>-->
<!--                <div v-if="loadingState === 'success'">-->
<!--                  <div v-if="data.length === 0" class="fade alert alert-secondary show">Empty query result.</div>-->
<!--                  <div v-else>[[[[</div>-->
<!--                </div>-->
<!--                <div v-else-if="loadingState === 'load'" class="fade alert alert-secondary show ">Loading...</div>-->
<!--                <div v-else class="fade parse-error alert alert-danger show">Error:</div>-->
<!--              </div>-->
<!--            </div>-->
<!--          </div>-->
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

import {onBeforeUnmount, onMounted, reactive, ref, toRefs, watch} from "vue";
import {graphData} from "@/utils/store";
import bus from "@/utils/bus";
import promRepository from "@/api/promRepository";
import moment, {Moment} from "moment";
import TabPaneTable from "@/components/TabPaneTable.vue";

export interface QueryParams {
  query: string;
  time?: number;
}

export default {
  name: "PromQLGraph",
  props: [],
  components: {TabPaneTable},
  setup(props: any) {
    const activeKey = ref('1')
    const state = reactive({
      data: graphData.data,
      state: graphData.state,
      loadingState: 'success',
      time: 0,
    })
    const startTime = ref<Moment>()

    const queryGraphData = async (value) => {
      state.loadingState = 'load'
      const params: QueryParams = {
        query: value,
      }
      if (state.time) {
        params.time = state.time
      }
      console.log(params, 'qqqqq')
      try {
        const data = await promRepository.queryDataAll(params)
        if (data.status === 'success') {
          state.loadingState = 'success'
          graphData.state = 'data'
          graphData.data = data.data.result
        } else {
          state.loadingState = 'error'
        }
      } catch (e) {
        state.loadingState = 'error'
        console.error(e)
      }
    }

    const selectTime = (value: Moment) => {
      state.time = moment(value).valueOf()
      console.log(state.time, '[[[[', value)
    }

    const changeTime = (value: Moment) => {
      if (!value) {
        state.time = 0
      }
    }

    watch(() => graphData.state, () => {
      state.state = graphData.state
      state.data = graphData.data
    })

    return {
      startTime,
      activeKey,
      ...toRefs(state),
      // selectTime,
      // changeTime,
    }
  }
}
</script>

<style scoped lang="less">
@import "../components/index.less";
</style>
