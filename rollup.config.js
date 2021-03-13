import { babel } from "@rollup/plugin-babel";
import eslint from "@rollup/plugin-eslint";
import resolve from "@rollup/plugin-node-resolve";
import json from "@rollup/plugin-json";
import commonjs from "@rollup/plugin-commonjs";
import replace from "@rollup/plugin-replace";
import { terser } from "rollup-plugin-terser";

function onwarn(warning, warn) {
  // skip certain warnings
  if (warning.code === "CIRCULAR_DEPENDENCY") return;
  // Use default for everything else
  warn(warning);
}

export default {
  input: "src/js/main.js",
  onwarn: onwarn,

  output: {
    name: "MyModule",
    file: "bundle.js",
    format: "iife",
    sourceMap: "inline",
    globals: {
      d3: "d3",
      crossfilter2: "crossfilter",
    },
  },

  plugins: [
    resolve({
      jsnext: true,
      main: true,
      browser: true,
    }),
    json(),
    commonjs(),
    eslint({
      include: ["src/js/**"],
      exclude: ["src/css/**"],
    }),

    replace({
      preventAssignment: true,
      ENV: JSON.stringify(process.env.NODE_ENV || "development"),
    }),

    process.env.NODE_ENV === "production" && terser(),
    babel({
      exclude: "node_modules/**",
      babelHelpers: "bundled",
    }),
  ],
};
