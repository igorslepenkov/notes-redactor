import { INote } from "../../types";

interface IProps {
  note: INote;
  listItem: boolean;
}

export const Note = ({ note }: IProps) => {
  return (
    <article className="note">
      <h2 className="note__title">{note.title}</h2>
      <p className="note__description">{note.description}</p>
      <div className="note__footer">
        <p className="note_created-at">{note.createdAt}</p>
      </div>
    </article>
  );
};
