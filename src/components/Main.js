import { useReducer, useEffect } from "react";
import Loader from "./Static/Loader";
import Error from "./Static/Error";
import NextButton from "./NextButton";
import StartScreen from "./StartScreen";
import Question from "./Questions/Question";
import Progress from "./Progress";
import FinishScreen from "./FinishScreen";
const initialState = {
  questions: [],
  status: "loading",
  index: 0,
  answer: null,
  points: 0,
  highscore: 0,
};
const reducer = (state, action) => {
  switch (action.type) {
    case "dataReceived":
      return { ...state, questions: action.payload, status: "ready" };
    case "dataFailed":
      return { ...state, status: "error" };
    case "start":
      return { ...state, status: "active" };
    case "newAnswer":
      const question = state.questions.at(state.index);
      console.log(state.points, question.points);
      return {
        ...state,
        answer: action.payload,
        points:
          action.payload === question.correctOption
            ? state.points + question.points
            : state.points,
      };
    case "nextQuestion":
      return { ...state, index: state.index + 1, answer: null };
    case "finish":
      return {
        ...state,
        status: "finished",
        highscore:
          state.points > state.highscore ? state.points : state.highscore,
      };
    default:
      throw new Error("Unknown request");
  }
};
const Main = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { questions, status, index, answer, points, highscore } = state;
  const numQuestions = questions.length;
  const maxPossiblePoints = questions.reduce(
    (prev, cur) => prev + cur.points,
    0
  );

  useEffect(() => {
    fetch("http://localhost:5000/questions")
      .then((response) => response.json())
      .then((data) => dispatch({ type: "dataReceived", payload: data }))
      .catch((error) => dispatch({ type: "dataFailed" }));
  }, []);

  return (
    <>
      <main className="main"></main>
      {status === "loading" && <Loader />}
      {status === "error" && <Error />}
      {status === "ready" && (
        <StartScreen length={questions.length} dispatch={dispatch} />
      )}
      {status === "active" && (
        <>
          <Progress
            index={index}
            numQuestions={numQuestions}
            points={points}
            maxPossiblePoints={maxPossiblePoints}
            answer={answer}
          />
          <Question
            question={questions[index]}
            dispatch={dispatch}
            answer={answer}
          />
          <NextButton
            dispatch={dispatch}
            answer={answer}
            index={index}
            numQuestions={numQuestions}
          ></NextButton>
        </>
      )}
      {status === "finished" && (
        <FinishScreen
          points={points}
          maxPossiblePoints={maxPossiblePoints}
          highscore={highscore}
        />
      )}
    </>
  );
};

export default Main;
