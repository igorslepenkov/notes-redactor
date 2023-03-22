import "./style.scss";

import { useRef, useEffect, useState, ReactNode } from "react";
import { useForm } from "react-hook-form";
import { useDebounce } from "../../hooks";
import parse from "html-react-parser";
import { removeHashFromHashtag, tagRegExp } from "../../utils";

interface IFormFields {
  title: string;
  description: string;
}

export const AddNewNoteForm = () => {
  const [tags, setTags] = useState<string[]>([]);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<IFormFields>();
  register("description", {
    required: "Please enter your description",
    minLength: 3,
    maxLength: 50,
  });

  const labelRef = useRef<HTMLLabelElement>(null);

  const descriptionValue = watch("description");
  const debouncedDescriptionValue = useDebounce(descriptionValue, 500);

  const getTagsFromDescription = (description: string) => {
    const descriptionText = description;
    const regExp = tagRegExp;
    const tagsArray = descriptionText.match(regExp);
    if (tagsArray) {
      const uniqueValues = Array.from(new Set(tagsArray));
      setTags(uniqueValues.map(removeHashFromHashtag));
    }
  };

  const changeTagsInDescriptionText = (
    description: string | undefined
  ): ReactNode => {
    if (description) {
      const matches = description.match(tagRegExp);

      if (matches) {
        matches.forEach((match) => {
          if (description) {
            description = description.replace(
              match,
              `<a href="#">${match}</a>`
            );
          }
        });
      }

      return parse(description);
    }
  };

  const onSubmit = (data: IFormFields) => {
    console.log(data);
    console.log(tags);
    // notesRepository.create({ ...data, tags });
    reset();
  };

  useEffect(() => {
    if (
      debouncedDescriptionValue &&
      tagRegExp.test(debouncedDescriptionValue)
    ) {
      getTagsFromDescription(debouncedDescriptionValue);
    } else {
      setTags([]);
    }
  }, [debouncedDescriptionValue]);

  return (
    <form className="add-note-form" onSubmit={handleSubmit(onSubmit)}>
      <section className="add-note-form__form-control">
        <label htmlFor="title" className="add-note-form__label">
          Title
        </label>
        <input
          id="title"
          type="text"
          placeholder="Enter title"
          className="add-note-form__input"
          {...register("title", {
            required: "Please enter your title",
            minLength: 3,
            maxLength: 50,
          })}
        />
        {errors.title && (
          <p className="add-note-form__error">{errors.title.message}</p>
        )}
      </section>

      <section className="add-note-form__form-control flex-1">
        <label htmlFor="description" className="add-note-form__label">
          Description
        </label>

        <div className="add-note-form__interactive-textarea flex-1">
          <label
            htmlFor="description"
            className="interactive-textarea__description-wrapper flex-1"
            ref={labelRef}
          >
            {changeTagsInDescriptionText(descriptionValue)}
          </label>
          <textarea
            id="description"
            placeholder="Enter description"
            className="interactive-textarea__textarea"
            {...register("description", {
              required: "Please enter your description",
              minLength: 3,
              maxLength: 50,
            })}
          />
        </div>

        <p className="add-note-form__tags">
          Tags:
          {tags &&
            tags.map((tag) => (
              <a key={tag} className="tag">
                {tag}
              </a>
            ))}
        </p>

        {errors.description && (
          <p className="add-note-form__error">{errors.description.message}</p>
        )}
      </section>

      <button className="add-note-form__submit-btn" type="submit">
        Submit
      </button>
    </form>
  );
};
