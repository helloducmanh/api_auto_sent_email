require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");

const app = express();
const PORT = 3000;

app.use(express.json());

// Lấy danh sách email gửi đi & nhận
const emailList = process.env.EMAILS.split(",");
const passwordList = process.env.PASSWORDS.split(",");
const recipientList = process.env.RECIPIENTS.split(",");

// Tạo danh sách transporter tương ứng với từng email
const transporters = emailList.map((email, index) =>
  nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: email.trim(),
      pass: passwordList[index].trim(),
    },
  })
);

// API gửi email từ nhiều tài khoản đến nhiều người nhận
app.post("/send-emails", async (req, res) => {
  res.json({ message: "Bắt đầu gửi email, vui lòng đợi..." });

  for (let i = 750; i < 1000; i++) {
    try {
      const senderIndex = i % emailList.length; // Luân phiên tài khoản gửi
      const recipientIndex = i % recipientList.length; // Luân phiên người nhận
      const transporter = transporters[senderIndex];

      await transporter.sendMail({
        from: emailList[senderIndex],
        to: recipientList[recipientIndex],
        subject: `Email ${Date.now()} từ ${emailList[senderIndex]}`,
        text: `Nội dung email số ${i + 1} từ ${emailList[senderIndex]} gửi đến ${recipientList[recipientIndex]}`,
      });

      console.log(`✅ Gửi email #${i + 1} từ ${emailList[senderIndex]} đến ${recipientList[recipientIndex]}`);
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Delay 1s để tránh bị chặn
    } catch (error) {
      console.error(`❌ Lỗi khi gửi email #${i + 1}:`, error.message);
    }
  }
});

// Khởi động server
app.listen(PORT, () => {
  console.log(`Server chạy tại: http://localhost:${PORT}`);
});
