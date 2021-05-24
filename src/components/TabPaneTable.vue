<template>
  <div class="tab-content">
    <div class="fade tab-pane active show">
      <div v-if="state === 'init'" class="fade alert alert-light show">Selected query is incomplete. To visualize it, please fill out the placeholders.</div>
      <div v-else-if="state === 'noQuery'" class="fade alert alert-light show">Select part of a query above to visualize it.</div>
      <div v-else>
        <div class="table-controls">
          <div class="time-input input-group input-group-sm">
            <div class="input-group-prepend">
              <a-button @click="forwardTime" class="btn btn-outline-secondary btn-svg"><LeftOutlined /></a-button>
            </div>
            <a-date-picker v-model:value="startTime" format="YYYY-MM-DD HH:mm:ss" show-time placeholder="Select Time" @ok="selectTime" @change="changeTime" />
            <div class="input-group-append">
              <a-button @click="backwardTime" class="btn btn-outline-secondary btn-svg"><RightOutlined /></a-button>
            </div>
          </div>
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
                <tr v-for="(item, index) in metricData" :key="JSON.stringify(item.metric) + index">
                  <td>
                    <span class="promql-code">
                      <span class="promql-metric-name">{{item?.name}}</span>
                      <span v-if="item?.metric?.length > 0">
                        <span class="promql-brace">{</span>
                        <span v-for="(t, i) in item?.metric" :key="t.name">
                          <span class="promql-label-name">{{t.name}}</span>=
                          <span class="promql-string">"{{t.value}}"</span>
                          <span v-if="item?.metric?.length > 1 && i !== (item?.metric?.length - 1) ">,</span>
                        </span>
                        <span class="promql-brace">}</span>
                      </span>
                    </span>
                  </td>
                  <td>{{ item.value }}</td>
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
        <div v-else class="fade alert alert-danger show ">Error:</div>
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
import {LeftOutlined, RightOutlined, } from '@ant-design/icons-vue'

export interface QueryParams {
  query: string;
  time?: number;
}
export interface MetricItem {
  metric: any;
  name: string;
  value: number;
}

export default {
  name: "TabPaneTable",
  components: {
    LeftOutlined,
    RightOutlined,
  },
  setup() {
    const state = reactive({
      data: graphData.data,
      state: graphData.state,
      loadingState: 'success',
      time: 0,
      resultType: graphData.resultType,
      query: '',
      metricData: [] as MetricItem[],
    })
    const startTime = ref<Moment>()

    const queryGraphData = async () => {
      state.loadingState = 'load'
      const params: QueryParams = {
        query: state.query,
      }
      if (state.time) {
        params.time = state.time
      }
      console.log(params, 'qqqqq')
      try {
        const data = await promRepository.queryDataAll(params)
        if (data.status === 'success') {
          // if (graphData.state === 'data') {
          //   state.data = data.data.result
          //   state.resultType = data.data.resultType
          // } else {
          //   graphData.data = data.data.result
          //   graphData.resultType = data.data.resultType
          //   graphData.state = 'data'
          // }
          state.data = data.data.result
          state.resultType = data.data.resultType
          graphData.state = 'data'
          state.loadingState = 'success'
          getMetricData()
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
      queryGraphData()
    }

    const changeTime = (value: Moment) => {
      if (!value) {
        state.time = 0
        queryGraphData()
      }
    }
    const getStateTime = (i) => {
      if (state.time) {
        state.time += i * 0.5 * 60 * 60 * 1000
        startTime.value = moment(state.time)
      } else {
        state.time = moment().valueOf() + i * 0.5 * 60 * 60 * 1000
        startTime.value = moment(state.time)
      }
      queryGraphData()
    }
    const forwardTime = () => {
      getStateTime(-1)
    }
    const backwardTime = () => {
      getStateTime(1)
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
    const getMetricData = () => {
      const data = state.data
      if (state.resultType === 'vector' && state.state === 'data') {
        state.metricData = data.map((item: any) => {
          return ({
            name: item.metric.__name__,
            metric: getItemMetric(item?.metric),
            value: item.value[1]
          })
        })
      }
    }

    watch(() => graphData.state, () => {
      state.state = graphData.state
      // state.data = graphData.data
      // state.resultType = graphData.resultType
    })

    const QueryGraph = (value) => {
      state.query = value
      queryGraphData()
    }

    onMounted(() => {
      bus.on('childTable', QueryGraph)
    })
    onBeforeUnmount(() => {
      bus.off('childTable', QueryGraph)
    })

    return {
      startTime,
      ...toRefs(state),
      selectTime,
      changeTime,
      getItemMetric,
      forwardTime,
      backwardTime,
    }
  }
}
</script>

<style scoped lang="less">
@import "index.less";
</style>
