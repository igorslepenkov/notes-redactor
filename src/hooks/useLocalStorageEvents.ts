import { useCallback, useMemo } from "react";
import { LocalStorageEndpoint } from "../services";

export const useLocalStorageEvents = (key: LocalStorageEndpoint) => {
  const setEventName = `${key}-set`;
  const clearEventName = `${key}-clear`;

  const setEvent = useMemo(() => new Event(setEventName), [setEventName]);
  const clearEvent = useMemo(() => new Event(clearEventName), [clearEventName]);

  const setTrigger = useCallback(() => {
    window.dispatchEvent(setEvent);
  }, [setEvent]);

  const clearTrigger = useCallback(
    () => window.dispatchEvent(clearEvent),
    [clearEvent]
  );

  return { setTrigger, setEventName, clearTrigger, clearEventName };
};
