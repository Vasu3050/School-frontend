// src/main.jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";

import "./index.css";
import store from "./store/store.js";

import App from "./App.jsx";
import HomePage from "./pages/HomePage.jsx";
import ContactUsPage from "./pages/ContactUsPage.jsx";
import LogInPage from "./pages/LogInPage.jsx";
import GalleryPage from "./pages/GalleryPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import Redirecting from "./components/Redirecting.jsx";
import LoggingOut from "./components/LoggingOut.jsx";

// Layouts
import AdminLayout from "./layouts/AdminLayout.jsx";
import ParentLayout from "./layouts/ParentLayout.jsx";
import TeacherLayout from "./layouts/TeacherLayout.jsx";

// Admin pages
import AdminDash from "./pages/Admin/AdminDash.jsx";
import ManageStaff from "./pages/Admin/ManageStaff.jsx";
import ManageStudents from "./pages/Admin/ManageStudents.jsx";
import ApproveUsers from "./pages/Admin/ApproveUsers.jsx";
import PhotoGallery from "./pages/Admin/PhotoGallery.jsx";

// Teacher pages
import TeacherDash from "./pages/Teacher/TeacherDash.jsx";
import MyAttendance from "./pages/Teacher/MyAttendance.jsx";
import ManageTeacherStudents from "./pages/Teacher/ManageTeacherStudents.jsx";
import StudentAttendance from "./pages/Teacher/StudentAttendance.jsx";
import TeacherDiary from "./pages/Teacher/TeacherDiary.jsx";
import TeacherPhotoGallery from "./pages/Teacher/TeacherPhotoGallery.jsx";

// Parent pages
import ParentDash from "./pages/Parent/ParentDash.jsx";
import Children from "./pages/Parent/Children.jsx";
import Diary from "./pages/Parent/Diary.jsx";

// ---- Router ----
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "contact", element: <ContactUsPage /> },
      { path: "login", element: <LogInPage /> },
      { path: "gallery", element: <GalleryPage /> },
      { path: "register", element: <RegisterPage /> },
      { path: "redirecting", element: <Redirecting /> },
      { path: "logout", element: <LoggingOut /> },

      // Admin
      {
        path: "admin",
        element: <AdminLayout />,
        children: [
          { index: true, element: <AdminDash /> },
          { path: "staff", element: <ManageStaff /> },
          { path: "students", element: <ManageStudents /> },
          { path: "photo-gallery", element: <PhotoGallery /> },
          { path: "approve-users", element: <ApproveUsers /> },
        ],
      },

      // Teacher
      {
        path: "teacher",
        element: <TeacherLayout />,
        children: [
          { index: true, element: <TeacherDash /> },
          { path: "students", element: <ManageTeacherStudents /> },
          { path: "photo-gallery", element: <TeacherPhotoGallery /> },
          { path: "student-attendance", element: <StudentAttendance /> },
          { path: "my-attendance", element: <MyAttendance /> },
          { path: "daily-diary", element: <TeacherDiary /> },
        ],
      },

      // Parent
      {
        path: "parent",
        element: <ParentLayout />,
        children: [
          { index: true, element: <ParentDash /> },
          { path: "children", element: <Children /> },
          { path: "daily-diary", element: <Diary /> },
        ],
      },
    ],
  },
]);

const queryClient = new QueryClient();

// ---- Render ----
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </Provider>
  </StrictMode>
);
