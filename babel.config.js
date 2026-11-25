// Copyright (c) 2026 Sniff Labs LLC. All rights reserved.
module.exports = function (api) {
    api.cache(true);
    return {
        presets: ['babel-preset-expo', 'module:react-native-dotenv'],
        env: {
            production: {
                plugins: ['react-native-paper/babel'],
            },
        },
    };
};

