const clients = {};

const setupSocket = (io) => {
    io.on('connection', (socket) => {
        console.log(`User connected: ${socket.id}`);

        // Lưu thông tin client và trạng thái tin nhắn tự động
        clients[socket.id] = { role: 'client', firstMessage: true };

        // Nhận tin nhắn từ client và chuyển tiếp tới admin
        socket.on('client message', (msg) => {
            console.log(`Message from ${socket.id}: ${msg}`);
            io.to('admin').emit('chat message', { from: socket.id, msg });

            // Gửi tin nhắn tự động từ admin chỉ nếu client gửi tin nhắn đầu tiên
            if (clients[socket.id].firstMessage) {
                setTimeout(() => {
                    io.to(socket.id).emit('chat message', { from: 'admin', msg: 'Cảm ơn bạn đã nhắn tin. Admin sẽ trả lời bạn sớm!' });
                }, 1000); // Gửi tin nhắn tự động sau 1 giây (hoặc tùy chỉnh thời gian)

                // Đặt trạng thái firstMessage = false để đảm bảo chỉ gửi 1 lần
                clients[socket.id].firstMessage = false;
            }
        });

        // Nhận tin nhắn từ admin và chuyển tiếp tới client
        socket.on('admin message', ({ to, msg }) => {
            if (clients[to]) {
                io.to(to).emit('chat message', { from: 'admin', msg });
            }
        });

        // Gán role admin nếu admin kết nối
        socket.on('admin connect', () => {
            console.log('Admin connected:', socket.id);
            clients[socket.id].role = 'admin';
            socket.join('admin'); // Thêm admin vào một phòng riêng
        });

        // Xử lý khi client ngắt kết nối
        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.id}`);
            delete clients[socket.id];
        });
    });
};

module.exports = { setupSocket };
