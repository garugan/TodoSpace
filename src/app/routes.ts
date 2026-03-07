import { createBrowserRouter } from "react-router";
import { FloatingTasks } from "./components/FloatingTasks";
import { TaskList } from "./components/TaskList";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: FloatingTasks,
  },
  {
    path: "/list",
    Component: TaskList,
  },
]);
