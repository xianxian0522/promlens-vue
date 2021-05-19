import {parser} from "lezer-promql";

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
    if (value.labelMatchers?.length > 0) {
        query += '{'
        value.labelMatchers?.forEach(label => {
            query += label.labelName + label.matchOp + '"' + label.labelValue + '"' + ','
        })
        query = query.slice(0, -1)
        query += '}'
    }
    if (value.offsetExpr?.duration) {
        query += '[' + value.offsetExpr.duration + ']'
    }
    if (value.matrixSelector?.duration && value.matrixSelector?.duration?.slice(0, -1) !== '0') {
        query += ' offset ' + value.matrixSelector?.duration
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
    } else if (value.binModifiers?.OnOrIgnoring?.Ignoring?.length > 0) {
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
        if (value.aggregateModifier?.Without?.length > 0) {
            query += value.aggregateModifier.Without.join(',')
        }
        query += ') '
    } else if (value.aggregateModifier?.By?.length > 0) {
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
    if ( value.functionArgs?.length > 0) {
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
        query += ' offset ' + value.offsetExpr?.duration
    }
    return query
}

export const queryUnary = (value) => {
    let query = value.unaryOp
    query += queryExpr(value.expr)
    return query
}

export const exprParser = (value) => {
    try {
        const tr = parser.configure({strict: true}).parse(value)
        // print(tr)
        // console.log(treeToModel(tr.cursor(), value), '...........')
        return treeToModel(tr.cursor(), value)
    } catch (e) {
        // console.error(e)
        // return e
    }
}
const treeToModel = (c: any, str: string, exprStr?: string, length?: number) => {
    console.log(c.name, 'ccccc')
    if (c.name === 'PromQL') {
        c.next()
        return treeToModel(c, str, exprStr, length)
    }
    if (c.name === 'Expr') {
        c.next()
        if (c.name === 'MatrixSelector') {
            return treeToModel(c, str, 'matrixSelector')
        }
        if (c.name === 'OffsetExpr') {
            return treeToModel(c, str, 'offsetExpr')
        }
        if (c.name === 'VectorSelector') {
            return {
                vectorSelector: treeToModel(c, str, exprStr, c.to - c.from)
            }
        }
        if (c.name === 'FunctionCall') {
            return {
                functionCall: treeToModel(c, str, exprStr)
            }
        }
        if (c.name === 'AggregateExpr') {
            return {
                aggregateExpr: treeToModel(c, str, exprStr, c.to - c.from)
            }
        }
        if (c.name === 'ParenExpr') {
            return {
                parenExpr: treeToModel(c, str, exprStr)
            }
        }
        if (c.name === 'BinaryExpr') {
            return {
                binaryExpr: treeToModel(c, str, exprStr)
            }
        }
        if (c.name === 'NumberLiteral') {
            return {
                numberLiteral: Number(str.substring(c.from, c.to))
            }
        }
        if (c.name === 'StringLiteral') {
            return {
                stringLiteral: (str.substring(c.from, c.to)).slice(1, -1)
            }
        }
        if (c.name === 'SubqueryExpr') {
            return {
                subqueryExpr: treeToModel(c, str, exprStr)
            }
        }
        if (c.name === 'UnaryExpr') {
            return {
                unaryExpr: treeToModel(c, str, exprStr)
            }
        }
    }
    if (c.name === 'VectorSelector') {
        c.next()
        const metricIdentifier = treeToModel(c, str)
        if (!c.next()) {
            return {
                metricIdentifier,
            }
        }
        let labelMatchers
        if (c.name === 'LabelMatchers') {
            labelMatchers = treeToModel(c, str)
        }
        let matrixSelector
        if (exprStr === 'matrixSelector') {
            if (c.name === 'Duration') {
                matrixSelector = {
                    duration: str.substring(c.from, c.to)
                }
            } else {
                c.next()
                matrixSelector = {
                    duration: treeToModel(c, str)
                }
            }
        }
        let offsetExpr
        if (exprStr === 'offsetExpr') {
            c.next()
            offsetExpr = {
                offset: true,
                duration: treeToModel(c, str)
            }
        }
        return {
            metricIdentifier,
            labelMatchers,
            matrixSelector,
            offsetExpr,
        }
    }
    if (c.name === 'MetricIdentifier') {
        c.next()
        return treeToModel(c, str)
    }
    if (c.name === 'Identifier') {
        return str.substring(c.from, c.to)
    }
    if (c.name === 'LabelMatchers') {
        c.next()
        if (c.name == 'LabelMatchList') {
            return treeToModel(c, str)
        }
        return []
    }
    if (c.name === 'LabelMatchList') {
        c.next()
        if (c.name == 'LabelMatcher') {
            return [treeToModel(c, str)]
        }
        if (c.name == 'LabelMatchList') {
            const xs = treeToModel(c, str)
            c.next()
            const x = treeToModel(c, str)
            return [...xs, x]
        }
    }
    if (c.name === 'LabelMatcher') {
        c.next()
        const labelName = treeToModel(c, str)
        c.next()
        const matchOp = treeToModel(c, str)
        c.next()
        const labelValue = treeToModel(c, str)
        return {
            labelName,
            matchOp,
            labelValue,
        }
    }
    if (c.name === 'LabelName') {
        return str.substring(c.from, c.to)
    }
    if (c.name === 'MatchOp') {
        c.next()
        return str.substring(c.from, c.to)
    }
    if (c.name === 'StringLiteral') {
        return (str.substring(c.from, c.to)).slice(1, -1)
    }
    if (c.name === 'MatrixSelector') {
        c.next()
        return treeToModel(c, str, exprStr)
    }
    if (c.name === 'OffsetExpr') {
        c.next()
        return treeToModel(c, str, exprStr)
    }
    if (c.name === 'Offset') {
        c.next()
        return str.substring(c.from, c.to)
    }
    if (c.name === 'Duration') {
        return str.substring(c.from, c.to)
    }

    if (c.name === 'FunctionCall') {
        c.next()
        const functionIdentifier = treeToModel(c, str)
        c.next()
        const functionArgs = treeToModel(c, str)
        return {
            functionIdentifier,
            functionArgs,
        }
    }
    if (c.name === 'FunctionIdentifier') {
        c.next()
        return str.substring(c.from, c.to)
    }
    if (c.name === 'FunctionCallBody') {
        c.next()
        if (c.name === 'FunctionCallArgs') {
            return treeToModel(c, str)
        }
        return []
    }
    if (c.name === 'FunctionCallArgs') {
        c.next()
        if (c.name === 'Expr') {
            return [treeToModel(c, str)]
        }
        if (c.name === 'FunctionCallArgs') {
            const xs = treeToModel(c, str)
            c.next()
            const x = treeToModel(c, str)
            return [...xs, x]
        }
    }

    if (c.name === 'AggregateExpr') {
        c.next()
        const aggregateOp = treeToModel(c, str)

        let functionArgs = []
        if (!c.next()) {
            return {
                aggregateOp,
                functionArgs,
            }
        }
        // if (c.to + 2 < Number(length)) {
        //     c.next()
        //     functionArgs = treeToModel(c, str, exprStr, length)
        //     c.next()
        //     aggregateModifier = treeToModel(c, str)
        // }
        functionArgs = treeToModel(c, str, exprStr, length)

        if (c.name === 'AggregateModifier') {
            c.next()
        }

        // 上面c.next() 已执行next() 下面不需要再执行了
        let aggregateModifier
        if (c.name === 'By' || c.name === 'Without' || c.name === 'AggregateModifier') {
            aggregateModifier = treeToModel(c, str)
        }

        return {
            aggregateOp,
            functionArgs,
            aggregateModifier,
        }
    }
    if (c.name === 'AggregateOp') {
        c.next()
        return str.substring(c.from, c.to)
    }
    if (c.name === 'AggregateModifier') {
        c.next()
        return treeToModel(c, str)
    }
    if (c.name === 'By') {
        c.next()
        if (c.name === 'GroupingLabels') {
            return {
                By: treeToModel(c, str)
            }
        }
        return {
            By: []
        }
    }
    if (c.name === 'Without') {
        c.next()
        if (c.name === 'GroupingLabels') {
            return {
                Without: treeToModel(c, str)
            }
        }
        return {
            Without: []
        }
    }
    if (c.name === 'GroupingLabels') {
        c.next()
        if (c.name === 'GroupingLabelList') {
            return treeToModel(c, str)
        }
        return []
    }
    if (c.name === 'GroupingLabelList') {
        c.next()
        if (c.name === 'GroupingLabel') {
            return [treeToModel(c, str)]
        }
        if (c.name === 'GroupingLabelList') {
            const xs = treeToModel(c, str)
            c.next()
            const x = treeToModel(c, str)
            return [...xs, x]
        }
    }
    if (c.name === 'GroupingLabel') {
        c.next()
        return treeToModel(c, str)
    }

    if (c.name === 'ParenExpr') {
        c.next()
        return {
            expr: treeToModel(c, str),
            parentheses: '()'
        }
    }

    if (c.name === 'BinaryExpr') {
        c.next()
        const left = treeToModel(c, str)

        let operator = str.substring(c.from, c.to)

        // c.next()
        // const binModifiers = treeToModel(c, str)

        c.next()
        // console.log(c.name, '---;;;;;;;;', str.substring(c.from, c.to))
        let binModifiers
        let right
        if (c.name !== 'BinModifiers') {
            operator = str.substring(c.from, c.to)
            c.next()
        }
        if (c.name === 'BinModifiers') {
            c.next()
            if (c.name === 'Expr') {
                return {
                    left,
                    operator,
                    right: treeToModel(c, str)
                }
            }
            binModifiers = treeToModel(c, str)
            if (c.name === 'LabelName') {
                c.next()
            }
            right = treeToModel(c, str)
        }
        // else {
        //     operator = str.substring(c.from, c.to)
        //     c.next()
        //     console.log(c.name, '::::')
        //     c.next()
        //     if (c.name === 'Expr') {
        //         return {
        //             left,
        //             operator,
        //             right: treeToModel(c, str)
        //         }
        //     }
        //     binModifiers = treeToModel(c, str)
        //     if (c.name === 'LabelName') {
        //         c.next()
        //     }
        //     right = treeToModel(c, str)
        // }

        return {
            left,
            operator,
            binModifiers,
            right,
        }
    }
    if (c.name === 'On') {
        c.next()
        if (c.name === 'GroupingLabels') {
            return {
                On: treeToModel(c, str)
            }
        }
        return {
            On: []
        }
    }
    if (c.name === 'Ignoring') {
        c.next()
        if (c.name === 'GroupingLabels') {
            return {
                Ignoring: treeToModel(c, str)
            }
        }
        return {
            Ignoring: []
        }
    }
    if (c.name === 'GroupLeft') {
        c.next()
        if (c.name === 'GroupingLabels') {
            return {
                GroupLeft: treeToModel(c, str)
            }
        }
        return {GroupLeft: []}
    }
    if ( c.name === 'GroupRight') {
        c.next()
        if (c.name === 'GroupingLabels') {
            return {
                GroupRight: treeToModel(c, str)
            }
        }
        return {
            GroupRight: []
        }
    }
    if (c.name === 'Bool') {
        c.next()
        const Bool = true
        if (c.name === 'OnOrIgnoring') {
            const ignoring = treeToModel(c, str)
            ignoring.Bool = Bool
            return ignoring
        }
        return {Bool}
    }
    if (c.name === 'OnOrIgnoring') {
        c.next()
        const OnOrIgnoring = treeToModel(c, str)
        let group
        if (c.name === 'GroupLeft' || c.name === 'GroupRight') {
            group = treeToModel(c, str)
        }
        if (c.name === 'LabelName') {
            c.next()
            if (c.name === 'GroupLeft' || c.name === 'GroupRight') {
                group = treeToModel(c, str)
            }
        }
        return {
            OnOrIgnoring,
            group
        }
    }

    if (c.name === 'SubqueryExpr') {
        c.next()
        const expr = treeToModel(c, str)

        const range = str.substring(c.from, c.to)
        if (!c.next()) {
            return {
                expr,
                range,
            }
        }
        let step
        if (c.name === 'Duration') {
            step = str.substring(c.from, c.to)
        }
        if (!c.next()) {
            return {
                expr,
                range,
                step
            }
        }

        const offsetExpr = {
            offset: true,
            duration: treeToModel(c, str)
        }
        return {
            expr,
            range,
            step,
            offsetExpr,
        }
    }
    if (c.name === 'UnaryExpr') {
        c.next()
        const unaryOp = str.substring(c.from, c.to)
        c.next()
        const expr = treeToModel(c, str)
        return {
            unaryOp,
            expr,
        }
    }
}

const print = (tree) => {
    const cursor = tree.cursor()
    do {
        console.log(`Node ${cursor.name} from ${cursor.from} to ${cursor.to}`)
    } while (cursor.next())
}
