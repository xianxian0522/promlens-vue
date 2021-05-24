<template>
<div class="metrics-explorer">
<!--  <div class="fade alert alert-warning show">-->
<!--    <strong>Couldn't load metric metadata: </strong>-->
<!--  </div>-->
  <div v-if="isLoading" class="fade alert alert-secondary show ">
    <strong>Loading metric metadata: </strong>
  </div>
  <div v-else>
    <div class="form-group">
      <label class="form-label">Filter metrics by:</label>
      <div style="display: flex; align-items: flex-start;">
        <a-input v-model:value="searchMata" class="metric-name-filter form-control form-control-sm" placeholder="Enter text to filter metric names by..."/>
        <a-button @click="closeMeta" style="font-size: 0.75rem; margin-left: 5px;" class="btn btn-light btn-sm"><CloseOutlined /></a-button>
      </div>
    </div>
    <table class="data-table table table-sm table-bordered table-hover">
      <tbody style="border-top: 1px solid #eeeeee;">
        <tr v-for="(meta) in metadata" :key="meta.name">
          <td>
            <div style="float: left">{{ meta.name }}</div>
            <div style="float: right; margin: -3px 0;">
              <a-button class="btn btn-light btn-sm" style="padding: 0.1rem 0.2rem;"><UploadOutlined /></a-button>
              <a-button class="btn btn-light btn-sm" style="padding: 0.1rem 0.2rem; margin-left: 8px;"><ImportOutlined /></a-button>
            </div>
          </td>
          <td class="metadata-type">
            <span v-for="(item, index) in meta.value" :key="JSON.stringify(item) + index">{{item.type}} <br /> </span>
          </td>
          <td class="metadata-help">
            <span v-for="(item, index) in meta.value" :key="JSON.stringify(item) + index">{{item.help}} <br /> </span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
</template>

<script lang="ts">
import { CloseOutlined, UploadOutlined, ImportOutlined } from '@ant-design/icons-vue'
import {onMounted, reactive, toRefs} from "vue";
import promRepository from "@/api/promRepository";

export interface metaItem {
  name: string;
  value: object;
}

export default {
  name: "MetricsExplorer",
  components: {
    CloseOutlined,
    UploadOutlined,
    ImportOutlined,
  },
  props: ['metaIndex'],
  emits: ['updateMeta'],
  setup(props, content) {
    const state = reactive({
      isLoading: false,
      searchMata: '',
      metadata: [] as metaItem[],
    })

    const queryMeta = async () => {
      state.isLoading = true
      try {
        const data = await promRepository.queryMetadata()
        state.isLoading = false
        Object.keys(data?.data).map(key => {
          state.metadata.push({
            name: key,
            value: data?.data[key],
          })
        })
      } catch (e) {
        state.isLoading = false
        // console.error(e)
      }
    }
    const closeMeta = () => {
      content.emit('updateMeta', [props.metaIndex, false])
    }

    onMounted(() => {
      queryMeta()
    })

    return {
      ...toRefs(state),
      closeMeta,
    }
  },
}
</script>

<style scoped lang="less">
@import "../components/index.less";
</style>
