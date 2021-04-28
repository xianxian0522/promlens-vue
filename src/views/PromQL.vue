<template>
<div>
  <Expr :expr="ql.expr" @updateValue="updateValue" />
</div>
</template>

<script lang="ts">
import {PromQL} from "@/utils/tree";
import Expr from "@/views/Expr.vue";
import {reactive, ref} from "vue";

export default {
  name: "PromQL",
  components: {
    Expr,
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
