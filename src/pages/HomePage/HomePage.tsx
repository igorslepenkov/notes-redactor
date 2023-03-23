import "./styles.scss";

import { useEffect, useState } from "react";
import { Outlet, resolvePath, useNavigate } from "react-router-dom";
import { NotesList } from "../../components";
import { LocalStorageEndpoint } from "../../services";
import { INote } from "../../types";
import { ROUTE } from "../../router";
import { useLocalStorageState, ValueType } from "../../hooks";
import { notesRepository } from "../../repositories";
import { useSearchParams } from "react-router-dom";

export const HomePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filterSearch, setFilterSearch] = useState<string>("");

  const onFilterChange: React.ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    if (event.currentTarget) {
      const { value } = event.currentTarget;
      setSearchParams({ filter: value });
    }
  };

  const navigate = useNavigate();
  const openAddForm = () => {
    navigate(resolvePath(ROUTE.AddNewNote, ROUTE.Home));
  };

  const [notesToRender, setNotesToRender] = useState<INote[]>([]);

  const { value: notes } = useLocalStorageState<INote>(
    LocalStorageEndpoint.Notes,
    notesRepository,
    ValueType.Multiple
  );

  const filterNotesByTags = (notes: INote[], filterString: string): INote[] => {
    if (!filterString) return notes;

    const filter = filterString.toLowerCase();
    const tags = filter.split(" ").filter((tag) => !!tag);

    if (tags.length === 0) return [];

    if (tags.length === 1) {
      return notes.filter((note) => {
        const regExp = new RegExp(tags[0], "gim");
        return regExp.test(note.tags.join(" "));
      });
    }

    return notes.filter((note) =>
      tags.some((tag) => {
        const regExp = new RegExp(tag, "gim");
        return note.tags.some((noteTage) => regExp.test(noteTage));
      })
    );
  };

  useEffect(() => {
    const filter = searchParams.get("filter");
    if (filter) {
      setFilterSearch(filter);
    } else {
      setFilterSearch("");
      setSearchParams({});
    }
  }, [searchParams]);

  useEffect(() => {
    if (notes && Array.isArray(notes)) {
      setNotesToRender(filterNotesByTags(notes, filterSearch));
    }
  }, [notes, filterSearch]);

  return (
    <div className="home-page">
      <div className="home-page__wrapper">
        {notes && Array.isArray(notes) && <NotesList notes={notesToRender} />}
        <section className="home-page__dashboard">
          <Outlet />
        </section>
        <input
          className="home-page__search"
          placeholder="Search note by tag"
          value={filterSearch}
          onChange={onFilterChange}
        />
        <button className="home-page__add-btn" onClick={openAddForm}>
          Add new note
        </button>
      </div>
    </div>
  );
};
