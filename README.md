# 🚀 InternTask - Full-Stack Administrator Dashboard

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB) ![CodeIgniter 4](https://img.shields.io/badge/CodeIgniter-%23EF4223.svg?style=for-the-badge&logo=codeIgniter&logoColor=white) ![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white) ![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white) ![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)

A feature-rich, full-stack application demonstrating complex relational database management, JWT authentication, and a stunning modern UI. Built with a robust **CodeIgniter 4 API Backend** running inside highly-scalable **Docker Containers** parsing to a dynamic **ReactJS + Vite Frontend**.

## ✨ Key Features

- **Advanced UI/UX Aesthetics:** Custom glassmorphic design utilizing completely Vanilla CSS, CSS3 Floating Animations, and interactive 3D scaling states.
- **Data Visualizations:** Features a dynamic `Recharts` Dashboard mapping live database demographics to interactive Pie and Bar charts.
- **Relational CRUD Operations:** Full API functionality (`POST`, `GET`, `PUT`, `DELETE`). Deleting a user safely performs Postgres `db->transStart()` transactions to cleanly cascade deletes across 1-to-1 relational `teachers` linked tables.
- **Export to CSV Client Setup:** Search filter outputs are instantly downloadable as `.csv` data-dumps straight from the Datatable UI via Blob-mapping implementations.
- **Stateless Verification Architecture:** Secure token-based API routing explicitly guarded by `firebase/php-jwt` headers on the CodeIgniter controller layers.
- **Live Search Filtering:** Realtime Array filtering using React's hook lifecycles.

---

## 🛠️ Architecture Setup

### 1. Launch the Stack
The backend runs entirely inside initialized Docker containers guaranteeing zero dependency collisions locally. Boot up the CI4 Apache server and the Postgres 15 database effortlessly:
```bash
docker-compose up -d --build
```

### 2. Scaffold Database Migrations
Provision the PostgreSQL database internal models by executing the `spark` tool directly inside the running backend container:
```bash
docker exec untitledfolder2-backend-1 php spark migrate
```
*(The API will immediately initialize at `http://localhost:8080/api/`)*

### 3. Spin up the Frontend Dev Server
Navigate into the React repository, install the Node elements natively, and spin up hot-reloading mapping to your local ports:
```bash
cd frontend
npm install
npm run dev
```

🚀 **Open your web browser strictly to `http://localhost:5173` to explore the experience.**
# teacher-dashboard
