### QLVT_Express_Typescript_SQLServer_Distributed

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

    Tạo file env:

        cp .env.example .env

    Cập nhật .env:

        Thông tin kết nối tới databases.

        Cấu hình Redis.

        Điền các field env khác còn thiếu.

    Khởi chạy ứng dụng:

        yarn start:dev
