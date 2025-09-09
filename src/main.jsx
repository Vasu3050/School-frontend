import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./index.css";
import { Provider } from "react-redux";
import store from "./store/store.js";
import App from "./App.jsx";
import HomePage from "./pages/HomePage.jsx";
import ContactUsPage from "./pages/ContactUsPage.jsx";
import LogInPage from "./pages/LogInPage.jsx";
import GalleryPage from "./pages/GalleryPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import Redirecting from "./components/Redirecting.jsx";
import LoggingOut from "./components/LoggingOut.jsx"
import AdminLayout from "./layouts/AdminLayout.jsx";
import ParentLayout from "./layouts/ParentLayout.jsx";
import TeacherLayout from "./layouts/teacherLayout.jsx";

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
        path: "contact",
        element: <ContactUsPage />,
      },

      {
        path: "login",
        element: <LogInPage />,
      },

      {
        path: "gallery",
        element: <GalleryPage />,
      },

      {
        path: "register",
        element: <RegisterPage />,
      },
      {
        path: "redirecting",
        element: <Redirecting />,
      },
      {
        path: "logOut",
        element: <LoggingOut />,
      },
      {
        path: "admin",
        element: <AdminLayout />,
      },
      {
        path: "teacher",
        element: <TeacherLayout />,
      },
      {
        path: "parent",
        element: <ParentLayout />,
      },
    ],
  },
]);

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </Provider>
  </StrictMode>
);
