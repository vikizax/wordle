import { useEffect, useState } from "react";
import "./App.css";
import { data as API_DATA } from "./data";
import { GuessLine } from "./components/GuessLine";

const NUM_GUSSES = 6;
const WORD_LENGTH = 5;

export default function App() {
  const [solution, setSolution] = useState<string | null>(null);
  const [guesses, setGuesses] = useState<string[]>(
    Array(NUM_GUSSES).fill(null)
  );
  const [currentGuess, setCurrentGuess] = useState<string>("");

  function retry() {
    setCurrentGuess("");
    setGuesses(Array(NUM_GUSSES).fill(null));
    setSolution(
      API_DATA[Math.floor(Math.random() * API_DATA.length)].toLowerCase()
    );
  }

  const fetchData = async () => {
    // const data = await new Promise<string[]>((res) => {
    //   setTimeout(() => res(API_DATA), 800);
    // });
    setSolution(API_DATA[Math.floor(Math.random() * API_DATA.length)].toLowerCase());
  };

  useEffect(() => {
    fetchData();
  }, []);

  const currentGuessIdx = guesses.findIndex((guess) => guess === null);

  useEffect(() => {
    if (solution === null) return;

    const onPressKey = (event: KeyboardEvent) => {
      if (guesses[NUM_GUSSES - 1] !== null || guesses?.includes(solution))
        return;

      const charCode = event.key.toLowerCase().charCodeAt(0);
      const isLetter =
        event.key.length === 1 &&
        charCode >= "a".charCodeAt(0) &&
        charCode <= "z".charCodeAt(0);

      setCurrentGuess((prevGuess) => {
        if (event.key === "Backspace") {
          return prevGuess.slice(0, -1);
        } else if (event.key === "Enter" && prevGuess.length === WORD_LENGTH) {
          const currentGuessIdx = guesses.findIndex((guess) => guess === null);
          const guessesClone = [...guesses];
          guessesClone[currentGuessIdx] = prevGuess;
          setGuesses(guessesClone);
          return "";
        } else if (prevGuess.length < WORD_LENGTH && isLetter) {
          return prevGuess + event.key.toLowerCase();
        }
        return prevGuess;
      });
    };

    window.addEventListener("keydown", onPressKey);

    return () => {
      window.removeEventListener("keydown", onPressKey);
    };
  }, [solution, guesses]);

  if (solution === null) return null;

  return (
    <div className="board">
      <h1 className="header">Wordle</h1>
      {guesses.map((guess, i) => (
        <GuessLine
          key={i}
          guess={(i === currentGuessIdx ? currentGuess : guess ?? "").padEnd(
            WORD_LENGTH
          )}
          solution={solution}
          isFinal={currentGuessIdx > i || currentGuessIdx === -1}
        />
      ))}
      {currentGuessIdx === -1 && (
        <>
          <p className="solution">
            It's <span>{solution}</span>!
          </p>
          <button className="retry" onClick={retry}>
            Retry
          </button>
        </>
      )}
    </div>
  );
}
