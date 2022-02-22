import React, { useRef } from "react";
import { useAppDispatch } from "../../hooks";
import { connect } from "./sessionSlice";

const KeyRequester = () => {
  const dispatch = useAppDispatch();
  const form = useRef(null);
  const presenterLink = useRef(null);
  const key = useRef(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(connect(key.current.value));
    key.current.value = "";
  }

  const handleSkip = (e: React.UIEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    dispatch(connect(":attendee"));
  }

  const showForm = (e: React.UIEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    presenterLink.current.style.display = "none";
    form.current.style.display = "block";
    key.current.focus();
  }

  return (
    <div className="keyRequester">
      <p className="attendeeLink">
        <a href="#" onClick={handleSkip}>I'm an attendee!</a>
      </p>
      <p
        className="presenterLink"
        ref={presenterLink}
      >
        <a
          href="#"
          onClick={showForm}
        >
          I'm just the presenter
        </a>
      </p>
      <form
        className="keyForm"
        onSubmit={handleSubmit}
        ref={form}
      >
        <input
          name="key"
          placeholder="Presenter Key"
          ref={key}
          type="password"
        />
        <button type="submit">Present</button>
      </form>
    </div>
  );

}

export default KeyRequester;
