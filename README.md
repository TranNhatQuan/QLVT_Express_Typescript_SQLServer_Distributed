###QLVT_Express_Typescript_SQLServer_Distributed

🛠 Tech Stack

    Backend: ExpressJS, TypeScript

    Database: SQL Server (phân tán dọc & ngang) với TypeORM

    Caching: Redis

    Queue: BullMQ

    Authentication: JWT

    Dependency Injection: TypeDI

🗃 Kiến trúc cơ sở dữ liệu

    Database master: Chứa các thông tin quản trị chung.

    Database phân tán dọc: Quản lý thông tin người dùng dùng chung cho toàn hệ thống.

    Databases phân tán ngang theo chi nhánh: Mỗi chi nhánh có một database riêng biệt để phục vụ cho việc mở rộng theo chiều ngang.

    Sử dụng script qlvt-table-data.sql để tạo và khởi tạo dữ liệu cho database QLVT.

🚀 Hướng dẫn chạy dự án

    Cài đặt dependencies:

yarn install

Tạo file cấu hình môi trường:

cp .env.example .env

Cập nhật file .env:

    Thông tin kết nối tới databases (master, dọc, các chi nhánh).

    Cấu hình Redis.

    Cấu hình khác phù hợp với môi trường của bạn.

Khởi chạy ứng dụng ở môi trường phát triển:

    yarn start:dev

Nếu bạn muốn mình viết thêm README đầy đủ với ví dụ .env, sơ đồ kiến trúc hoặc hướng dẫn cụ thể cho từng môi trường (dev/prod), mình có thể hỗ trợ tiếp.
