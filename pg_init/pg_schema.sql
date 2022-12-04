CREATE TYPE roles AS ENUM('USER', 'ADMIN');
CREATE TYPE sessionType AS ENUM('LECTURE', 'ACTIVITY', 'NOTE');
CREATE TYPE sessionProgressStatus AS ENUM('NOT_STARTED', 'IN_PROGRES', 'COMPLETED', 'WIATING_APPROVAL');
CREATE TYPE notificationType AS ENUM('SUCCESS', 'WARNING', 'ERROR', 'GENERAL');

/* AppUser */
CREATE TABLE IF NOT EXISTS AppUser (
  userId serial PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  role roles DEFAULT 'USER'
);

/* Course */
CREATE TABLE IF NOT EXISTS Course (
  courseId serial PRIMARY KEY,
  title VARCHAR(120) NOT NULL,
  dependsOn INT REFERENCES Course(courseId)
);

/* Session */
CREATE TABLE IF NOT EXISTS Session (
  sessionId serial PRIMARY KEY,
  title VARCHAR(120) NOT NULL,
  content TEXT NOT NULL,
  type sessionType DEFAULT 'LECTURE',
  isMandatory BOOLEAN NOT NULL,
  rank INT NOT NULL,
  courseId INT NOT NULL REFERENCES Course(courseId)
);

/* SessionProgress */
CREATE TABLE IF NOT EXISTS SessionProgress (
  sessionProgressId serial PRIMARY KEY,
  sessionId INT NOT NULL REFERENCES Session(sessionId),
  userId INT NOT NULL REFERENCES AppUser(userId),
  isCompleted BOOLEAN DEFAULT FALSE,
  status sessionProgressStatus DEFAULT 'NOT_STARTED'
);

/* Enrollment */
CREATE TABLE IF NOT EXISTS Enrollment (
  enrollmentId serial PRIMARY KEY,
  courseId INT NOT NULL REFERENCES Course(courseId),
  userId INT NOT NULL REFERENCES AppUser(userId),
  isCompleted BOOLEAN DEFAULT FALSE
);

/* Notification */
CREATE TABLE IF NOT EXISTS Notification (
  userId INT NOT NULL REFERENCES AppUser(userId),
  title VARCHAR(100) NOT NULL,
  description TEXT,
  type notificationType NOT NULL
);
