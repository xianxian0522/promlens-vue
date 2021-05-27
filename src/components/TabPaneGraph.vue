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
          <div class="stacked-input btn-group btn-group-sm">
            <a-button @click="line = true" :class="{active: line}" class="btn btn-outline-secondary btn-svg"><LineChartOutlined /></a-button>
            <a-button @click="line = false" :class="{active: !line}" class="btn btn-outline-secondary btn-svg"><AreaChartOutlined /></a-button>
          </div>
        </div>
        <div v-if="loadingState === 'load'" class="fade alert alert-secondary show ">Loading...</div>
        <div v-else-if="loadingState === 'error'" class="fade alert alert-danger show ">Error:</div>
        <div v-else>
          <div v-if="data.length === 0" class="fade alert alert-secondary show ">Empty query result.</div>
        </div>
      </div>
      <div id="graph" style="height: 1px; width: 100%;"></div>
      <div class="graph-legend" v-if="state === 'data' && data.length > 0">
        <div class="legend-item" @mouseleave="legendUnHighlight(index)" @mouseenter="legendHighlight(item, index)" @click="legendItem(item, index)" v-for="(item, index) in legendData" :key="JSON.stringify(item) + index">
          <span class="legend-swatch" :style="{'background-color': item.color}"></span>
          <span class="promql-code">
            <span class="promql-metric-name">{{ item.name }}</span>
            <span class="promql-brace">{</span>
            <span v-for="(t, i) in item?.metric" :key="t.name">
              <span class="promql-label-name">{{t.name}}</span>=
              <span class="promql-string">"{{t.value}}"</span>
              <span v-if="item?.metric?.length > 1 && i !== (item?.metric?.length - 1) ">,</span>
            </span>
            <span class="promql-brace">}</span>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {inject, onBeforeUnmount, onMounted, reactive, ref, toRefs, watch} from "vue";
import {graphData} from "@/utils/store";
import {LeftOutlined, RightOutlined, PlusOutlined, MinusOutlined, LineChartOutlined, AreaChartOutlined} from '@ant-design/icons-vue'
import bus from "@/utils/bus";
import moment, {Moment} from "moment";
import promRepository from "@/api/promRepository";
import * as echarts from 'echarts'
import {EChartsType} from "echarts";

export interface LegendItem {
  name: string;
  metric: any;
  seriesName: string;
  color?: string;
}

export default {
  name: "TabPaneGraph",
  components: {
    LeftOutlined,
    RightOutlined,
    PlusOutlined,
    MinusOutlined,
    LineChartOutlined,
    AreaChartOutlined,
  },
  props: ['query'],
  setup(props) {
    const state = reactive({
      data: graphData.data,
      state: graphData.state,
      loadingState: 'success',
      resultType: graphData.resultType,
      time: 0,
      query: props?.query,
      timeStep: '1h',
      step: 60,
      line: true,
      legendData: [] as LegendItem[],
    })
    const startTime = ref<Moment>()
    const timeSteps = ['1s', '10s', '1m', '5m', '15m', '30m', '1h', '2h', '6h', '12h', '1d', '2d', '1w']
    const color = ['#edc240', '#afd8f8', '#cb4b4b', '#4da74d', '#9440ed', '#bd9b33', '#8cacc6', '#a23c3c', '#3d853d', '#7633bd',
      '#ffe84c', '#d2ffff', '#f35a5a', '#5cc85c', '#b14cff', '#8e7426', '#698194', '#792d2d', '#2e642e', '#58268e', '#ffff59']
    const domLegend = ref<EChartsType>()
    const currentItem: any = {}
    const optionSeries = ref()

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
        domLegend.value = myChart
        if (data.length === 0) {
          dom.style.setProperty('height', '1px')
          domLegend.value.setOption({option: {}, notMerge: true})
        } else {
          dom.style.setProperty('height', '500px')
          const colors = color
          if (data.length > colors.length) {
            const num = data.length - colors.length
            for (let i = 0; i < num; i++) {
              colors.push(colors[i])
            }
          }
          // const names = data.map((s: any) => {
          //   const name = s.metric.__name__ ? s.metric.__name__ : ''
          //   return `${name}{${Object.keys(s.metric).filter(key => key !== '__name__').sort().map(k => `${k}="${s.metric[k]}"`).join(',')}}`
          // })
          state.legendData = data.map((s: any, index: number) => {
            const name = s.metric.__name__ ? s.metric.__name__ : ''
            return ({
              name: name,
              metric: Object.keys(s.metric).filter(key => key !== '__name__').sort().map(k => ({name: k, value: s.metric[k]})),
              seriesName: `${name}{${Object.keys(s.metric).filter(key => key !== '__name__').sort().map(k => `${k}="${s.metric[k]}"`).join(',')}}`,
              color: colors[index]
            })
          })
          const values = data.map((s: any) => {
            // return s.values.map(v => [moment(v[0] * 1000).format('YYYY-MM-DD HH:mm:ss'), v[1]])
            return s.values.map(v => [moment(v[0] * 1000).valueOf(), v[1]])
          })
          console.log( values)

          optionSeries.value = values.map((v: any, i: number) => ({
            name: state.legendData[i].seriesName,
            type: 'line',
            areaStyle: state.line ? null : {},
            itemStyle: {
              color: colors[i],
            },
            // emphasis: {
            //   focus: 'series'
            // },
            symbolSize: 0.5,
            data: v
          }))

          const option = {
            tooltip: {
              axisPointer: {
                type: 'cross',
              },
              backgroundColor: 'rgba(0, 0, 0, .8)',
              borderColor: '#000',
              textStyle: {
                color: '#fff',
                fontSize: 12,
              },
              formatter: (params) => {
                // console.log(params, `{b1}`)
                const name = params.seriesName?.split('{')[0]
                const metric = (params.seriesName?.split('{')[1]).slice(0, -1).split(',')
                let metricHtml = ''
                metric.forEach(m => {
                  metricHtml += `<span>${m.split('=')[0]}: ${m.split('=')[1].slice(1, -1)}</span><br/>`
                })
                return `<div>${moment(params.data[0]).format('ddd, DD MMM YYYY HH:mm:ss')}</div>
<div style="display: flex; align-items: center"><div style="background-color: ${params.color}; width: 10px; height: 10px; margin-right: 3px"></div><div>${name}: ${params.data[1]}</div></div>
${metricHtml}`
              }
            },
            xAxis: {
              type: 'time',
              axisLabel: {
                formatter: {
                  day: '{MMM} {dd}'
                },
              },
            },
            yAxis: {
              type: 'value',
              scale: true,
            },
            // legend: {
            //   type: 'scroll',
            //   orient: 'vertical',
            //   align: 'left',
            //   itemGap: 2.5,
            //   itemHeight: 12,
            //   height: 200,
            //   bottom: 0,
            // },
            // grid: {
            //   bottom: '50%',
            // },
            // series: values.map((v: any, i: number) => ({
            //   name: names[i],
            //   type: 'line',
            //   areaStyle: state.line ? null : {},
            //   // emphasis: {
            //   //   focus: 'series'
            //   // },
            //   symbolSize: 0.5,
            //   data: v
            // }))
            series: optionSeries.value
          }

          myChart.resize()
          myChart.setOption(option, {notMerge: true})
        }
      }

    }

    const legendItem = (item, index) => {
      const option = domLegend.value?.getOption()
      if (option) {
        let series: any = []
        if (item === currentItem.item) {
          series = optionSeries.value
          currentItem.item = {}
        } else {
          currentItem.item = item
          series.push((optionSeries.value as object)[index])
        }
        option.series = series
        domLegend.value?.setOption(option, {notMerge: true})
      }

      // domLegend.value?.dispatchAction({
      //   type: 'legendSelect',
      //   name: `${item.name}{${item.metric.sort().map(k => `${k.name}="${k.value}"`).join(',')}}`
      // })
      // domLegend.value?.dispatchAction({
      //   type: 'downplay',
      //   seriesIndex: state.legendData.map((item, idx) => (idx)).filter(i => i !== index)
      // })
    }
    const legendHighlight = (item, index) => {
      const option = domLegend.value?.getOption()
      if (option) {
        option.series = (option.series as any).map((s, idx) => {
          return {
            itemStyle: {opacity: idx === index ? 1 : 0.25},
            lineStyle: {opacity: idx === index ? 1 : 0.25}
          }
        })
        domLegend.value?.setOption(option)
      }
    }
    const legendUnHighlight = (index) => {
      const option = domLegend.value?.getOption()
      if (option) {
        option.series = (option.series as any).map((s, idx) => {
          return {
            itemStyle: {opacity: 1},
            lineStyle: {opacity: 1}
          }
        })
        domLegend.value?.setOption(option)
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
      if (graphData.state === 'data') {
        getEchartsData()
      } else {
        document.getElementById("graph")?.style?.setProperty('height', '1px')
        domLegend.value?.setOption({option: {}, notMerge: true})
      }
    })
    watch(() => state.line, () => {
      getEchartsData()
    })

    const QueryGraph = (value) => {
      state.query = value

      queryGraphData()
    }

    onMounted(() => {
      bus.on('childGraph', QueryGraph)

      if (state.query) {
        queryGraphData()
      }
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
      legendItem,
      legendHighlight,
      legendUnHighlight,
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
