import { IGetLocalStorageItemOptions } from "../services";

export abstract class Repository<Type> {
  public abstract index(): Type[];

  public abstract getById(id: string): Type | null;

  public abstract getMany(options: IGetLocalStorageItemOptions<Type>): Type[];

  public abstract getOne(
    options: IGetLocalStorageItemOptions<Type>
  ): Type | null;

  public abstract create(noteData: Partial<Type>): Type[];

  public abstract delete(id: string): Type[] | null;

  public abstract update(id: string, options: Partial<Type>): Type[];
}
