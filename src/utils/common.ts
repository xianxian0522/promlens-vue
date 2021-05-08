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

export const querySelectData = (value) => {
    let query = value.metricIdentifier
    if (value.labelMatchers.length > 0) {
        query += '{'
        value.labelMatchers.forEach(label => {
            query += label.labelName + label.matchOp + '"' + label.labelValue + '"' + ','
        })
        query = query.slice(0, -1)
        query += '}'
    }
    if (value.offsetExpr?.duration) {
        query += '[' + value.offsetExpr.duration + ']'
    }
    if (value.matrixSelector.duration.slice(0, -1) !== '0') {
        query += ' offset ' + value.matrixSelector.duration
    }
    return query
}

export const queryBinary = (value) => {
    let query = ''
    if (value.left?.vectorSelector) {
        query += querySelectData(value.left.vectorSelector)
    } else if (value.left?.numberLiteral) {
        query += value.left.numberLiteral
    } else if (value.left?.stringLiteral) {
        query += '"' + value.left.stringLiteral + '"'
    } else if (value.left?.binaryExpr) {
        query += queryBinary(value.left.binaryExpr)
    }

    query += ' ' + value.operator + ' '

    if (value.binModifiers?.Bool) {
        query += 'bool '
    }
    if (value.binModifiers?.OnOrIgnoring && Object.prototype.hasOwnProperty.call(value.binModifiers?.OnOrIgnoring, 'On')) {
        query += 'on('
        if (value.binModifiers?.OnOrIgnoring.On?.length > 0) {
            query += value.binModifiers?.OnOrIgnoring.On.join(',')
        }
        query += ') '
    } else if (value.binModifiers?.OnOrIgnoring.Ignoring?.length > 0) {
        query += 'ignoring(' + value.binModifiers?.OnOrIgnoring.Ignoring.join(',') + ') '
    }

    if (value.right?.numberLiteral) {
        query += value.right.numberLiteral
    } else if (value.right?.stringLiteral) {
        query += '"' + value.right.stringLiteral + '"'
    } else if (value.right?.binaryExpr) {
        query += queryBinary(value.right.binaryExpr)
    } else if (value.right?.vectorSelector) {
        query += querySelectData(value.right.vectorSelector)
    }

    return query
}
