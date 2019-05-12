# A1-INFO30005
Major project for Web Information Technologies

## Deliverable 4 

Things required:
Decription(Please write 2-3 sentences describing each functionality. You can describe what the functionality is and what it achieves.)
Relevant URLS(Provide a list of the names of the views, routes, controllers, and models associated with each functionality.)

### Functionality #1: Login & Registration
Decription:
Views: login.ejs, register.ejs
Routes: /login, /register
Controllers: controllers/user.js
Models: models/user.js

### Functionality #2: Resume Uploading
Decription:
Views: upload-resume.ejs, dashboard.ejs
Routes: /resumes/upload, /dashboard
Controllers: controllers/resumes.js
Models: models/user.js, models/resume.js
Middleware: middleware/is_logged_in.js

### Functionality #3: Resume Gallery
Decription:
Views: resume-gallery.ejs
Routes: /resumes
Controllers: controllers/resumes.js
Models: models/user.js, models/resume.js
Middleware: middleware/is_logged_in.js, upload() from routes/resumes.js

### Functionality #4:Viewing Specific resumes and commenting on them
Decription:
Views: show-resume.ejs
Routes: /resumes/:id, 
Controllers: controllers/resumes.js
Models: models/user.js, models/resume.js, models/comment.js
Middleware: middleware/is_logged_in.js
