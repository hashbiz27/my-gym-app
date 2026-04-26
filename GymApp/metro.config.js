const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
const path = require("path");

const config = getDefaultConfig(__dirname);

// react-native-screens sets "react-native": "src/index" in package.json,
// which makes Metro load TypeScript source files. Those fabric component
// files use TypeScript patterns that the @react-native/codegen bundled inside
// babel-preset-expo can't parse, causing a 500 bundling error.
// Redirect to the pre-compiled lib/commonjs output so Metro sees plain JS.
const rnsRoot = path.dirname(
  require.resolve("react-native-screens/package.json")
);
const rnsCommonjs = path.join(rnsRoot, "lib/commonjs/index.js");

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === "react-native-screens") {
    return { type: "sourceFile", filePath: rnsCommonjs };
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = withNativeWind(config, { input: "./global.css" });
