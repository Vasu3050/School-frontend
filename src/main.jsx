// main.jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./index.css";

import App from "./App.jsx";
import HomePage from "./pages/HomePage.jsx";
import AboutPage from "./pages/AboutPage.jsx";
import ContactUsPage from "./pages/ContactUsPage.jsx";
import AdmissionsPage from "./pages/AdmissionsPage.jsx";
import LogInPage from "./pages/LogInPage.jsx";
import GalleryPage from "./pages/GalleryPage.jsx";

// define routes with createBrowserRouter
const router = createBrowserRouter([
  {
    path: "/",           
    element: <App />,    
    children: [
      {
        index: true,     
        element: <HomePage />,
      },
      {
        path: "about",
        element: <AboutPage />,
      },
      {
        path: "contact",
        element: <ContactUsPage />,
      },
      {
        path: "admission",
        element: <AdmissionsPage />,
      },
      {
        path: "login",
        element: <LogInPage />,
      },
      {
        path: "gallery",
        element: <GalleryPage />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
