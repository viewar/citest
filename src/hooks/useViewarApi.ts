import { createContext, useContext } from "react";
import viewarApi from "viewar-api";

export const ViewarApiContext = createContext<typeof viewarApi>(undefined);

function useViewarApi() {
  return useContext(ViewarApiContext);
};

export default useViewarApi;
