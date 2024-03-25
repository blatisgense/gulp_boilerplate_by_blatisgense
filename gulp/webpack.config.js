import { fileURLToPath } from "url";
import path from "path";
import TerserPlugin from "terser-webpack-plugin";
import { isBuild } from "./_helpers/if.js";

export const webpack_config = () => {
  const filename = fileURLToPath(import.meta.url);
  let dirname = path.dirname(filename).split("\\");
  dirname.pop();
  dirname = dirname.join("\\")
  return {
    entry: { app: `${dirname}/_src/assets/javascript/app.js`},
    output: {
      path: `${dirname}/_build/assets/javascript/`,
      filename: "[name].js",
      publicPath: "/",
    },
    mode: isBuild ? "production" : "development",
    optimization: {
      minimize: true,
      minimizer: [new TerserPlugin()],
      moduleIds: "named"
    },
    devtool: "source-map",
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
          resolve: {
            fullySpecified: false,
          },
        },
      ],
    },
  };
};
