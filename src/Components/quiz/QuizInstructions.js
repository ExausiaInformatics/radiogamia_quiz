import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';

import answer from '../../assets/img/answers.png';
import fiftyFifty from '../../assets/img/fiftyFifty.PNG';
import hints from '../../assets/img/hints.PNG';
import options from '../../assets/img/options.PNG';
import zoom from '../../assets/img/zoom.png';
import compare from '../../assets/img/compare.png';
import { Container } from 'react-bootstrap';

const QuizInstructions = () => (
    <Container fluid style={{marginTop:"-43px", color: 'white', fontWeight: 700,height: '100%',backgroundColor:'black'}}>
        <Fragment>
            <Helmet><title>Quiz Instructions - Radiogamia</title></Helmet>
            <div className="instructions container">
                <h1 style={{color: 'white', fontWeight: 900 ,letterSpacing:'.2rem' }}>How To Give The Quiz</h1>
                <p>Read this Guide for better understanding</p>
                <ul className="browser-default" id="main-list">
                    <li>The quiz has a duration of 15 minutes and ends as soon as your time elapses.</li>
                    <li>Quiz consists of 15 questions.</li>
                    <li>
                        Every question contains 4 options.
                    <img src={options} alt="Quiz App options example" />
                    </li>
                    <li>
                        Select the option which best answers the question by clicking (or selecting) it.
                    <img src={answer} alt="Quiz App answer example" />
                    </li>
                    <li>
                        Quiz gives you 2 lifelines namely:
                    <ul id="sublist">
                            <li>2 50-50 options</li>
                            <li>5 Hints</li>
                        </ul>
                    </li>
                    <li>
                        Selecting a 50-50 lifeline by clicking the icon
                    <span className="mdi mdi-set-center mdi-24px lifeline-icon"></span>
                    will remove 2 wrong answers, leaving the correct answer and one wrong answer
                    <img src={fiftyFifty} alt="Quiz App Fifty-Fifty example" />
                    </li>
                    <li>
                        Using a hint by clicking the icon
                    <span className="mdi mdi-lightbulb-on mdi-24px lifeline-icon"></span>
                    will remove one wrong answer leaving two wrong answers and one correct answer.
                    <img src={hints} alt="Quiz App hints example" />
                    </li>
                    <li>
                       Use ZoomIn feature by clicking the icon &nbsp;
                       <span className="mdi mdi-magnify mdi-24px lifeline-icon"></span> and then
                       move the cursor over the Image to Zoom.
                        <img src={zoom} alt="Quiz App hints example" />
                    </li>
                    <li>
                       You can compare two images by clicking the icon &nbsp;
                       <span className="mdi mdi-compare mdi-24px lifeline-icon"></span>
                        <img src={compare} alt="Quiz App hints example" />
                    </li>
                    <li>Feel free to quit (or retire from) the game at any time. In that case your score will be revealed afterwards.</li>
                    <li>The timer starts as soon as the quiz loads.</li>
                    <li>Let's do this if you think you've got what it takes?</li>
                </ul>
                <div className="mb-3">
                    <span className="left"><Link to="/radiogamia_quiz">No take me back</Link></span>
                    <span className="right"><Link to="/play/quiz">Okay, Let's do this!</Link></span>
                </div>
            </div>
        </Fragment>
    </Container>
);

export default QuizInstructions;