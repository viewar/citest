const getIconsContext = (): any => {
  if (process.env.NODE_ENV === "test") {
    const mock: any = () => ({ default: "div" });
    mock.keys = () => [];

    return mock;
  } else {
    return require.context("./icons", true, /\.svg$/);
  }
}

export default getIconsContext();
