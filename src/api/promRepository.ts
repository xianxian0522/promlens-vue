import request from "@/utils/request";

const ApiQuery = '/api/v1/query_range';
const ApiLabelName = '/api/v1/label/__name__/values';
const ApiMetadata = '/api/v1/metadata';
const ApiLabels = '/api/v1/labels';
const ApiValue = '/api/v1/label'

const promRepository: any = {};
promRepository.queryLabelName = (params?: any) => request.get(`${ApiLabelName}`, params).catch(err => console.error(err))
promRepository.query = (params?: any) => request.get(`${ApiQuery}`, params).catch(err => console.error(err))
promRepository.queryMetadata = (params?: any) => request.get(`${ApiMetadata}`, params).catch(err => console.error(err))
promRepository.queryLabel = (params?: any) => request.get(`${ApiLabels}`, params).catch(err => console.error(err))
promRepository.queryValueByLabelName = (labelName: string) => request.get(`${ApiValue}/${labelName}/values`).catch(err => console.error(err))

export default promRepository
