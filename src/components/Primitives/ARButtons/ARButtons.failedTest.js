// TODO: fix ARButtons see #5
// import React from "react";
// import ARButtons from "./ARButtons";
// import { render, act } from "@testing-library/react";
// import { ViewarApiContext } from "hooks/useViewarApi";

// const mockViewarApi = {
//   tracker: {
//     active: true,
//   },
//   coreInterface: {
//     call: async () => {},
//   },
// };

// describe("ARButtons", () => {
//   it("renders", () => {
//     const { container } = act(() =>
//       render(
//         <ViewarApiContext.Provider value={mockViewarApi}>
//           <ARButtons />
//         </ViewarApiContext.Provider>
//       )
//     );
//     return expect(container).not.toBeNull();
//   });
// });
