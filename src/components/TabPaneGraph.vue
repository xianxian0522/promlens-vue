<template>
  <div class="tab-content">
    <div class="fade tab-pane active show">
      <div v-if="state === 'init'" class="fade alert alert-light show">Selected query is incomplete. To visualize it, please fill out the placeholders.</div>
      <div v-else-if="state === 'noQuery'" class="fade alert alert-light show">Select part of a query above to visualize it.</div>
      <div v-else>
        <div class="graph-controls form-inline">
          <div class="range-input input-group input-group-sm">
            <div class="input-group-prepend">
              <a-button @click="forwardStep" class="btn btn-outline-secondary btn-svg"><MinusOutlined /></a-button>
            </div>
            <a-input v-model:value="timeStep"></a-input>
            <div class="input-group-append">
              <a-button @click="backwardStep" class="btn btn-outline-secondary btn-svg"><PlusOutlined /></a-button>
            </div>
          </div>
          <div class="time-input input-group input-group-sm">
            <div class="input-group-prepend">
              <a-button @click="forwardTime" class="btn btn-outline-secondary btn-svg"><LeftOutlined /></a-button>
            </div>
            <a-date-picker v-model:value="startTime" format="YYYY-MM-DD HH:mm:ss" show-time placeholder="Select Time" @ok="selectTime" @change="changeTime" />
            <div class="input-group-append">
              <a-button @click="backwardTime" class="btn btn-outline-secondary btn-svg"><RightOutlined /></a-button>
            </div>
          </div>
          <a-input-number @blur="stepChange" v-model:value="step" placeholder="Res. (s)" class="resolution-input form-control form-control-sm" />
        </div>
        <div v-if="loadingState === 'load'" class="fade alert alert-secondary show ">Loading...</div>
        <div v-else-if="loadingState === 'error'" class="fade alert alert-danger show ">Error:</div>
      </div>
      <div id="graph" style="height: 1px; width: 100%;"></div>
    </div>
  </div>
</template>

<script lang="ts">
import {inject, onBeforeUnmount, onMounted, reactive, ref, toRefs, watch} from "vue";
import {graphData} from "@/utils/store";
import {LeftOutlined, RightOutlined, PlusOutlined, MinusOutlined, } from '@ant-design/icons-vue'
import bus from "@/utils/bus";
import moment, {Moment} from "moment";
import promRepository from "@/api/promRepository";
import * as echarts from 'echarts'

export default {
  name: "TabPaneGraph",
  components: {
    LeftOutlined,
    RightOutlined,
    PlusOutlined,
    MinusOutlined,
  },
  setup() {
    const state = reactive({
      data: graphData.data,
      state: graphData.state,
      loadingState: 'success',
      resultType: graphData.resultType,
      time: 0,
      query: '',
      timeStep: '1h',
      step: 60,
    })
    const startTime = ref<Moment>()
    const timeSteps = ['1s', '10s', '1m', '5m', '15m', '30m', '1h', '2h', '6h', '12h', '1d', '2d', '1w']

    const queryGraphData = async () => {
      state.loadingState = 'load'
      const time = state.time || moment().valueOf()
      const endTime = time / 1000
      const startTime = endTime - (getTimeStep() as number)
      const params = {
        query: state.query,
        start: startTime,
        end: endTime,
        step: state.step,
      }
      try {
        const data = await promRepository.queryGraphData(params)
        if (data.status === 'success') {
          state.data = data.data.result
          state.resultType = data.data.resultType
          graphData.state = 'data'
          state.loadingState = 'success'
          getEchartsData()
        } else {
          state.loadingState = 'error'
        }
      } catch (e) {
        state.loadingState = 'error'
        console.error(e)
      }
    }

    const getEchartsData = () => {
      const data = state.data
      const dom = document.getElementById("graph")
      if (dom && state.state === 'data') {
        let myChart = echarts.getInstanceByDom(dom)
        if (!myChart) { // 如果不存在，就进行初始化
          myChart = echarts.init(dom);
        }
        dom.style.setProperty('height', '500px')
        // const myChart = echarts.init(document.getElementById('graph'))
        // console.log(data, '-----;;;;;')
        const names = data.map((s: any) => {
          const name = s.metric.__name__ ? s.metric.__name__ : ''
          return `${name}{${Object.keys(s.metric).filter(key => key !== '__name__').sort().map(k => `${k}="${s.metric[k]}"`).join(',')}}`
        })
        const values = data.map((s: any) => {
          return s.values.map(v => [moment(v[0] * 1000).format('YYYY-MM-DD HH:mm:ss'), v[1]])
        })
        // console.log( values)

        const option = {
          tooltip: {},
          // legend: {
          //   bottom: 0,
          //   // orient: 'vertical',
          //   type: 'scroll',
          // },
          xAxis: {
            type: 'time',
          },
          yAxis: {
            scale: true,
          },
          series: values.map((v: any, i: number) => ({
            name: names[i],
            type: 'line',
            data: v
          }))
        }
        console.log(option)
        myChart.resize()
        myChart.setOption(option)
      }

    }

    const getTimeStep = () => {
      const t = state.timeStep.slice(-1);
      const n = parseInt(state.timeStep.slice(0, -1), 10);
      if (t === 's') {
        return n;
      } else if (t === 'm') {
        return n * 60;
      } else if (t === 'h') {
        return n * 60 * 60;
      } else if (t === 'd') {
        return n * 24 * 60 * 60;
      } else if (t === 'w') {
        return n * 7 * 24 * 60 * 60;
      }
    }

    const forwardStep = () => {
      getStateTimeStep(-1)
      queryGraphData()
    }
    const backwardStep = () => {
      getStateTimeStep(1)
      queryGraphData()
    }
    const getStateTimeStep = (j) => {
      for (let i = 0; i < timeSteps.length; i++) {
        if (state.timeStep === timeSteps[i]) {
          if (j > 0) {
            if (i !== timeSteps.length - 1) {
              state.timeStep = timeSteps[i + 1]
              return
            }
          } else {
            if (i !== 0 ) {
              state.timeStep = timeSteps[i - 1]
              return
            }
          }
        }
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
    const stepChange = () => {
      queryGraphData()
    }

    watch(() => graphData.state, () => {
      state.state = graphData.state
    })

    const QueryGraph = (value) => {
      state.query = value
      queryGraphData()
    }

    onMounted(() => {
      bus.on('childGraph', QueryGraph)

      getEchartsData()
    })
    onBeforeUnmount(() => {
      bus.off('childGraph', QueryGraph)
    })

    return {
      startTime,
      ...toRefs(state),
      forwardTime,
      backwardTime,
      changeTime,
      selectTime,
      forwardStep,
      backwardStep,
      stepChange,
    }
  }
}
</script>

<style scoped lang="less">
@import "index.less";
#graph canvas {
  height: 500px !important;
}
</style>
