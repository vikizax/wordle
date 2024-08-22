export function GuessLine({
  guess,
  solution,
  isFinal,
}: {
  guess: string;
  solution: string;
  isFinal: boolean;
}) {
  return (
    <div className="line">
      {guess.split("").map((char, i) => {
        let className = "tile";

        if (isFinal) {
          if (char === solution[i]) {
            className += " correct";
          } else if (solution.includes(char)) {
            className += " close";
          } else {
            className += " incorrect";
          }
        }

        return (
          <div className={className} key={i}>
            {char}
          </div>
        );
      })}
    </div>
  );
}
