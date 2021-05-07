import request from "@/utils/request";
import {reactive, ref, toRefs} from "vue";
import {dataInfo} from "@/utils/common";

const ApiQuery = '/api/v1/query_range';
const ApiLabelName = '/api/v1/label/__name__/values';
const ApiMetadata = '/api/v1/metadata';
const ApiLabels = '/api/v1/labels';
const ApiValue = '/api/v1/label';
const ApiQueryAll = '/api/v1/query';

const metricNameData = ref();
const labelNameData = ref();
const storeState = reactive({
    metricNameData: [],
    labelNameData: [],
})
const queryData = reactive({
    status: '',
    data: [],
    keyInfo: [],
    error: '',
    isLoading: false,
    resultType: '',
})

const promRepository: any = {};
promRepository.queryLabelName = (params?: any) => request.get(`${ApiLabelName}`, params)
    .then((res: any) => {
        metricNameData.value = res.data
        storeState.metricNameData = res.data
    }).catch(err => console.error(err))

promRepository.query = (params?: any) => request.get(`${ApiQuery}`, params).catch(err => console.error(err))

promRepository.queryMetadata = (params?: any) => request.get(`${ApiMetadata}`, params).catch(err => console.error(err))

promRepository.queryLabel = (params?: any) => request.get(`${ApiLabels}`, params)
    .then((res: any) => {
        labelNameData.value = res.data
        storeState.labelNameData = res.data
    }).catch(err => console.error(err))

promRepository.queryValueByLabelName = (labelName: string) => request.get(`${ApiValue}/${labelName}/values`).catch(err => console.error(err))

promRepository.queryAll = (params?: any) => {
    queryData.isLoading = true
    request.get(`${ApiQueryAll}`, params)
        .then((res: any) => {
            queryData.status = res.status
            queryData.data = res.data.result
            queryData.isLoading = false
            queryData.resultType = res.data.resultType
            if (queryData.resultType !== 'scalar') {
                queryData.keyInfo = dataInfo(queryData.data)
            }
            // console.log(res, 'query res', queryData,)
            // return {...res}
        })
        .catch(err => {
            const value = {...err.response.data}
            queryData.status = value.status
            queryData.error = value.error
            queryData.isLoading = false
            // console.log({...err.response}, queryData)
        })
}
// export default promRepository
export {promRepository, metricNameData, labelNameData, queryData}
