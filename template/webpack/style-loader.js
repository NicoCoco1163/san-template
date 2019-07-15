const loaders = [
    'style-loader',
    {
        loader: 'css-loader',
        options: {
            exportOnlyLocals: false
        }
    },
    'postcss-loader'
];

module.exports = [
    {
        test: /\.(sa|sc|c)ss$/,
        use: loaders.concat([
            {
                loader: 'sass-loader',
                options: {
                    // using Dart Sass
                    implementation: require('sass'),
                    // sync compilation is twice as fast as async compilation by default
                    // call async importers from the sync code path
                    fiber: require('fibers')
                }
            }
        ])
    },
    {
        test: /\.less$/,
        use: loaders.concat({
            loader: 'less-loader',
            options: {
                modifyVars: {},
                javascriptEnabled: true
            }
        })
    }
];
