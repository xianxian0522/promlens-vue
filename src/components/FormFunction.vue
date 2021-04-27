<template>
<div>
  <a-form layout="vertical" :model="formState" class="small">
    <a-form-item label="Function:">
      <a-select
          v-model:value="formState.functionIdentifier"
          style="width: 680px"
          ref="select"
      >
        <a-select-option v-for="(item, index) in functionList" :key="index" :value="item.value">
          {{ item.name }}</a-select-option>
      </a-select>
    </a-form-item>
  </a-form>
</div>
</template>

<script lang="ts">
import {onMounted, reactive, toRefs, watch} from "vue";

export default {
  name: "FormFunction",
  props: ['functionCall'],
  emits: ['previewChange'],
  setup(props: any, content) {
    console.log(props, 'function')
    const formState = reactive({
      functionIdentifier: (props.functionCall && props.functionCall.functionIdentifier) || 'rate',
      functionArgs: (props.functionCall && props.functionCall.functionArgs) || []
    })
    const state = reactive({
      functionList: [
        {name: 'abs() — return absolute values of input series', value: 'abs'},
        {name: 'absent() — determine whether input vector is empty', value: 'absent'},
        {name: 'absent_over_time() — determine whether input range vector is empty', value: 'absent_over_time'},
        {name: 'avg_over_time() — average series values over time', value: 'avg_over_time'},
        {name: 'ceil() — round up values of input series to nearest integer', value: 'ceil'},
        {name: 'changes() — return number of value changes in input series over time', value: 'changes'},
        {name: 'clamp_max() — limit the value of input series to a maximum', value: 'clamp_max'},
        {name: 'clamp_min() — limit the value of input series to a minimum', value: 'clamp_min'},
        {name: 'count_over_time() — count the number of values for each input series', value: 'count_over_time'},
        {name: 'day_of_month() — return the day of the month for provided timestamps', value: 'day_of_month'},
        {name: 'day_of_week() — return the day of the week for provided timestamps', value: 'day_of_week'},
        {name: 'days_in_month() — return the number of days in current month for provided timestamps', value: 'days_in_month'},
        {name: 'delta() — calculate the difference between beginning and end of a range vector (for gauges)', value: 'delta'},
        {name: 'deriv() — calculate the per-second derivative over series in a range vector (for gauges)', value: 'deriv'},
        {name: 'exp() — calculate exponential function for input vector values', value: 'exp'},
        {name: 'floor() — round down values of input series to nearest integer', value: 'floor'},
        {name: 'histogram_quantile() — calculate quantiles from histogram buckets', value: 'histogram_quantile'},
        {name: 'holt_winters() — calculate smoothed value of input series', value: 'holt_winters'},
        {name: 'hour() — return the hour of the day for provided timestamps', value: 'hour'},
        {name: 'idelta() — calculate the difference between the last two samples of a range vector (for counters)', value: 'idelta'},
        {name: 'increase() — calculate the increase in value over a range of time (for counters)', value: 'increase'},
        {name: 'irate() — calculate the per-second increase over the last two samples of a range vector (for counters)', value: 'irate'},
        {name: 'label_join() — join together label values into new label', value: 'label_join'},
        {name: 'label_replace() — set or replace label values', value: 'label_replace'},
        {name: 'ln() — calculate natural logarithm of input series', value: 'ln'},
        {name: 'log10() — calculate base-10 logarithm of input series', value: 'log10'},
        {name: 'log2() — calculate base-2 logarithm of input series', value: 'log2'},
        {name: 'max_over_time() — return the maximum value over time for input series', value: 'max_over_time'},
        {name: 'min_over_time() — return the minimum value over time for input series', value: 'min_over_time'},
        {name: 'minute() — return the minute of the hour for provided timestamps', value: 'minute'},
        {name: 'month() — return the month for provided timestamps', value: 'month'},
        {name: 'predict_linear() — predict the value of a gauge into the future', value: 'predict_linear'},
        {name: 'quantile_over_time() — calculate value quantiles over time for input series', value: 'quantile_over_time'},
        {name: 'rate() — calculate per-second increase over a range vector (for counters)', value: 'rate'},
        {name: 'resets() — return number of value decreases (resets) in input series of time', value: 'resets'},
        {name: 'round() — round values of input series to nearest integer', value: 'round'},
        {name: 'scalar() — convert single-element series vector into scalar value', value: 'scalar'},
        {name: 'sort() — sort input series ascendingly by value', value: 'sort'},
        {name: 'sort_desc() — sort input series descendingly by value', value: 'sort_desc'},
        {name: 'sqrt() — return the square root for input series', value: 'sqrt'},
        {name: 'stddev_over_time() — calculate the standard deviation within input series over time', value: 'stddev_over_time'},
        {name: 'stdvar_over_time() — calculate the standard variation within input series over time', value: 'stdvar_over_time'},
        {name: 'sum_over_time() — calculate the sum over the values of input series over time', value: 'sum_over_time'},
        {name: 'time() — return the Unix timestamp at the current evaluation time', value: 'time'},
        {name: 'timestamp() — return the Unix timestamp for the samples in the input vector', value: 'timestamp'},
        {name: 'vector() — convert a scalar value into a single-element series vector', value: 'vector'},
        {name: 'year() — return the year for provided timestamps', value: 'year'},
      ],
    })

    onMounted(() => {
      content.emit('previewChange', formState)

      watch(formState, (value) => {
        content.emit('previewChange', value)
      })
    })

    return {
      formState,
      ...toRefs(state),
    }
  }
}
</script>

<style scoped lang="less">
@import "index.less";
</style>
