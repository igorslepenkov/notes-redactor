import "./styles.scss";

import { Outlet, resolvePath, useNavigate } from "react-router-dom";
import { NotesList } from "../../components";
import { LocalStorageEndpoint } from "../../services";
import { INote } from "../../types";
import { ROUTE } from "../../router";
import { useLocalStorageState, ValueType } from "../../hooks";
import { notesRepository } from "../../repositories";

export const HomePage = () => {
  const navigate = useNavigate();
  const openAddForm = () => {
    navigate(resolvePath(ROUTE.AddNewNote, ROUTE.Home));
  };

  const { value: notes } = useLocalStorageState<INote>(
    LocalStorageEndpoint.Notes,
    notesRepository,
    ValueType.Multiple
  );

  return (
    <div className="home-page">
      <div className="home-page__wrapper">
        {notes && Array.isArray(notes) && <NotesList notes={notes} />}
        <section className="home-page__dashboard">
          <Outlet />
        </section>
        <button className="home-page__add-btn" onClick={openAddForm}>
          Add new note
        </button>
      </div>
    </div>
  );
};
