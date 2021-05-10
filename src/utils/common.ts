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

export const queryExpr = (value) => {
    let query = ''
    if (value?.vectorSelector) {
        query += querySelectData(value?.vectorSelector)
    } else if (value?.numberLiteral) {
        query += value?.numberLiteral
    } else if (value?.stringLiteral) {
        query += '"' + value?.stringLiteral + '"'
    } else if (value?.binaryExpr) {
        query += queryBinary(value?.binaryExpr)
    } else if (value?.aggregateExpr) {
        query += queryAggregate(value?.aggregateExpr)
    } else if (value?.functionCall) {
        query += queryFunction(value?.functionCall)
    } else if (value?.subqueryExpr) {
        query += querySubquery(value?.subqueryExpr)
    } else if (value?.parenExpr) {
        query += queryParentheses(value?.parenExpr)
    } else if (value?.unaryExpr) {
        query += queryUnary(value?.unaryExpr)
    }

    return query
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
    // if (value.left?.vectorSelector) {
    //     query += querySelectData(value.left.vectorSelector)
    // } else if (value.left?.numberLiteral) {
    //     query += value.left.numberLiteral
    // } else if (value.left?.stringLiteral) {
    //     query += '"' + value.left.stringLiteral + '"'
    // } else if (value.left?.binaryExpr) {
    //     query += queryBinary(value.left.binaryExpr)
    // }
    query += queryExpr(value.left)

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
    if (value.binModifiers?.group && Object.prototype.hasOwnProperty.call(value.binModifiers?.group, 'GroupLeft')) {
        query += 'group_left('
        if (value.binModifiers?.group.GroupLeft?.length > 0) {
            query += value.binModifiers?.group.GroupLeft.join(',')
        }
        query += ') '
    } else if (value.binModifiers?.group && Object.prototype.hasOwnProperty.call(value.binModifiers?.group, 'GroupRight')) {
        query += 'group_right('
        if (value.binModifiers?.group.GroupRight?.length > 0) {
            query += value.binModifiers?.group.GroupRight.join(',')
        }
        query += ') '
    }

    // if (value.right?.numberLiteral) {
    //     query += value.right.numberLiteral
    // } else if (value.right?.stringLiteral) {
    //     query += '"' + value.right.stringLiteral + '"'
    // } else if (value.right?.binaryExpr) {
    //     query += queryBinary(value.right.binaryExpr)
    // } else if (value.right?.vectorSelector) {
    //     query += querySelectData(value.right.vectorSelector)
    // }
    query += queryExpr(value.right)

    return query
}

export const queryAggregate = (value) => {
    let query = value.aggregateOp
    if (value.aggregateModifier && Object.prototype.hasOwnProperty.call(value.aggregateModifier, 'Without')) {
        query += ' without('
        if (value.aggregateModifier.Without?.length > 0) {
            query += value.aggregateModifier.Without.join(',')
        }
        query += ') '
    } else if (value.aggregateModifier.By?.length > 0) {
        query += ' by(' + value.aggregateModifier.By.join(',') + ') '
    }
    query += '('
    if (value.functionArgs?.length > 0) {
        value.functionArgs.forEach(fun => {
            query += queryExpr(fun)
        })
    } else {
        return ''
    }
    query += ')'
    return query
}

export const queryFunction = (value) => {
    let query = value.functionIdentifier + '('
    if (value.functionArgs?.length > 0) {
        value.functionArgs.forEach(fun => {
            query += queryExpr(fun)
        })
    } else {
        return ''
    }
    query += ')'
    return query
}

export const queryParentheses = (value) => {
    let query = '('
    if (value.expr) {
        query += queryExpr(value.expr)
    }
    query += ')'
    return query
}

export const querySubquery = (value) => {
    let query = queryExpr(value.expr)
    if (value.range) {
        query += '[' + value.range + ':'
    }
    if (value.step && value.step.slice(0, -1) !== '0') {
        query += value.step
    }
    query += ']'
    if (value.offsetExpr?.offset) {
        query += ' offset ' + value.offsetExpr.duration
    }
    return query
}

export const queryUnary = (value) => {
    let query = value.unaryOp
    query += queryExpr(value.expr)
    return query
}
