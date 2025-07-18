document.addEventListener("DOMContentLoaded", function() {
    const hotelForm = document.getElementById("hotelForm");
  
    hotelForm.addEventListener("submit", function(event) {
      event.preventDefault();
      
      const hotelName = document.getElementById("hotelName").value.trim();
      const hotelAddress = document.getElementById("hotelAddress").value.trim();
      
      if (!hotelName || !hotelAddress) {
        alert("Please enter both the hotel name and hotel address.");
        return;
      }
      
      const hotelDetails = {
        name: hotelName,
        address: hotelAddress
      };
      
      // Save hotel details in localStorage
      localStorage.setItem("selectedHotel", JSON.stringify(hotelDetails));
      
      alert("Hotel confirmed! Redirecting to the next page...");
      // Redirect to the next page (e.g., menu.html)
      window.location.href = "menu.html";
    });
  });
  
  