<template>
  <div class="tab-content">
    <div class="fade tab-pane active show">
      <div v-if="state === 'init'" class="fade alert alert-light show">Selected query is incomplete. To visualize it, please fill out the placeholders.</div>
      <div v-else-if="state === 'noQuery'" class="fade alert alert-light show">Select part of a query above to visualize it.</div>
      <div v-else>
        <div class="table-controls">
          <a-date-picker v-model:value="startTime" format="YYYY-MM-DD HH:mm:ss" show-time placeholder="Select Time" @ok="selectTime" @change="changeTime" />
        </div>
        <div v-if="loadingState === 'success'">
          <div v-if="data.length === 0" class="fade alert alert-secondary show">Empty query result.</div>
          <div v-else style="overflow-x: auto;">
            <table class="data-table table table-sm table-bordered table-hover">
              <thead>
              <tr>
                <th>Series</th>
                <th>Value</th>
              </tr>
              </thead>
              <tbody>
              <template v-if="resultType === 'vector'">
                <tr v-for="(item, index) in data" :key="JSON.stringify(item) + index">
                  <td>
                    <span class="promql-code" v-if="item?.metric">
                      <span class="promql-metric-name">{{item?.metric?.__name__}}</span>
                      <span v-if="getItemMetric(item.metric).length > 0">
                        <span class="promql-brace">{</span>
                        <span v-for="(t, i) in getItemMetric(item.metric)" :key="t.name">
                          <span class="promql-label-name">{{t.name}}</span>=
                          <span class="promql-string">"{{t.value}}"</span>
                          <span v-if="getItemMetric(item.metric).length >1 && i !== (getItemMetric(item.metric).length - 1) ">,</span>
                        </span>
                        <span class="promql-brace">}</span>
                      </span>
                    </span>
                  </td>
                  <td>{{ item.value[1] }}</td>
                </tr>
              </template>
              <template v-else>
                <tr>
                  <td>{{ resultType }}</td>
                  <td>{{ data[1] }}</td>
                </tr>
              </template>
              </tbody>
            </table>
          </div>
        </div>
        <div v-else-if="loadingState === 'load'" class="fade alert alert-secondary show ">Loading...</div>
        <div v-else class="fade parse-error alert alert-danger show">Error:</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {onBeforeUnmount, onMounted, reactive, ref, toRefs, watch} from "vue";
import {graphData} from "@/utils/store";
import moment, {Moment} from "moment";
import promRepository from "@/api/promRepository";
import bus from "@/utils/bus";

export interface QueryParams {
  query: string;
  time?: number;
}

export default {
  name: "TabPaneTable",
  setup() {
    const state = reactive({
      data: graphData.data,
      state: graphData.state,
      loadingState: 'success',
      time: 0,
      resultType: graphData.resultType,
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
          graphData.data = data.data.result
          graphData.resultType = data.data.resultType
          graphData.state = 'data'
          state.loadingState = 'success'
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
    }

    const changeTime = (value: Moment) => {
      if (!value) {
        state.time = 0
      }
    }
    const getItemMetric = (item) => {
      const arr: any = []
      Object.keys(item).filter(key => key !== '__name__').map(k => {
        arr.push({
          name: k,
          value: item[k]
        })
      })
      return arr
    }

    watch(() => graphData.state, () => {
      state.state = graphData.state
      state.data = graphData.data
      state.resultType = graphData.resultType
    })

    onMounted(() => {
      bus.on('queryGraph', queryGraphData)
    })
    onBeforeUnmount(() => {
      bus.off('queryGraph', queryGraphData)
    })

    return {
      startTime,
      ...toRefs(state),
      selectTime,
      changeTime,
      getItemMetric,
    }
  }
}
</script>

<style scoped lang="less">
@import "index.less";
</style>
