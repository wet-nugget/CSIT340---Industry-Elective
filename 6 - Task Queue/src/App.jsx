import { useEffect, useState } from 'react'
import './App.css'

const HIGH_PRIORITY = 'HIGH'
const REGULAR_PRIORITY = 'REGULAR'
const TICK_MS = 100

function formatDuration(value) {
  return `${(value / 1000).toFixed(1)}s`
}

function createRandomTask(id) {
  const duration = 60 + Math.floor(Math.random() * 160)
  const priority = Math.random() < 0.15 ? HIGH_PRIORITY : REGULAR_PRIORITY

  return {
    id,
    duration,
    remainingDuration: duration * 100,
    priority,
  }
}

function getQueueTotal(tasks) {
  return tasks.reduce(
    (total, task) => total + (task.remainingDuration ?? task.duration * 100),
    0,
  )
}

function chooseRegularQueueIndex(queues) {
  let bestIndex = 0
  let smallestTotal = Number.POSITIVE_INFINITY

  queues.forEach((queue, index) => {
    const total = getQueueTotal(queue)

    if (total < smallestTotal) {
      smallestTotal = total
      bestIndex = index
    }
  })

  return bestIndex
}

function TaskItem({ task }) {
  return (
    <span
      className={`task-item ${task.priority === HIGH_PRIORITY ? 'high-priority' : 'regular-priority'}`}
      title={`${task.priority} priority • ${formatDuration(task.remainingDuration ?? task.duration * 100)}`}
    >
      {task.duration}
    </span>
  )
}

function QueueDuration({ tasks }) {
  const totalDuration = getQueueTotal(tasks)
  const maxDuration = 60000
  const meterWidth = Math.min((totalDuration / maxDuration) * 100, 100)

  return (
    <div className="queue-duration">
      <div className="duration-bar" aria-label="Queue duration">
        <span style={{ width: `${meterWidth}%` }} />
      </div>
      <div className="duration-label">{formatDuration(totalDuration)}</div>
    </div>
  )
}

function ServiceQueue({ title, tasks }) {
  return (
    <section className="service-queue">
      <h3>{title}</h3>
      <div className="queue-list">
        {tasks.length > 0 ? (
          tasks.map((task) => <TaskItem key={task.id} task={task} />)
        ) : (
          <span className="empty-list">Queue List:</span>
        )}
      </div>
      <div className="duration-row">
        <span className="duration-label">Duration:</span>
        <QueueDuration tasks={tasks} />
      </div>
    </section>
  )
}

function App() {
  const [nextTaskId, setNextTaskId] = useState(1)
  const [waitingTasks, setWaitingTasks] = useState([])
  const [highPriorityQueue, setHighPriorityQueue] = useState([])
  const [regularQueues, setRegularQueues] = useState([[], [], [], []])

  useEffect(() => {
    const timer = setInterval(() => {
      setHighPriorityQueue((previousQueue) =>
        previousQueue
          .map((task) => ({
            ...task,
            remainingDuration: Math.max(
              0,
              (task.remainingDuration ?? task.duration * 100) - TICK_MS,
            ),
          }))
          .filter((task) => (task.remainingDuration ?? task.duration * 100) > 0),
      )

      setRegularQueues((previousQueues) =>
        previousQueues.map((queue) =>
          queue
            .map((task) => ({
              ...task,
              remainingDuration: Math.max(
                0,
                (task.remainingDuration ?? task.duration * 100) - TICK_MS,
              ),
            }))
            .filter((task) => (task.remainingDuration ?? task.duration * 100) > 0),
        ),
      )
    }, TICK_MS)

    return () => clearInterval(timer)
  }, [])

  const addRandomTask = () => {
    const newTask = createRandomTask(nextTaskId)

    setWaitingTasks((previousTasks) => [...previousTasks, newTask])
    setNextTaskId((previousId) => previousId + 1)
  }

  const admitTask = () => {
    if (waitingTasks.length === 0) {
      return
    }

    const highPriorityIndex = waitingTasks.findIndex(
      (task) => task.priority === HIGH_PRIORITY,
    )
    const regularPriorityIndex = waitingTasks.findIndex(
      (task) => task.priority === REGULAR_PRIORITY,
    )

    const chosenIndex =
      highPriorityIndex !== -1 ? highPriorityIndex : regularPriorityIndex

    if (chosenIndex === -1) {
      return
    }

    const admittedTask = waitingTasks[chosenIndex]

    setWaitingTasks((previousTasks) =>
      previousTasks.filter((task, index) => index !== chosenIndex),
    )

    if (admittedTask.priority === HIGH_PRIORITY) {
      setHighPriorityQueue((previousQueue) => [
        ...previousQueue,
        {
          ...admittedTask,
          remainingDuration: admittedTask.remainingDuration ?? admittedTask.duration * 100,
        },
      ])
      return
    }

    setRegularQueues((previousQueues) => {
      const targetQueueIndex = chooseRegularQueueIndex(previousQueues)

      return previousQueues.map((queue, index) =>
        index === targetQueueIndex
          ? [
              ...queue,
              {
                ...admittedTask,
                remainingDuration: admittedTask.remainingDuration ?? admittedTask.duration * 100,
              },
            ]
          : queue,
      )
    })
  }

  return (
    <main className="app-shell">
      <aside className="waiting-panel">
        <div className="top-actions">
          <button type="button" className="primary-button" onClick={addRandomTask}>
            ADD RANDOM TASK
          </button>
        </div>

        <div className="waiting-queue">
          <h2>Task Queue</h2>
          <div className="task-list waiting-list">
            {waitingTasks.length > 0 ? (
              waitingTasks.map((task) => <TaskItem key={task.id} task={task} />)
            ) : (
              <span className="empty-list">No tasks waiting</span>
            )}
          </div>
        </div>

        <button type="button" className="primary-button admit-button" onClick={admitTask}>
          ADMIT TASK
        </button>
      </aside>

      <section className="service-panel" aria-label="Processing queues">
        <ServiceQueue title="High Priority Queue 1" tasks={highPriorityQueue} />

        {regularQueues.map((queue, index) => (
          <ServiceQueue
            key={`regular-${index + 2}`}
            title={`Regular Queue ${index + 2}`}
            tasks={queue}
          />
        ))}
      </section>
    </main>
  )
}

export default App
