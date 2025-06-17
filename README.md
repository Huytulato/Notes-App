# Full-Stack Notes App

Một ứng dụng ghi chú full-stack hiện đại được xây dựng bằng React, NestJS, và MongoDB, sử dụng kiến trúc API GraphQL. Ứng dụng cho phép người dùng đăng ký, đăng nhập, tạo, xem, sửa, xóa, và tìm kiếm các ghi chú cá nhân một cách an toàn và hiệu quả.

## ✨ Các tính năng chính

- **Xác thực an toàn:** Đăng ký và đăng nhập bằng JWT (JSON Web Tokens). Mật khẩu được hash an toàn bằng `bcrypt`.
- **Quản lý Ghi chú (CRUD):** Người dùng có toàn quyền tạo, đọc, cập nhật và xóa các ghi chú của riêng mình.
- **Soạn thảo bằng Markdown:** Hỗ trợ viết ghi chú bằng cú pháp Markdown và tự động render sang HTML để hiển thị.
- **Tìm kiếm Real-time:** Tìm kiếm ghi chú nhanh chóng dựa trên tiêu đề hoặc nội dung với cơ chế debouncing để tối ưu hiệu năng.
- **Giao diện Dark Mode:** Chuyển đổi giữa giao diện Sáng và Tối để phù hợp với sở thích người dùng. Lựa chọn được lưu lại cho các lần truy cập sau.
- **API GraphQL:** Toàn bộ các thao tác dữ liệu được thực hiện thông qua một API GraphQL mạnh mẽ và linh hoạt, thay thế cho kiến trúc REST truyền thống.
- **Phân quyền dữ liệu:** Đảm bảo người dùng chỉ có thể truy cập và thao tác trên dữ liệu của chính mình.

## 🚀 Kiến trúc và Công nghệ sử dụng

Dự án được xây dựng theo kiến trúc 3 lớp hiện đại, tách biệt rõ ràng giữa giao diện, logic nghiệp vụ và lưu trữ dữ liệu.

### **Backend (NestJS)**

- **Framework:** [NestJS](https://nestjs.com/) - Một framework Node.js mạnh mẽ để xây dựng các ứng dụng server-side hiệu quả và có khả năng mở rộng.
- **Ngôn ngữ:** TypeScript
- **API:** [GraphQL](https://graphql.org/) (sử dụng `@nestjs/graphql` và Apollo Server)
- **Database:** [MongoDB](https://www.mongodb.com/) - Một cơ sở dữ liệu NoSQL linh hoạt.
- **Tương tác DB:** [Mongoose](https://mongoosejs.com/) - Thư viện ODM (Object Data Modeling) cho MongoDB.
- **Xác thực:** [Passport.js](http://www.passportjs.org/) với chiến lược JWT (`passport-jwt`).
- **Validation:** `class-validator` để xác thực dữ liệu đầu vào cho các mutation.

### **Frontend (React)**

- **Thư viện:** [React](https://reactjs.org/) (sử dụng Function Components và Hooks).
- **Ngôn ngữ:** TypeScript
- **Build Tool:** [Vite](https://vitejs.dev/) - Cung cấp môi trường phát triển cực nhanh với Hot Module Replacement (HMR).
- **GraphQL Client:** [Apollo Client](https://www.apollographql.com/docs/react/) - Quản lý state từ server, caching, và thực hiện các query/mutation.
- **Routing:** [React Router DOM](https://reactrouter.com/) - Xử lý client-side routing cho ứng dụng trang đơn (SPA).
- **Quản lý State Toàn cục:** React Context API (dùng cho `AuthContext` và `ThemeContext`).

## 🛠️ Cài đặt và Khởi chạy

Để chạy dự án này trên máy cục bộ của bạn, hãy làm theo các bước sau.

### **Yêu cầu tiên quyết**

- [Node.js](https://nodejs.org/) (phiên bản 16.x trở lên)
- [MongoDB](https://www.mongodb.com/try/download/community) đã được cài đặt và đang chạy trên máy của bạn.
- `npm` hoặc `yarn`

### **1. Cài đặt Backend**

```bash
# 1. Clone repository (hoặc di chuyển vào thư mục backend nếu đã có)
# git clone https://your-repo-url.com/notes-app.git
cd notes-app-backend

# 2. Cài đặt các dependencies
npm install

# 3. Tạo file .env ở thư mục gốc của backend
# Sao chép nội dung từ .env.example (nếu có) hoặc tạo mới với nội dung sau:
# MONGO_URI=mongodb://localhost:27017/notes-app
# JWT_SECRET=YOUR_SUPER_SECRET_KEY_HERE_CHANGE_ME

# 4. Khởi động server backend
npm run start:dev
```
Server backend sẽ chạy tại `http://localhost:3001`. Bạn có thể truy cập GraphQL Playground tại `http://localhost:3001/graphql`.

### **2. Cài đặt Frontend**

Mở một cửa sổ terminal **mới**.

```bash
# 1. Di chuyển vào thư mục frontend
cd ../notes-app-frontend

# 2. Cài đặt các dependencies
npm install

# 3. Khởi động server frontend
npm run dev
```
Server frontend sẽ chạy tại một địa chỉ được Vite cung cấp, thường là `http://localhost:5173`.

Bây giờ, hãy mở trình duyệt và truy cập vào địa chỉ của frontend để bắt đầu sử dụng ứng dụng!

## API GraphQL

Bạn có thể khám phá và kiểm tra tất cả các query và mutation có sẵn thông qua **GraphQL Playground** tại `http://localhost:3001/graphql` sau khi khởi động backend.

### **Ví dụ Mutation (Đăng nhập)**
```graphql
mutation {
  login(loginInput: {
    email: "test@example.com",
    password: "password123"
  }) {
    access_token
    user {
      _id
      email
    }
  }
}
```

### **Ví dụ Query (Lấy ghi chú)**
*Lưu ý: Cần cung cấp token trong HTTP Headers: `{ "Authorization": "Bearer <your_token>" }`*
```graphql
query {
  myNotes {
    _id
    title
    createdAt
  }
}
```

---

Cảm ơn bạn đã xem qua dự án này!