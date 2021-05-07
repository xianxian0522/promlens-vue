export const validatorRule = async (rule, value) => {
    const num = value.slice(0, -1)
    const str = value.slice(-1)
    if (str === 's' || str === 'm' || str === 'h' || str === 'd' || str === 'w' || str === 'y') {
        if (Number(num) || (parseInt(num, 10) === 0 && Number(num) === 0)) {
            return Promise.resolve();
        }
        return Promise.reject('Unable to parse duration string: invalid duration string');
    } else {
        return Promise.reject('Unable to parse duration string: invalid duration string');
    }
}

export const dataInfo = (data) => {
    const value = {}
    const dataInfo: any = []
    data.forEach(item => {
        Object.keys(item.metric).filter(key => key !== '__name__').map((key) => {
            value[key] = []
        })
    })
    data.forEach((item) => {
        Object.keys(item.metric).filter(key => key !== '__name__').map(key => {
            value[key].push(item.metric[key])
        })
    })
    Object.keys(value).map((key, index) => {
        value[key] = Array.from(new Set(value[key]))
        dataInfo.push({
            name: key,
            value: value[key].length
        })
    })

    return dataInfo
}
