export default function generateGraph(numNodes: number) {
    return {
        nodes: Array.from({ length: numNodes }, (_, i) => {
            const id = `${i + 1}`
            return {
                id,
                label: `Node ${Number(id)}`,
                abbreviation: `N${Number(id)}`,
            }
        }),
        edges:
            numNodes > 1
                ? Array.from({ length: numNodes - 1 }, (_, i) => {
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
                  })
                : [
                      {
                          id: 'e1-1',
                          source: '1',
                          target: '1',
                          side: 'contralateral',
                      },
                  ],
    }
}
