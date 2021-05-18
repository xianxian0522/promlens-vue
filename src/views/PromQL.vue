<template>
<div class="promlens-container container-fluid">
  <a-button type="primary">Primary</a-button>
  <div class="editor-container" id="container"></div>
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
import {onMounted, reactive, ref, toRefs, watch} from "vue";
import {CloseOutlined, EnterOutlined, PlusOutlined, ReadOutlined, SyncOutlined} from "@ant-design/icons-vue";
import {metricNameData, promRepository} from "@/api/promRepository";
import PromQLCodeMirror from "@/views/PromQLCodeMirror.vue";
import bus from "@/utils/bus";

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
      await promRepository.queryLabelName()
    }
    const queryLabels = async () => {
      await promRepository.queryLabel()
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

    return {
      // ql,
      ...toRefs(state),
      updateValue,
      codeMirrorUpdate,
      addAnotherQuery,
      deleteAnotherQuery,
    }
  }
}
</script>

<style lang="less">
@import '../components/index.less';
</style>
