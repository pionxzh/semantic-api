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
                    edge: "17",
                    chrome: "67",
                    firefox: "60",
                    safari: "11.1",
                }
            },
        ],
    ]

    const plugins = [
        '@babel/plugin-syntax-object-rest-spread',
        '@babel/plugin-proposal-class-properties',
    ]

    return {
        presets,
        plugins,
    }
}
