# A1-INFO30005
Major project for Web Information Technologies

## Deliverable 4 

Things required:
Decription(Please write 2-3 sentences describing each functionality. You can describe what the functionality is and what it achieves.)
Relevant URLS(Provide a list of the names of the views, routes, controllers, and models associated with each functionality.)

### Functionality #1: Login & Registration
Description:  
Views: login.ejs, register.ejs  
Routes: /login, /register  
Controllers: controllers/user.js  
Models: models/user.js  

### Functionality #2: Resume Uploading
Description:  
Views: upload-resume.ejs, dashboard.ejs  
Routes: /resumes/upload, /dashboard  
Controllers: controllers/resumes.js  
Models: models/user.js, models/resume.js  
Middleware: middleware/is_logged_in.js  

### Functionality #3: Resume Gallery
Description:  
Views: resume-gallery.ejs  
Routes: /resumes  
Controllers: controllers/resumes.js  
Models: models/user.js, models/resume.js  
Middleware: middleware/is_logged_in.js, upload() from routes/resumes.js  

### Functionality #4: Viewing, Commenting on and Reviewing Specific Resumes
Description:  
Views: show-resume.ejs  
Routes: /resumes/:id     
Controllers: controllers/resumes.js  
Models: models/user.js, models/resume.js, models/comment.js  
Middleware: middleware/is_logged_in.js  

### NOTES:
- The notification and voting systems have not yet been implemented.
