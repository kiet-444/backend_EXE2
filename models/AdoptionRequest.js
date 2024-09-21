const mongoose = require('mongoose');

const adoptionRequestSchema = new mongoose.Schema({
    pet: { type: mongoose.Schema.Types.ObjectId, ref: 'Pet', required: true }, // Thú nuôi muốn nhận nuôi
    name: { type: String, required: true },  // Tên người nhận nuôi
    address: { type: String, required: true },  // Địa chỉ
    phoneNumber: { type: String, required: true },  // Số điện thoại
    cccd: { type: String, required: true },  // Số CCCD
    status: { 
        type: String, 
        enum: ['pending', 'approved', 'rejected'], 
        default: 'pending'  // Trạng thái: pending (chờ xét duyệt), approved (đã duyệt), rejected (bị từ chối)
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Người gửi yêu cầu nhận nuôi
}, { timestamps: true });

const AdoptionRequest = mongoose.model('AdoptionRequest', adoptionRequestSchema);

module.exports = AdoptionRequest;
