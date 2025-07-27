// "use client";
// import { RedocStandalone } from "redoc";

// export default function Home() {
//   return (
//     <RedocStandalone
//       specUrl="/.well-known/ai-plugin.json"
//       options={{
//         theme: {
//           colors: {
//             primary: { main: "#ffffff" },
//             text: { primary: "#000000" },
//           },
//         },
//       }}
//     />
//   );
// }

"use client";
import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";

export default function Home() {
  return <SwaggerUI url="/.well-known/ai-plugin.json" />;
}
