
export default function StartScreen({ length, dispatch }) {
  return (
    <div className="start">
      <h2>Welcome to the react Quiz!</h2>
      <h3>{length} questions to test your React mastery</h3>
      <button
        className="btn btn-ui"
        onClick={() => dispatch({ type: "start" })}
      >
        Let's start
      </button>
    </div>
  );
}
