function initializeBetterReads() {
    document.addEventListener('DOMContentLoaded', function () {
        const commentText = document.getElementById('comment-text');
        const favoritesSection = document.getElementById('favorites-section'); // Section containing the "Add to Favorites" button
        const submitReviewButton = document.getElementById('submit-review');
        const bookList = document.getElementById('book-list-ul');
        const completedList = document.getElementById('completed-list-ul');
        const favoritesList = document.getElementById('favorites-list-ul'); // The favorites list
        const stars = document.querySelectorAll('.star');
        let selectedRating = 0;

        // Load books from localStorage
        const savedBooks = JSON.parse(localStorage.getItem('books')) || [];
        const completedBooks = JSON.parse(localStorage.getItem('completedBooks')) || [];
        const favoriteBooks = JSON.parse(localStorage.getItem('favoriteBooks')) || []; // Load favorites

        // Populate "To Read" list
        savedBooks.forEach(book => addBookToList(book, bookList, true));

        // Populate "Completed" list
        completedBooks.forEach(book => addBookToList(book, completedList, false));

        // Populate "Favorites" list
        favoriteBooks.forEach(book => addBookToList(book, favoritesList, false));

        // Handle star rating click
        stars.forEach(star => {
            star.addEventListener('click', function () {
                selectedRating = this.getAttribute('data-value');
                updateStarRating(selectedRating);

                // Get the book title from the modal input field
                const bookTitleInput = document.getElementById('book-title-modal');
                if (bookTitleInput) {
                    currentBookTitle = bookTitleInput.value.trim();
                } else {
                    currentBookTitle = ''; // Reset if no input field found
                }

                if (selectedRating == 5) {
                    favoritesSection.style.display = 'block'; // Show "Add to Favorites" button when rated 5 stars
                } else {
                    favoritesSection.style.display = 'none'; // Hide "Add to Favorites" button for non-5 star ratings
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
                favoritesSection.style.display = 'none'; // Hide "Add to Favorites" section after review is submitted
                // Close modal
                const modal = bootstrap.Modal.getInstance(document.getElementById('bookCompletionModal'));
                modal.hide();
            } else {
                alert('Please provide a rating and a comment.');
            }
        });

        // Handles the "Add Book" button click
        document.getElementById('save-book').addEventListener('click', function () {
            const title = document.getElementById('book-title').value;
            const summary = document.getElementById('book-summary').value;

            if (title && summary) {
                const listItem = document.createElement('li');
                listItem.className = 'list-group-item';
                listItem.innerHTML = `
                    <input type="checkbox" class="book-checkbox" /> 
                    <strong>${title}</strong>: ${summary}`;
                bookList.appendChild(listItem);

                sortList(bookList); // Sort the list alphabetically

                document.getElementById('book-title').value = '';
                document.getElementById('book-summary').value = '';

                const modal = bootstrap.Modal.getInstance(document.getElementById('addBookModal'));
                modal.hide();

                saveBooksToLocalStorage(); // Save after adding
            }
        });

        // Save books to localStorage
        function saveBooksToLocalStorage() {
            const books = [];
            const completedBooks = [];
            const favoritesBooks = [];

            bookList.querySelectorAll('li').forEach(item => {
                const title = item.querySelector('strong').textContent;
                const summary = item.textContent.replace(`${title}: `, '').trim();
                books.push({ title, summary });
            });

            completedList.querySelectorAll('li').forEach(item => {
                const title = item.querySelector('strong').textContent;
                const summary = item.textContent.replace(`${title}: `, '').trim();
                completedBooks.push({ title, summary });
            });

            favoritesList.querySelectorAll('li').forEach(item => {
                const title = item.textContent;
                favoritesBooks.push({ title });
            });

            localStorage.setItem('books', JSON.stringify(books));
            localStorage.setItem('completedBooks', JSON.stringify(completedBooks));
            localStorage.setItem('favoriteBooks', JSON.stringify(favoritesBooks)); // Save favorites to localStorage
        }

        // Add book to a list
        function addBookToList(book, list, withCheckbox) {
            const listItem = document.createElement('li');
            listItem.className = 'list-group-item';
            listItem.innerHTML = `${withCheckbox ? '<input type="checkbox" class="book-checkbox" /> ' : ''}<strong>${book.title}</strong>: ${book.summary || book.title}`;
            list.appendChild(listItem);
        }

        // Sort list alphabetically
        function sortList(list) {
            const items = Array.from(list.getElementsByTagName('li'));
            items.sort((a, b) => a.textContent.localeCompare(b.textContent));
            list.innerHTML = '';
            items.forEach(item => list.appendChild(item));
        }

        // Mark books as completed
        submitReviewButton.addEventListener('click', function () {
            bookList.querySelectorAll('.book-checkbox').forEach(checkbox => {
                if (checkbox.checked) {
                    const listItem = checkbox.closest('li');
                    listItem.removeChild(checkbox); // Remove the checkbox
                    completedList.appendChild(listItem);
                }
            });

            saveBooksToLocalStorage();
        });
        // Add book to favorites (inside the modal)
        const addToFavoritesButton = document.getElementById('add-to-favorites'); // Button inside modal to add to favorites
        addToFavoritesButton.addEventListener('click', function () {
            const selectedBook = document.querySelector('#book-list-ul .book-checkbox:checked');
            if (selectedBook) {
                const listItem = document.createElement('li');
                const bookTitle = selectedBook.closest('li').querySelector('strong').textContent;
                listItem.textContent = bookTitle;
                favoritesList.appendChild(listItem);

                // Save the favorites list to localStorage
                saveBooksToLocalStorage();
                alert('Book added to favorites!');
            } else {
                alert('Please select a book to add to favorites.');
            }
        });
    });
}

// Call the function to initialize the functionality
initializeBetterReads();
