require("polyfill-object.fromentries");

const fs = require("fs");

function GenerateTXRegistrationFilePlugin(
  path = "/CubeModule.json",
  options = {}
) {
  this.path = path;
  this.options = Object.assign(
    {},
    GenerateTXRegistrationFilePlugin.globOptions,
    options
  );
}

GenerateTXRegistrationFilePlugin.globOptions = {
  autoDownload: false,
  identifier: "com.trinasolar.demo.test",
  name: "demo",
  hidden: false,
  build: "1001",
  version: "1.0.01",
  releaseNote: ""
};

GenerateTXRegistrationFilePlugin.dataMatch = function(opts) {
  // eslint-disable-next-line array-callback-return
  const finalEntries = Object.entries(opts).filter((item) => {
    if (
      Object.prototype.hasOwnProperty.call(
        GenerateTXRegistrationFilePlugin.globOptions,
        item[0]
      )
    )
      return item;
  });
  return Object.fromEntries(finalEntries);
};

GenerateTXRegistrationFilePlugin.writeSync = function(path, data, cb) {
  fs.writeFileSync(path, data, "utf-8");
  cb && cb();
};

GenerateTXRegistrationFilePlugin.prototype = {
  apply(compiler) {
    const _this = this;
    _this.onBeforeRun(
      compiler,
      "generate-tx-registration-file-plugin",
      function() {
        _this.init();
      }
    );
  },

  onBeforeRun(compiler, name, hook) {
    if (compiler.hooks) compiler.hooks.beforeRun.tapAsync(name, hook);
    else compiler.plugin("before-run", hook);
  },

  init() {
    const that = this;
    try {
      const data = GenerateTXRegistrationFilePlugin.dataMatch(that.options);
      fs.open(that.path, "r+", (err) => {
        if (err && err.code === "ENOENT")
          that.createFileAndWrite(that.path, data);
        else that.writeInFile(that.path, data);
      });
    } catch (error) {
      console.error("generate-tx-registration-file-plugin:\n", error);
    }
  },

  createFileAndWrite(path, data) {
    GenerateTXRegistrationFilePlugin.writeSync(path, data, function() {
      console.log("天信平台项目注册json文件创建成功");
    });
  },

  writeInFile(path, data) {
    // const oldData = fs.readFileSync(path, "utf-8");
    GenerateTXRegistrationFilePlugin.writeSync(path, data, function() {
      console.log("天信平台项目注册json文件覆盖成功");
    });
  }
};

module.exports = GenerateTXRegistrationFilePlugin;
