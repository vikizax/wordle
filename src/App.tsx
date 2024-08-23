import { useEffect, useState, useReducer, memo } from "react";
import "./App.css";
import { data as API_DATA } from "./data";
import { GuessLine } from "./components/GuessLine";

const NUM_GUSSES = 6;
const WORD_LENGTH = 5;

type ReducerState = {
  guesses: string[];
  currentGuess: string;
};

type ReducerAction =
  | {
      type: "SET_GUESS";
      payload: string;
    }
  | {
      type: "SET_GUESSES";
      payload: string[];
    }
  | {
      type: "RESET";
    };

function reducer(state: ReducerState, action: ReducerAction): ReducerState {
  switch (action.type) {
    case "SET_GUESS":
      return {
        ...state,
        currentGuess: action.payload,
      };
    case "SET_GUESSES":
      return {
        ...state,
        guesses: action.payload,
      };
    case "RESET":
      return {
        guesses: Array(NUM_GUSSES).fill(null),
        currentGuess: "",
      };
  }
}

export default function App() {
  const [solution, setSolution] = useState<string | null>(null);
  const [state, dispatch] = useReducer(reducer, {
    guesses: Array(NUM_GUSSES).fill(null),
    currentGuess: "",
  });
  const currentGuessIdx = state.guesses.findIndex((guess) => guess === null);
  const MemoGuessLine = memo(GuessLine);

  function retry() {
    dispatch({ type: "RESET" });
    setSolution(
      API_DATA[Math.floor(Math.random() * API_DATA.length)].toLowerCase()
    );
  }

  const fetchData = () => {
    setSolution(
      API_DATA[Math.floor(Math.random() * API_DATA.length)].toLowerCase()
    );
  };

  const onPressKey = (event: KeyboardEvent) => {
    if (
      state.guesses[NUM_GUSSES - 1] !== null ||
      state.guesses?.includes(solution!)
    )
      return;

    const charCode = event.key.toLowerCase().charCodeAt(0);
    const isLetter =
      event.key.length === 1 &&
      charCode >= "a".charCodeAt(0) &&
      charCode <= "z".charCodeAt(0);

    if (event.key === "Backspace") {
      return dispatch({
        type: "SET_GUESS",
        payload: state.currentGuess.slice(0, -1),
      });
    } else if (
      event.key === "Enter" &&
      state.currentGuess.length === WORD_LENGTH
    ) {
      const currentGuessIdx = state.guesses.findIndex(
        (guess) => guess === null
      );
      const guessesClone = [...state.guesses];
      guessesClone[currentGuessIdx] = state.currentGuess;
      dispatch({ type: "SET_GUESSES", payload: guessesClone });
      dispatch({ type: "SET_GUESS", payload: "" });
      return;
    } else if (state.currentGuess.length < WORD_LENGTH && isLetter) {
      return dispatch({
        type: "SET_GUESS",
        payload: state.currentGuess + event.key.toLowerCase(),
      });
    }
    dispatch({
      type: "SET_GUESS",
      payload: state.currentGuess,
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (solution === null) return;
    window.addEventListener("keydown", onPressKey);
    return () => {
      window.removeEventListener("keydown", onPressKey);
    };
  }, [solution, state]);

  if (solution === null) return null;
  const win = state.guesses.includes(solution);

  return (
    <div className="board">
      <h1 className="header">Wordle</h1>
      {state.guesses.map((guess, i) => (
        <MemoGuessLine
          key={i}
          guess={(i === currentGuessIdx
            ? state.currentGuess
            : guess ?? ""
          ).padEnd(WORD_LENGTH)}
          solution={solution}
          isFinal={currentGuessIdx > i || currentGuessIdx === -1}
        />
      ))}
      {(currentGuessIdx === -1 || win) && (
        <>
          <p className="solution">
            {state.guesses.includes(solution) ? "Correct it's " : "It's "}
            <span>{solution}</span>!
          </p>
          <button className="retry" onClick={retry}>
            {win ? "Play Again" : "Retry"}
          </button>
        </>
      )}
    </div>
  );
}
