import "./style.scss";

import { INote } from "../../types";
import { Note } from "../Note";

interface IProps {
  notes: INote[];
}

export const NotesList = ({ notes }: IProps) => {
  return (
    <section className="notes-list">
      {notes.map((note) => (
        <Note key={note.title} note={note} listItem />
      ))}
    </section>
  );
};
