import { createBrowserRouter } from "react-router";
import { FloatingTasks } from "./components/FloatingTasks";
import { TaskList } from "./components/TaskList";
import { PrivacyPolicy } from "./components/PrivacyPolicy";
import { Contact } from "./components/Contact";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: FloatingTasks,
  },
  {
    path: "/list",
    Component: TaskList,
  },
  {
    path: "/privacy",
    Component: PrivacyPolicy,
  },
  {
    path: "/contact",
    Component: Contact,
  },
]);
