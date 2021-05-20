<template>
<div class="metrics-explorer">
<!--  <div class="fade alert alert-warning show">-->
<!--    <strong>Couldn't load metric metadata: </strong>-->
<!--  </div>-->
  <div class="fade alert alert-secondary show ">
    <strong>Loading metric metadata: </strong>
  </div>
  <div>
    <div class="form-group">
      <label class="form-label">Filter metrics by:</label>
      <div style="display: flex; align-items: flex-start;">
        <a-input v-model:value="searchMata" class="metric-name-filter form-control form-control-sm" placeholder="Enter text to filter metric names by..."/>
        <a-button style="font-size: 0.75rem; margin-left: 5px;" class="btn btn-light btn-sm"><CloseOutlined /></a-button>
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
  props: [],
  setup() {
    const state = reactive({
      searchMata: '',
      metadata: [] as metaItem[],
    })

    const queryMeta = async () => {
      try {
        const data = await promRepository.queryMetadata()
        Object.keys(data?.data).map(key => {
          state.metadata.push({
            name: key,
            value: data?.data[key],
          })
        })
      } catch (e) {
        // console.error(e)
      }
    }

    onMounted(() => {
      queryMeta()
    })

    return {
      ...toRefs(state),
    }
  },
}
</script>

<style scoped lang="less">
@import "../components/index.less";
.data-table.table {
  margin: 5px 0 0;
  border: none;
}
.table-bordered, .table-bordered td, .table-bordered th {
  border: 1px solid #dee2e6;
}
.table {
  width: 100%;
  margin-bottom: 1rem;
  color: #212529;
  border-collapse: collapse;
}
.table tr td:first-child {
  min-width: 600px;
}
.metrics-explorer .data-table td.metadata-help, .metrics-explorer .data-table td.metadata-type, .parse-error {
  font-family: "Open Sans","Lucida Sans Unicode","Lucida Grande",sans-serif;
}
.metrics-explorer .data-table td.metadata-help {
  color: maroon;
}
.metrics-explorer .data-table td.metadata-type {
  font-style: italic;
  color: teal;
}
.data-table>tbody>tr:first-child>td {
  border-top: none;
}
.data-table>tbody>tr>td {
  border-bottom: 1px solid #eee;
  border-right: 1px solid #eee;
  padding: 5px 18px;
  //font-size: .8em;
  vertical-align: middle;
  white-space: pre-wrap;
  font-family: "DejaVu Sans Mono",monospace;
}
.table-bordered, .table-bordered td, .table-bordered th {
  border: 1px solid #dee2e6;
}
.table-sm td, .table-sm th {
  padding: .3rem;
}
.table td, .table th {
  padding: .75rem;
  vertical-align: top;
  border-top: 1px solid #dee2e6;
}
</style>
