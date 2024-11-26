const starRating = document.querySelector('.star-rating');
const starRatingValue = document.querySelector('.star-rating-value');

document.addEventListener('DOMContentLoaded', function () {
    const stars = document.querySelectorAll('.star');
    const commentText = document.getElementById('comment-text');
    const favoritesSection = document.getElementById('favorites-section');
    const submitReviewButton = document.getElementById('submit-review');
    let selectedRating = 0;

    // Handle star rating click
    stars.forEach(star => {
        star.addEventListener('click', function () {
            selectedRating = this.getAttribute('data-value');
            updateStarRating(selectedRating);
            if (selectedRating == 5) {
                favoritesSection.style.display = 'block';
            } else {
                favoritesSection.style.display = 'none';
            }
        });
    });

    // Update star rating display
    function updateStarRating(rating) {
        stars.forEach(star => {
            if (star.getAttribute('data-value') <= rating) {
                star.classList.add('selected');
            } else {
                star.classList.remove('selected');
            }
        });
    }

    // Handle review submission
    submitReviewButton.addEventListener('click', function () {
        const comment = commentText.value;
        if (selectedRating > 0 && comment.trim() !== '') {
            alert(`Rating: ${selectedRating}\nComment: ${comment}`);
            if (selectedRating == 5) {
                alert('Book added to favorites!');
            }
            // Reset modal
            selectedRating = 0;
            commentText.value = '';
            updateStarRating(0);
            favoritesSection.style.display = 'none';
            // Close modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('bookCompletionModal'));
            modal.hide();
        } else {
            alert('Please provide a rating and a comment.');
        }
    });
});