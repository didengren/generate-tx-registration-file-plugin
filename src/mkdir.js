/* eslint-disable no-caller */
/* eslint-disable no-restricted-properties */
const fs = require("fs");
const path = require("path");

// 递归创建目录 异步方法
exports.mkdirs = function(dirname, callback) {
  fs.exists(dirname, function(exists) {
    if (exists) {
      callback();
    } else {
      arguments.callee(path.dirname(dirname), function() {
        fs.mkdir(dirname, callback);
      });
    }
  });
};

// 递归创建目录 同步方法
exports.mkdirsSync = function(dirname) {
  if (fs.existsSync(dirname)) {
    return true;
  } else if (arguments.callee(path.dirname(dirname))) {
    fs.mkdirSync(dirname);
    return true;
  }
};

// useage
// mkdirs('hello/a/b/c', () => {
//   console.log('done');
// })
// mkdirsSync('hello/a/b/c');
