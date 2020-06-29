module.exports = {
  testPathIgnorePatterns: ["<rootDir>/node_modules/"],
  setupFilesAfterEnv: ["@testing-library/jest-dom/extend-expect"],
  moduleNameMapper: {
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
      "<rootDir>/__mocks__/fileMock.js",
    "\\.(scss|less)$": "identity-obj-proxy",
    "^hooks/(.*)$": "<rootDir>/src/hooks/$1",
    "^components/(.*)$": "<rootDir>/src/components/$1",
    "^pages/(.*)$": "<rootDir>/src/pages/$1",
    "^css/(.*)$": "<rootDir>/css/$1",
    "^assets/(.*)$": "<rootDir>/assets/$1",
  },
};
