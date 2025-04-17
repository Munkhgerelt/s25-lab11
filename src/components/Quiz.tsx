import React, { useState } from 'react'
import './Quiz.css'
import QuizQuestion from '../core/QuizQuestion'

interface QuizState {
  questions: QuizQuestion[]
  currentQuestionIndex: number
  selectedAnswer: string | null
  score: number
  isQuizFinished: boolean
  answerFeedback: string | null // For feedback message
  isAnswerSubmitted: boolean // Flag to control answer submission
}

const Quiz: React.FC = () => {
  const initialQuestions: QuizQuestion[] = [
    {
      question: 'What is the capital of France?',
      options: ['London', 'Berlin', 'Paris', 'Madrid'],
      correctAnswer: 'Paris'
    },
    {
      question: 'What is 2 + 2?',
      options: ['3', '4', '5', '22'],
      correctAnswer: '4'
    },
    {
      question: 'Which planet is known as the Red Planet?',
      options: ['Earth', 'Mars', 'Jupiter', 'Venus'],
      correctAnswer: 'Mars'
    }
  ]

  const [state, setState] = useState<QuizState>({
    questions: initialQuestions,
    currentQuestionIndex: 0,
    selectedAnswer: null,
    score: 0,
    isQuizFinished: false,
    answerFeedback: null,
    isAnswerSubmitted: false // Initially, the answer is not submitted
  })

  const handleOptionSelect = (option: string): void => {
    if (state.isAnswerSubmitted) return // Prevent selecting other answers after submission
    setState((prevState) => ({ ...prevState, selectedAnswer: option }))
  }

  const handleSubmitAnswer = (): void => {
    if (state.selectedAnswer === null) return // Prevent submission if no answer is selected

    const { selectedAnswer, currentQuestionIndex, questions, score } = state
    const currentQuestion = questions[currentQuestionIndex]

    const isCorrect = selectedAnswer === currentQuestion.correctAnswer
    const updatedScore = isCorrect ? score + 1 : score

    setState((prevState) => ({
      ...prevState,
      score: updatedScore,
      answerFeedback: isCorrect ? 'Correct!' : `Incorrect! The correct answer was ${currentQuestion.correctAnswer}.`,
      isAnswerSubmitted: true // Disable answer selection and show feedback
    }))
  }

  const handleNextQuestion = (): void => {
    const { currentQuestionIndex, questions } = state

    if (currentQuestionIndex + 1 >= questions.length) {
      setState((prevState) => ({
        ...prevState,
        isQuizFinished: true
      }))
    } else {
      setState((prevState) => ({
        ...prevState,
        currentQuestionIndex: currentQuestionIndex + 1,
        selectedAnswer: null,
        answerFeedback: null,
        isAnswerSubmitted: false // Allow answering again
      }))
    }
  }

  const handleRestart = (): void => {
    setState({
      questions: initialQuestions,
      currentQuestionIndex: 0,
      selectedAnswer: null,
      score: 0,
      isQuizFinished: false,
      answerFeedback: null,
      isAnswerSubmitted: false
    })
  }

  const { questions, currentQuestionIndex, selectedAnswer, score, isQuizFinished, answerFeedback, isAnswerSubmitted } = state

  if (isQuizFinished) {
    return (
      <div>
        <h2>Quiz Completed</h2>
        <p>Final Score: {score} out of {questions.length}</p>
        <button onClick={handleRestart}>Restart Quiz</button>
      </div>
    )
  }

  const currentQuestion = questions[currentQuestionIndex]

  return (
    <div>
      <h2>Quiz Question {currentQuestionIndex + 1} of {questions.length}:</h2>
      <p>{currentQuestion.question}</p>

      <h3>Answer Options:</h3>
      <ul>
        {currentQuestion.options.map((option) => {
          let optionClass = ''
          if (isAnswerSubmitted) {
            if (option === selectedAnswer) {
              optionClass = option === currentQuestion.correctAnswer ? 'correct' : 'incorrect'
            } else if (option === currentQuestion.correctAnswer) {
              optionClass = 'correct' // Highlight the correct answer if the user selected the wrong one
            }
          }

          return (
            <li
              key={option}
              onClick={() => handleOptionSelect(option)}
              className={`${optionClass} ${selectedAnswer === option ? 'selected' : ''}`}
              style={{ cursor: isAnswerSubmitted ? 'not-allowed' : 'pointer' }} // Prevent further clicks after answer submission
            >
              {option}
            </li>
          )
        })}
      </ul>

      <h3>Selected Answer:</h3>
      <p>{selectedAnswer ?? 'No answer selected'}</p>

      {/* Show feedback after submitting an answer */}
      {answerFeedback != null && answerFeedback !== '' && <p>{answerFeedback}</p>}

      {!isAnswerSubmitted
        ? (
          <button
            onClick={handleSubmitAnswer}
            disabled={selectedAnswer === null}
          >
            Submit Answer
          </button>
          )
        : (
          <button onClick={handleNextQuestion}>
            {currentQuestionIndex === questions.length - 1
              ? 'Finish Quiz'
              : 'Next Question'}
          </button>
          )}
    </div>
  )
}

export default Quiz
