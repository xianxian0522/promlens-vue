<template>
<div>
  <Expr v-if="ql.expr" :expr="ql.expr" @updateValue="updateValue" />
  <div v-else>
    <TreeCommon >
      <template v-slot:innerText>
        <span>start query:ccc</span>
      </template>
      <template v-slot:addExpr>
        <PlusOutlined @click="addExpr" class="ast-connector-plus ast-connector-plus-up" />
      </template>
    </TreeCommon>
  </div>
</div>
</template>

<script lang="ts">
import TreeCommon from "@/components/TreeCommon.vue";
import {PromQL} from "@/utils/tree";
import Expr from "@/views/Expr.vue";
import {reactive, ref} from "vue";
import {PlusOutlined} from "@ant-design/icons-vue";

export default {
  name: "PromQL",
  components: {
    Expr,
    TreeCommon,
    PlusOutlined,
  },
  setup() {
    const ql: PromQL = reactive({
      expr: {
        binaryExpr: {
          left: {
            functionCall: {
              functionIdentifier: 'rate',
              functionArgs: [
                {
                  vectorSelector: {
                    metricIdentifier: 'node_memory_MemAvailable_bytes',
                    labelMatchers: [
                      {
                        labelName: 'instance',
                        matchOp: '=',
                        labelValue: 'node-exporter-172-18-11-45',
                      }
                    ],
                    matrixSelector: {
                      expr: {
                      },
                      duration: '5m'
                    },
                    offsetExpr: {
                      offset: true,
                      duration: '15m'
                    }
                  },
                },
                {
                  unaryExpr: {
                    unaryOp: '-',
                    expr: {
                      vectorSelector: {
                        metricIdentifier: 'net_conntrack_dialer_conn_attempted_total',
                        labelMatchers: [
                          {
                            labelName: 'instance',
                            matchOp: '=',
                            labelValue: 'node-exporter:9100',
                          }
                        ],
                      },
                    }
                  }
                }
              ],
            },
          },
          right: {
            parenExpr: {
              aggregateExpr: {
                aggregateOp: 'sum',
                aggregateModifier: {
                  By: ['a'],
                },
                functionArgs: [
                  {
                    subqueryExpr: {
                      range: '5m',
                      offsetExpr: {
                        offset: true,
                        duration: '5h',
                      },
                      step: '5s',
                    }
                  },
                  {numberLiteral: 1024}
                ],
              }
            },
          },
          operator: '/',
          binModifiers: {
            Bool: true,
            OnOrIgnoring: {
              On: ['on']
            },
            group: {
              GroupLeft: ['left'],
            }
          }
        }
      }
    })
    // ql.expr = {}
    console.log(ql);

    const updateValue = (value) => {
      const [v, str] = value;
      if (ql.expr[str]) {
        ql.expr[str] = v;
      } else {
        ql.expr = v
      }
      console.log(v, str, 'update promql', ql.expr)
    }
    return {
      ql,
      updateValue,
    }
  }
}
</script>

<style scoped lang="less">
@import "../components/index.less";
</style>
