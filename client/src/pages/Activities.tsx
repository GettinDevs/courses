import React, { useContext, useEffect, useState } from 'react'
import styled from 'styled-components'
import CodeMirror from '@uiw/react-codemirror'
import { javascript } from '@codemirror/lang-javascript'
import { LocationContext } from '../contexts/LocationContext'

const DEFAULT_FN = `\
function task(#PARAMS) {
  // your code
}
`

function createTask (code: string, params: string[]): {
  valid: true
  fn: Function
} | {
  valid: false
  error: unknown
} {
  try {
    // eslint-disable-next-line no-new-func, @typescript-eslint/no-implied-eval
    const fn = new Function('args', `
      try {
        ${code}
        return {
          success: true,
          value: task(...args)
        }
      } catch(error) {
        let message = 'Execution failed. Recheck code.'
        if (error instanceof ReferenceError && error.message === 'task is not defined') {
          message = \`Please, do not remove task function. Use template:\n\n${DEFAULT_FN.replace('#PARAMS', params.join(', '))}\`
        }
        else if (error instanceof Error) {
          message = error.toString()
        }
        else {
          console.error(error)
        }
        return {
          success: false,
          message
        }
      }
    `)

    return {
      valid: true,
      fn
    }
  } catch (error) {
    return {
      valid: false,
      error
    }
  }
}

export function Activities (): JSX.Element {
  const { addLocation, popLocation } = useContext(LocationContext)
  const [activities, setActivities] = useState<ActivityProps[]>([])
  const [selectedActivityIdx, setSelectedActivityIdx] = useState<number | null>(null)

  useEffect(() => {
    // getActivit`ies().then(res => {
    //   setActivities(res)
    // })`
    setActivities([
      {
        id: 1,
        description: 'do so',
        params: ['firstValue', 'secondValue'],
        tests: [
          [[0, 20], 0],
          [[2, 30], 60],
          [[5, 100], 500]
        ]
      },
      {
        id: 2,
        description: 'do so by two lolo',
        params: ['firstValue', 'multiplier', 'exclusive'],
        tests: [
          [[{ age: 23 }, 100], { age: 123 }],
          [[{ age: 51 }, 120], { age: 171 }]
        ]
      }
    ])

    addLocation('Activities', true)
  }, [])

  function onSelectActivity (index: number): void {
    if (selectedActivityIdx !== null) {
      popLocation()
    }
    addLocation(String(index + 1))
    setSelectedActivityIdx(index)
  }

  return (
    <ContainerStyled>
      <div className="sidebar">
        <div style={{ paddingTop: 8 }} />
        {activities.map((_, index) => (
          <React.Fragment key={index}>
            <button
              onClick={() => onSelectActivity(index)}
              style={selectedActivityIdx === index ? { backgroundColor: 'gray' } : {}}
            >
              {index + 1}
            </button>
            <div style={{ paddingTop: 8 }} />
          </React.Fragment>
        ))}
      </div>
      <div className="activity">
        {
          selectedActivityIdx === null
            ? (
              <span style={{ display: 'flex', justifyContent: 'center', paddingTop: 200 }}>
                Please, select an activity from the list on the sidebar.
              </span>
              )
            : <Activity key={selectedActivityIdx} {...activities[selectedActivityIdx]} />
        }
      </div>
    </ContainerStyled>
  )
}

const ContainerStyled = styled.div`
  display: flex;
  height: calc(100vh - 51px);

  .sidebar {
    overflow-y: scroll;
    width: 80px;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0 8px;

    button {
      outline: none;
      width: 100%;
      text-align: center;
      padding: 10px;
      border: none;
      border-radius: 5px;
      font-size: 2rem;
      background-color: lightgray;
      cursor: pointer;
      :hover {
        background-color: gray;
      }
    }
  }

  .activity {
    flex: 1;
  }
`

interface ActivityProps {
  id: number
  description: string
  params: string[]
  tests: Array<[any[], any]>
}
export function Activity ({ description, params, tests }: ActivityProps): JSX.Element {
  const [code, setCode] = useState(DEFAULT_FN.replace('#PARAMS', params.join(', ')))
  const [results, setResults] = useState<any[]>(Array(tests.length).fill(undefined))
  const [error, setError] = useState<string | null>(null)
  const [showTests, setShowTests] = useState(true)
  const [selectedTestIdx, setSelectedTestIdx] = useState(0)
  const [output, setOutput] = useState<string | null>(null)

  function onChange (value: string): void {
    setCode(value)
  }

  function getFn (): Function | null {
    setResults([])
    setError(null)
    setOutput(null)

    const task = createTask(code, params)
    if (!task.valid) {
      setError(task.error instanceof Error ? task.error.toString() : 'Invalid code')
      return null
    }

    return task.fn
  }

  function onRunCode (): void {
    const fn = getFn()
    if (fn === null) return

    const executedTask = fn(tests[selectedTestIdx][0]) as {
      success: true
      value: any
    } | {
      success: false
      message: string
    }

    if (executedTask.success) {
      setOutput(executedTask.value)
    } else {
      setOutput(null)
      setError(executedTask.message)
    }
  }

  function onRunTests () {
    const fn = getFn()
    if (fn === null) return

    tests.forEach(test => {
      const testInput = test[0]
      const executedTask = fn(testInput) as {
        success: true
        value: any
      } | {
        success: false
        message: string
      }

      if (executedTask.success) {
        setResults(prev => [...prev, executedTask.value])
      } else {
        setResults(prev => [...prev, null])
        setError(executedTask.message)
      }
    })
  }

  return (
    <ActivitiesOverviewContainer>
      <div className="editor-container">
        <p>{description}</p>
        <CodeMirror
          value={code}
          height="500px"
          theme="dark"
          style={{ fontSize: '1rem' }}
          extensions={[javascript()]}
          onChange={onChange}
        />
        <div className="actions">
          <button onClick={onRunCode}>Run Code</button>
          <button onClick={onRunTests}>Run Tests</button>
          <button onClick={() => setShowTests(v => !v)}>{showTests ? 'Hide tests' : 'Show tests'}</button>
        </div>
        <span style={{ paddingTop: '1rem', fontWeight: 'bold' }}>Output from running the code:</span>
        {output !== null && (
          <pre>
            {JSON.stringify(output, undefined, 2)}
          </pre>
        )}
        {error !== null && (
          <div style={{ color: 'red', fontWeight: 'bold' }}>
            <pre>{error}</pre>
          </div>
        )}
      </div>
      <div className="tests-container" hidden={!showTests}>
        <table>
          <thead>
            <tr>

                           <th>Input</th>
                <th>Expected Output</th>

                  <th>Received Output</th>
                  <th>Success</th>
            </tr>
          </thead>
          <tbody>
            {tests.map((test, index) => (
              <tr key={index} onClick={() => setSelectedTestIdx(index)}>
                <td>
                  <table>
                    <tbody>
                      {test[0].map((testItem, idx) => (
                        <tr key={idx} style={selectedTestIdx === index ? { color: 'darkorange', fontWeight: 'bold' } : {}}>
                          <td>{params[idx]}</td>
                          <td>
                            <pre>
                              {JSON.stringify(testItem, undefined, 2)}
                            </pre>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </td>
                <td><pre>{JSON.stringify(test[1], undefined, 2)}</pre></td>
                <td><pre>{JSON.stringify(results[index], undefined, 2)}</pre></td>
                <td style={{
                  color: JSON.stringify(test[1]) === JSON.stringify(results[index]) ? 'green' : 'red'
                }}>{JSON.stringify(test[1]) === JSON.stringify(results[index]) ? 'SUCCESSED' : 'FAILED'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

          </ActivitiesOverviewContainer>
  )
}

const ActivitiesOverviewContainer = styled.div`
  display: flex;
  padding: 20px;

  .editor-container {
    flex: 4;
    display: flex;
    flex-direction: column;

    .actions {
      display: flex;
      padding: 20px;

      button {
        margin-left: 1rem;
        outline: none;
        padding: 10px;
        border: none;
        border-radius: 5px;
        background-color: lightgray;
        cursor: pointer;
        :hover {
          background-color: gray;
        }
      }
    }
  }

  .tests-container {
    flex: 3;
    padding-left: 20px;

    table, th, td {
      border: 1px solid;
    }

    th, td {
      padding: 0 8px;
    }
  }
`
