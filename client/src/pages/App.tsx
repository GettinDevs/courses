import { useEffect, useState, useContext, useMemo } from 'react';
import axios from 'axios';
import styled, { css } from 'styled-components'
import { Routes, Route, Outlet, Link, useLocation, useOutletContext, useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

import { getSession, getUserEnrollments, login } from '../api/User';
import { User } from '../definitions/User'
import { UserContext } from '../contexts/UserContext';
import { LocationContext } from '../contexts/LocationContext';

axios.defaults.baseURL = 'http://localhost:8000/api';

export function App() {
  const { user, setUser } = useContext(UserContext);

  function handleLogin(user: User) {
    setUser(user);
    localStorage.setItem('user', JSON.stringify(user));
  }

  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<EnrollmentsWrapper />}>
          <Route index element={<EnrollmentsPage />} />
          <Route path="courses/:courseId" element={<CourseWrapper />}>
            <Route index element={<CourseOverviewPage />} />
            <Route path="sessions/:sessionId" element={<SessionOverviewPage />} />
          </Route>
        </Route>
      </Routes>
    </MainLayout>
  );
}

type LoginPageProps = {
  onLogin: (user: User) => void;
}
export function LoginPage({ onLogin }: LoginPageProps) {
  const ADMIN_USER = 'tomas';

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  async function handleLogin() {
    const usernameParsed = username.trim().toLowerCase();
    const passwordParsed = password.trim();

    if (!usernameParsed) return;
    if (usernameParsed === ADMIN_USER && !passwordParsed) return

    const user = await login(usernameParsed, passwordParsed);
    onLogin(user);
  }

  return (
    <div>
      <h1>Login Page</h1>
      <div>
        <span>Username:</span>
        <input type="text" value={username} onChange={e => setUsername(e.target.value)} />
      </div>
      {username === ADMIN_USER && (
        <div>
          <span>Password:</span>
          <input type="text" value={password} onChange={e => setPassword(e.target.value)} />
        </div>
      )}
      <div>
        <button onClick={handleLogin}>Login</button>
      </div>
    </div>
  )
}

export function Header() {
  const { locations } = useContext(LocationContext);
  const { user, logout } = useContext(UserContext);

  return (
    <HeaderStyled>
      <div className="path-container">
        <span>{locations.at(-2)}</span>
        <span>{locations.length > 1 ? ' > ' : ''}{locations.at(-1)}</span>
      </div>
      {user && (
        <div className="user-container">
          <span>Logged in as: <b>{user.username}</b></span>
          <div style={{ paddingLeft: '16px' }} />
          <Link to="/" onClick={logout}><button>Logout</button></Link>
        </div>
      )}
    </HeaderStyled>
  )
}

const HeaderStyled = styled.div`
  display: flex;
  align-items: center;
  min-height: 30px;
  padding: 10px;
  border-bottom: 1px solid #ccc;
  
  .path-container {
    flex: 1;
    font-size: 1.8rem;
  }

  .user-container {
    display: flex;
  }
`

export function SideBar() {
  return (
    <SideBarStyled>
      <Link className='item' to="/">My Enrollments</Link>
    </SideBarStyled>
  )
}

const SideBarStyled = styled.div`
  display: flex;
  flex-direction: column;
  color: white;
  padding: 20px;
  border-right: 1px solid #ccc;

  .item {
    margin-bottom: 20px;
    padding: 10px;
    background-color: lightgray;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1.5rem;
    text-decoration: none;
    color: black;

    :hover {
      background-color: gray;
    }
  }
`

export function MainLayout({ children }: { children: React.ReactNode }) {
  const { addLocation } = useContext(LocationContext);

  useEffect(() => {
    addLocation('My Enrollments');
  }, []);

  return (
    <MainLayoutStyled>
      <Header />
      <div className="container">
        <SideBar />
        <div className="content">
          {children}
        </div>
      </div>
    </MainLayoutStyled>
  )
}

const MainLayoutStyled = styled.div`
  height: 100vh;
  width: 100wh;
  display: flex;
  flex-direction: column;

  .container {
    flex: 1;
    display: flex;

    .content {
      flex: 1;
    }
  }
`

export enum SessionType {
  LECTURE = 'LECTURE',
  NOTE = 'NOTE',
  ACTIVITY = 'ACTIVITY',
}

export enum SessionProgressStatus {
  IN_PROGRESS = 'IN_PROGRESS',
  NOT_STARTED = 'NOT_STARTED',
  COMPLETED = 'COMPLETED',
  WAITING_APPROVAL = 'WAITING_APPROVAL'
}

export type Session = {
  sessionId: number;
  isMandatory: boolean;
  rank: number;
  title: string;
  type: SessionType;
}

export type SessionWithContent = Session & {
  content: string;
}

export type SessionWithUserProgress = Session & {
  userProgress: {
    isCompleted: boolean;
    status: SessionProgressStatus
  } | null
}

export type Enrollment = {
  enrollmentId: number;
  isCompleted: boolean;
  userId: number;
  course: {
    courseId: number;
    title: string;
    dependsOn: number | null;
    sessions: SessionWithUserProgress[];
  }
}

export type EnrollmentWithStatusTag = Enrollment & {
  statusTag: string;
  locked: boolean;
}

function getEnrollmentsCoursesById(enrollments: Enrollment[]): Record<number, Enrollment> {
  return enrollments.reduce((acc, enrollment) => {
    acc[enrollment.course.courseId] = enrollment;
    return acc;
  }, {} as Record<number, Enrollment>);
}

function getEnrollmentsStatusTag(enrollments: Enrollment[]): EnrollmentWithStatusTag[] {
  const enrollmentsObjById = getEnrollmentsCoursesById(enrollments);

  return enrollments.map(enrollment => {
    let statusTag = '';
    let locked = false;
    if (enrollment.isCompleted) {
      statusTag = 'Completed'
    } else if (!enrollment.course.dependsOn || enrollmentsObjById[enrollment.course.dependsOn]?.isCompleted) {
      statusTag = 'Started'
    } else {
      statusTag = `Locked by "${enrollmentsObjById[enrollment.course.dependsOn]?.course.title}"`
      locked = true;
    }
    return {
      ...enrollment,
      statusTag,
      locked
    }
  });
}

type OutletContextType = { enrollments: EnrollmentWithStatusTag[] };

export function EnrollmentsWrapper() {
  const { user } = useContext(UserContext);
  const [enrollments, setEnrollments] = useState<EnrollmentWithStatusTag[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchEnrollments() {
    if (!user) return;
    const response = await getUserEnrollments(user.userId);
    const enrollmentsWithStatusTag = getEnrollmentsStatusTag(response);
    setEnrollments(enrollmentsWithStatusTag);
    setLoading(false);
  }

  useEffect(() => {
    fetchEnrollments();
  }, [])

  if (loading) return <></>;

  return <Outlet context={{ enrollments }} />
}

export function EnrollmentsPage() {
  const { enrollments } = useOutletContext<OutletContextType>();

  return (
    <EnrollmentsContainer>
      {enrollments?.map(enrollment => (
        <EnrollmentStyled
          key={enrollment.enrollmentId}
          to={`/courses/${enrollment.enrollmentId}`}
          state={{ enrollment }}
          locked={enrollment.locked ? 1 : 0}
        >
          <div className="title">{enrollment.course.title}</div>
          <div className="tags">
            <div className="tag">{enrollment.statusTag}</div>
          </div>
        </EnrollmentStyled>
      ))}
    </EnrollmentsContainer>
  )
}

const EnrollmentsContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
`

const EnrollmentStyled = styled(Link) <{ locked: number }>`
  margin-bottom: 20px;
  padding: 10px;
  border: none;
  border-radius: 5px;
  text-decoration: none;
  color: black;
  display: flex;
  justify-content: space-between;

  ${({ locked }) => locked
    ? css`
      pointer-events: none;
      background-color: gray;
    `
    : css`
      background-color: lightgray;
      cursor: pointer;
      :hover {
        background-color: gray;
      }
    `}

  .title {
    font-size: 1.5rem;
  }

  .tags {
    display: flex;
    flex-direction: row;
  }

  .tag {
    margin-left: 10px;
    padding: 5px;
    background-color: #f7c15f;
    border-radius: 5px;
  }
`

export function CourseWrapper() {
  const { addLocation, popLocation } = useContext(LocationContext);
  const { enrollments } = useOutletContext<OutletContextType>();
  const { courseId } = useParams();
  const [enrollment, setEnrollment] = useState<EnrollmentWithStatusTag | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const enrollment = enrollments?.find(enrollment => enrollment.enrollmentId === Number(courseId));
    if (!enrollment) {
      console.warn('Enrollment not found');
      return;
    };

    addLocation(enrollment.course.title);
    setEnrollment(enrollment);
    setLoading(false);
    return () => {
      popLocation()
    }
  }, [])

  if (loading) return <></>;

  return <Outlet context={{ enrollment }} />
}

type OutletCourseContextType = { enrollment: EnrollmentWithStatusTag };

export function CourseOverviewPage() {
  const { enrollment } = useOutletContext<OutletCourseContextType>();
  let lecturesCount = 1;

  if (enrollment.course.sessions.length === 0) return <CourseOverviewContainer>This course does not have any session yet!</CourseOverviewContainer>;

  return (
    <CourseOverviewContainer>
      {enrollment.course.sessions.map((session, index) => (
        <SessionItemStyled
          key={session.sessionId}
          to={`sessions/${session.sessionId}`}
          state={{ session }}
          locked={index !== 0 && (!enrollment.course.sessions[index - 1].userProgress?.isCompleted || !enrollment.course.sessions[index - 1].isMandatory) ? 1 : 0}
        >
          <div className="title"><b>{session.type === 'LECTURE' ? lecturesCount++ : session.type.toUpperCase()}: </b>{session.title}</div>
          <div className="tags">
            <div className="tag">{session.userProgress?.status.toLowerCase().replace('_', ' ') || 'not started'}</div>
          </div>
        </SessionItemStyled>
      ))}
    </CourseOverviewContainer>
  )
}

const CourseOverviewContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
`

const SessionItemStyled = styled(Link) <{ locked: number }>`
  margin-bottom: 20px;
  padding: 10px;
  border: none;
  border-radius: 5px;
  text-decoration: none;
  color: black;
  display: flex;
  justify-content: space-between;

  ${({ locked }) => locked
    ? css`
      pointer-events: none;
      background-color: gray;
    `
    : css`
      background-color: lightgray;
      cursor: pointer;
      :hover {
        background-color: gray;
      }
    `}

  .title {
    font-size: 1.5rem;
  }

  .tags {
    display: flex;
    flex-direction: row;
  }

  .tag {
    margin-left: 10px;
    padding: 5px;
    background-color: #f7c15f;
    border-radius: 5px;
  }
`

const markdown = `A paragraph with *emphasis* and **strong importance**.

> A block quote with ~strikethrough~ and a URL: https://reactjs.org.

* Lists
* [ ] todo
* [x] done

A table:

| a | b |
| - | - |
`

export function SessionOverviewPage() {
  const { addLocation, popLocation } = useContext(LocationContext);
  const { enrollment } = useOutletContext<OutletCourseContextType>();
  const { sessionId } = useParams();
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<SessionWithContent | null>(null);

  async function fetchSessionContent(sessionId: number) {
    const response = await getSession(sessionId)
    setSession(response);
    setLoading(false);
  }

  useEffect(() => {
    const session = enrollment.course.sessions.find(session => session.sessionId === Number(sessionId));
    if (!session) {
      console.warn('Session not found');
      return;
    };

    addLocation(session.title);
    fetchSessionContent(Number(sessionId));

    return () => {
      popLocation()
    }
  }, [])

  if (loading || !session) return <></>;

  return (
    <SessionOverviewContainer>
      <BackButton to={`/courses/${enrollment.enrollmentId}`}>Return to course sessions</BackButton>
      {/* <div>{session.content}</div> */}
      <ReactMarkdown children={markdown} remarkPlugins={[remarkGfm]} />
    </SessionOverviewContainer>
  )
}

const SessionOverviewContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
`

const BackButton = styled(Link)`
  margin-bottom: 20px;
  text-decoration: underline;
  color: black;
`
