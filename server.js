const express = require('express');
const line = require('@line/bot-sdk');
const cors = require('cors');
require('dotenv').config();

const config = {
    channelAccessToken: process.env.LINE_ACCESS_TOKEN,
    channelSecret: process.env.LINE_CHANNEL_SECRET
};

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'))

const client = new line.Client(config);

app.post('/sendOrder', async (req, res) => {
    const order = req.body;

    if (!order || !order.items || !order.customerName) {
        return res.status(400).send('ข้อมูลคำสั่งซื้อไม่ครบถ้วน');
    }

    let messageText = `มีคำสั่งซื้อใหม่:\nชื่อ: ${order.customerName}\nที่อยู่: ${order.address}\nเบอร์โทร: ${order.phone}\n\nรายการสินค้า:\n`;

    order.items.forEach(item => {
        messageText += `- ${item.name} x${item.quantity} = ${item.price * item.quantity} บาท\n`;
    });

    messageText += `\nรวมทั้งหมด: ${order.total} บาท`;

    const message = {
        type: 'text',
        text: messageText
    };

    try {
        await client.pushMessage('Ua51784907977a60d7b6787f604a0f14f', message);

        res.status(200).send('ส่งข้อความเรียบร้อย');
    } catch (error) {
        console.error(error);
        res.status(500).send('ส่งข้อความล้มเหลว');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server รันที่พอร์ต ${PORT}`);
});
