<template>
<div>
  <a-form layout="vertical" :model="formState" class="small">
    <a-form-item label="Function:">
      <a-select
          v-model:value="formState.functionIdentifier"
          ref="select"
      >
        <a-select-option v-for="(item, index) in functionList" :key="index" :value="item.value">
          {{ item.name }}</a-select-option>
      </a-select>
    </a-form-item>
  </a-form>
  <a-button class="btn btn-secondary btn-sm" @click.stop="onSubmit">
    <CheckOutlined />Apply changes
  </a-button>
</div>
</template>

<script lang="ts">
import {inject, onMounted, reactive, toRefs, watch} from "vue";
import {CheckOutlined} from "@ant-design/icons-vue";

export default {
  name: "FormFunction",
  components: {CheckOutlined,},
  props: ['functionCall'],
  emits: ['previewChange'],
  setup(props: any, content) {
    console.log(props, 'function')
    const updateExprValue: any = inject('updateExprValue')
    const updateExprIndex: number | undefined = inject('updateExprIndex')
    const updateLeft = inject('updateLeft')
    const updateQlIndex = inject('updateQlIndex')
    const queryAllData: any = inject('queryAllData')
    const exprChange: any = inject('exprChange')

    const formState = reactive({
      functionIdentifier: (props.functionCall && props.functionCall.functionIdentifier) || 'rate',
      functionArgs: (props.functionCall && props.functionCall.functionArgs)
    })
    const state = reactive({
      functionList: [
        // {name: 'abs() — return absolute values of input series', value: 'abs'},
        {name: 'abs() — 返回输入向量的所有样本的绝对值', value: 'abs'},
        // {name: 'absent() — determine whether input vector is empty', value: 'absent'},
        {name: 'absent() — 传递给它的向量有值，则返回空向量;则返回值为1', value: 'absent'},
        // {name: 'absent_over_time() — determine whether input range vector is empty', value: 'absent_over_time'},
        {name: 'absent_over_time() — 传递给它的范围向量有任何元素，则返回一个空向量;则返回值为1。', value: 'absent_over_time'},
        // {name: 'avg_over_time() — average series values over time', value: 'avg_over_time'},
        {name: 'avg_over_time() — 范围向量内每个度量指标的平均值', value: 'avg_over_time'},
        // {name: 'ceil() — round up values of input series to nearest integer', value: 'ceil'},
        {name: 'ceil() — 所有元素的样本值向上四舍五入到最接近的整数', value: 'ceil'},
        // {name: 'changes() — return number of value changes in input series over time', value: 'changes'},
        {name: 'changes() — 输入一个区间向量,返回这个区间向量内每个样本数据值变化的次数(瞬时向量)', value: 'changes'},
        // {name: 'clamp_max() — limit the value of input series to a maximum', value: 'clamp_max'},
        {name: 'clamp_max() — 输入一个瞬时向量和最大值,样本数据值若大于max,则改为max,否则不变', value: 'clamp_max'},
        // {name: 'clamp_min() — limit the value of input series to a minimum', value: 'clamp_min'},
        {name: 'clamp_min() — 输入一个瞬时向量和最小值,样本数据值若小于min,则改为min,否则不变', value: 'clamp_min'},
        // {name: 'count_over_time() — count the number of values for each input series', value: 'count_over_time'},
        {name: 'count_over_time() — 范围向量内每个度量指标的样本数据个数', value: 'count_over_time'},
        // {name: 'day_of_month() — return the day of the month for provided timestamps', value: 'day_of_month'},
        {name: 'day_of_month() — 返回被给定UTC时间所在月的第几天。返回值范围：1~31', value: 'day_of_month'},
        // {name: 'day_of_week() — return the day of the week for provided timestamps', value: 'day_of_week'},
        {name: 'day_of_week() — 返回被给定UTC时间所在周的第几天。返回值范围：0~6，0 表示星期天', value: 'day_of_week'},
        // {name: 'days_in_month() — return the number of days in current month for provided timestamps', value: 'days_in_month'},
        {name: 'days_in_month() — 返回当月一共有多少天。返回值范围：28~31', value: 'days_in_month'},
        // {name: 'delta() — calculate the difference between beginning and end of a range vector (for gauges)', value: 'delta'},
        {name: 'delta() — 计算一个区间向量 v 的第一个元素和最后一个元素之间的差值', value: 'delta'},
        // {name: 'deriv() — calculate the per-second derivative over series in a range vector (for gauges)', value: 'deriv'},
        {name: 'deriv() — 参数是一个区间向量,返回一个瞬时向量。它使用简单的线性回归计算区间向量中各个时间序列的导数', value: 'deriv'},
        // {name: 'exp() — calculate exponential function for input vector values', value: 'exp'},
        {name: 'exp() — 输入一个瞬时向量，返回各个样本值的e的指数值，即 e 的 N 次方。当 N 的值足够大时会返回 +Inf', value: 'exp'},
        // {name: 'floor() — round down values of input series to nearest integer', value: 'floor'},
        {name: 'floor() — 所有元素的样本值向下四舍五入到最接近的整数', value: 'floor'},
        // {name: 'histogram_quantile() — calculate quantiles from histogram buckets', value: 'histogram_quantile'},
        {name: 'histogram_quantile() — 从bucket类型的向量b中计算 φ (0 ≤ φ ≤ 1) 分位数(百分位数的一般形式)的样本的最大值', value: 'histogram_quantile'},
        // {name: 'holt_winters() — calculate smoothed value of input series', value: 'holt_winters'},
        {name: 'holt_winters() — 基于区间向量v，生成时间序列数据平滑值', value: 'holt_winters'},
        // {name: 'hour() — return the hour of the day for provided timestamps', value: 'hour'},
        {name: 'hour() — 函数返回被给定 UTC 时间的当前第几个小时，时间范围：0~23', value: 'hour'},
        // {name: 'idelta() — calculate the difference between the last two samples of a range vector (for counters)', value: 'idelta'},
        {name: 'idelta() — 参数是一个区间向量, 返回一个瞬时向量。它计算最新的 2 个样本值之间的差值', value: 'idelta'},
        // {name: 'increase() — calculate the increase in value over a range of time (for counters)', value: 'increase'},
        {name: 'increase() — 计算一段时间内值的增长量', value: 'increase'},
        // {name: 'irate() — calculate the per-second increase over the last two samples of a range vector (for counters)', value: 'irate'},
        {name: 'irate() — 用于计算区间向量的增长率，但是其反应出的是瞬时增长率', value: 'irate'},
        // {name: 'label_join() — join together label values into new label', value: 'label_join'},
        {name: 'label_join() — 将多个标签src_label的值，通过separator作为连接符写入到一个新的标签dst_label中', value: 'label_join'},
        // {name: 'label_replace() — set or replace label values', value: 'label_replace'},
        {name: 'label_replace() — 输入：瞬时向量，输出：key: value = 度量指标', value: 'label_replace'},
        // {name: 'ln() — calculate natural logarithm of input series', value: 'ln'},
        {name: 'ln() — 计算瞬时向量v中所有样本数据的自然对数', value: 'ln'},
        // {name: 'log10() — calculate base-10 logarithm of input series', value: 'log10'},
        {name: 'log10() — 计算瞬时向量中所有样本数据以10为底对数', value: 'log10'},
        // {name: 'log2() — calculate base-2 logarithm of input series', value: 'log2'},
        {name: 'log2() — 计算瞬时向量中所有样本数据以2为底对数', value: 'log2'},
        // {name: 'max_over_time() — return the maximum value over time for input series', value: 'max_over_time'},
        {name: 'max_over_time() — 返回范围向量内每个度量指标的最大值', value: 'max_over_time'},
        // {name: 'min_over_time() — return the minimum value over time for input series', value: 'min_over_time'},
        {name: 'min_over_time() — 返回范围向量内每个度量指标的最小值', value: 'min_over_time'},
        // {name: 'minute() — return the minute of the hour for provided timestamps', value: 'minute'},
        {name: 'minute() — 返回给定 UTC 时间当前小时的第多少分钟。结果范围：0~59', value: 'minute'},
        // {name: 'month() — return the month for provided timestamps', value: 'month'},
        {name: 'month() — 返回给定 UTC 时间当前属于第几个月，结果范围：0~12', value: 'month'},
        // {name: 'predict_linear() — predict the value of a gauge into the future', value: 'predict_linear'},
        {name: 'predict_linear() — 预测时间序列 v 在 t 秒后的值。它基于简单线性回归的方式，对时间窗口内的样本数据进行统计', value: 'predict_linear'},
        // {name: 'quantile_over_time() — calculate value quantiles over time for input series', value: 'quantile_over_time'},
        {name: 'quantile_over_time() — 范围向量内每个度量指标的样本数据值分位数，φ-quantile (0 ≤ φ ≤ 1)', value: 'quantile_over_time'},
        // {name: 'rate() — calculate per-second increase over a range vector (for counters)', value: 'rate'},
        {name: 'rate() — 计算区间向量 v 在时间窗口内平均增长速率', value: 'rate'},
        // {name: 'resets() — return number of value decreases (resets) in input series of time', value: 'resets'},
        {name: 'resets() — 对于每个时间序列，它都返回一个计数器重置的次数。两个连续样本之间的值的减少被认为是一次计数器重置', value: 'resets'},
        // {name: 'round() — round values of input series to nearest integer', value: 'round'},
        {name: 'round() — 返回向量中所有样本值的最接近的整数', value: 'round'},
        // {name: 'scalar() — convert single-element series vector into scalar value', value: 'scalar'},
        {name: 'scalar() — 返回其唯一的时间序列的值作为一个标量。如果度量指标的样本数量大于 1 或者等于 0, 则返回 NaN', value: 'scalar'},
        // {name: 'sort() — sort input series ascendingly by value', value: 'sort'},
        {name: 'sort() — 对向量按元素的值进行升序排序，返回结果：key: value = 度量指标：样本值[升序排列]', value: 'sort'},
        // {name: 'sort_desc() — sort input series descendingly by value', value: 'sort_desc'},
        {name: 'sort_desc() — 对向量按元素的值进行降序排序，返回结果：key: value = 度量指标：样本值[降序排列]', value: 'sort_desc'},
        // {name: 'sqrt() — return the square root for input series', value: 'sqrt'},
        {name: 'sqrt() — 返回向量 v 中所有元素的平方根', value: 'sqrt'},
        // {name: 'stddev_over_time() — calculate the standard deviation within input series over time', value: 'stddev_over_time'},
        {name: 'stddev_over_time() — 计算范围向量内每个度量指标的总体标准偏差', value: 'stddev_over_time'},
        // {name: 'stdvar_over_time() — calculate the standard variation within input series over time', value: 'stdvar_over_time'},
        {name: 'stdvar_over_time() — 计算范围向量内每个度量指标的总体标准方差', value: 'stdvar_over_time'},
        // {name: 'sum_over_time() — calculate the sum over the values of input series over time', value: 'sum_over_time'},
        {name: 'sum_over_time() — 计算范围向量内每个度量指标的求和值', value: 'sum_over_time'},
        // {name: 'time() — return the Unix timestamp at the current evaluation time', value: 'time'},
        {name: 'time() — 返回从 1970-01-01 到现在的秒数。注意：它不是直接返回当前时间，而是时间戳', value: 'time'},
        // {name: 'timestamp() — return the Unix timestamp for the samples in the input vector', value: 'timestamp'},
        {name: 'timestamp() — 返回向量 v 中的每个样本的时间戳(从 1970-01-01 到现在的秒数)', value: 'timestamp'},
        // {name: 'vector() — convert a scalar value into a single-element series vector', value: 'vector'},
        {name: 'vector() — 将标量 s 作为没有标签的向量返回，即返回结果为：key: value= {}, s', value: 'vector'},
        // {name: 'year() — return the year for provided timestamps', value: 'year'},
        {name: 'year() — 函数返回被给定 UTC 时间的当前年份', value: 'year'},
      ],
    })

    const getFunction = () => {
      const data: any = {
        functionIdentifier: formState.functionIdentifier,
        functionArgs: formState.functionArgs || []
      }

      if (exprChange()?.unknownExpr) {
        data.functionArgs.push(exprChange()?.unknownExpr)
      }
      return data
    }

    const onSubmit = async () => {
      const value = {
        functionCall: getFunction(),
        showLeft: updateLeft,
      }
      await updateExprValue([value, 'functionCall', updateExprIndex, updateQlIndex])
      await queryAllData()
    }

    onMounted(() => {
      content.emit('previewChange', props.functionCall)

      watch(formState, (value) => {
        content.emit('previewChange', getFunction())
      })
    })

    return {
      formState,
      ...toRefs(state),
      onSubmit,
    }
  }
}
</script>

<style scoped lang="less">
@import "index.less";
</style>
