var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    entry: {
      main: "./public/js/main"
    },
    output: {
      filename: "./public/dist/[name].js"
    },
    module: {
      loaders: [
        { test: /\.css$/, loader: ExtractTextPlugin.extract("css")},
        { test: /\.png$/, loader: "url-loader?limit=100000" },
        { test: /\.jpg$/, loader: "file-loader" }
      ]
    },
    plugins: [
      new ExtractTextPlugin("./public/dist/style.css")
    ]
}
