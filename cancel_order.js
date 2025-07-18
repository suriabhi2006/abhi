let currentStep = 0;
const steps = document.querySelectorAll(".step");
const cancelBtn = document.getElementById("cancel-btn");
const cancelPage = document.getElementById("cancel-page");
const trackingPage = document.getElementById("order-tracking");
const yesCancel = document.getElementById("yes-cancel");
const noCancel = document.getElementById("no-cancel");
const refundPage = document.getElementById("refund-page");
const refundDetails = document.getElementById("refund-details");
const refundAmountDisplay = document.getElementById("refund-amount");
const giveRatingBtns = document.querySelectorAll("#give-rating");
const thankYouPage = document.getElementById("thank-you");

let orderTotal = parseFloat(localStorage.getItem("finalAmount")) || 0;

function updateOrderStatus() {
    if (currentStep < steps.length) {
        steps[currentStep].classList.add("active");
        setTimeout(() => {
            currentStep++;
            updateOrderStatus();
        }, 60000);
    }
}

cancelBtn.addEventListener("click", () => {
    trackingPage.classList.add("hidden");
    cancelPage.classList.remove("hidden");
});

yesCancel.addEventListener("click", () => {
    cancelPage.classList.add("hidden");
    refundPage.classList.remove("hidden");
    let refundAmount = currentStep <= 2 ? orderTotal * 0.85 : orderTotal * 0.15;
    refundDetails.textContent = currentStep <= 2 ? "85% refund issued." : "15% refund issued. Rest will be donated if not claimed.";
    refundAmountDisplay.textContent = `Refund Amount: ₹${refundAmount.toFixed(2)}`;
});

noCancel.addEventListener("click", () => {
    cancelPage.classList.add("hidden");
    trackingPage.classList.remove("hidden");
});

giveRatingBtns.forEach(button => {
    button.addEventListener("click", () => {
        alert("Thank you for your feedback!");
    });
});

updateOrderStatus();
