# A1-INFO30005
Major project for Web Information Technologies

## Deliverable 4

### Functionality #1: Login & Registration
Our platform has 2 user types, Students and Reviewers. This functionality provides a way for users to login or register as either type and is the gateway to our website.

**Views:** login.ejs, register.ejs  
**Routes:** /login, /register  
**Controllers:** controllers/user.js  
**Models:** models/user.js  

### Functionality #2: Resume Uploading
Users are able to upload their resume to our database on this page. The page includes a form to locate a PDF file, set tags and a write a description before storing the details in our database. After submitting, the file is stored in the filesystem and a thumbnail is generated from the first page of the document.

**Views:** upload-resume.ejs, dashboard.ejs  
**Routes:** /resumes/upload, /dashboard  
**Controllers:** controllers/resumes.js  
**Models:** models/user.js, models/resume.js  
**Middleware:** middleware/is_logged_in.js  

### Functionality #3: Resume Gallery
The Resume Gallery provides a page for all users to view resumes that have been uploaded to the platform. These can be filtered by their tags to help users find resumes specific to certain industries.

**Views:** resume-gallery.ejs  
**Routes:** /resumes  
**Controllers:** controllers/resumes.js  
**Models:** models/user.js, models/resume.js  
**Middleware:** middleware/is_logged_in.js, upload() from routes/resumes.js  

### Functionality #4: Viewing, Commenting on and Reviewing Specific Resumes
Opening a resume in the gallery will direct the user to this page, where the PDF is loaded for viewing along with the tags, descriptions and reviews/comments. The page also allows users to type and post a review/comment on the resume, and provides the option of deleting the resume.

**Views:** show-resume.ejs  
**Routes:** /resumes/:id
**Controllers:** controllers/resumes.js  
**Models:** models/user.js, models/resume.js, models/comment.js  
**Middleware:** middleware/is_logged_in.js  

### NOTES:
- The notification and voting systems have not yet been implemented.
