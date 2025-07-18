document.addEventListener("DOMContentLoaded", function () {
    const stars = document.querySelectorAll('.star');
    let selectedRating = 0;

    stars.forEach(star => {
        star.addEventListener('click', function () {
            selectedRating = this.getAttribute('data-value');
            stars.forEach(s => s.classList.remove('selected'));
            for (let i = 0; i < selectedRating; i++) {
                stars[i].classList.add('selected');
            }
        });
    });

    document.getElementById('submit-rating').addEventListener('click', function () {
        if (selectedRating > 0) {
            alert(`Thank you for rating us ${selectedRating} stars!`);
        } else {
            alert('Please select a star rating before submitting.');
        }
    });
});
