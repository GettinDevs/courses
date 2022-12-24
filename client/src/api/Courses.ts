import { post, get, put, del } from './Api';
import { Course, SessionWithContent } from '../definitions/Course'

const localUser = localStorage.getItem('user')
const user = localUser ? JSON.parse(localUser) : null

export const getCourses = () => get('/courses')
export const addCourse = (course: Course) => post('/courses', { ...course, user })
export const addSession = (session: SessionWithContent) => post('/sessions', { ...session, user })
export const updateCourseById = (courseId: number, course: Course) => put(`/courses/${courseId}`, { ...course, user })
export const updateSessionById = (sessionId: number, session: SessionWithContent) => put(`/sessions/${sessionId}`, { ...session, user })
export const deleteCourseById = (courseId: number) => del(`/courses/${courseId}`)
export const deleteSessionById = (sessionId: number) => del(`/sessions/${sessionId}`)
export const completeSession = (sessionId: number) => post(`/sessions/${sessionId}/complete`, { ...user })
export const uncompleteSession = (sessionId: number) => post(`/sessions/${sessionId}/uncomplete`, { ...user })