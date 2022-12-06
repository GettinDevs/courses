import { useEffect, useState, useContext, useMemo } from 'react';
import styled, { css } from 'styled-components'
import { Routes, Route, Outlet, Link, useLocation, useOutletContext, useParams, Navigate, redirect } from 'react-router-dom';
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

import { getSession, getUserEnrollments, login } from '../api/User';
import { getCourses } from '../api/Courses'
import { UserContext } from '../contexts/UserContext';
import { LocationContext } from '../contexts/LocationContext';
import { CourseWithSessions, SessionWithContent, CourseWithSessionsMeta, SessionWithCount } from '../definitions/Course';

export function Dashboard() {
  const { user } = useContext(UserContext);
  const [courses, setCourses] = useState<CourseWithSessionsMeta[]>([]);
  const [sessionsWithoutCourse, setSessionsWithoutCourse] = useState<SessionWithContent[]>([])
  const [isLoading, setIsLoading] = useState(true);

  const [activeCourseId, setActiveCourseId] = useState<number | null>(null);
  const [activeSessionId, setActiveSessionId] = useState<number | null>(null);

  useEffect(() => {
    if (!user || user.role !== 'ADMIN') {
      redirect('/')
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
              <SidebarItemStyled onClick={() => setActiveSessionId(null)}>{course.title}</SidebarItemStyled>
              <div style={{ paddingLeft: '30px' }}>
                {
                  course.sessions.map((session) => (
                    <SidebarItemStyled key={session.sessionId} onClick={() => setActiveSessionId(session.sessionId)}>
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
          activeCourseId !== null && activeSessionId === null && <CourseOverview course={activeCourseId === -1 ? null : courses.find(c => c.courseId === activeCourseId)} />
        }
        {
          activeCourseId !== null && activeSessionId !== null && <SessionOverview session={activeSessionId === -1 ? null : courses.find(c => c.courseId === activeCourseId)?.sessions.find(s => s.sessionId === activeSessionId)} />
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
export function CourseOverview({ course }: CourseOverviewProps) {

  if (!course) return (
    <div>
      <h1>New course</h1>
    </div>
  )

  return (
    <div>
      <h1>{course.title}</h1>
    </div>
  )
}

type SessionOverviewProps = {
  session?: SessionWithCount | null,
}
export function SessionOverview({ session }: SessionOverviewProps) {

  if (!session) return (
    <div>
      <h1>New session</h1>
    </div>
  )

  return (
    <div>
      <h1>{session.title}</h1>
    </div>
  )
}