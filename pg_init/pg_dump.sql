INSERT INTO AppUser(username, role) VALUES ('tomas', 'ADMIN');
INSERT INTO AppUser(username) VALUES ('willi');
INSERT INTO AppUser(username) VALUES ('tiago');
INSERT INTO AppUser(username) VALUES ('anda');

INSERT INTO Course(title) VALUES('HTML and CSS');
INSERT INTO Course(title) VALUES('JavaScript Essentials');
INSERT INTO Course(title, dependsOn) VALUES('API', 2);
INSERT INTO Course(title, dependsOn) VALUES('NodeJS', 2);

INSERT INTO Session(title, content, isMandatory, rank, courseId)
VALUES (
	'Introduction',
	'This is your lecture about HTML and CSS',
	TRUE,
	0,
	1
);
INSERT INTO Session(title, content, isMandatory, rank, courseId)
VALUES (
	'Starting with elements',
	'Those are different HTML elements',
	TRUE,
	1,
	1
);


INSERT INTO Enrollment(courseId, userId) VALUES(1, 2);
INSERT INTO Enrollment(courseId, userId) VALUES(2, 2);
INSERT INTO Enrollment(courseId, userId) VALUES(3, 2);

INSERT INTO Enrollment(courseId, userId) VALUES(1, 3);
INSERT INTO Enrollment(courseId, userId) VALUES(2, 3);
INSERT INTO Enrollment(courseId, userId) VALUES(3, 3);

INSERT INTO SessionProgress(sessionId, userId, iscompleted, status) VALUES(1, 2, TRUE, 'COMPLETED');
INSERT INTO SessionProgress(sessionId, userId, status) VALUES(2, 2, 'IN_PROGRESS');

INSERT INTO SessionProgress(sessionId, userId, status) VALUES(1, 3, 'IN_PROGRESS');

/* skip Notification */
