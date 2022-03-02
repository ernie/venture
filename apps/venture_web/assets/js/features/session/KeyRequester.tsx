import React, { useRef } from "react";
import { useAppDispatch } from "js/hooks";
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
    <div id="keyRequester">
      <p id="attendeeLink">
        <a href="#" onClick={handleSkip}>I'm an attendee!</a>
      </p>
      <p
        id="presenterLink"
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
        id="keyForm"
        onSubmit={handleSubmit}
        ref={form}
        style={ { display: "none" } }
      >
        <input
          id="keyInput"
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
