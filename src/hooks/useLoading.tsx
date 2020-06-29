import { createContext, useContext } from "react";

type LoadingContextProps = {
  showLoading?: () => void,
  hideLoading?: () => void,
};

export const LoadingContext = createContext<LoadingContextProps>({});

function useLoading() {
  return useContext(LoadingContext);
};

export default useLoading;
