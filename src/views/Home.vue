<template>
<div>
  <a-button type="primary" @click="submit">Primary</a-button>
</div>
</template>

<script lang="ts">

import promRepository from "@/api/promRepository";

export default {
  name: "Home",
  setup() {
    const submit = async () => {
      const data = await promRepository.queryLabel()
      console.log(data);
    }

    return {
      submit
    }
  }
}
</script>

<style scoped lang="less">

</style>
