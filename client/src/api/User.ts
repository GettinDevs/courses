import { post, get } from './Api';

export function login(username: string, password?: string) {
  return post('/login', { username, password });
}

export function getUserNotifications(userId: number) {
  return get(`/users/${userId}/notifications`);
}

export function getUserEnrollments(userId: number) {
  return get(`/users/${userId}/enrollments`);
}

export function getUserEnrollment(userId: number, enrollmentId: number) {
  return get(`/users/${userId}/enrollments/${enrollmentId}`);
}

export function getCourse(courseId: number) {
  return get(`/courses/${courseId}`);
}

export function getSession(sessionId: number) {
  return get(`/sessions/${sessionId}`);
}