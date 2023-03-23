import "./style.scss";

import { ReactNode, useEffect, useState } from "react";
import {
  Path,
  resolvePath,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { INote } from "../../types";
import { ROUTE } from "../../router";
import { createDinamicUrlString } from "../../utils";
import { LocalStorageEndpoint, localStorageService } from "../../services";
import { notesRepository } from "../../repositories";
import { useLocalStorageEvents } from "../../hooks";

interface IProps {
  note?: INote;
  listItem?: boolean;
}

interface IWrapperProps {
  wrap: boolean;
  link: string;
  children: ReactNode;
}

const NoteWrapper = ({ wrap, children, link }: IWrapperProps) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const navigateWithLink = () => {
    navigate({
      pathname: link,
      search: searchParams.toString(),
    });
  };

  if (wrap) {
    return (
      <li className="note list-item" onClick={navigateWithLink}>
        {children}
      </li>
    );
  }

  return <article className="note">{children}</article>;
};

export const Note = ({ note, listItem = false }: IProps) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const setFilterParam = (tag: string) => {
    setSearchParams({ filter: tag });
  };

  const { setTrigger } = useLocalStorageEvents(LocalStorageEndpoint.Notes);

  const navigate = useNavigate();
  const [currentNote, setCurrentNote] = useState<INote | null>(null);

  const { note_id } = useParams();

  const deleteNote: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    event.stopPropagation();
    if (currentNote) {
      notesRepository.delete(currentNote.id);
      setTrigger();
      navigate(ROUTE.Home);
    }
  };

  useEffect(() => {
    if (note_id && !note) {
      const storedNote = localStorageService.getFirstNote({
        where: { id: note_id },
      });
      if (storedNote) {
        setCurrentNote(storedNote);
        return;
      }
    }

    if (note) {
      setCurrentNote(note);
      return;
    }
  }, [note_id]);

  if (currentNote) {
    const { id, title, description, tags, createdAt } = currentNote;
    const link = resolvePath(
      createDinamicUrlString(ROUTE.Note, { note_id: id }),
      ROUTE.Home
    );

    const navigateToEdit: React.MouseEventHandler<HTMLButtonElement> = (
      event
    ) => {
      event.stopPropagation();
      navigate(
        resolvePath(
          createDinamicUrlString(ROUTE.EditNote, { note_id: currentNote.id }),
          ROUTE.Home
        )
      );
    };

    return (
      <NoteWrapper wrap={listItem} link={link.pathname}>
        <h2 className="note__title">{title}</h2>
        <p className="note__description">{description}</p>
        <ul className="note__tags-list">
          <p className="tags-heading">Tags:</p>
          {tags.map((tag) => (
            <li className="tag-item" key={tag}>
              <button
                className="tag-item__btn"
                onClick={() => setFilterParam(tag)}
              >
                #{tag}
              </button>
            </li>
          ))}
        </ul>
        <p className="note__created-at">
          Created: {new Date(createdAt).toLocaleDateString()}
        </p>
        <section className="note__buttons">
          <button
            className="note__button note__button--edit"
            onClick={navigateToEdit}
          >
            Edit
          </button>
          <button
            className="note__button note__button--delete"
            onClick={deleteNote}
          >
            Delete
          </button>
        </section>
      </NoteWrapper>
    );
  }

  return null;
};
