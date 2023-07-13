const path = require("path");

module.exports = {
  entry: "./src/app/layout.js", // Your entry file path
  output: {
    path: path.resolve(__dirname, "dist"), // Output directory path
    filename: "bundle.js", // Output bundle file name
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
    ],
  },
};
