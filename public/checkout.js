const form = document.getElementById('checkout-form');
const qrPopup = document.getElementById('qr-popup');

form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const address = document.getElementById('address').value.trim();
    const phone = document.getElementById('phone').value.trim();

    if (!name || !address || !phone) {
        Swal.fire({
            icon: 'warning',
            title: 'กรอกข้อมูลไม่ครบ!',
            text: 'กรุณากรอกข้อมูลให้ครบถ้วนก่อนดำเนินการ',
            confirmButtonColor: '#f27474',
            confirmButtonText: 'เข้าใจแล้ว'
        });
        return;
    }

    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart.length === 0) {
        return;
    }

    const orderData = {
        customerName: name,
        address: address,
        phone: phone,
        items: cart,
        total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    };

    try {
        const response = await fetch('/sendOrder', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData)
        });

        if (!response.ok) {
            alert("เกิดข้อผิดพลาดในการส่งคำสั่งซื้อ กรุณาลองใหม่อีกครั้ง");
            return;
        }

        qrPopup.style.display = "flex";

    } catch (error) {
        alert("ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้ กรุณาลองใหม่ภายหลัง");
        console.error(error);
    }
});

function confirmPayment() {
    qrPopup.style.display = "none";
    Swal.fire({
        icon: 'success',
        title: 'สั่งซื้อสำเร็จ!',
        text: 'คุณจะได้รับสินค้าภายในวันพรุ่งนี้',
        showConfirmButton: false,
        timer: 3000
    });
    localStorage.removeItem('cart');
    window.location.href = "index.html";
}
