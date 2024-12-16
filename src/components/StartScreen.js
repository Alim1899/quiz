import React from "react";

export default function StartScreen({length}) {
  return (
    <div className="start">
      <h2>Welcome to the react Quiz!</h2>
      <h3>{length} questions to test your React mastery</h3>
      <button className="btn btn-ui">Let's start</button>
    </div>
  );
}
