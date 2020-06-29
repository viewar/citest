const viewarWebpack = require("@viewar/webpack");

module.exports = env =>
  viewarWebpack(env, {
    type: "react-ts",
  });
