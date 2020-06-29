import { useContext } from "react";
import { ViewarApiContext } from "./useViewarApi";

export type ColorOption = {
  [key: string]: string;
}

function useDefaultColorOptions(): ColorOption[] {
  const viewarApi = useContext(ViewarApiContext);

  // Just use first option for each material.
  const colorOptions = viewarApi.roomManager.roomMaterialDescription.reduce((options: any, material: any) => {
    options[material.name] = material.options[0].id;
    return options;
  }, {});

  return colorOptions;
};

export default useDefaultColorOptions;
