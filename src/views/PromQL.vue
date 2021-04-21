<template>
<div>
  <Expr :expr="ql.expr" />
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
        functionCall: {
          functionIdentifier: 'sum',
          functionArgs: [
            {
              matrixSelector: {
                expr: {
                  vectorSelector: {
                    metricIdentifier: 'node_memory_MemAvailable_bytes',
                    labelMatchers: [
                      {
                        labelName: 'instance',
                        matchOp: '=',
                        labelValue: 'node-exporter-172-18-11-45',
                      }
                    ],
                  }
                },
                duration: '5m'
              }
            }
          ],
        },
        binaryExpr: {
          left: {
            functionCall: {
              functionIdentifier: 'sum',
              functionArgs: [
                {
                  matrixSelector: {
                    expr: {
                      vectorSelector: {
                        metricIdentifier: 'node_memory_MemAvailable_bytes',
                        labelMatchers: [
                          {
                            labelName: 'instance',
                            matchOp: '=',
                            labelValue: 'node-exporter-172-18-11-45',
                          }
                        ],
                      }
                    },
                    duration: '5m'
                  }
                }
              ],
            },
          },
          right: {
            numberLiteral: 1024
          },
          operator: '/',
        }
      }
    })
    console.log(ql);
    return {
      ql,
    }
  }
}
</script>

<style scoped lang="less">
@import "../components/index.less";
</style>
