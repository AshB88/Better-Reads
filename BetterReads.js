// Set variables to record book rating and comment
const starRating = document.querySelector('.star-rating');
const starRatingValue = document.querySelector('.star-rating-value');

// Set stars variable
let stars = document.querySelectorAll('.star');

// Star rating system function
function gfg(n) {
    remove();
    const classes = ['one', 'two', 'three', 'four', 'five'];
    for (let i = 0; i < n; i++) {
        stars[i].className = 'star ' + classes[n - 1];
    }
}

// To remove pre-applied styling
function remove() {
    stars.forEach(star => star.className = 'star');
}


// Modal/event listener for book review
document.addEventListener('DOMContentLoaded', function () {
    const stars = document.querySelectorAll('.star');
    const commentText = document.getElementById('comment-text');
    const favoritesSection = document.getElementById('favorites-section');
    const submitReviewButton = document.getElementById('submit-review');
    const addToFavoritesButton = document.querySelector('.btn-success');
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

    // Add book to favorites list
    addToFavoritesButton.addEventListener('click', function () {
        const bookTitle = localStorage.getItem('currentBookTitle'); //may need to change this based on what local storage is named
        if (bookTitle) {
            const favoritesList = document.getElementById('favorites-list');
            const listItem = document.createElement('li');
            listItem.textContent = bookTitle;
            favoritesList.appendChild(listItem);
            alert('Book added to favorites!');
        } else {
            alert('No book titles found in local storage.');
        }
    });
});

// Handles the "Add Book" button click.
document.getElementById('save-book').addEventListener('click', function() {
    const title = document.getElementById('book-title').value;
    const summary = document.getElementById('book-summary').value;

    if (title && summary) {
      const bookList = document.getElementById('book-list-ul');
      const listItem = document.createElement('li');
      listItem.className = 'list-group-item';
      listItem.innerHTML = `<strong>${title}</strong>: ${summary}`;
      bookList.appendChild(listItem);

      // Sort the list alphabetically
      const items = Array.from(bookList.getElementsByTagName('li'));
      items.sort((a, b) => a.textContent.localeCompare(b.textContent));
      bookList.innerHTML = '';
      items.forEach(item => bookList.appendChild(item));

      // Clear the input fields
      document.getElementById('book-title').value = '';
      document.getElementById('book-summary').value = '';

      // Close the modal
      const modal = bootstrap.Modal.getInstance(document.getElementById('addBookModal'));
      modal.hide();
    }
  });

  // Load saved books from localStorage
  document.addEventListener('DOMContentLoaded', function() {
    const savedBooks = JSON.parse(localStorage.getItem('books')) || [];
    const bookList = document.getElementById('book-list-ul');
    savedBooks.forEach(book => {
      const listItem = document.createElement('li');
      listItem.className = 'list-group-item';
      listItem.innerHTML = `<strong>${book.title}</strong>: ${book.summary}`;
      bookList.appendChild(listItem);
    });

    // Save books to localStorage
    function saveBooksToLocalStorage() {
        const bookList = document.getElementById('book-list-ul');
        const books = [];
        bookList.querySelectorAll('li').forEach(item => {
            const title = item.querySelector('strong').textContent;
            const summary = item.textContent.replace(`${title}: `, '');
            books.push({ title, summary });
        });
        localStorage.setItem('books', JSON.stringify(books));
    }

    // Save books when a new book is added
    document.getElementById('save-book').addEventListener('click', saveBooksToLocalStorage);

    // Save books when the page is unloaded
    window.addEventListener('beforeunload', saveBooksToLocalStorage);
  });
