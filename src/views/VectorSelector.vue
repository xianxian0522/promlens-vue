<template>
<div>
  <TreeCommon>
    <template v-slot:innerText>
      <span class="promql-code">
        <span class="promql-metric-name">{{vectorSelector.metricIdentifier}}</span>
        <span class="promql-metric-name" v-if="vectorSelector.labelMatchers.length > 0">
          {<span v-for="(vector, index) in vectorSelector.labelMatchers" :key="index">
            <span class="promql-label-name">{{ vector.labelName }}</span>
            {{vector.matchOp}}
            <span class="promql-string">"{{vector.labelValue}}"</span>
            <span v-if="vectorSelector.labelMatchers.length > 1 && (vectorSelector.labelMatchers.length - 1 !== index)">,</span>
          </span>}
        </span>
        <span v-if="vectorSelector.duration">
          [<span class="promql-duration">{{vectorSelector.duration}}</span>]
        </span>
      </span>
    </template>
    <template v-slot:infoLabel>
      16 results - 91ms -
      <div class="ast-node-label-stats">
        <span class="ast-label-name" style="color: green;">host</span>
        :16,
      </div>
      <div class="ast-node-label-stats">
        <span class="ast-label-name" style="color: green;">instance</span>
        :16,
      </div>
    </template>
  </TreeCommon>
</div>
</template>

<script lang="ts">
import TreeCommon from "@/components/TreeCommon.vue";

export default {
  name: "VectorSelector",
  props: ['vectorSelector'],
  components: {
    TreeCommon,
  },
  setup(props: any) {
    console.log(props, 've')

    return {

    }
  }
}
</script>

<style scoped lang="less">
@import "../components/index.less";
</style>
