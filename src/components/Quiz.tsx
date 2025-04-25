import React, { useState } from 'react'
import './Quiz.css'
import QuizQuestion from '../core/QuizQuestion'

interface QuizState {
  questions: QuizQuestion[]
  currentQuestionIndex: number
  selectedAnswer: string | null
  isQuizFinished: boolean
  userAnswers: string[] // Track all user answers
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
    isQuizFinished: false,
    userAnswers: Array(initialQuestions.length).fill(null)
  })

  const handleOptionSelect = (option: string): void => {
    setState(prev => ({ ...prev, selectedAnswer: option }))
  }
  
  const handleNextQuestion = (): void => {
    const { currentQuestionIndex, questions, selectedAnswer } = state
  
    // Ensure selectedAnswer is not null before saving it to userAnswers
    const updatedUserAnswers = [...state.userAnswers]
    updatedUserAnswers[currentQuestionIndex] = selectedAnswer || ''  // default to '' if null
  
    if (currentQuestionIndex + 1 >= questions.length) {
      setState(prev => ({
        ...prev,
        isQuizFinished: true,
        userAnswers: updatedUserAnswers
      }))
    } else {
      setState(prev => ({
        ...prev,
        currentQuestionIndex: currentQuestionIndex + 1,
        selectedAnswer: null,
        userAnswers: updatedUserAnswers
      }))
    }
  }  

  const handlePreviousQuestion = (): void => {
    if (state.currentQuestionIndex > 0) {
      setState(prev => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex - 1,
        selectedAnswer: prev.userAnswers[prev.currentQuestionIndex - 1]
      }))
    }
  }

  const handleRestart = (): void => {
    setState({
      questions: initialQuestions,
      currentQuestionIndex: 0,
      selectedAnswer: null,
      isQuizFinished: false,
      userAnswers: Array(initialQuestions.length).fill(null)
    })
  }

  const { questions, currentQuestionIndex, selectedAnswer, isQuizFinished, userAnswers } = state

  if (isQuizFinished) {
    // Calculate number of correct answers
    const correctAnswers = questions.reduce((count, question, index) => {
      return count + (userAnswers[index] === question.correctAnswer ? 1 : 0)
    }, 0)

    return (
      <div>
        <h2>Quiz Completed</h2>
        <p>You got {correctAnswers} out of {questions.length} questions correct!</p>
        
        <h3>Questions Review:</h3>
        {questions.map((question, index) => (
          <div key={index}>
            <h4>Question {index + 1}: {question.question}</h4>
            <p>Your answer: {userAnswers[index] || 'Not answered'}</p>
            <p>Correct answer: {question.correctAnswer}</p>
            <hr />
          </div>
        ))}

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
        {currentQuestion.options.map(option => (
          <li
            key={option}
            onClick={() => handleOptionSelect(option)}
            className={selectedAnswer === option ? 'selected' : ''}
          >
            {option}
          </li>
        ))}
      </ul>

      <h3>Selected Answer:</h3>
      <p>{selectedAnswer ?? 'No answer selected'}</p>

      <button
        onClick={handlePreviousQuestion}
        disabled={currentQuestionIndex === 0}
      >
        Previous Question
      </button>
      
      <button onClick={handleNextQuestion}>
        {currentQuestionIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
      </button>
    </div>
  )
}

export default Quiz
