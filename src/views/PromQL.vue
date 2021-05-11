<template>
<div class="promlens-container container-fluid">
  <a-button type="primary">Primary</a-button>
  <div class="editor-container" id="container"></div>
  <div class="row">
    <div class="col ast-visualizer">
      <div v-for="(q, index) in ql" :key="index">
        <div class="query-top-bar">
          <div class="expression-input-wrapper">
            <div class="expression-input expression-input-stale">
              <a-button class="expression-input-sync-btn btn btn-light btn-sm"><SyncOutlined /></a-button>
              <div class="cm-expression-input" id="editor"></div>
              <div class="expression-input-enter">
                <EnterOutlined />
              </div>
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
import {onMounted, reactive, ref, toRefs} from "vue";
import {CloseOutlined, EnterOutlined, PlusOutlined, ReadOutlined, SyncOutlined} from "@ant-design/icons-vue";
import {metricNameData, promRepository} from "@/api/promRepository";
import {PromQLExtension} from "codemirror-promql";
import {EditorView} from "@codemirror/view";
import {EditorState} from "@codemirror/state";
import {basicSetup} from "@codemirror/basic-setup";
import {HighlightStyle, tags} from "@codemirror/highlight";

export default {
  name: "PromQL",
  components: {
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
    })
    console.log(state.ql);
    const promQL = new PromQLExtension().setComplete({
      remote: {
        url: 'http://prometheus.proxy.sumscope.com:8000',
      }
    })
    const promQLHighlightMaterialTheme = HighlightStyle.define([
      {
        tag: tags.deleted,
        textDecoration: 'line-through',
      },
      {
        tag: tags.inserted,
        textDecoration: 'underline',
      },
      {
        tag: tags.link,
        textDecoration: 'underline',
      },
      {
        tag: tags.strong,
        fontWeight: 'bold',
      },
      {
        tag: tags.emphasis,
        fontStyle: 'italic',
      },
      {
        tag: tags.invalid,
        color: '#f00',
      },
      {
        tag: tags.keyword,
        color: '#C792EA',
      },
      {
        tag: tags.operator,
        color: '#89DDFF',
      },
      {
        tag: tags.atom,
        color: '#F78C6C',
      },
      {
        tag: tags.number,
        color: '#FF5370',
      },
      {
        tag: tags.string,
        color: '#99b867',
      },
      {
        tag: [tags.escape, tags.regexp],
        color: '#e40',
      },
      {
        tag: tags.definition(tags.variableName),
        color: '#f07178',
      },
      {
        tag: tags.labelName,
        color: '#f07178',
      },
      {
        tag: tags.typeName,
        color: '#085',
      },
      {
        tag: tags.function(tags.variableName),
        color: '#C792EA',
      },
      {
        tag: tags.definition(tags.propertyName),
        color: '#00c',
      },
      {
        tag: tags.comment,
        color: '#546e7a',
      }
    ])

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
    }
    const deleteAnotherQuery = (index: number) => {
      if (state.ql.length > 1) {
        state.ql.splice(index, 1)
      }
    }

    const queryLabelValue = async () => {
      await promRepository.queryLabelName()
    }
    const queryLabels = async () => {
      await promRepository.queryLabel()
    }

    onMounted(() => {
      const doc = document.getElementById('editor')
      if (doc !== null) {
        new EditorView({
          state: EditorState.create({
            extensions: [
              basicSetup,
              promQL.asExtension(),
              EditorView.lineWrapping,
              promQLHighlightMaterialTheme,
            ]
          }),
          parent: doc
        })
      }

      queryLabelValue()
      queryLabels()
    })

    return {
      // ql,
      ...toRefs(state),
      updateValue,
      addAnotherQuery,
      deleteAnotherQuery,
    }
  }
}
</script>

<style lang="less">
@import '../components/index.less';
.cm-completionIcon {
  font-size: 16px !important;
  line-height: 1;
  margin-right: 10px;
  vertical-align: top;
  font-family: codicon;
  padding-right: 0 !important;
  opacity: 1 !important;
  color: #007acc;
}
.cm-completionMatchedText {
  color: #0066bf;
}
.cm-completionDetail {
  float: right;
  color: #999;
}
// 不显示几行
.cm-gutters {
  display: none !important;
}
.cm-activeLine {
  background-color: transparent !important;
}
// 去掉虚线
.ͼ1.cm-focused {
  outline: 0
}
</style>
