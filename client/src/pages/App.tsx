import { useEffect, useState, useContext, useMemo, Fragment } from 'react';
import styled, { css } from 'styled-components'
import { Routes, Route, Outlet, Link, useLocation, useOutletContext, useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

import { getSession, getUserEnrollments, login } from '../api/User';
import { User } from '../definitions/User'
import { UserContext } from '../contexts/UserContext';
import { LocationContext } from '../contexts/LocationContext';
import { completeSession, uncompleteSession } from '../api/Courses';

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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleLogin() {
    try {
      const usernameParsed = username.trim().toLowerCase();
      const passwordParsed = password.trim();

      if (!usernameParsed) return;
      if (usernameParsed === ADMIN_USER && !passwordParsed) return

      setIsLoading(true);
      setError(null);
      const user = await login(usernameParsed, passwordParsed);
      onLogin({ ...user, password: passwordParsed });
    } catch (e) {
      setError((e as any).message);
    } finally {
      setIsLoading(false);
    }
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
      {isLoading && (
        <div>
          <span>Checking...</span>
        </div>
      )}
      {error && (
        <div>
          <span>{error}</span>
        </div>
      )}
    </div>
  )
}

export function Header() {
  const { locations } = useContext(LocationContext);
  const { user, logout } = useContext(UserContext);

  return (
    <HeaderStyled>
      {/* <div className="path-container">
        <span>{locations.at(-2)}</span>
        <span>{locations.length > 1 ? ' > ' : ''}{locations.at(-1)}</span>
      </div> */}
      <div className="path-container">
        {locations.map((location, index) => (
          <Fragment key={location}>
            {index !== 0 && <b>{' > '}</b>}
            <span>{location}</span>
          </Fragment>
        ))}
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
      <Link className='item' to="/activities">Activities</Link>
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
  }
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
  const { addLocation } = useContext(LocationContext);
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
    addLocation('My Enrollments', true);
    fetchEnrollments();
  }, [])

  if (loading) return <></>;

  return <Outlet context={{ enrollments }} />
}

export function EnrollmentsPage() {
  const { enrollments } = useOutletContext<OutletContextType>();

  function calculateBorder(index: number, sessions: SessionWithUserProgress[]) {
    if (index === 0) return { borderBottomLeftRadius: '5px' }
    if (index === sessions.length - 1) return { borderBottomRightRadius: '5px' }
    return {};
  }

  function calculateColor(session: SessionWithUserProgress) {
    const colors = ({
      [SessionProgressStatus.IN_PROGRESS]: 'orange',
      [SessionProgressStatus.NOT_STARTED]: 'lightgray',
      [SessionProgressStatus.COMPLETED]: 'green',
      [SessionProgressStatus.WAITING_APPROVAL]: 'blue',
    })
    const progress = session.userProgress ? session.userProgress.status : SessionProgressStatus.NOT_STARTED;
    return { backgroundColor: colors[progress] };
  }

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
          <div className="progress-container">
            {enrollment.course.sessions.map((session, index) => (
              <div key={session.sessionId} className="progress-item-container">
                <div className="progress-item" style={{
                  ...calculateBorder(index, enrollment.course.sessions),
                  ...calculateColor(session)
                }}
                ></div>
                <div className="progress-item-title">{session.title}</div>
              </div>
            ))}
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
  padding: 10px 10px 15px; // 5px extra bottom for progress bar
  border: none;
  border-radius: 5px;
  text-decoration: none;
  color: black;
  display: flex;
  justify-content: space-between;
  position: relative;

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

  .progress-container {
    position: absolute;
    bottom: 0;
    left: 0;
    display: flex;
    width: 100%;

    .progress-item-container {
      padding-top: 20px;
      flex: 1;

      :hover {
        .progress-item-title {
          display: block;
        }
      }

      .progress-item-title {
        position: absolute;
        display: none;
        font-size: 0.8rem;
        top: 100%;
        padding-left: 5px;
      }
      .progress-item {
        width: 100%;
        height: 4px;
        box-sizing: border-box;
        border: 1px solid black;
        background-color: lightgreen;
      }
    }
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
          // locked={index !== 0 && (!enrollment.course.sessions[index - 1].userProgress?.isCompleted || !enrollment.course.sessions[index - 1].isMandatory) ? 1 : 0}
          locked={0}
        >
          <div className="title"><b>{session.type === 'LECTURE' ? lecturesCount++ : session.type.toUpperCase()}:&nbsp;</b>{session.title}</div>
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

export function SessionOverviewPage() {
  const { addLocation, popLocation } = useContext(LocationContext);
  const { enrollment } = useOutletContext<OutletCourseContextType>();
  const { sessionId } = useParams();
  const [loading, setLoading] = useState(true);
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [session, setSession] = useState<SessionWithUserProgress | null>(null);
  const [content, setContent] = useState('')

  useEffect(() => {
    const session = enrollment.course.sessions.find(session => session.sessionId === Number(sessionId));
    if (!session) {
      console.warn('Session not found');
      return;
    };

    addLocation(session.title);
    setSession(session);
    fetchSessionContent(Number(sessionId));

    return () => {
      popLocation()
    }
  }, [])

  async function fetchSessionContent(sessionId: number) {
    const res = await getSession(sessionId) as SessionWithContent
    setContent(res.content)
    setLoading(false);
  }

  function handleStatus(id: number, toComplete: boolean) {
    if (!session) {
      console.warn('Invalid session');
      return;
    }

    setLoadingStatus(true)

    const newSession: SessionWithUserProgress = {
      ...session,
      userProgress: {
        ...session.userProgress
      }
    }

    if (toComplete) {
      newSession.userProgress.isCompleted = true;
      newSession.userProgress.status = SessionProgressStatus.COMPLETED
      completeSession(id).then(() => {
        setSession(newSession)
        setLoadingStatus(false)
      })
    } else {
      newSession.userProgress.isCompleted = false;
      newSession.userProgress.status = SessionProgressStatus.IN_PROGRESS
      uncompleteSession(id).then(() => {
        setSession(newSession)
        setLoadingStatus(false)
      })
    }
  }

  function isLastSession() {
    return true
    // const lastSessionId = enrollment.course.sessions.reverse().find(s => s.userProgress?.status === SessionProgressStatus.IN_PROGRESS)?.sessionId
    // return session?.sessionId === lastSessionId
  }

  if (loading || !session) return <></>;

  return (
    <SessionOverviewContainer>
      <div className="actions">
        <BackButton to={`/courses/${enrollment.enrollmentId}`}>Return to course sessions</BackButton>
        {
          isLastSession() && (
            <>
              {
                loadingStatus
                  ? <button disabled>Loading...</button>
                  : session.userProgress?.isCompleted
                    ? <button onClick={() => handleStatus(session.sessionId, false)}>Uncomplete</button>
                    : <button onClick={() => handleStatus(session.sessionId, true)}>Complete</button>
              }
            </>
          )
        }
      </div>
      <ReactMarkdown className='md' children={content} remarkPlugins={[remarkGfm]} />
    </SessionOverviewContainer>
  )
}

const SessionOverviewContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;

  .actions {
    display: flex;
    justify-content: space-between;
  }

  .md {
    pre, code {
      background-color: lightgrey;
    }
  }
`

const BackButton = styled(Link)`
  margin-bottom: 20px;
  text-decoration: underline;
  color: black;
`
