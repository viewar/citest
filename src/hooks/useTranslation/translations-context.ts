import { join } from "path";

const getTranslationsContext = (): any => {
  if (process.env.NODE_ENV === "test") {
    const mock: any = () => ({ Key: "Value" });
    mock.keys = () => ["de"];

    return mock;
  }
  else {
    // module resolvement doesn't work with require.context
    // because it relates on vanilla-node and not on webpack
    return require.context("assets/translations", true, /\.json$/);
    // return require.context(join(process.cwd(), 'src/assets/translations'), true, /\.json$/);
  }
};

export default getTranslationsContext();
