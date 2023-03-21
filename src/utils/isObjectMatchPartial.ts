export const isObjectMatchPartial = <Type>(
  object: Type,
  options?: Partial<Type>
): boolean => {
  let result = true;

  for (let key in options) {
    const objValue = object[key];
    const optionsValue = options[key];

    if (Array.isArray(optionsValue) && Array.isArray(objValue)) {
      const areTagsIncluded = optionsValue.some((item) =>
        objValue.includes(item)
      );
      !areTagsIncluded && (result = false);
    } else if (
      typeof objValue === "object" &&
      typeof optionsValue === "object"
    ) {
      const areEqual =
        JSON.stringify(objValue) === JSON.stringify(optionsValue);
      !areEqual && (result = false);
    } else {
      if (object[key] !== options[key]) {
        result = false;
      }
    }
  }

  return result;
};
