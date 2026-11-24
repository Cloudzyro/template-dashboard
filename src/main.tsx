import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createHashRouter, RouterProvider } from "react-router";
import { Layout } from "./components/Layout";
import "./index.css";
import { SignIn, SignUp } from "./pages/Auth";
import { NotFound } from "./pages/NotFound";
import { OrderDetail } from "./pages/OrderDetail";
import { Orders } from "./pages/Orders";
import { Overview } from "./pages/Overview";
import { Settings } from "./pages/Settings";

// A hash router keeps every address after a "#" (for example /#/orders/BL-2300),
// so the server only ever has to send index.html. Deep links and refreshes work
// on any static host with no rewrite rules.
const router = createHashRouter([
  {
    element: <Layout />,
    children: [
      { path: "/", element: <Overview /> },
      { path: "/orders", element: <Orders /> },
      { path: "/orders/:id", element: <OrderDetail /> },
      { path: "/settings", element: <Settings /> },
      { path: "*", element: <NotFound /> },
    ],
  },
  { path: "/sign-in", element: <SignIn /> },
  { path: "/sign-up", element: <SignUp /> },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
