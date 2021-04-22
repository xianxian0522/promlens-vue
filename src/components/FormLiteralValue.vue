<template>
<div>
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
import {reactive} from "vue";

export default {
  name: "FormLiteralValue",
  setup() {
    const formState = reactive({
      valueType: 'numberLiteral',
      numValue: 0,
      stringValue: '',
    })

    return {
      formState,
    }
  }
}
</script>

<style scoped lang="less">
@import "index.less";
</style>
