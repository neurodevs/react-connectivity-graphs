export interface SimpleNode {
    id: string
    label: string
    abbreviation: string
}

export interface SimpleEdge {
    id: string
    source: string
    target: string
}

export interface LateralizedEdge extends SimpleEdge {
    side: 'ipsilateral' | 'contralateral' | 'bilateral'
}
