import { useCallback, useEffect, useMemo, useState } from "react";
import { Repository } from "../repositories";
import {
  generateLocalStorageEventsTriggers,
  LocalStorageEndpoint,
  localStorageService,
} from "../services";

interface IUseLocalStorageStateReturn<Type> {
  value: Type | Type[] | null;
  setTrigger: () => void;
  clearTrigger: () => void;
}

export enum ValueType {
  Single = "signle",
  Multiple = "multiple",
}

export const useLocalStorageState = <Type>(
  key: LocalStorageEndpoint,
  repository: Repository<Type>,
  type: ValueType
): IUseLocalStorageStateReturn<Type> => {
  const fetchValue = useMemo(
    () =>
      type === ValueType.Single
        ? () => localStorageService.get<Type>(key, { where: {} })
        : () => repository.getMany({ where: {} }),
    [key, repository, type]
  );

  const [value, setValue] = useState<Type | Type[] | null>(null);

  const { setTrigger, clearEventName, clearTrigger, setEventName } =
    generateLocalStorageEventsTriggers(key);

  const fetchData = useCallback(() => {
    const saved = fetchValue();

    if (!saved || (Array.isArray(saved) && saved.length === 0))
      localStorageService.set(key, null);

    if (saved) {
      setValue(saved);
    }
  }, [key, fetchValue]);

  const clearData = useCallback(() => {
    setValue(null);
  }, []);

  useEffect(() => {
    fetchData();

    window.addEventListener(setEventName, fetchData);
    window.addEventListener(clearEventName, clearData);

    return () => {
      window.removeEventListener(setEventName, fetchData);
      window.removeEventListener(clearEventName, clearData);
    };
  }, [fetchData, clearData, key, setEventName, clearEventName]);

  return { value, setTrigger, clearTrigger };
};
