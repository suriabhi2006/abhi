document.addEventListener("DOMContentLoaded", function() {
    showBill();

    document.getElementById("payment").addEventListener("change", function() {
        const paymentMethod = this.value;
        document.getElementById("debitDetails").style.display = paymentMethod === "debit" ? "block" : "none";
        document.getElementById("phonePeQR").style.display = paymentMethod === "phonepe" ? "block" : "none";
    });
});

function showBill() {
    let selectedItems = JSON.parse(localStorage.getItem("selectedItems")) || {};
    let subtotal = 0;
    let billDetails = document.getElementById("billDetails");
    billDetails.innerHTML = "";

    for (const item in selectedItems) {
        let price = selectedItems[item].price;
        let quantity = selectedItems[item].quantity;
        let total = price * quantity;
        subtotal += total;

        let tr = document.createElement("tr");
        tr.innerHTML = `<td>${item}</td><td>₹${price}</td><td>${quantity}</td><td>₹${total}</td>`;
        billDetails.appendChild(tr);
    }

    let discount = subtotal * 0.10;
    let gst = (subtotal - discount) * 0.05;
    let sgst = gst;
    let finalAmount = subtotal - discount + gst + sgst;

    document.getElementById("subtotal").textContent = subtotal.toFixed(2);
    document.getElementById("discount").textContent = discount.toFixed(2);
    document.getElementById("gst").textContent = gst.toFixed(2);
    document.getElementById("sgst").textContent = sgst.toFixed(2);
    document.getElementById("finalAmount").textContent = finalAmount.toFixed(2);
    document.getElementById("qrAmount").textContent = finalAmount.toFixed(2);

    document.getElementById("billSection").style.display = "block";
}

function confirmOrder() {
    const address = document.getElementById("address").value;
    const paymentMethod = document.getElementById("payment").value;

    if (!address || !paymentMethod) {
        alert("Please enter your address and select a payment method.");
        return;
    }

    if (paymentMethod === "debit") {
        const cardNumber = document.getElementById("cardNumber").value;
        const expiry = document.getElementById("expiry").value;
        const cvv = document.getElementById("cvv").value;

        if (!cardNumber || !expiry || !cvv || cardNumber.length !== 16 || cvv.length !== 3) {
            alert("Please enter valid debit card details.");
            return;
        }
    }

    document.getElementById("orderStatus").style.display = "block";
    setTimeout(() => {
        document.getElementById("orderStatus").textContent = "Your order is confirmed!";
        document.querySelector(".checkmark").style.display = "block";
        document.getElementById("nextOptions").style.display = "block";
    }, 3000);
}

function showHelp() {
    document.getElementById("helpSection").style.display = "block";
}

function proceedToCheckout() {
    window.location.href = "cancel_order.html";
}

function downloadBill() {
    let billContent = document.getElementById("billSection").innerHTML;
    let billWindow = window.open("", "", "width=600,height=600");
    billWindow.document.write("<html><head><title>Bill</title></head><body>");
    billWindow.document.write(billContent);
    billWindow.document.write("</body></html>");
    billWindow.document.close();
    billWindow.print();
}

function finalConfirmOrder() {
    alert("Final Order Confirmed!");
    // Add any final order processing logic here.
    // For example, you might want to send the order to a server, clear the cart, etc.
}