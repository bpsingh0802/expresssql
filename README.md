# 🏫 School API - Node.js + MySQL (Amazon RDS) + Vercel Deployment  

This is a **Node.js Express API** that allows users to **add schools** and **list schools** based on their location.  
- 🚀 **Hosted on Vercel**  
- 🗄️ **MySQL Database on Amazon RDS**  
- 🔥 **REST API for School Management**  

---

## 📌 Features
✅ Add a school with **name, address, latitude, and longitude**  

1. Add a School
Method: POST
Endpoint: https://expresssql-ltak.vercel.app/api/addSchool

JASON BODY:
{
  "name": "Springfield High",
  "address": "456 Oak Street, Springfield",
  "latitude": 40.123456,
  "longitude": -75.654321
}

<img width="1448" alt="addschool" src="https://github.com/user-attachments/assets/6b14d2f3-9698-43ff-9e99-b4d25f20fc1d" />




✅ Retrieve a list of schools sorted by **distance from user coordinates** 

2. List Schools
Method: GET
Endpoint:https://expresssql-5a6i.vercel.app//api/listSchools?latitude=40.712776&longitude=-74.005974


Query Parameters:
latitude (optional): Latitude coordinate for filtering.
longitude (optional): Longitude coordinate for filtering.

<img width="1426" alt="listschool" src="https://github.com/user-attachments/assets/bf362b00-a50a-4dcb-900a-c694bd7e0fb4" />






---

## 📌 Live API Endpoint

🌍 **Base URL**:  
https://expresssql-ltak.vercel.app/


Tech Stack
Backend: Node.js, Express.js
Database: Amazon RDS (SQL)
Deployment: Vercel
API Testing: Postman





AWS Server Snap

<img width="1470" alt="database" src="https://github.com/user-attachments/assets/90285420-c65e-4a36-8886-ad6e7b0c6c4d" />





Local Connection Snap
<img width="1470" alt="local" src="https://github.com/user-attachments/assets/e7881171-856b-436a-b97c-b1e3d2f5f03c" />






Vercel Live Snap

<img width="1401" alt="vercel" src="https://github.com/user-attachments/assets/d23cebe7-350d-49f2-8b56-c00954ddb606" />




