import { useState } from "react";

function useStateToggle(initialValue) {
  const [value, setValue] = useState(initialValue);
  const toggleValue = (e) => {
    if (e) {
      e.stopPropagation();
    }

    setValue(!value);
  };

  // Return setValue as third element (optional), user is probably not needing it.
  return [toggleValue, value, setValue];
}

export default useStateToggle;
