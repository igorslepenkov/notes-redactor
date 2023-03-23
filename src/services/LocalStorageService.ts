import { INote } from "../types";
import { isObjectMatchPartial } from "../utils";

export enum LocalStorageEndpoint {
  Notes = "notes",
}

export interface IGetLocalStorageItemOptions<Type> {
  where?: Partial<Type>;
}

class LocalStorageService {
  private static _instance: LocalStorageService | null = null;

  private constructor() {}

  static get instance(): LocalStorageService {
    if (!LocalStorageService._instance) {
      LocalStorageService._instance = new LocalStorageService();
    }

    return LocalStorageService._instance;
  }

  public get<Type>(
    key: LocalStorageEndpoint,
    options?: IGetLocalStorageItemOptions<Type>
  ): Type | Type[] | null {
    const item = localStorage.getItem(key);

    if (!item) return null;

    const itemValue: Type = JSON.parse(item);
    const isArray = Array.isArray(itemValue);

    if (!isArray) return itemValue;

    return itemValue.filter((item) =>
      isObjectMatchPartial<Type>(item, options?.where)
    );
  }

  public set<Type>(key: LocalStorageEndpoint, value: Type | Type[]): boolean {
    localStorage.setItem(key, JSON.stringify(value));

    return true;
  }

  public setNotes = (value: INote[]): boolean => {
    return this.set(LocalStorageEndpoint.Notes, value);
  };

  public getNotes = (
    options: IGetLocalStorageItemOptions<INote>
  ): INote[] | null => {
    const getResult = this.get<INote>(LocalStorageEndpoint.Notes, options);

    if (Array.isArray(getResult)) {
      return getResult;
    }

    return null;
  };

  public getFirstNote = (
    options: IGetLocalStorageItemOptions<INote>
  ): INote | null => {
    const getResult = this.get<INote>(LocalStorageEndpoint.Notes, options);
    if (getResult && !Array.isArray(getResult)) {
      return getResult;
    }

    if (Array.isArray(getResult)) {
      return getResult[0];
    }

    return null;
  };
}

export const localStorageService = LocalStorageService.instance;
