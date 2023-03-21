import "./style.scss";

import { ReactNode, useEffect, useState } from "react";
import { Path, resolvePath, useNavigate, useParams } from "react-router-dom";
import { INote } from "../../types";
import { ROUTE } from "../../router";
import { createDinamicUrlString } from "../../utils";
import { localStorageService } from "../../services";

interface IProps {
  note?: INote;
  listItem?: boolean;
}

interface IWrapperProps {
  wrap: boolean;
  link: string | Path;
  children: ReactNode;
}

const NoteWrapper = ({ wrap, children, link }: IWrapperProps) => {
  const navigate = useNavigate();
  const navigateWithLink = () => {
    navigate(link);
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
  const [currentNote, setCurrentNote] = useState<INote | null>(null);

  const { note_id } = useParams();

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
    return (
      <NoteWrapper wrap={listItem} link={link}>
        <h2 className="note__title">{title}</h2>
        <p className="note__description">{description}</p>
        <ul className="note__tags-list">
          <p className="tags-heading">Tags:</p>
          {tags.map((tag) => (
            <li className="tag-item" key={tag}>
              <a href="#">#{tag}</a>
            </li>
          ))}
        </ul>
        <p className="note__created-at">
          Created: {new Date(createdAt).toLocaleDateString()}
        </p>
        <button className="note__button note__button--edit">Edit</button>
        <button className="note__button note__button--delete">Delete</button>
      </NoteWrapper>
    );
  }

  return null;
};
