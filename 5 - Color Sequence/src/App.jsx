import { useEffect, useRef, useState } from 'react'
import Box from './components/Box.jsx'

const baseSequence = [
  { name: 'Pink', value: '#e92ed6' }, { name: 'Blue', value: '#4568d4' }, { name: 'Red', value: '#e8174c' },
  { name: 'Orange', value: '#fc842d' }, { name: 'Cyan', value: '#43c8e2' }, { name: 'Green', value: '#36b44a' },
  { name: 'Lime', value: '#b8ef36' }, { name: 'Yellow', value: '#ffe016' }, { name: 'Purple', value: '#9620ad' },
]

// These colors stay in their board positions for the entire game.
const initialBoard = [baseSequence[4], baseSequence[1], baseSequence[7], baseSequence[2], baseSequence[5], baseSequence[0], baseSequence[8], baseSequence[3], baseSequence[6]]

function shuffle(colors) {
  const shuffled = [...colors]
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1))
    ;[shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]]
  }
  return shuffled
}

function App() {
  const cardRef = useRef(null)
  const [sequence, setSequence] = useState(baseSequence)
  const [boardColors, setBoardColors] = useState(initialBoard)
  const [step, setStep] = useState(0)
  const [revealed, setRevealed] = useState([])
  const [wrongBox, setWrongBox] = useState(null)
  const gameComplete = step === sequence.length
  const target = sequence[step]

  useEffect(() => {
    if (wrongBox === null) return undefined
    const restartTimer = window.setTimeout(() => { setRevealed([]); setStep(0); setWrongBox(null) }, 850)
    return () => window.clearTimeout(restartTimer)
  }, [wrongBox])

  useEffect(() => {
    function handleOutsideClick(event) {
      if (cardRef.current && !cardRef.current.contains(event.target)) {
        setSequence(shuffle(baseSequence))
        setBoardColors(shuffle(baseSequence))
        setRevealed([])
        setStep(0)
        setWrongBox(null)
      }
    }

    document.addEventListener('click', handleOutsideClick)
    return () => document.removeEventListener('click', handleOutsideClick)
  }, [])

  function handleBoxClick(index) {
    if (wrongBox !== null || gameComplete) return
    if (boardColors[index].name === target.name) {
      setRevealed((current) => [...current, index])
      setStep((current) => current + 1)
    } else setWrongBox(index)
  }

  return <main className="page"><section className="card" ref={cardRef} aria-labelledby="page-title">
    <div className="sequence" aria-label="Color sequence to follow">{sequence.map((color, index) => <div className={`sequence-color ${index === step ? 'sequence-color--current' : ''} ${index < step ? 'sequence-color--done' : ''}`} style={{ backgroundColor: color.value }} key={color.name} title={`${index + 1}. ${color.name}`} />)}</div>
    <p className="indicator" aria-live="polite">{gameComplete ? 'You completed the sequence!' : wrongBox !== null ? 'Wrong color — restarting…' : `Find ${target.name} (${step + 1} of 9)`}</p>
    <div className="board" aria-label="Hidden color board">{boardColors.map((color, index) => <Box key={color.name} color={color.value} isRevealed={revealed.includes(index)} isWrong={wrongBox === index} onClick={() => handleBoxClick(index)} disabled={wrongBox !== null || gameComplete} />)}</div>
  </section></main>
}

export default App
