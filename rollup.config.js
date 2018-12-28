import serve from "rollup-plugin-serve";
import livereload from "rollup-plugin-livereload";

export default {
  input: "src/app.js",
  output: {
    file: "public/app.js",
    format: "iife",
    name: "flowEngine"
  },
  plugins: [
    serve({ contentBase: "public", host: "192.168.1.3", port: 10001 }),
    livereload({ watch: "public" })
  ]
};
