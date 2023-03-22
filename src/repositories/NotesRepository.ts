import { v4 as uuidv4 } from "uuid";
import { ICreateNote, INote, IUpdateNote } from "../types";
import {
  IGetLocalStorageItemOptions,
  localStorageService,
} from "../services/LocalStorageService";
import { Repository } from "./Repository";

class Note implements INote {
  id: string;
  title: string;
  description: string;
  tags: string[];
  createdAt: number;

  constructor({ title, description, tags }: ICreateNote) {
    this.id = uuidv4();
    this.title = title;
    this.description = description;
    this.tags = tags;
    this.createdAt = Date.now();
  }
}

export class NotesRepository extends Repository<INote> {
  private static _instance: NotesRepository | null = null;

  private constructor() {
    super();
  }

  static get instance() {
    if (!NotesRepository._instance) {
      NotesRepository._instance = new NotesRepository();
    }

    return NotesRepository._instance;
  }

  public index(): INote[] {
    const result = localStorageService.getNotes({});

    if (!result) return [];

    return result;
  }

  public getById(id: string): INote | null {
    return localStorageService.getFirstNote({ where: { id } });
  }

  public getMany(
    options: IGetLocalStorageItemOptions<INote> = { where: {} }
  ): INote[] {
    const result = localStorageService.getNotes(options);

    if (!result) return [];

    return result;
  }

  public getOne(
    options: IGetLocalStorageItemOptions<INote> = { where: {} }
  ): INote | null {
    const result = localStorageService.getFirstNote(options);

    if (!result) return null;

    return result;
  }

  public create(noteData: ICreateNote): INote[] {
    const newNote = new Note(noteData);

    const notes = localStorageService.getNotes({});

    if (!notes) {
      const newArray = [newNote];
      localStorageService.setNotes(newArray);
      return newArray;
    }

    notes.push(newNote);
    localStorageService.setNotes(notes);

    return notes;
  }

  public delete(id: string): INote[] | null {
    const notes = localStorageService.getNotes({});

    if (!notes) return null;

    const filteredNotes = notes.filter((note) => note.id !== id);
    localStorageService.setNotes(filteredNotes);

    return filteredNotes;
  }

  public update(
    id: string,
    { title, description, tags }: IUpdateNote
  ): INote[] {
    const notes = localStorageService.getNotes({});

    if (!notes) return [];

    const noteToUpdate = notes.splice(
      notes.findIndex((item) => item.id === id),
      1
    )[0];

    const newObject: INote = {
      ...noteToUpdate,
    };

    if (title) newObject.title = title;
    if (description) newObject.description = description;
    if (tags) newObject.tags = tags;

    notes.push(newObject);
    localStorageService.setNotes(notes);

    return notes;
  }
}

export const notesRepository = NotesRepository.instance;
