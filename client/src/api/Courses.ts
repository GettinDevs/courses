import { post, get, put, del } from './Api';
import { Course, SessionWithContent } from '../definitions/Course'

export const getCourses = () => get('/courses')
export const addCourse = (course: Course) => post('/courses', course)
export const addSession = (session: SessionWithContent) => post('/sessions', session)
export const updateCourse = (courseId: number, course: Course) => put(`/courses/${courseId}`, course)
export const updateSession = (sessionId: number, session: SessionWithContent) => put(`/sessions/${sessionId}`, session)
export const deleteCourse = (courseId: number) => del(`/courses/${courseId}`)
export const deleteSession = (sessionId: number) => del(`/sessions/${sessionId}`)