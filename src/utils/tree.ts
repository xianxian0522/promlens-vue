export interface PromQL {
    expr: Expr
}
export interface Expr {
    functionCall?: FunctionCall;
    vectorSelector?: VectorSelector;
    // matrixSelector?: MatrixSelector;
    aggregateExpr?: AggregateExpr;
    binaryExpr?: BinaryExpr;
    numberLiteral?: number;
    stringLiteral?: string;
    // offsetExpr?: OffsetExpr;
    parenExpr?: parenExpr;
    subqueryExpr?: SubqueryExpr;
    unaryExpr?: UnaryExpr;
    stepInvariantExpr?: StepInvariantExpr;
    unknownExpr?: Expr;
}
export interface FunctionCall {
    functionIdentifier: string;
    functionArgs: Array<Expr>;
}
export interface VectorSelector {
    metricIdentifier: string;
    labelMatchers: Array<LabelMatcher>;
    matrixSelector?: MatrixSelector;
    offsetExpr?: OffsetExpr;
}
export interface LabelMatcher {
    labelName: string;
    matchOp: string;
    labelValue: string;
}
export interface MatrixSelector {
    expr?: Expr;
    duration: string;
}
export interface AggregateExpr {
    aggregateOp: string;
    aggregateModifier: AggregateModifier;
    functionArgs: Array<Expr>;
}

export interface AggregateModifier {
    By?: Array<string>;
    Without?: Array<string>;
}

export interface BinaryExpr {
    left: Expr;
    operator: string;
    binModifiers?: BinModifiers;
    right: Expr;
}

export interface BinModifiers {
    Bool?: boolean;
    OnOrIgnoring: {
        Ignoring?: Array<string>;
        On?: Array<string>;
    }
    group: {
        GroupLeft?: Array<string>;
        GroupRight?: Array<string>;
    }
}

export interface OffsetExpr {
    expr?: Expr;
    offset: boolean;
    duration: string;
}
export interface SubqueryExpr {
    expr: Expr;
    // duration1: string;
    // duration2?: string;
    range: string;
    offsetExpr?: OffsetExpr;
    step?: string;
}
export interface UnaryExpr {
    unaryOp: string;
    expr: Expr;
}
export interface StepInvariantExpr {
    expr: Expr;
    at?: string;
}
export interface parenExpr {
    expr: Expr;
    parentheses: string;
}
