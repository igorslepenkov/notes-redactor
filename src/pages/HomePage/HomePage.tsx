import "./styles.scss";

import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { NotesList } from "../../components";
import { localStorageService } from "../../services";
import { INote } from "../../types";

export const HomePage = () => {
  const [notes, setNotes] = useState<INote[]>();
  useEffect(() => {
    const notes = localStorageService.getNotes({});
    if (notes) {
      setNotes(notes);
    }
  }, []);
  if (notes && notes.length !== 0) {
    return (
      <div className="home-page">
        <div className="home-page__wrapper">
          <NotesList notes={notes} />
          <section className="home-page__dashboard">
            <Outlet />
          </section>
          <button className="home-page__add-btn">Add new note</button>
        </div>
      </div>
    );
  }

  return null;
};
