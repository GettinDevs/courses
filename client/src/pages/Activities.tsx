import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { LocationContext } from "../contexts/LocationContext";
import { getActivities, updateActivity } from "../api/Activities";
import { Route, Routes } from "react-router-dom";

const DEFAULT_FN = `\
function task(#PARAMS) {
  // your code
}
`;

function createTask(
  code: string,
  params: string[]
):
  | {
      valid: true;
      fn: Function;
    }
  | {
      valid: false;
      error: unknown;
    } {
  try {
    // eslint-disable-next-line no-new-func, @typescript-eslint/no-implied-eval
    const fn = new Function(
      "args",
      `
      try {
        ${code}
        return {
          success: true,
          value: task(...args)
        }
      } catch(error) {
        let message = 'Execution failed. Recheck code.'
        if (error instanceof ReferenceError && error.message === 'task is not defined') {
          message = \`Please, do not remove task function. Use template:\n\n${DEFAULT_FN.replace(
            "#PARAMS",
            params.join(", ")
          )}\`
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
    `
    );

    return {
      valid: true,
      fn,
    };
  } catch (error) {
    return {
      valid: false,
      error,
    };
  }
}

export function Activities(): JSX.Element {
  const { addLocation, popLocation } = useContext(LocationContext);
  const [activities, setActivities] = useState<ActivityProps[]>([]);
  const [selectedActivityIdx, setSelectedActivityIdx] = useState<number | null>(
    null
  );

  useEffect(() => {
    getActivities().then((res) => {
      setActivities(res);
    });

    addLocation("Activities", true);
  }, []);

  function onSelectActivity(index: number): void {
    if (selectedActivityIdx !== null) {
      popLocation();
    }
    addLocation(String(index + 1));
    setSelectedActivityIdx(index);
  }

  return (
    <ContainerStyled>
      <div className="sidebar">
        <div style={{ paddingTop: 8 }} />
        {activities.map((_, index) => (
          <React.Fragment key={index}>
            <button
              onClick={() => onSelectActivity(index)}
              style={
                selectedActivityIdx === index ? { backgroundColor: "gray" } : {}
              }
            >
              {index + 1}
            </button>
            <div style={{ paddingTop: 8 }} />
          </React.Fragment>
        ))}
      </div>
      <div className="activity">
        {selectedActivityIdx === null ? (
          <span
            style={{
              display: "flex",
              justifyContent: "center",
              paddingTop: 200,
            }}
          >
            Please, select an activity from the list on the sidebar.
          </span>
        ) : (
          <Routes>
            <Route
              index
              element={
                <Activity
                  key={selectedActivityIdx}
                  {...activities[selectedActivityIdx]}
                />
              }
            />
            <Route
              path="edit"
              element={
                <EditActivity
                  key={selectedActivityIdx}
                  {...activities[selectedActivityIdx]}
                />
              }
            />
          </Routes>
        )}
      </div>
    </ContainerStyled>
  );
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
`;

export function EditActivity(activity: ActivityProps): JSX.Element {
  const [description, setDescription] = useState(activity.description);
  const [params, setParams] = useState<string[]>(activity.params);
  const [paramsEdit, setParamsEdit] = useState(activity.params.join(", "));
  const [args, setArgs] = useState(
    activity.tests.map((t) =>
      t[0].reduce(
        (args, arg, paramIdx) => ({
          ...args,
          [activity.params[paramIdx]]: JSON.stringify(arg, null, 2),
        }),
        {}
      )
    )
  );
  const [outputs, setOutputs] = useState(
    activity.tests.map((t) => JSON.stringify(t[1], null, 2))
  );
  const [newArg, setNewArg] = useState<{ [key: string]: string }>(
    params.reduce((a, p) => ({ ...a, [p]: "" }), {})
  );
  const [newOutput, setNewOutput] = useState("");

  function updateArgs(index: number, paramName: string, value: string): void {
    const newArgs = args.map((a) => ({ ...a }));
    newArgs[index][paramName] = value;
    setArgs(newArgs);
  }

  function updateOutputs(index: number, value: string): void {
    const newOutputs = [...outputs];
    newOutputs[index] = value;
    setOutputs(newOutputs);
  }

  function addTest() {
    setArgs([...args, newArg]);
    setOutputs([...outputs, newOutput]);
    setNewArg(params.reduce((a, p) => ({ ...a, [p]: "" }), {}));
    setNewOutput("");
  }

  function handleDeleteActivity() {}

  function handleSaveActivity() {
    const newTests = args.map((arg, index) => [
      params.map((param) => JSON.parse(arg[param] || "null")),
      JSON.parse(outputs[index] || "null"),
    ]) as [any[], any][];

    updateActivity({
      activityId: activity.activityId,
      description,
      params,
      tests: newTests,
    }).then((res) => {
      alert("Activity updated successfully!");
    });
  }

  return (
    <EditActivityContainerStyled>
      <div>
        <h1>Activity {activity.activityId}</h1>
        <div style={{ display: "flex", marginBottom: 16 }}>
          <button onClick={handleDeleteActivity}>Delete</button>
          <button onClick={handleSaveActivity}>Save</button>
        </div>
        <div style={{ display: "flex", marginBottom: 16 }}>
          <span>Description:</span>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ height: 100, width: 400 }}
          />
        </div>
        <div style={{ display: "flex", marginBottom: 16 }}>
          <span>
            Params: <b>{params.join(", ")}</b>
          </span>
        </div>
        <div style={{ display: "flex", marginBottom: 16 }}>
          <span>Edit Params:</span>
          <input
            value={paramsEdit}
            onChange={(e) => setParamsEdit(e.target.value)}
          />
          <button onClick={() => setParamsEdit(args.join(", "))}>Cancel</button>
          <button
            onClick={() =>
              setParams(paramsEdit.split(",").map((p) => p.trim()))
            }
          >
            Save
          </button>
        </div>
      </div>
      <div className="tests-container">
        <table>
          <thead>
            <tr>
              <th colSpan={params.length}>Arguments</th>
            </tr>
            <tr>
              {params.map((param) => (
                <th key={param}>{param}</th>
              ))}
              <th rowSpan={1}>Expected Output</th>
            </tr>
          </thead>
          <tbody>
            {args.map((_, testIdx) => (
              <tr key={testIdx}>
                {params.map((param) => (
                  <td key={param}>
                    <CodeMirror
                      value={args[testIdx][param]}
                      theme="dark"
                      style={{ fontSize: "1rem" }}
                      basicSetup={{
                        lineNumbers: false,
                      }}
                      extensions={[javascript()]}
                      onChange={(edit) => updateArgs(testIdx, param, edit)}
                    />
                  </td>
                ))}
                <td>
                  <CodeMirror
                    value={outputs[testIdx]}
                    theme="dark"
                    style={{ fontSize: "1rem" }}
                    basicSetup={{
                      lineNumbers: false,
                    }}
                    extensions={[javascript()]}
                    onChange={(edit) => updateOutputs(testIdx, edit)}
                  />
                </td>
              </tr>
            ))}
            <tr>
              {params.map((param) => (
                <td key={param}>
                  <CodeMirror
                    value={newArg[param]}
                    theme="dark"
                    style={{ fontSize: "1rem" }}
                    basicSetup={{
                      lineNumbers: false,
                    }}
                    extensions={[javascript()]}
                    onChange={(edit) => setNewArg({ ...newArg, [param]: edit })}
                  />
                </td>
              ))}
              <td>
                <CodeMirror
                  value={newOutput}
                  theme="dark"
                  style={{ fontSize: "1rem" }}
                  basicSetup={{
                    lineNumbers: false,
                  }}
                  extensions={[javascript()]}
                  onChange={(edit) => setNewOutput(edit)}
                />
              </td>
              <td>
                <button onClick={addTest}>Add</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </EditActivityContainerStyled>
  );
}

const EditActivityContainerStyled = styled.div`
  display: flex;
  flex-direction: column;
  padding: 16px;

  .tests-container {
    flex: 3;
    padding-left: 20px;

    th,
    td {
      border: 1px solid;
    }

    th,
    td {
      padding: 0 8px;
    }
  }
`;

interface ActivityProps {
  activityId: number;
  description: string;
  params: string[];
  tests: Array<[any[], any]>;
}
export function Activity({
  description,
  params,
  tests,
}: ActivityProps): JSX.Element {
  const [code, setCode] = useState(
    DEFAULT_FN.replace("#PARAMS", params.join(", "))
  );
  const [results, setResults] = useState<any[]>(
    Array(tests.length).fill(undefined)
  );
  const [error, setError] = useState<string | null>(null);
  const [showTests, setShowTests] = useState(true);
  const [selectedTestIdx, setSelectedTestIdx] = useState(0);
  const [output, setOutput] = useState<string | null>(null);

  function onChange(value: string): void {
    setCode(value);
  }

  function getFn(): Function | null {
    setResults([]);
    setError(null);
    setOutput(null);

    const task = createTask(code, params);
    if (!task.valid) {
      setError(
        task.error instanceof Error ? task.error.toString() : "Invalid code"
      );
      return null;
    }

    return task.fn;
  }

  function onRunCode(): void {
    const fn = getFn();
    if (fn === null) return;

    const executedTask = fn(tests[selectedTestIdx][0]) as
      | {
          success: true;
          value: any;
        }
      | {
          success: false;
          message: string;
        };

    if (executedTask.success) {
      setOutput(executedTask.value);
    } else {
      setOutput(null);
      setError(executedTask.message);
    }
  }

  function onRunTests() {
    const fn = getFn();
    if (fn === null) return;

    tests.forEach((test) => {
      const testInput = test[0];
      const executedTask = fn(testInput) as
        | {
            success: true;
            value: any;
          }
        | {
            success: false;
            message: string;
          };

      if (executedTask.success) {
        setResults((prev) => [...prev, executedTask.value]);
      } else {
        setResults((prev) => [...prev, null]);
        setError(executedTask.message);
      }
    });
  }

  return (
    <ActivitiesOverviewContainer>
      <div className="editor-container">
        <p>{description}</p>
        <CodeMirror
          value={code}
          height="500px"
          theme="dark"
          style={{ fontSize: "1rem" }}
          extensions={[javascript()]}
          onChange={onChange}
        />
        <div className="actions">
          <button onClick={onRunCode}>Run Code</button>
          <button onClick={onRunTests}>Run Tests</button>
          <button onClick={() => setShowTests((v) => !v)}>
            {showTests ? "Hide tests" : "Show tests"}
          </button>
        </div>
        <span style={{ paddingTop: "1rem", fontWeight: "bold" }}>
          Output from running the code:
        </span>
        {output !== null && <pre>{JSON.stringify(output, undefined, 2)}</pre>}
        {error !== null && (
          <div style={{ color: "red", fontWeight: "bold" }}>
            <pre>{error}</pre>
          </div>
        )}
      </div>
      <div className="tests-container" hidden={!showTests}>
        <table>
          <thead>
            <tr>
              <th
                colSpan={params.length}
                style={{ backgroundColor: "lightgray" }}
              >
                Input (arguments)
              </th>
            </tr>
            <tr>
              {params.map((param) => (
                <th key={param} style={{ backgroundColor: "lightgray" }}>
                  {param}
                </th>
              ))}
              <th rowSpan={1}>Expected Output</th>
              <th rowSpan={1}>Received Output</th>
              <th rowSpan={1}>Success</th>
            </tr>
          </thead>
          <tbody>
            {tests.map((test, index) => (
              <tr key={index} onClick={() => setSelectedTestIdx(index)}>
                {test[0].map((testItem, idx) => (
                  <td
                    key={idx}
                    style={{
                      backgroundColor:
                        selectedTestIdx === index ? "#ffd383" : "lightgray",
                    }}
                  >
                    <pre>{JSON.stringify(testItem, undefined, 2)}</pre>
                  </td>
                ))}
                <td>
                  <pre>{JSON.stringify(test[1], undefined, 2)}</pre>
                </td>
                <td>
                  <pre>{JSON.stringify(results[index], undefined, 2)}</pre>
                </td>
                <td
                  style={{
                    color:
                      JSON.stringify(test[1]) === JSON.stringify(results[index])
                        ? "green"
                        : "red",
                  }}
                >
                  {JSON.stringify(test[1]) === JSON.stringify(results[index])
                    ? "SUCCESSED"
                    : "FAILED"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ActivitiesOverviewContainer>
  );
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

    table {
      border-collapse: collapse;
    }

    table,
    th,
    td {
      border: 1px solid;
    }

    th,
    td {
      padding: 0 8px;
    }
  }
`;
