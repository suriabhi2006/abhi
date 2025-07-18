document.addEventListener("DOMContentLoaded", function () {
  // Authentication & User Details
  const signupSection = document.getElementById("signup-section");
  const loginSection = document.getElementById("login-section");
  const authSection = document.getElementById("auth-section");
  const detailsSection = document.getElementById("details-section");
  const signupForm = document.getElementById("signupForm");
  const loginForm = document.getElementById("loginForm");
  const detailsForm = document.getElementById("detailsForm");
  const showLoginLink = document.getElementById("show-login");
  const showSignupLink = document.getElementById("show-signup");

  if (showLoginLink) showLoginLink.addEventListener("click", () => toggleAuth("login"));
  if (showSignupLink) showSignupLink.addEventListener("click", () => toggleAuth("signup"));

  function toggleAuth(type) {
    signupSection.style.display = type === "signup" ? "block" : "none";
    loginSection.style.display = type === "login" ? "block" : "none";
  }

  if (signupForm) {
    signupForm.addEventListener("submit", function (event) {
      event.preventDefault();
      const newUsername = document.getElementById("newUsername").value;
      const newPassword = document.getElementById("newPassword").value;

      if (newUsername && newPassword) {
        localStorage.setItem("username", newUsername);
        localStorage.setItem("password", newPassword);
        alert("Sign-up successful! Please log in.");
        toggleAuth("login");
      }
    });
  }

  if (loginForm) {
    loginForm.addEventListener("submit", function (event) {
      event.preventDefault();
      const username = document.getElementById("username").value;
      const password = document.getElementById("password").value;

      if (username === localStorage.getItem("username") && password === localStorage.getItem("password")) {
        alert("Login successful!");
        authSection.style.display = "none";
        detailsSection.style.display = "block";
      } else {
        alert("Invalid username or password.");
      }
    });
  }

  if (detailsForm) {
    detailsForm.addEventListener("submit", function (event) {
      event.preventDefault();
      localStorage.setItem("fullName", document.getElementById("fullName").value);
      localStorage.setItem("phoneNumber", document.getElementById("phoneNumber").value);
      localStorage.setItem("addressDetail", document.getElementById("addressDetail").value);
      localStorage.setItem("district", document.getElementById("district").value);
      alert("Details confirmed! Redirecting to hotel selection...");
      window.location.href = "select_hotel.html";
    });
  }

  const hotelForm = document.getElementById("hotelForm");
  if (hotelForm) {
    hotelForm.addEventListener("submit", function(event) {
      event.preventDefault();
      const hotelName = document.getElementById("hotelName").value.trim();
      const hotelAddress = document.getElementById("hotelAddress").value.trim();
      if (!hotelName || !hotelAddress) {
        alert("Please enter both the hotel name and hotel address.");
        return;
      }
      const hotelDetails = { name: hotelName, address: hotelAddress };
      localStorage.setItem("selectedHotel", JSON.stringify(hotelDetails));
      alert("Hotel confirmed! Redirecting to the next page...");
      window.location.href = "menu.html";
    });
  }

  let selectedItems = {};
  let totalItems = 0;
  let totalCost = 0;
  const uploadExcel = document.getElementById("uploadExcel");
  const menuTableBody = document.getElementById("menuTableBody");
  const selectedItemsBody = document.getElementById("selectedItemsBody");
  const totalItemsSpan = document.getElementById("totalItems");
  const totalCostSpan = document.getElementById("totalCost");

  uploadExcel.addEventListener("change", function (event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (e) {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet);
      menuTableBody.innerHTML = "";
      jsonData.forEach((row, index) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${index + 1}</td>
          <td>${row["Food Item"]}</td>
          <td>${row["Zomato Price Range (₹)"]}</td>
          <td>${row["Swiggy Price Range (₹)"]}</td>
          <td>₹${row["Grab a Grub Price (₹)"]}</td>
          <td><button onclick="selectItem('${row["Food Item"]}', ${row["Grab a Grub Price (₹)"]})">Select</button></td>
        `;
        menuTableBody.appendChild(tr);
      });
    };
    reader.readAsArrayBuffer(file);
  });

  window.selectItem = function (item, price) {
    if (selectedItems[item]) {
      selectedItems[item].quantity += 1;
    } else {
      selectedItems[item] = { price, quantity: 1 };
    }
    totalItems += 1;
    totalCost += price;
    updateSelectedItems();
  };

  function updateSelectedItems() {
    selectedItemsBody.innerHTML = "";
    for (const item in selectedItems) {
      let tr = document.createElement("tr");
      tr.innerHTML = `<td>${item}</td><td>₹${selectedItems[item].price}</td><td>${selectedItems[item].quantity}</td>`;
      selectedItemsBody.appendChild(tr);
    }
    totalItemsSpan.textContent = totalItems;
    totalCostSpan.textContent = totalCost;
  }

  window.redirectToConfirm = function () {
    localStorage.setItem("totalCost", totalCost);
    localStorage.setItem("selectedItems", JSON.stringify(selectedItems));
    window.location.href = "confirm_order.html";
  };

  // Order Confirmation & Payment Handling
  document.getElementById("payment").addEventListener("change", function () {
    const paymentMethod = this.value;
    document.getElementById("debitDetails").style.display = paymentMethod === "debit" ? "block" : "none";
    document.getElementById("phonePeQR").style.display = paymentMethod === "phonepe" ? "block" : "none";
    updateTotalAmount();
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

  function updateTotalAmount() {
    let selectedItems = JSON.parse(localStorage.getItem("selectedItems")) || {};
    let subtotal = 0;

    for (const item in selectedItems) {
      let price = selectedItems[item].price;
      let quantity = selectedItems[item].quantity;
      let total = price * quantity;
      subtotal += total;
    }

    let discount = subtotal * 0.10;
    let gst = (subtotal - discount) * 0.05;
    let sgst = gst;
    let finalAmount = subtotal - discount + gst + sgst;

    document.getElementById("finalAmount").textContent = finalAmount.toFixed(2);
    document.getElementById("qrAmount").textContent = finalAmount.toFixed(2);
  }

  window.confirmOrder = function () {
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
  };

  showBill();
  generateMenu();
});
