import { useReducer, useEffect } from "react";
import Loader from "./Static/Loader";
import Error from "./Static/Error";
import StartScreen from "./StartScreen";
import Question from "./Questions/Question";
const initialState = {
  questions: [],
  status: "loading",
  index: 0,
};
const reducer = (state, action) => {
  switch (action.type) {
    case "dataReceived":
      return { ...state, questions: action.payload, status: "ready" };
    case "dataFailed":
      return { ...state, status: "error" };
    case "start":
      return { ...state, status: "active" };

    default:
      throw new Error("Unknown request");
  }
};
const Main = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { questions, status, index } = state;
  useEffect(() => {
    fetch("http://localhost:5000/questions")
      .then((response) => response.json())
      .then((data) => dispatch({ type: "dataReceived", payload: data }))
      .catch((error) => dispatch({ type: "dataFailed" }));
  }, []);
  console.log(state);
  return (
    <>
      <main className="main">
        <p>1/15</p>
        <p>Question?</p>
      </main>
      {status === "loading" && <Loader />}
      {status === "error" && <Error />}
      {status === "ready" && (
        <StartScreen length={questions.length} dispatch={dispatch} />
      )}
      {status === "active" && <Question question={questions[index]} />}
    </>
  );
};

export default Main;

// json-server --watch db.json --port 5000
