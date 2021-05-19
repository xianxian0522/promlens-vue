<template>
<div class="promlens-container container-fluid">
  <div class="server-settings row no-gutters">
    <div class="col">
      <div class="input-group">
        <div class="input-group-prepend">
          <span class="input-group-text" style="background-color: white; border-right: 0; border-radius: 0;">
            <CheckOutlined v-if="baseShowState === 'success'" style="color: green;"/>
            <CloseOutlined v-else-if="baseShowState === 'error'" style="color: red;" />
            <span v-else><a-spin size="small" /></span>
          </span>
        </div>
        <a-input v-model:value="baseurl" v-on:press-enter="baseurlChange" class="form-control" style="border-color: #344f7133; border-radius: 0" placeholder="Enter Prometheus server URL or append ?s=<url> to the page URL" />
      </div>
      <div v-if="baseErr" class="fade parse-error alert alert-danger show" style="text-align: left">
        <strong>Error validating server health: </strong> {{baseErr}}
      </div>
    </div>
    <div class="col-auto">
      <a-button class="ml-2 btn btn-light"><SettingOutlined /></a-button>
      <a-button class="ml-2 btn btn-light"><ShareAltOutlined /></a-button>
      <div class="ml-2 show-hotkeys"> Show hotkeys: ?</div>
    </div>
  </div>
  <div class="row">
    <div class="col ast-visualizer">
      <div v-for="(q, index) in ql" :key="JSON.stringify(q.expr) + index">
        <div class="query-top-bar">
          <div class="expression-input-wrapper">
            <div class="expression-input expression-input-stale">
              <a-button class="expression-input-sync-btn btn btn-light btn-sm"><SyncOutlined /></a-button>
<!--              <div class="cm-expression-input" :id="'editor' + index"></div>-->
              <PromQLCodeMirror :codeId="index" :expr="q.expr" @codeMirrorUpdate="codeMirrorUpdate" />
              <div class="expression-input-enter" style="color: #bbbbbb">
                <EnterOutlined />
              </div>
            </div>
            <div class="fade parse-error alert alert-danger show" v-if="parseErr[index].showError">
              <strong>Error: </strong>{{ parseErr[index].parseError }}
            </div>
          </div>
          <a-button type="link" class="query-top-bar-btn btn btn-light btn-sm"><ReadOutlined /></a-button>
          <a-button @click="deleteAnotherQuery(index)" class="query-top-bar-btn btn btn-light btn-sm"><CloseOutlined /></a-button>
        </div>
        <div class="row">
          <div class="col">
            <div class="ast-node ast-node-selected ast-node-root">
              <Expr v-if="q.expr" :expr="q.expr" :qlIndex="index" outermost="true" @updateValue="updateValue" />
            </div>
          </div>
        </div>
        <div class="row" v-if="ql.length > 1 && index !== (ql.length - 1)">
          <div class="col">
            <div style="border-top: 1px dashed rgba(52, 79, 113, 0.2); width: 100%; margin-top: 15px; margin-bottom: 15px; height: 2px;"></div>
          </div>
        </div>
      </div>
      <div class="row" style="margin-top: 20px">
        <div class="col">
          <a-button @click="addAnotherQuery" class="px-4 btn btn-light btn-sm"><PlusOutlined /> Add another query</a-button>
        </div>
      </div>
    </div>
  </div>
<!--  <Expr v-if="ql.expr" :expr="ql.expr" outermost="true" @updateValue="updateValue" />-->
</div>
</template>

<script lang="ts">
import {PromQL} from "@/utils/tree";
import Expr from "@/views/Expr.vue";
import {onBeforeUnmount, onMounted, reactive, ref, toRefs, watch} from "vue";
import {
  CloseOutlined, EnterOutlined, PlusOutlined,
  ReadOutlined, SyncOutlined, CheckOutlined,
  SettingOutlined, ShareAltOutlined,
} from "@ant-design/icons-vue";
import promRepository from "@/api/promRepository";
import PromQLCodeMirror from "@/views/PromQLCodeMirror.vue";
import bus from "@/utils/bus";
import {baseUrl, labelNameData, metricNameData} from "@/utils/store";

export default {
  name: "PromQL",
  components: {
    PromQLCodeMirror,
    Expr,
    ReadOutlined,
    CloseOutlined,
    SyncOutlined,
    EnterOutlined,
    PlusOutlined,
    CheckOutlined,
    SettingOutlined,
    ShareAltOutlined,
  },
  props: ['expr'],
  setup(props: any) {
    // const ql: PromQL = reactive({
    //   expr: {
    //     binaryExpr: {
    //       left: {
    //         functionCall: {
    //           functionIdentifier: 'rate',
    //           functionArgs: [
    //             {
    //               vectorSelector: {
    //                 metricIdentifier: 'node_memory_MemAvailable_bytes',
    //                 labelMatchers: [
    //                   {
    //                     labelName: 'instance',
    //                     matchOp: '=',
    //                     labelValue: 'node-exporter-172-18-11-45',
    //                   }
    //                 ],
    //                 matrixSelector: {
    //                   expr: {
    //                   },
    //                   duration: '5m'
    //                 },
    //                 offsetExpr: {
    //                   offset: true,
    //                   duration: '15m'
    //                 }
    //               },
    //             },
    //             {
    //               unaryExpr: {
    //                 unaryOp: '-',
    //                 expr: {
    //                   vectorSelector: {
    //                     metricIdentifier: 'net_conntrack_dialer_conn_attempted_total',
    //                     labelMatchers: [
    //                       {
    //                         labelName: 'instance',
    //                         matchOp: '=',
    //                         labelValue: 'node-exporter:9100',
    //                       }
    //                     ],
    //                   },
    //                 }
    //               }
    //             }
    //           ],
    //         },
    //       },
    //       right: {
    //         parenExpr: {
    //           parentheses: '()',
    //           expr: {
    //             aggregateExpr: {
    //               aggregateOp: 'sum',
    //               aggregateModifier: {
    //                 By: ['a'],
    //               },
    //               functionArgs: [
    //                 {
    //                   subqueryExpr: {
    //                     range: '5m',
    //                     offsetExpr: {
    //                       offset: true,
    //                       duration: '5h',
    //                     },
    //                     step: '5s',
    //                   }
    //                 },
    //                 {numberLiteral: 1024}
    //               ],
    //             }
    //           }
    //         },
    //       },
    //       operator: '/',
    //       binModifiers: {
    //         Bool: true,
    //         OnOrIgnoring: {
    //           On: ['on']
    //         },
    //         group: {
    //           GroupLeft: ['left'],
    //         }
    //       }
    //     }
    //   }
    // })
    // ql.expr = {}
    // const ql: PromQL = reactive({
    //   expr: props.expr
    // })
    const state = reactive({
      ql: [{expr: {}}] as PromQL[],
      parseErr: [{showError: false, parseError: ''}],
    })
    console.log(state.ql);
    const base = reactive({
      baseurl: baseUrl.value,
      baseErr: '',
      baseShowState: 'load',
    })

    const codeMirrorUpdate = (value) => {
      const [v, index] = value
      state.ql[index].expr = v
    }

    const updateValue = (value) => {
      const [v, str, index, qlIndex] = value;
      // if (str === 'unknown') {
      //   ql.expr = v
      // } else if (Object.prototype.hasOwnProperty.call(ql.expr, str)) {
      //   ql.expr = v;
      // } else {
      //   ql.expr = {
      //     [str]: v
      //   }
      // }
      state.ql[qlIndex].expr = v
      console.log(v, str, 'update promql', state.ql[qlIndex].expr)
    }

    const addAnotherQuery = () => {
      state.ql.push({expr: {}})
      state.parseErr.push({showError: false, parseError: ''})
    }
    const deleteAnotherQuery = (index: number) => {
      if (state.ql.length > 1) {
        state.ql.splice(index, 1)
        state.parseErr.splice(index, 1)
      }
    }

    const queryLabelValue = async () => {
      await promRepository.queryLabelName().then((res: any) => {
        metricNameData.value = res.data
      }).catch(err => console.error(err))
    }
    const queryLabels = async () => {
      await promRepository.queryLabel().then((res: any) => {
        labelNameData.value = res.data
        base.baseErr = ''
        base.baseShowState = 'success'
      }).catch(err => {
        base.baseErr = 'Failed to fetch'
        base.baseShowState = 'error'
      })
    }

    const baseurlChange = async () => {
      if (baseUrl.value !== base.baseurl) {
        baseUrl.value = base.baseurl
        base.baseErr = ''
        base.baseShowState = 'load'
        await queryLabels()
      }
    }

    onMounted(() => {
      queryLabelValue()
      queryLabels()

      bus.on('parseError', (value) => {
        const [index, show, parse] = value
        state.parseErr[index].showError = show
        state.parseErr[index].parseError = parse
      })

    })
    onBeforeUnmount(() => {
      bus.all.clear()
    })

    return {
      // ql,
      ...toRefs(state),
      ...toRefs(base),
      updateValue,
      codeMirrorUpdate,
      addAnotherQuery,
      deleteAnotherQuery,
      baseurlChange,
    }
  }
}
</script>

<style lang="less">
@import '../components/index.less';
</style>
