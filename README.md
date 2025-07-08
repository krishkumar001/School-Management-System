
<h1 align="center">
    SCHOOL MANAGEMENT SYSTEM
</h1>

<h3 align="center">
Streamline school management, class organization, and add students and faculty.<br>
Seamlessly track attendance, assess performance, and provide feedback. <br>
Access records, view marks, and communicate effortlessly.
</h3>

# About

The School Management System (Schoolstan) is a modern, web-based application built using the MERN (MongoDB, Express.js, React.js, Node.js) stack. It streamlines school management, class organization, and facilitates communication between students, teachers, parents, and administrators.

## Features

- **User Roles:** Admin, Teacher, Student, and Parent roles with specific functionalities and access levels.
- **Admin Dashboard:** Add students and teachers, create classes and subjects, manage user accounts, oversee system settings.
- **Attendance Tracking:** Teachers can take attendance, mark students, and generate reports. Parents can view their children’s attendance.
- **Performance Assessment:** Teachers provide marks and feedback. Students and parents can view marks and track progress.
- **Data Visualization:** Interactive charts and tables for performance analytics.
- **Communication:** Universal messaging system for all roles, including inbox, sent, conversation view, and notifications.
- **Notice Board & Complaints:** Post and view notices, submit and track complaints.
- **Parent Portal:** Dedicated registration, login, and dashboard for parents.
- **Dark/Light Mode:** Global toggle with MUI’s theme provider.
- **Profile Avatars:** Users can upload/change profile pictures.
- **Real-time/In-app Notifications:** For new notices, complaints, messages, and events.
- **Loading Skeletons:** For tables and cards during data fetches.
- **Accessibility Improvements:** Enhanced color contrast, keyboard navigation, ARIA labels.
- **Responsive, user-friendly interface**

## Technologies Used

- **Frontend:** React.js (Vite), Material UI, Redux
- **Backend:** Node.js, Express.js
- **Database:** MongoDB

# Installation

```sh
git clone https://github.com/Yogndrr/MERN-School-Management-System.git
```
Open 2 terminals in separate windows/tabs.

Terminal 1: Setting Up Backend 
```sh
cd backend
npm install
npm start
```

Create a file called .env in the backend folder.
Inside it write this :

```sh
MONGO_URL = mongodb://127.0.0.1/school
```
If you are using MongoDB Compass you can use this database link but if you are using MongoDB Atlas then instead of this link write your own database link.

Terminal 2: Setting Up Frontend
```sh
cd frontend
npm install
npm start
```
Now, navigate to `localhost:3000` in your browser. 
The Backend API will be running at `localhost:5000`.

---

## Vite Version (Schoolstan)

For the Vite-based frontend:

```sh
cd frontend-vite
npm install
npm run dev
```

---

# Error Solution

You might encounter an error while signing up, either a network error or a loading error that goes on indefinitely.

To resolve it:

1. Navigate to the `frontend > .env` file.
2. Uncomment the first line. After that, terminate the frontend terminal. Open a new terminal and execute the following commands:
```sh
cd frontend
npm start
```
3. If the issue persists, update the base URL in all `Handle` files in `frontend/src/redux` as described below:
   - Add `const REACT_APP_BASE_URL = "http://localhost:5000";` after imports.
   - Replace all `process.env.REACT_APP_BASE_URL` with `REACT_APP_BASE_URL`.
   - Repeat for all files with "Handle" in their names.

If the issue persists, feel free to contact for further assistance.

# Delete Feature Not Working Solution

If you see "Sorry, the delete function has been disabled for now.", follow these steps to enable delete:

1. In `frontend/src/redux/userRelated/userHandle.js`, uncomment the original `deleteUser` function and comment out the disabled version.
2. In `frontend/src/pages/admin/*Related/Show*.js`, uncomment the code in `deleteHandler` that dispatches `deleteUser` and comment out the code that shows the disabled message.
3. Repeat for all relevant files (including those prefixed with "View" if present).

# Deployment
* Render - server side
* Netlify - client side

# Planned & Recent Major Features (TODOs)

1. **Advanced Attendance Analytics**
2. **Parent Portal**
3. **Messaging System**
4. **Dark/Light Mode**
5. **Profile Avatars**
6. **Real-time/In-app Notifications**
7. **Loading Skeletons**
8. **Accessibility Improvements**

# Author
Krish Kumar

# License
This project is developed and maintained by Krish Kumar.
