// Initialize on page load
function initializeBetterReads() {
    document.addEventListener('DOMContentLoaded', function () {
        const commentText = document.getElementById('comment-text');
        const favoritesSection = document.getElementById('favorites-section');
        const submitReviewButton = document.getElementById('submit-review');
        const bookList = document.getElementById('book-list-ul');
        const completedList = document.getElementById('completed-list-ul');
        const favoritesList = document.getElementById('favorites-list-ul');
        const stars = document.querySelectorAll('.star');
        let selectedRating = 0;

        // Load saved data from localStorage
        const savedBooks = JSON.parse(localStorage.getItem('books')) || [];
        const completedBooks = JSON.parse(localStorage.getItem('completedBooks')) || [];
        const favoriteBooks = JSON.parse(localStorage.getItem('favoriteBooks')) || [];

        // Populate the lists from localStorage
        savedBooks.forEach(book => addBookToList(book, bookList, true));
        completedBooks.forEach(book => addBookToList(book, completedList, false, book.rating)); // Pass rating for completed books
        favoriteBooks.forEach(book => addBookToList(book, favoritesList, false));

        // Star rating system
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

        // Update star rating
        function updateStarRating(rating) {
            stars.forEach(star => {
                if (star.getAttribute('data-value') <= rating) {
                    star.classList.add('selected');
                } else {
                    star.classList.remove('selected');
                }
            });
        }

        // Handle review submission (and move completed books)
        submitReviewButton.addEventListener('click', function () {
            bookList.querySelectorAll('.book-checkbox').forEach(checkbox => {
                if (checkbox.checked) {
                    const listItem = checkbox.closest('li');
                    const bookTitle = listItem.querySelector('strong').textContent;

                    // Create a new completed list item with rating
                    const completedListItem = document.createElement('li');
                    completedListItem.className = 'list-group-item';
                    completedListItem.innerHTML = `<strong>${bookTitle}</strong>: Rated ${selectedRating} star${selectedRating > 1 ? 's' : ''}`;
                    completedList.appendChild(completedListItem);

                    // Remove the book from the "To Read" list
                    listItem.remove();
                }
            });

            saveBooksToLocalStorage(); // Save the changes to localStorage

            // Reset the form
            selectedRating = 0;
            commentText.value = '';
            updateStarRating(0);
            favoritesSection.style.display = 'none';

            const modal = bootstrap.Modal.getInstance(document.getElementById('bookCompletionModal'));
            modal.hide();
        });

        // Handle the "Save Book" button click
        document.getElementById('save-book').addEventListener('click', function () {
            const title = document.getElementById('book-title').value;
            const summary = document.getElementById('book-summary').value;

            if (title && summary) {
                const listItem = document.createElement('li');
                listItem.className = 'list-group-item';
                listItem.innerHTML = `<input type="checkbox" class="book-checkbox" /> <strong>${title}</strong>: ${summary}`;
                bookList.appendChild(listItem);

                sortList(bookList);

                // Clear the form
                document.getElementById('book-title').value = '';
                document.getElementById('book-summary').value = '';

                // Hide the modal
                const modal = bootstrap.Modal.getInstance(document.getElementById('addBookModal'));
                modal.hide();

                saveBooksToLocalStorage(); // Save the new book to localStorage
            }
        });

        // Add book to favorites (inside the modal)
        const addToFavoritesButton = document.getElementById('add-to-favorites');
        addToFavoritesButton.addEventListener('click', function () {
            const selectedCheckbox = document.querySelector('#book-list-ul .book-checkbox:checked');
            if (selectedCheckbox) {
                const bookTitle = selectedCheckbox.closest('li').querySelector('strong').textContent;

                const listItem = document.createElement('li');
                listItem.className = 'list-group-item';
                listItem.textContent = bookTitle;
                favoritesList.appendChild(listItem);

                console.log(`Added to favorites: ${bookTitle}`);

                saveBooksToLocalStorage(); // Save to localStorage

                alert('Book added to favorites!');
            } else {
                alert('Please select a book to add to favorites.');
            }
        });

        // Save all lists to localStorage
        function saveBooksToLocalStorage() {
            const books = [];
            const completedBooks = [];
            const favoriteBooks = [];

            bookList.querySelectorAll('li').forEach(item => {
                const title = item.querySelector('strong').textContent;
                const summary = item.textContent.replace(`${title}: `, '').trim();
                books.push({ title, summary });
            });

            completedList.querySelectorAll('li').forEach(item => {
                const title = item.querySelector('strong').textContent;
                const ratingMatch = item.textContent.match(/Rated (\d+) star/);
                const rating = ratingMatch ? ratingMatch[1] : null;

                if (title && rating) {
                    completedBooks.push({ title, rating });
                }
            });

            favoritesList.querySelectorAll('li').forEach(item => {
                const title = item.textContent;
                favoriteBooks.push({ title });
            });

            localStorage.setItem('books', JSON.stringify(books));
            localStorage.setItem('completedBooks', JSON.stringify(completedBooks));
            localStorage.setItem('favoriteBooks', JSON.stringify(favoriteBooks));
        }

        // Add book to a list
        function addBookToList(book, list, withCheckbox, rating) {
            const listItem = document.createElement('li');
            listItem.className = 'list-group-item';

            if (list === completedList && rating) {
                // If this is a completed book, show the rating
                listItem.innerHTML = `<strong>${book.title}</strong>: Rated ${rating} star${rating > 1 ? 's' : ''}`;
            } else if (list === favoritesList) {
                // Favorites list only shows the title
                listItem.textContent = book.title;
            } else {
                // "To Read" list shows title and summary
                listItem.innerHTML = `${withCheckbox ? '<input type="checkbox" class="book-checkbox" /> ' : ''}<strong>${book.title}</strong>: ${book.summary || ''}`;
            }

            list.appendChild(listItem);
        }

        // Sort list alphabetically
        function sortList(list) {
            const items = Array.from(list.getElementsByTagName('li'));
            items.sort((a, b) => a.textContent.localeCompare(b.textContent));
            list.innerHTML = '';
            items.forEach(item => list.appendChild(item));
        }
    });
}

// Call the function to initialize the functionality
initializeBetterReads();
