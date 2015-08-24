System.config({
  baseURL: "/",
  defaultJSExtensions: true,
  transpiler: "babel",
  babelOptions: {
    "optional": [
      "runtime"
    ]
  },
  paths: {
    "github:*": "jspm_packages/github/*",
    "npm:*": "jspm_packages/npm/*"
  },

  map: {
    "babel": "npm:babel-core@5.8.22",
    "babel-runtime": "npm:babel-runtime@5.8.20",
    "core-js": "npm:core-js@1.1.1",
    "github/fetch": "github:github/fetch@0.9.0",
    "jakearchibald/es6-promise": "github:jakearchibald/es6-promise@3.0.2",
    "jquery": "github:components/jquery@2.1.4",
    "piggy-module": "npm:piggy-module@api-storage",
    "sweetalert": "github:t4t5/sweetalert@1.1.0",
    "github:jspm/nodelibs-process@0.1.1": {
      "process": "npm:process@0.10.1"
    },
    "npm:babel-runtime@5.8.20": {
      "process": "github:jspm/nodelibs-process@0.1.1"
    },
    "npm:core-js@1.1.1": {
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "process": "github:jspm/nodelibs-process@0.1.1",
      "systemjs-json": "github:systemjs/plugin-json@0.1.0"
    },
    "npm:piggy-module@api-storage": {
      "validator": "npm:validator@3.43.0"
    },
    "npm:validator@3.43.0": {
      "systemjs-json": "github:systemjs/plugin-json@0.1.0"
    }
  }
});
