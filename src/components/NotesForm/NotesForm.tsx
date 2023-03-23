import "./style.scss";

import { useRef, useEffect, useState, ReactNode } from "react";
import { useForm } from "react-hook-form";
import { useDebounce, useLocalStorageEvents } from "../../hooks";
import parse from "html-react-parser";
import { removeHashFromHashtag, tagRegExp } from "../../utils";
import { notesRepository } from "../../repositories";
import { LocalStorageEndpoint } from "../../services";
import { resolvePath, useLocation, useNavigate, useParams } from "react-router";
import { ROUTE } from "../../router";
import { useSearchParams } from "react-router-dom";

interface IFormFields {
  title: string;
  description: string;
}

export const NotesForm = () => {
  const location = useLocation();
  const [, setSearchParams] = useSearchParams();

  const { note_id } = useParams();

  const { setTrigger } = useLocalStorageEvents(LocalStorageEndpoint.Notes);

  const [tags, setTags] = useState<string[]>([]);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    watch,
  } = useForm<IFormFields>();

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
      const areOtherWordsMatch = tags.some(
        (tag) => !!description?.match(new RegExp(`[^>#]${tag}[^<]`, "gim"))
      );
      const matches = description.match(tagRegExp);

      if (matches) {
        matches.forEach((match) => {
          if (description) {
            description = description.replace(
              match,
              `<span className="interactive-textarea__hashtag">${match}</span>`
            );
          }
        });
      }

      if (areOtherWordsMatch) {
        tags.forEach((tag) => {
          description = description?.replace(
            new RegExp(`([^>#_]${tag}[^<"])`, "gim"),
            `<span className="interactive-textarea__hashtag">$1</span>`
          );
        });
      }

      return parse(description);
    }
  };

  const navigate = useNavigate();

  const onSubmit = (data: IFormFields) => {
    if (note_id) {
      notesRepository.update(note_id, { ...data, tags });
    } else {
      notesRepository.create({ ...data, tags });
    }

    setTrigger();
    reset();
    navigate(ROUTE.Home);
  };

  useEffect(() => {
    if (note_id) {
      const note = notesRepository.getOne({ where: { id: note_id } });
      if (note) {
        setValue("title", note.title);
        setValue("description", note.description);
      }
    }
  }, []);

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

  useEffect(() => {
    if (
      location.pathname === resolvePath(ROUTE.AddNewNote, ROUTE.Home).pathname
    ) {
      reset();
    }

    if (note_id) {
      const note = notesRepository.getOne({ where: { id: note_id } });
      if (note) {
        setValue("title", note.title);
        setValue("description", note.description);
      }
    }
  }, [location.pathname]);

  return (
    <form className="notes-form" onSubmit={handleSubmit(onSubmit)}>
      <section className="notes-form__form-control">
        <label htmlFor="title" className="notes-form__label">
          Title
        </label>
        <input
          id="title"
          type="text"
          placeholder="Enter title"
          className="notes-form__input"
          {...register("title", {
            required: "Please enter your title",
            minLength: {
              value: 3,
              message:
                "Your description has to be at least 3 characters length",
            },
            maxLength: {
              value: 50,
              message: "Your title should not be over 50 characters length",
            },
          })}
        />
        {errors.title && (
          <p className="notes-form__error">{errors.title.message}</p>
        )}
      </section>

      <section className="notes-form__form-control flex-1">
        <label htmlFor="description" className="notes-form__label">
          Description
        </label>

        <div className="notes-form__interactive-textarea flex-1">
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
              minLength: {
                value: 3,
                message:
                  "Your description has to be at least 3 characters length",
              },
            })}
          />
        </div>

        <p className="notes-form__tags">
          Tags:
          {tags &&
            tags.map((tag) => (
              <button
                key={tag}
                className="tag"
                onClick={() => setSearchParams({ filter: tag })}
              >
                {tag}
              </button>
            ))}
        </p>

        {errors.description && (
          <p className="notes-form__error">{errors.description.message}</p>
        )}
      </section>

      <button className="notes-form__submit-btn" type="submit">
        Submit
      </button>
    </form>
  );
};
