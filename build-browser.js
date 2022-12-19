/* eslint import/no-extraneous-dependencies: 0 */
import fs from "fs";
import { rollup } from "rollup";
import babel from "@rollup/plugin-babel";
import babelPresetEnv from "@babel/preset-env";
import pkg from "./package.json";

rollup({
  input: "src/index.js",
  plugins: [
    babel({
      presets: [[babelPresetEnv, { modules: false }]],
      babelrc: false,
      babelHelpers: "bundled",
    }),
  ],
})
  .then((bundle) =>
    bundle.write({
      file: "validator.js",
      format: "umd",
      name: pkg.name,
      banner: `/*!\n${String(fs.readFileSync("./LICENSE"))
        .trim()
        .split("\n")
        .map((l) => ` * ${l}`)
        .join("\n")}\n */`,
    })
  )
  .catch((e) => {
    process.stderr.write(`${e.message}\n`);
    process.exit(1);
  });
