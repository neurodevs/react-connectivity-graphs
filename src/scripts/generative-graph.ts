const numNodes = 10

export default {
    nodes: Array.from({ length: numNodes }, (_, i) => {
        const id = `${i + 1}`
        return {
            id,
            label: `Node ${id}`,
            abbreviation: `N${id}`,
        }
    }),
    edges: Array.from({ length: numNodes - 1 }, (_, i) => {
        const source = `${i + 1}`
        const target = `${i + 2}`
        const side =
            i % 3 === 0
                ? 'ipsilateral'
                : i % 3 === 1
                  ? 'contralateral'
                  : 'bilateral'
        return {
            id: `e${source}-${target}`,
            source,
            target,
            side,
        }
    }),
}
