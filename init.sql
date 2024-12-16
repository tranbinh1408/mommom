GRANT ALL PRIVILEGES ON *.* TO 'baitap'@'%' IDENTIFIED BY '1' WITH GRANT OPTION;
FLUSH PRIVILEGES;
CREATE TABLE Users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,      -- ID định danh duy nhất
    username VARCHAR(50) UNIQUE NOT NULL,        -- Tên đăng nhập, không được trùng
    password VARCHAR(255) NOT NULL,              -- Mật khẩu đã mã hóa
    full_name VARCHAR(100) NOT NULL,             -- Tên đầy đủ của nhân viên
    email VARCHAR(100) UNIQUE,                   -- Email, không được trùng
    phone VARCHAR(15),                           -- Số điện thoại
    role ENUM('staff', 'admin') DEFAULT 'staff', -- Vai trò: nhân viên hoặc admin
);
CREATE TABLE Categories (
    category_id INT PRIMARY KEY AUTO_INCREMENT,  -- ID định danh duy nhất
    name VARCHAR(50) NOT NULL,                   -- Tên danh mục (VD: Món chính, Tráng miệng)
    description TEXT,                            -- Mô tả danh mục
    image_url VARCHAR(255),                      -- Đường dẫn hình ảnh danh mục
    is_active BOOLEAN DEFAULT true               -- Trạng thái hiển thị
);
CREATE TABLE Products (
    product_id INT PRIMARY KEY AUTO_INCREMENT,   -- ID định danh duy nhất
    category_id INT,                             -- Liên kết với bảng Categories
    name VARCHAR(100) NOT NULL,                  -- Tên món ăn
    description TEXT,                            -- Mô tả món ăn
    price DECIMAL(10,2) NOT NULL,                -- Giá tiền (VD: 50.00)
    image_url VARCHAR(1000),                      -- Đường dẫn hình ảnh món ăn
    is_available BOOLEAN DEFAULT true,           -- Trạng thái còn/hết
    created_at TIMESTAMP,                        -- Thời điểm thêm món
    FOREIGN KEY (category_id) REFERENCES Categories(category_id)
);
CREATE TABLE Tables (
    table_id INT PRIMARY KEY AUTO_INCREMENT,     -- ID định danh duy nhất
    table_number VARCHAR(10) NOT NULL UNIQUE,    -- Số bàn (VD: "A1", "B2")
    capacity INT NOT NULL,                       -- Sức chứa (số người)
    status ENUM('available', 'occupied', 'reserved') DEFAULT 'available' 
    -- Trạng thái: trống/đang dùng/đã đặt
);
CREATE TABLE Orders (
    order_id INT PRIMARY KEY AUTO_INCREMENT,     -- ID định danh duy nhất
    customer_name VARCHAR(100) NULL,         -- Tên khách hàng
    customer_phone VARCHAR(15),                  -- SĐT khách hàng
    customer_email VARCHAR(100),                 -- Email khách hàng
    table_id INT,                                -- Liên kết với bảng Tables
    staff_id INT,                                -- Liên kết với bảng Users (nhân viên xử lý)
    total_amount DECIMAL(10,2) NOT NULL,         -- Tổng tiền
    status ENUM('created', 'completed') DEFAULT 'created';
    payment_method ENUM('cash', 'card', 'momo'), -- Phương thức thanh toán
    payment_status ENUM('pending', 'paid', 'failed'), -- Trạng thái thanh toán
    note TEXT,                                   -- Ghi chú đơn hàng

    created_at TIMESTAMP,                        -- Thời điểm tạo đơn
    updated_at TIMESTAMP,                        -- Thời điểm cập nhật cuối
    FOREIGN KEY (table_id) REFERENCES Tables(table_id),
    FOREIGN KEY (staff_id) REFERENCES Users(user_id)
);
CREATE TABLE OrderDetails (
    order_id INT,                                -- Liên kết với bảng Orders
    product_id INT,                              -- Liên kết với bảng Products
    quantity INT NOT NULL,                       -- Số lượng
    unit_price DECIMAL(10,2) NOT NULL,           -- Đơn giá
    subtotal DECIMAL(10,2) GENERATED ALWAYS AS (quantity * unit_price) STORED,
    -- Thành tiền (tự động tính = số lượng * đơn giá)
    note TEXT,                                   -- Ghi chú cho món
    PRIMARY KEY (order_id, product_id),          -- Khóa chính kép
    FOREIGN KEY (order_id) REFERENCES Orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES Products(product_id)
);


INSERT INTO Products (category_id, name, description, price, image_url, is_available) VALUES
-- Phở/Bún (category_id = 1)
(1, 'Phở bò', 'Phở bò truyền thống Việt Nam', 20.00, 'https://scontent.fhan20-1.fna.fbcdn.net/v/t39.30808-6/470137547_122097395390660943_4919139303085711054_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=127cfc&_nc_ohc=W2C3_3ZPuIcQ7kNvgG4-OUt&_nc_zt=23&_nc_ht=scontent.fhan20-1.fna&_nc_gid=AAYb2B8T8uXGj-J5oDBJpeL&oh=00_AYA_pXEohDk5LB0PZYoM0w0M0ruRzrbQEGjwG1O5oRM7QQ&oe=6762F55C', true),
(1, 'Bún bò huế', 'Bún bò Huế cay nồng đặc trưng', 10.00, 'https://scontent.fhan2-4.fna.fbcdn.net/v/t39.30808-6/470159813_122097395126660943_7022793989104890694_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=127cfc&_nc_ohc=MBIsIWFk1CYQ7kNvgG8VMyX&_nc_zt=23&_nc_ht=scontent.fhan2-4.fna&_nc_gid=AH42nbiNj-CUApUaU25i31G&oh=00_AYDvDpJmnkiNxAPWPy2K7BxXayc7qM03LaGRTCXFKhLuZw&oe=6762DA7C', true),
(1, 'Bún đậu', 'Bún đậu mắm tôm đầy đủ', 15.00, 'https://scontent.fhan20-1.fna.fbcdn.net/v/t39.30808-6/470183710_122097395180660943_1407003487478193665_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=127cfc&_nc_ohc=jFegE7LwsB8Q7kNvgEcPEvK&_nc_zt=23&_nc_ht=scontent.fhan20-1.fna&_nc_gid=AUrR9NqB6xWnryHRetImFt6&oh=00_AYDo5n92LHuGm8oyUTO5wrBK68nBXX5-57v_x4HUSEMkDQ&oe=6762E70C', true),
(1, 'Bánh cuốn nóng', 'Bánh cuốn nóng nhân thịt', 12.00, 'https://scontent.fhan2-4.fna.fbcdn.net/v/t39.30808-6/470186015_122097395066660943_8158675139027273568_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=127cfc&_nc_ohc=FCr-LL7DOUMQ7kNvgF2N-wz&_nc_zt=23&_nc_ht=scontent.fhan2-4.fna&_nc_gid=AVGmQIFhCYUCV18PsrD81w_&oh=00_AYDEuHH83hct379mY-_yl5kagaaPsPj0PYWihf6IGpwcQg&oe=6762CBE5', true),
(1, 'Mì quảng', 'Mì Quảng đặc sản miền Trung', 14.00, 'https://scontent.fhan2-4.fna.fbcdn.net/v/t39.30808-6/470181294_122097395372660943_739976327725751104_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=127cfc&_nc_ohc=Sv8uo026S-UQ7kNvgHSmar7&_nc_zt=23&_nc_ht=scontent.fhan2-4.fna&_nc_gid=AD5SEpz1k-RBAbopBCEUvBh&oh=00_AYC8fZ9kuhq0AGwz0wRgJWEwLbDv-AOSoH0KHtJLNSIqIQ&oe=6762CB78', true),
(1, 'Bún chả', 'Bún chả Hà Nội', 10.00, 'https://scontent.fhan2-5.fna.fbcdn.net/v/t39.30808-6/470218179_122097395090660943_715585315901448055_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=127cfc&_nc_ohc=1PSVLTeVyAkQ7kNvgGZVRvB&_nc_zt=23&_nc_ht=scontent.fhan2-5.fna&_nc_gid=Ay9RPx0kMmN_sr3LwWASrd3&oh=00_AYDfxeZH-f5kPJ3ZuMJRFhJ43ns7NDi1Eo3XsymiA_rwTg&oe=6762F684', true),

-- Cơm (category_id = 2)
(2, 'Cơm tấm', 'Cơm tấm sườn bì chả', 15.00, 'https://scontent.fhan2-5.fna.fbcdn.net/v/t39.30808-6/470230418_122097395240660943_5811830361814724942_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=127cfc&_nc_ohc=12C6THyNP10Q7kNvgHQIjVn&_nc_zt=23&_nc_ht=scontent.fhan2-5.fna&_nc_gid=ARgt_f97Iid5qiebNQiIZmt&oh=00_AYA4lNONZ2fuCz9YgTo-snE3VjvQMaMJxxrX9xdztqaqXw&oe=6762D243', true),
(2, 'Cơm gà xối mỡ', 'Cơm gà xối mỡ giòn rụm', 17.00, 'https://scontent.fhan20-1.fna.fbcdn.net/v/t39.30808-6/470181315_122097410042660943_377140919348690356_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=127cfc&_nc_ohc=81hzJhuGmjAQ7kNvgFmjEE3&_nc_zt=23&_nc_ht=scontent.fhan20-1.fna&_nc_gid=ATIpKbBB6DNtrbJkHDYYuIM&oh=00_AYAsgOXBtd71Y4znNw2fqhocRJer9OtAXqY2dzLJF-iOhg&oe=6762F266', true);

-- Đồ uống (category_id = 3) - Có thể thêm các món đồ uống sau này