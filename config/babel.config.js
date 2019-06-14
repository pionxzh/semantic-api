module.exports = (api) => {
    if (api) api.cache(true)

    const presets = [
        [
            '@babel/preset-typescript',
        ],
        [
            '@babel/env',
            {
                targets: {
                    edge: "18",
                    chrome: "67",
                    firefox: "60",
                    safari: "12",
                }
            },
        ],
    ]

    const plugins = []

    return {
        presets,
        plugins,
    }
}
