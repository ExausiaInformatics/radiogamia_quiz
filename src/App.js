import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Home from './Components/Home';
import QuizInstructions from './Components/quiz/QuizInstructions';
import Play from './Components/quiz/Play';
import QuizSummary from './Components/quiz/QuizSummary';

function App() {
  return (
    <Router>
      <Route path="/radiogamia_quiz" exact component={Home} />
      <Route path="/play/instructions" exact component={QuizInstructions} />
      <Route path="/play/quiz" exact component={Play} />
      <Route path="/play/quizSummary" exact component={QuizSummary} />
    </Router>
  );
}

export default App;