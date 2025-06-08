const form = document.getElementById('checkout-form');
const qrPopup = document.getElementById('qr-popup');

form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const address = document.getElementById('address').value.trim();
    const phone = document.getElementById('phone').value.trim();

    if (!name || !address || !phone) {
        alert("กรุณากรอกข้อมูลให้ครบถ้วน");
        return;
    }

    // ดึงตะกร้าสินค้า
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart.length === 0) {
        alert("ไม่มีสินค้าในตะกร้า");
        return;
    }

    // เตรียมข้อมูลสั่งซื้อสำหรับส่ง backend
    const orderData = {
        customerName: name,
        address: address,
        phone: phone,
        items: cart,
        total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    };

    try {
        // ส่งข้อมูลไป backend (แก้ URL เป็นของคุณเอง)
        const response = await fetch('http://localhost:3000/sendOrder', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData)
        });

        if (!response.ok) {
            alert("เกิดข้อผิดพลาดในการส่งคำสั่งซื้อ กรุณาลองใหม่อีกครั้ง");
            return;
        }

        // ถ้าส่งข้อมูลสำเร็จ แสดง popup QR code
        qrPopup.style.display = "flex";

    } catch (error) {
        alert("ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้ กรุณาลองใหม่ภายหลัง");
        console.error(error);
    }
});

function confirmPayment() {
    qrPopup.style.display = "none";
    alert("สั่งซื้อสำเร็จ! คุณจะได้รับสินค้าภายในวันพรุ่งนี้");
    localStorage.removeItem('cart');
    window.location.href = "index.html";
}
