import React, { useEffect, useState, useContext, useMemo, FunctionComponent, Component } from 'react';
import styled, { css } from 'styled-components'
import { Routes, Route, Outlet, Link, useLocation, useOutletContext, useParams, Navigate, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import MarkdownEditor from '@uiw/react-markdown-editor';

import { getSession, getUserEnrollments, login } from '../api/User';
import { addCourse, addSession, deleteCourseById, deleteSessionById, getCourses, updateCourseById, updateSessionById } from '../api/Courses'
import { UserContext } from '../contexts/UserContext';
import { LocationContext } from '../contexts/LocationContext';
import { CourseWithSessions, SessionWithContent, CourseWithSessionsMeta, SessionWithCount, Course, Session } from '../definitions/Course';

export function Dashboard() {
  const { user } = useContext(UserContext);
  const [courses, setCourses] = useState<CourseWithSessionsMeta[]>([]);
  const [sessionsWithoutCourse, setSessionsWithoutCourse] = useState<SessionWithContent[]>([])
  const [isLoading, setIsLoading] = useState(true);

  const [activeCourseId, setActiveCourseId] = useState<number | null>(null);
  const [activeSessionId, setActiveSessionId] = useState<number | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== 'ADMIN') {
      navigate('/')
      return
    }

    getCourses().then((res) => {
      const coursesRes = res.courses as CourseWithSessions[] || [];
      const coursesWithNumberedSessionLectures = coursesRes.map((course) => {
        let lecturesCount = 1;
        const sessionsWithNumberedLectures = course.sessions.map((session) => {
          if (session.type === 'LECTURE') {
            return {
              ...session,
              count: lecturesCount++
            }
          }
          return session;
        })
        return {
          ...course,
          sessions: sessionsWithNumberedLectures
        }
      }) as CourseWithSessionsMeta[];

      setCourses(coursesWithNumberedSessionLectures);
      setSessionsWithoutCourse(res.sessionsWithoutCourse || [])
      setIsLoading(false);
    })
  }, [])

  if (isLoading) return <div>Loading...</div>

  return (
    <ContainerStyled>
      <div className="sidebar">
        <div className="section-separator">Courses</div>
        {
          courses.map((course) => (
            <div key={course.courseId} onClick={() => setActiveCourseId(course.courseId)}>
              <SidebarItemStyled onClick={() => setActiveSessionId(null)}>[{course.courseId}] {course.title}</SidebarItemStyled>
              <div style={{ paddingLeft: '30px' }}>
                {
                  course.sessions.map((session, index) => (
                    <SidebarItemStyled key={session.sessionId} onClick={() => setActiveSessionId(session.sessionId)}>
                      <span>[{session.sessionId}]&nbsp;</span>
                      <span>[{index}]&nbsp;</span>
                      <b>{session.type === 'LECTURE' ? session.count : session.type.toUpperCase()}:&nbsp;</b>
                      {session.title}
                    </SidebarItemStyled>
                  ))
                }
                <div>
                  <SidebarItemStyled onClick={() => setActiveSessionId(-1)}>+ Add session</SidebarItemStyled>
                </div>
              </div>
            </div>
          ))
        }
        <div>
          <SidebarItemStyled onClick={() => {
            setActiveCourseId(-1);
            setActiveSessionId(null);
          }}>+ Add course</SidebarItemStyled>
        </div>
        <div className="section-separator">Unlinked sessions</div>
        {
          sessionsWithoutCourse.map((session) => (
            <SidebarItemStyled key={session.sessionId}>{session.title}</SidebarItemStyled>
          ))
        }
        {
          sessionsWithoutCourse.length === 0 && (
            <span>All sessions are linked</span>
          )
        }
      </div>
      <div className="content">
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span>active course: <b>{String(activeCourseId)}</b></span>
          <span>active session: <b>{String(activeSessionId)}</b></span>
        </div>
        <hr style={{ width: '100%' }} />
        {
          activeCourseId === null && activeSessionId === null && (
            <div>
              <h1>Welcome to the admin dashboard!</h1>
              <p>Here you can manage courses and sessions.</p>
              <p>Click on a course or session in the sidebar to get started.</p>
            </div>
          )
        }
        {
          activeCourseId !== null && activeSessionId === null && <CourseOverview key={activeCourseId} course={activeCourseId === -1 ? null : courses.find(c => c.courseId === activeCourseId)} />
        }
        {
          activeCourseId !== null && activeSessionId !== null && <SessionOverview key={activeSessionId} session={activeSessionId === -1 ? null : courses.find(c => c.courseId === activeCourseId)?.sessions.find(s => s.sessionId === activeSessionId)} />
        }
      </div>
    </ContainerStyled>
  )
}

const ContainerStyled = styled.div`
  display: flex;
  height: 100vh;
  width: 100vw;

  .sidebar {
    display: flex;
    flex-direction: column;
    padding: 1rem;
    border-right: 1px solid lightgray;
    overflow-y: auto;

    .section-separator {
      width: 100%;
      color: gray;
      display: flex;
      justify-content: center;
      border-top: 1px solid lightgray;
      border-bottom: 1px solid lightgray;
      padding: 10px 0;
      margin: 20px 0;
    }
  }

  .content {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 1rem;
  }
`

const SidebarItemStyled = styled.div`
  margin-bottom: 20px;
  padding: 6px 10px;
  background-color: lightgray;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  text-decoration: none;
  color: black;
  display: flex;
  width: min-content;
  white-space: nowrap;

  :hover {
    background-color: gray;
  }
`
type CourseOverviewProps = {
  course?: CourseWithSessions | null,
}
export function CourseOverview({ course: courseInit }: CourseOverviewProps) {
  const defaultCourse = {
    title: '',
    dependsOn: null,
  } as Course
  const [course, setCourse] = useState(courseInit || defaultCourse)

  function updateCourse(label: string, value: unknown) {
    setCourse({
      ...course,
      [label]: value
    })
  }

  async function handleSave() {
    if (course.courseId) {
      await updateCourseById(course.courseId, course)
    } else {
      await addCourse(course)
    }
  }

  async function handleDelete() {
    if (course.courseId) {
      await deleteCourseById(course.courseId)
    }
  }

  return (
    <div>
      <Label label="courseId" value={course.courseId} />
      <Input label="title" value={course.title} type="text" onSave={updateCourse} />
      <Input label="dependsOn" value={course.dependsOn} type="number" allowNull onSave={updateCourse} />
      <button onClick={handleSave}>Save</button>
      {course.courseId && <button onClick={handleDelete}>Delete</button>}
    </div>
  )
}

type SessionOverviewProps = {
  session?: SessionWithContent | null,
}
export function SessionOverview({ session: sessionInit }: SessionOverviewProps) {
  const defaultSession = {
    title: '',
    content: '',
    courseId: -1,
    isMandatory: false,
    rank: -1,
    type: 'LECTURE',
    sessionId: null
  } as SessionWithContent & { sessionId: null }
  const [session, setSession] = useState(sessionInit || defaultSession)

  function updateSession(label: string, value: unknown) {
    setSession({
      ...session,
      [label]: value
    })
  }

  async function handleSave() {
    if (session.courseId === null) {
      alert('Please select a course')
      return
    }
    if (session.sessionId) {
      await updateSessionById(session.sessionId, session)
    } else {
      await addSession(session)
    }
  }

  async function handleDelete() {
    if (session.sessionId) {
      await deleteSessionById(session.sessionId)
    }
  }

  return (
    <div>
      <Label label="sessionId" value={session.sessionId} />
      <Input label="title" value={session.title} type="text" onSave={updateSession} />
      <Input label="courseId" value={session.courseId} type="number" onSave={updateSession} />
      <Input label="type" value={session.type} type="text" onSave={updateSession} />
      <Input label="isMandatory" value={session.isMandatory} type="boolean" onSave={updateSession} />
      <Input label="rank" value={session.rank} type="number" onSave={updateSession} />
      <Input label="content" value={session.content} type="markdown" onSave={updateSession} />
      <button onClick={handleSave}>Save</button>
      {session.sessionId && <button onClick={handleDelete}>Delete</button>}
    </div>
  )
}


type LabelProps = {
  label: string;
  value: string | number | boolean | null;
}
function Label({ label, value }: LabelProps) {
  return (
    <div>
      <span>{label}: </span>
      <span>{String(value)}</span>
    </div>
  )
}

type InputProps = {
  label: string;
  value: string | number | boolean | null;
  type: 'text' | 'number' | 'boolean' | 'markdown';
  allowNull?: boolean;
  onSave: (label: string, newValue: unknown) => void;
}

export function Input({ label, value, type, allowNull, onSave }: InputProps) {
  const [inputValue, setInputValue] = useState(value);
  const [editMode, setEditMode] = useState(false);

  if (typeof value === null && !allowNull) throw new Error('Input value cannot be null');

  const defaultValues = {
    text: '',
    number: 0,
    boolean: false,
    markdown: ''
  }

  function handleSave() {
    onSave(label, inputValue);
    setEditMode(false);
  }

  if (editMode) {
    if (inputValue === null) {
      return (
        <LabelStyled>
          <span>{label}:&nbsp;</span>
          <span>null</span>
          <button style={{ marginLeft: '12px' }} onClick={() => setInputValue(defaultValues[type])}>set value</button>
          <button style={{ marginLeft: '12px' }} onClick={() => {
            setInputValue(value)
            setEditMode(false)
          }}>cancel</button>
          <button style={{ marginLeft: '12px' }} onClick={handleSave}>save</button>
        </LabelStyled>
      )
    }

    return (
      <LabelStyled>
        <span>{label}:&nbsp;</span>
        {
          type === 'boolean' ? <input type="checkbox" checked={Boolean(inputValue)} onChange={(e) => setInputValue(Boolean(e.target.checked))} /> :
            type === 'number' ? <input type="number" value={Number(inputValue)} onChange={(e) => setInputValue(Number(e.target.value))} /> :
              type === 'text' ? <input type="text" value={String(inputValue)} onChange={(e) => setInputValue(String(e.target.value))} /> :
                type === 'markdown' ? <MarkdownEditor style={{ minHeight: '500px' }} value={String(inputValue)} onChange={(newValue, _viewUpdate) => setInputValue(newValue)} /> :
                  <span>Unknown type</span>
        }
        {
          allowNull && <button style={{ marginLeft: '12px', height: 'min-content' }} onClick={() => setInputValue(null)}>set null</button>
        }
        <button style={{ marginLeft: '12px', height: 'min-content' }} onClick={() => {
          setInputValue(value)
          setEditMode(false)
        }}>cancel</button>
        <button style={{ marginLeft: '12px', height: 'min-content' }} onClick={handleSave}>save</button>
      </LabelStyled>
    )
  }

  return (
    <LabelStyled onClick={() => setEditMode(true)}>
      <span>{label}:&nbsp;</span>
      <span>{String(inputValue)}</span>
    </LabelStyled>
  )
}

const LabelStyled = styled.div`
  display: flex;
  font-size: 1.2rem;
  padding: 8px 0;  
`