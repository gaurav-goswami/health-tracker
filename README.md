
# 🩺 Health Tracker

A full-stack Health Tracking App built with **Next.js**, **Node.js**, **PostgreSQL**, **Redis**, **RabbitMQ**, **WebSockets**, and **SSE** for real-time updates.

---

## 📁 Project Structure

```
health-tracker/
├── client   # Next.js frontend
└── server   # Node.js backend (API, WebSockets, SSE, Queueing, Caching)
```

---

## ⚙️ Environment Variables

### 🔒 Server `.env`
```
PORT=8080
DATABASE_URL="postgresql://root:password@localhost:5432/health_tracker_db?schema=public"
NODE_ENV=development
ACCESS_TOKEN_SECRET=somerandomaccesstokensecret
REDIS_URL="redis://localhost:6379"
QUEUE_URL="amqp://localhost"

POSTGRES_USER=root
POSTGRES_PASSWORD=password
POSTGRES_DB=health_tracker_db

FRONTEND_URL=http://localhost:3000
```

### 🌐 Client `.env`
```
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SERVER_URL=http://localhost:8080
```

---

## 🚀 Getting Started

You can either set up dependencies manually **or** use Docker. Docker is recommended for convenience.

---

## 🐳 Docker Setup (Recommended)

1. **Clone the repository:**
   ```bash
   git clone <repo-url>
   cd health-tracker/server
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create a `.env` file in the `server` directory** and add the environment variables listed above.

4. **Start services with Docker Compose:**
   ```bash
   docker-compose up
   ```

5. **Run database migrations:**
   ```bash
   npm run prisma:migrate
   ```

   > If Prisma client fails to generate, run:
   ```bash
   npm run prisma:generate
   ```

6. **Seed the database with dummy users:**
   ```bash
   npm run db:seed
   ```

   ✅ Dummy Users:
   ```
   1. test@test.com / password
   2. user@user.com / password
   3. example@eg.com / password
   ```

4. **Start the server:**
   ```bash
   npm run dev
   ```

---

## 🛠 Manual Setup (Without Docker Compose)

### 🔹 PostgreSQL
```bash
docker run --name pg-container -p 5432:5432 \
-e POSTGRES_USER=root \
-e POSTGRES_PASSWORD=password \
-e POSTGRES_DB=health_tracker_db \
-v pgdata:/var/lib/postgresql/data \
-d postgres
```

### 🔹 Redis
```bash
docker run -d --name redis-container -p 6379:6379 \
-v /local-data/:/data \
redis/redis-stack-server:latest
```

### 🔹 RabbitMQ
```bash
docker run -it --rm --name rabbitmq-container \
-p 5672:5672 -p 15672:15672 \
rabbitmq:4-management
```

> 🧭 Access RabbitMQ UI at: [http://localhost:15672](http://localhost:15672)  
> 👤 Username: `guest`  
> 🔐 Password: `guest`

Then follow **steps 5–7** from the Docker section above.

---

## 💻 Frontend Setup

1. Open a new terminal and go to the `client` folder:
   ```bash
   cd ../client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the `client` folder and add:
   ```
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   NEXT_PUBLIC_SERVER_URL=http://localhost:8080
   ```

4. Start the frontend:
   ```bash
   npm run dev
   ```

---

## ✅ You're All Set!

- 🌐 Frontend running at: [http://localhost:3000](http://localhost:3000)
- 🔙 Backend running at: [http://localhost:8080](http://localhost:8080)
- 📊 RabbitMQ UI at: [http://localhost:15672](http://localhost:15672)

---

## 📡 API Usage Examples

### 🔐 Login
**Endpoint:** `POST /api/v1/auth/login`  
**Description:** Log in using email and password

```bash
curl -X POST http://localhost:8080/api/v1/auth/login \
-H "Content-Type: application/json" \
-d '{"email": "test@test.com", "password": "password"}'
```

---

### 📝 Create Health Record
**Endpoint:** `POST /api/v1/health/`  
**Description:** Add a new health record

```bash
curl -X POST http://localhost:8080/api/v1/health/ \
-H "Content-Type: application/json" \
-H "Authorization: Bearer <your_token>" \
-d '{"name": "John Doe", "age": 30, "status": "HEALTHY"}'
```

---

### 📋 Get All Health Records
**Endpoint:** `GET /api/v1/health/`  
**Description:** Retrieve all health records

```bash
curl -X GET http://localhost:8080/api/v1/health/ \
-H "Authorization: Bearer <your_token>"
```

---

### 🔎 Get Single Health Record
**Endpoint:** `GET /api/v1/health/:id`  
**Description:** Retrieve a health record by ID

```bash
curl -X GET http://localhost:8080/api/v1/health/1 \
-H "Authorization: Bearer <your_token>"
```

---

### 🛠 Update Health Record
**Endpoint:** `PUT /api/v1/health/:id`  
**Description:** Update a health record by ID

```bash
curl -X PUT http://localhost:8080/api/v1/health/1 \
-H "Content-Type: application/json" \
-H "Authorization: Bearer <your_token>" \
-d '{"name": "John Smith", "age": 35, "status": "recovering"}'
```

---

### ❌ Delete Health Record
**Endpoint:** `DELETE /api/v1/health/:id`  
**Description:** Delete a health record by ID

```bash
curl -X DELETE http://localhost:8080/api/v1/health/1 \
-H "Authorization: Bearer <your_token>"
```

---

## Architectural Decisions 🏗️

![image](https://github.com/user-attachments/assets/aea7c8f2-adad-4833-a8b5-013724aec84d)


1. **Authentication & Token Storage 🔐:**
   - Users log in via a request to the server, and upon successful authentication, a JWT token is generated and stored in cookies. This token is used for secure access to the application.

2. **Health Record Creation & Message Queuing 📬:**
   - When a user creates a health record, the data is published to **RabbitMQ**. The **Queue class** consumes the message and logs it for further analysis.

3. **Log Analysis with Winston 📊:**
   - **Winston** is used to log health record events. This allows us to track data like how often records are updated and which users are the most active in creating health records. Logs are structured for easy analysis.

4. **Event Triggering from Queue Consumer 🧑‍💻:**
   - Instead of triggering events directly from the controller, notifications about health record updates or creations are now triggered from the **Queue class's consume method**. 
     - **Pros:**
       - Non-blocking: Keeps the main thread free for processing.
       - Decoupling: Separates the event notification logic from the core flow, making it more modular.
     - **Cons:**
       - Dependency on the queue consumer: If the service goes down, users won't get notified.
       - Possible latency: Notifications might experience a slight delay due to the asynchronous queue processing.

5. **Caching with Redis 🚀:**
   - **Redis** is used as a caching layer, storing health record data for **5 minutes** to reduce database load. This makes repeated requests faster as they are served from the cache, unless the record is updated. 
     - **Note:** You can verify this caching by using a `curl` request to the health record endpoint.

6. **Real-time Updates with SSE 🌐:**
   - **Server-Sent Events (SSE)** are used to send real-time updates about health records to clients. With SSE, the server pushes updates to all connected clients, making it a perfect fit for broadcasting record changes without requiring constant polling from clients.
  
## Video demo

https://streamable.com/133m5p

