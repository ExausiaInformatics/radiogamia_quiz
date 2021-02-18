import React, { Component, Fragment } from 'react';
import { Helmet } from 'react-helmet';
import M from 'materialize-css';
import classnames from 'classnames';
import { Row, Col, Image, Container, Modal, Button } from 'react-bootstrap'
// import questions from '../../questions.json';
import { questions } from '../../questions.js';
import isEmpty from '../../utils/is-empty';

import correctNotification from '../../assets/audio/correct-answer.mp3';
import wrongNotification from '../../assets/audio/wrong-answer.mp3';
import buttonSound from '../../assets/audio/button-sound.mp3';

class Play extends Component {
    constructor(props) {
        super(props);
        this.state = {
            questions,
            currentQuestion: {},
            nextQuestion: {},
            previousQuestion: {},
            answer: '',
            numberOfQuestions: 0,
            numberOfAnsweredQuestions: 0,
            currentQuestionIndex: 0,
            score: 0,
            correctAnswers: 0,
            wrongAnswers: 0,
            hints: 5,
            fiftyFifty: 2,
            usedFiftyFifty: false,
            nextButtonDisabled: false,
            previousButtonDisabled: true,
            previousRandomNumbers: [],
            time: {},
            zoom: false,
            setShow: false
        };
        this.interval = null;
        this.correctSound = React.createRef();
        this.wrongSound = React.createRef();
        this.buttonSound = React.createRef();
    }

    componentDidMount() {
        const { questions, currentQuestion, nextQuestion, previousQuestion } = this.state;
        this.displayQuestions(questions, currentQuestion, nextQuestion, previousQuestion);
        this.startTimer();
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    handleZoom = () => {
        if (!this.state.zoom) {
            this.setState({
                zoom: true
            })
        }
        else if (this.state.zoom) {
            this.setState({
                zoom: false
            })
        }
    }

    handleSetShow = () => {
        this.setState({
            setShow: true
        })
        // this.handleCompare();
    }

    handleCompare = () => {
        console.log('hello', this.state.setShow)
        return (
            <Modal
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                show={this.state.setShow}
                onHide={() => this.setState({ setShow: false })}
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Modal heading
                        </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h4>Centered Modal</h4>
                    <p>
                        Cras mattis consectetur purus sit amet fermentum. Cras justo odio,
                        dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac
                        consectetur ac, vestibulum at eros.
                        </p>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => this.setState({ setShow: false })}>Close</Button>
                </Modal.Footer>
            </Modal>
        )
    }

    displayQuestions = (questions = this.state.questions, currentQuestion, nextQuestion, previousQuestion) => {
        let { currentQuestionIndex } = this.state;
        if (!isEmpty(this.state.questions)) {
            questions = this.state.questions;
            currentQuestion = questions[currentQuestionIndex];
            nextQuestion = questions[currentQuestionIndex + 1];
            previousQuestion = questions[currentQuestionIndex - 1];
            const answer = currentQuestion.answer;
            this.setState({
                currentQuestion,
                nextQuestion,
                previousQuestion,
                numberOfQuestions: questions.length,
                answer,
                previousRandomNumbers: []
            }, () => {
                this.showOptions();
                this.handleDisableButton();
            });
        }
    };

    handleOptionClick = (e) => {
        if (e.target.innerHTML.toLowerCase() === this.state.answer.toLowerCase()) {
            this.correctTimeout = setTimeout(() => {
                this.correctSound.current.play();
            }, 500);
            this.correctAnswer();
        } else {
            this.wrongTimeout = setTimeout(() => {
                this.wrongSound.current.play();
            }, 500);
            this.wrongAnswer();
        }
    }

    handleNextButtonClick = () => {
        this.playButtonSound();
        if (this.state.nextQuestion !== undefined) {
            this.setState(prevState => ({
                currentQuestionIndex: prevState.currentQuestionIndex + 1
            }), () => {
                this.displayQuestions(this.state.state, this.state.currentQuestion, this.state.nextQuestion, this.state.previousQuestion);
            });
        }
    };

    handlePreviousButtonClick = () => {
        this.playButtonSound();
        if (this.state.previousQuestion !== undefined) {
            this.setState(prevState => ({
                currentQuestionIndex: prevState.currentQuestionIndex - 1
            }), () => {
                this.displayQuestions(this.state.state, this.state.currentQuestion, this.state.nextQuestion, this.state.previousQuestion);
            });
        }
    };

    handleQuitButtonClick = () => {
        this.playButtonSound();
        if (window.confirm('Are you sure you want to quit?')) {
            this.props.history.push('/radiogamia_quiz');
        }
    };

    handleButtonClick = (e) => {
        switch (e.target.id) {
            case 'next-button':
                this.handleNextButtonClick();
                break;

            case 'previous-button':
                this.handlePreviousButtonClick();
                break;

            case 'quit-button':
                this.handleQuitButtonClick();
                break;

            default:
                break;
        }

    };

    playButtonSound = () => {
        this.buttonSound.current.play();
    };

    correctAnswer = () => {
        M.toast({
            html: 'Correct Answer!',
            classes: 'toast-valid',
            displayLength: 1500
        });
        this.setState(prevState => ({
            score: prevState.score + 1,
            correctAnswers: prevState.correctAnswers + 1,
            currentQuestionIndex: prevState.currentQuestionIndex + 1,
            numberOfAnsweredQuestions: prevState.numberOfAnsweredQuestions + 1
        }), () => {
            if (this.state.nextQuestion === undefined) {
                this.endGame();
            } else {
                this.displayQuestions(this.state.questions, this.state.currentQuestion, this.state.nextQuestion, this.state.previousQuestion);
            }
        });
    }

    wrongAnswer = () => {
        navigator.vibrate(1000);
        M.toast({
            html: 'Wrong Answer!',
            classes: 'toast-invalid',
            displayLength: 1500
        });
        this.setState(prevState => ({
            wrongAnswers: prevState.wrongAnswers + 1,
            currentQuestionIndex: prevState.currentQuestionIndex + 1,
            numberOfAnsweredQuestions: prevState.numberOfAnsweredQuestions + 1
        }), () => {
            if (this.state.nextQuestion === undefined) {
                this.endGame();
            } else {
                this.displayQuestions(this.state.questions, this.state.currentQuestion, this.state.nextQuestion, this.state.previousQuestion);
            }
        });
    }

    showOptions = () => {
        const options = Array.from(document.querySelectorAll('.option'));

        options.forEach(option => {
            option.style.visibility = 'visible';
        });

        this.setState({
            usedFiftyFifty: false
        });
    }

    handleHints = () => {
        if (this.state.hints > 0) {
            const options = Array.from(document.querySelectorAll('.option'));
            let indexOfAnswer;

            options.forEach((option, index) => {
                if (option.innerHTML.toLowerCase() === this.state.answer.toLowerCase()) {
                    indexOfAnswer = index;
                }
            });

            while (true) {
                const randomNumber = Math.round(Math.random() * 3);
                if (randomNumber !== indexOfAnswer && !this.state.previousRandomNumbers.includes(randomNumber)) {
                    options.forEach((option, index) => {
                        if (index === randomNumber) {
                            option.style.visibility = 'hidden';
                            this.setState((prevState) => ({
                                hints: prevState.hints - 1,
                                previousRandomNumbers: prevState.previousRandomNumbers.concat(randomNumber)
                            }));
                        }
                    });
                    break;
                }
                if (this.state.previousRandomNumbers.length >= 3) break;
            }
        }
    }

    handleFiftyFifty = () => {
        if (this.state.fiftyFifty > 0 && this.state.usedFiftyFifty === false) {
            const options = document.querySelectorAll('.option');
            const randomNumbers = [];
            let indexOfAnswer;

            options.forEach((option, index) => {
                if (option.innerHTML.toLowerCase() === this.state.answer.toLowerCase()) {
                    indexOfAnswer = index;
                }
            });

            let count = 0;
            do {
                const randomNumber = Math.round(Math.random() * 3);
                if (randomNumber !== indexOfAnswer) {
                    if (randomNumbers.length < 2 && !randomNumbers.includes(randomNumber) && !randomNumbers.includes(indexOfAnswer)) {
                        randomNumbers.push(randomNumber);
                        count++;
                    } else {
                        while (true) {
                            const newRandomNumber = Math.round(Math.random() * 3);
                            if (!randomNumbers.includes(newRandomNumber) && newRandomNumber !== indexOfAnswer) {
                                randomNumbers.push(newRandomNumber);
                                count++;
                                break;
                            }
                        }
                    }
                }
            } while (count < 2);

            options.forEach((option, index) => {
                if (randomNumbers.includes(index)) {
                    option.style.visibility = 'hidden';
                }
            });
            this.setState(prevState => ({
                fiftyFifty: prevState.fiftyFifty - 1,
                usedFiftyFifty: true
            }));
        }
    }

    startTimer = () => {
        const countDownTime = Date.now() + 600000;
        this.interval = setInterval(() => {
            const now = new Date();
            const distance = countDownTime - now;

            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            if (distance < 0) {
                clearInterval(this.interval);
                this.setState({
                    time: {
                        minutes: 0,
                        seconds: 0
                    }
                }, () => {
                    this.endGame();
                });
            } else {
                this.setState({
                    time: {
                        minutes,
                        seconds,
                        distance
                    }
                });
            }
        }, 1000);
    }

    handleDisableButton = () => {
        if (this.state.previousQuestion === undefined || this.state.currentQuestionIndex === 0) {
            this.setState({
                previousButtonDisabled: true
            });
        } else {
            this.setState({
                previousButtonDisabled: false
            });
        }

        if (this.state.nextQuestion === undefined || this.state.currentQuestionIndex + 1 === this.state.numberOfQuestions) {
            this.setState({
                nextButtonDisabled: true
            });
        } else {
            this.setState({
                nextButtonDisabled: false
            });
        }
    }

    endGame = () => {
        alert('Quiz has eneded!');
        const { state } = this;
        const playerStats = {
            score: state.score,
            numberOfQuestions: state.numberOfQuestions,
            numberOfAnsweredQuestions: state.correctAnswers + state.wrongAnswers,
            correctAnswers: state.correctAnswers,
            wrongAnswers: state.wrongAnswers,
            fiftyFiftyUsed: 2 - state.fiftyFifty,
            hintsUsed: 5 - state.hints
        };
        setTimeout(() => {
            this.props.history.push('/play/quizSummary', playerStats);
        }, 1000);
    }

    render() {
        const {
            currentQuestion,
            currentQuestionIndex,
            fiftyFifty,
            hints,
            numberOfQuestions,
            time
        } = this.state;

        return (
            <Fragment>
                <Helmet><title>Quiz Page</title></Helmet>
                <Fragment>
                    <audio ref={this.correctSound} src={correctNotification}></audio>
                    <audio ref={this.wrongSound} src={wrongNotification}></audio>
                    <audio ref={this.buttonSound} src={buttonSound}></audio>
                </Fragment>
                <Container fluid style={{ height: '100vh', backgroundColor: 'black' }}>
                    <div className="questions" style={{ height: '100vh', backgroundColor: 'black' }}>
                        <h2 className="title-web">Radiogamia</h2>
                        <div className="lifeline-container">
                            <p>
                                <span onClick={this.handleFiftyFifty} className="mdi mdi-set-center mdi-36px lifeline-icon">
                                    <span className="lifeline">{fiftyFifty}</span>
                                </span>
                            &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;
                            <span className="mdi mdi-36px lifeline-icon mdi-magnify" onClick={this.handleZoom} title="Zoom">
                                    {/* &nbsp;<span onClick={this.handleZoom} className="lifeline">Zoom</span> */}
                                </span>
                            &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;
                            <span onClick={this.handleSetShow} className="mdi mdi-36px lifeline-icon mdi-compare" title="Compare">
                                    {/* <span onClick={this.handleSetShow} className="lifeline">Compare</span> */}
                                </span>
                            </p>
                            <p>
                                <span onClick={this.handleHints} className="mdi mdi-lightbulb-on-outline mdi-36px lifeline-icon">
                                    <span className="lifeline">{hints}</span>
                                </span>
                            </p>
                        </div>
                        <div className="timer-container text">
                            <p>
                                <span className="left text" style={{ float: 'left'}}>{currentQuestionIndex + 1} of {numberOfQuestions}</span>
                                <span className={classnames('right valid', {
                                    'warning': time.distance <= 120000,
                                    'invalid': time.distance < 30000
                                })}>
                                    {time.minutes}:{time.seconds}
                                    <span className="mdi mdi-clock-outline mdi-24px" style={{marginTop: '-9px'}}></span></span>
                            </p>
                        </div>
                        <br /><br />
                        <h5 className="text">{currentQuestion.question}</h5>
                        <Row>
                            <Col md={6} className={this.state.zoom ? 'zoom' : 'boom'}>
                                <Image src={currentQuestion.image} width={currentQuestion.width} className="mt-2" />

                            </Col>
                            <Col md={5} className="offset-1 d-xs-block d-sm-none d-md-block" style={{position:'fixed', left:'655px'}}>
                                <div className="options-container">
                                    <p onClick={this.handleOptionClick} className="option">{currentQuestion.optionA}</p>
                                    <p onClick={this.handleOptionClick} className="option">{currentQuestion.optionB}</p>
                                </div>
                                <div className="options-container">
                                    <p onClick={this.handleOptionClick} className="option">{currentQuestion.optionC}</p>
                                    <p onClick={this.handleOptionClick} className="option">{currentQuestion.optionD}</p>
                                </div>
                            </Col>
                            <Col className="d-none d-sm-block d-md-none">
                                <Row>
                                    <Col xs={6}><p onClick={this.handleOptionClick} className="option">{currentQuestion.optionA}</p></Col>
                                    <Col xs={6}><p onClick={this.handleOptionClick} className="option">{currentQuestion.optionB}</p></Col>
                                </Row>
                                <Row>
                                    <Col xs={6}><p onClick={this.handleOptionClick} className="option">{currentQuestion.optionC}</p></Col>
                                    <Col xs={6}><p onClick={this.handleOptionClick} className="option">{currentQuestion.optionD}</p></Col>
                                </Row>
                            </Col>
                        </Row>
                        <div className="button-container d-none d-sm-block mb-sm-5">
                            <button
                                className={classnames('', { 'disable': this.state.previousButtonDisabled })}
                                id="previous-button"
                                onClick={this.handleButtonClick}>
                                Previous
                        </button>
                            <button
                                className={classnames('', { 'disable': this.state.nextButtonDisabled })}
                                id="next-button"
                                onClick={this.handleButtonClick}>
                                Next
                            </button>
                            <button id="quit-button" onClick={this.handleButtonClick}>Quit</button>
                        </div>
                        <div className="d-sm-none button-container" style={{justifyContent: 'none', width: '100%', margin: '0'}}>
                        <button
                                className={classnames('', { 'disable': this.state.previousButtonDisabled })}
                                id="previous-button"
                                onClick={this.handleButtonClick}>
                                Previous
                        </button>
                            <button
                                className={classnames('', { 'disable': this.state.nextButtonDisabled })}
                                id="next-button"
                                onClick={this.handleButtonClick}>
                                Next
                            </button>
                            <button id="quit-button" onClick={this.handleButtonClick}>Quit</button>
                        </div>
                    </div>
                    <>
                        {this.state.setShow ? (
                            <Modal
                                size="xl"
                                aria-labelledby="contained-modal-title-vcenter"
                                centered
                                show={this.state.setShow}
                                onHide={() => this.setState({ setShow: false })}
                                style={{ backgroundColor: 'transparent', maxHeight: '100%' }}
                            >
                                <Modal.Header closeButton>
                                    <Modal.Title id="contained-modal-title-vcenter" className="modalHead">
                                        Compare
                                </Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <Row>
                                        <Col xs={6} style={{borderRight: '1px solid', borderColor:'rgba(233, 222, 222, 0.699)',textAlign: 'center'}}>
                                            <Row>
                                                <Col xs={12}>
                                                    <span className="modalSubHead">Normal Image</span>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col xs={12}>
                                                    <Image src={currentQuestion.normalImage} width={currentQuestion.widthA} />
                                                </Col>
                                            </Row>
                                        </Col>
                                        <Col xs={6} style={{textAlign: 'center'}}>
                                            <Row>
                                                <Col xs={12}>
                                                    <span className="modalSubHead">Abnormal Image</span>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col xs={12}>
                                                    <Image src={currentQuestion.image} width={currentQuestion.width} />
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button onClick={() => this.setState({ setShow: false })}>Close</Button>
                                </Modal.Footer>
                            </Modal>
                        ) : (
                                <span></span>
                            )
                        }
                    </>
                </Container>
            </Fragment>
        );
    }
}

export default Play;