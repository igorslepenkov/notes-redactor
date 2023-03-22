import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import { App } from "../App";
import { AddNewNoteForm } from "../components";
import { Note } from "../components/Note";
import { HomePage } from "../pages";
import { ROUTE } from "./route";

export const appRouter = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<App />}>
      <Route path={ROUTE.Home} element={<HomePage />}>
        <Route path={ROUTE.Note} element={<Note />} />
        <Route path={ROUTE.AddNewNote} element={<AddNewNoteForm />} />
      </Route>
    </Route>
  )
);
