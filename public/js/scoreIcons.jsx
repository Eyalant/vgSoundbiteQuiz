function ScoreIcons({ score, numOfQuestions }) {
  function getNumOfGoldCoins() {
    switch (score) {
      case 0:
        return 0;
      case 100:
        return 5;
    }
    let increment = Math.floor(numOfQuestions / 5);
    let lower = 0;
    let upper = increment;
    for (let i = 1; i <= 5; i++) {
      if (lower <= score && upper > score) {
        return i;
      }
      lower = upper;
      upper = increment * (i + 1);
    };
  };

  const goldenCoins = getNumOfGoldCoins();
  let scoreIcons = [];
  for (let i = 0; i < (5 - goldenCoins); i++) {
    scoreIcons.push(<img src="/public/assets/si_score_grey.png" className="score-icon" />)
  };
  for (let i = 0; i < goldenCoins; i++) {
    scoreIcons.push(<img src="/public/assets/si_score.png" className="score-icon" />);
  }
  return scoreIcons;
};