function addToCart(productName, price) {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];

  const existingItem = cart.find(item => item.name === productName);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ name: productName, price: price, quantity: 1 });
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  alert(`เพิ่ม ${productName} ลงในตะกร้าแล้ว`);
}

function loadCart() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const cartContainer = document.getElementById('cart-container');
  const totalPriceEl = document.getElementById('total-price');
  const checkoutButton = document.getElementById('checkout-button');
  let total = 0;

  if (cart.length === 0) {
    cartContainer.innerHTML = '<p>ไม่มีสินค้าในตะกร้า</p>';
    totalPriceEl.innerHTML = '';

    if (checkoutButton) {
      checkoutButton.disabled = true;
      checkoutButton.style.opacity = 0.5;
      checkoutButton.addEventListener('click', function (e) {
        e.preventDefault();
        alert("ไม่มีสินค้าในตะกร้า");
      });
    }
    return;
  }

  let tableHTML = `
    <table>
      <thead>
        <tr>
          <th>ชื่อสินค้า</th>
          <th>ราคา (บาท)</th>
          <th>จำนวน</th>
          <th>รวม (บาท)</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
  `;

  cart.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;

    tableHTML += `
      <tr>
        <td>${item.name}</td>
        <td>${item.price}</td>
        <td>${item.quantity}</td>
        <td>${itemTotal}</td>
        <td>
          <button onclick="removeFromCart(${index})" style="font-family: 'Mitr', sans-serif;">ลบ</button>
        </td>
      </tr>
    `;
  });

  tableHTML += `
      </tbody>
    </table>
  `;

  cartContainer.innerHTML = tableHTML;
  totalPriceEl.innerHTML = `รวมทั้งหมด: <strong>${total} บาท</strong>`;

  if (checkoutButton) {
    checkoutButton.disabled = false;
    checkoutButton.style.opacity = 1;
    checkoutButton.replaceWith(checkoutButton.cloneNode(true));
  }
}

function removeFromCart(index) {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];

  if (cart[index].quantity > 1) {
    cart[index].quantity -= 1;
  } else {
    cart.splice(index, 1);
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  loadCart();
}
