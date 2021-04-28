<template>
<div >
  <a-form layout="vertical" :model="formState" class="small">
    <a-form-item label="Value type:">
      <a-select v-model:value="formState.valueType">
        <a-select-option value="numberLiteral">number (scalar)</a-select-option>
        <a-select-option value="stringLiteral">string</a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item v-if="formState.valueType === 'numberLiteral'" label="Numeric value:">
      <a-input-number v-model:value="formState.numValue"></a-input-number>
    </a-form-item>
    <a-form-item v-if="formState.valueType === 'stringLiteral'" label="String value:">
      <a-input v-model:value="formState.stringValue"></a-input>
    </a-form-item>
  </a-form>
</div>
</template>

<script lang="ts">
import {onMounted, reactive} from "vue";

export default {
  name: "FormLiteralValue",
  props: ['stringLiteral', 'numberLiteral'],
  emits: ['previewChange'],
  setup(props, content) {
    const formState = reactive({
      valueType: 'numberLiteral',
      numValue: props.numberLiteral || 0,
      stringValue: props.stringLiteral || '',
    })
    if (props.numberLiteral || props.stringLiteral === '') {
      formState.valueType = 'numberLiteral'
    }

    onMounted(() => {
      content.emit('previewChange', formState)
    })

    return {
      formState,
    }
  }
}
</script>

<style scoped lang="less">
@import "index.less";
.tab-content .ant-input-number {
  width: 100%;
}
</style>
