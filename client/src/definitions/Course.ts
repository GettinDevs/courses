export enum SessionType {
  LECTURE = 'LECTURE',
  NOTE = 'NOTE',
  ACTIVITY = 'ACTIVITY',
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

export type SessionWithCount = SessionWithContent & {
  count: number;
}

export type Course = {
  courseId: number;
  title: string;
  dependsOn: number | null;
}

export type CourseWithSessions = Course & {
  sessions: SessionWithContent[];
}

export type CourseWithSessionsMeta = Course & {
  sessions: SessionWithCount[];
}