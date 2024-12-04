document.addEventListener('DOMContentLoaded', function () {
    const commentText = document.getElementById('comment-text');
    const favoritesSection = document.getElementById('favorites-section');
    const submitReviewButton = document.getElementById('submit-review');
    const bookList = document.getElementById('book-list-ul');
    const completedList = document.getElementById('completed-list-ul');
    const favoritesList = document.getElementById('favorites-list-ul');
    const stars = document.querySelectorAll('.star');
    let selectedRating = 0;

    const savedBooks = JSON.parse(localStorage.getItem('books')) || [];
    const completedBooks = JSON.parse(localStorage.getItem('completedBooks')) || [];
    const favoriteBooks = JSON.parse(localStorage.getItem('favoriteBooks')) || [];

    savedBooks.forEach(book => addBookToList(book, bookList, true));
    completedBooks.forEach(book => addBookToList(book, completedList, false, book.rating));
    favoriteBooks.forEach(book => addBookToList(book, favoritesList, false));

    // Handle the star rating selection
    stars.forEach(star => {
        star.addEventListener('click', function () {
            selectedRating = this.getAttribute('data-value');
            updateStarRating(selectedRating);
            favoritesSection.style.display = selectedRating == 5 ? 'block' : 'none';
        });
    });

    // Update star rating display
    function updateStarRating(rating) {
        stars.forEach(star => {
            star.classList.toggle('selected', star.getAttribute('data-value') <= rating);
        });
    }

    // Handle review submission (and move completed books to the completed list)
    submitReviewButton.addEventListener('click', function () {
        if (selectedRating === 0 || commentText.value.trim() === '') {
            alert('Please provide a rating and a comment.');
            return;
        }

        bookList.querySelectorAll('.book-checkbox:checked').forEach(checkbox => {
            const listItem = checkbox.closest('li');
            const bookTitle = listItem.querySelector('strong').textContent;

            // Create a new completed list item with selected rating
            const completedListItem = document.createElement('li');
            completedListItem.className = 'list-group-item';
            completedListItem.innerHTML = `<strong>${bookTitle}</strong>: ${'⭐'.repeat(selectedRating)}`;
            completedList.appendChild(completedListItem);

            // Remove the book from the "To Read" list
            listItem.remove();
        });

        saveBooksToLocalStorage(); // Save the changes to localStorage
        resetForm(); // Reset the form
        bootstrap.Modal.getInstance(document.getElementById('bookCompletionModal')).hide();
    });

    // Handles the "Add Book" button click
    document.getElementById('save-book').addEventListener('click', function () {
        const title = document.getElementById('book-title').value;

        if (title) {
            const listItem = document.createElement('li');
            listItem.className = 'list-group-item';
            listItem.innerHTML = `<input type="checkbox" class="book-checkbox" /> <strong>${title}</strong>`;
            bookList.appendChild(listItem);

            sortList(bookList);

            // Clear the form and hide the modal
            document.getElementById('book-title').value = '';
            bootstrap.Modal.getInstance(document.getElementById('addBookModal')).hide();
            saveBooksToLocalStorage(); // Save the new book to localStorage
        }
    });
    
    // Add book to favorites (inside the modal)
    document.getElementById('add-to-favorites').addEventListener('click', function () {
        const selectedCheckbox = document.querySelector('#book-list-ul .book-checkbox:checked');
        if (selectedCheckbox) {
            const bookTitle = selectedCheckbox.closest('li').querySelector('strong').textContent;

            const listItem = document.createElement('li');
            listItem.className = 'list-group-item';
            listItem.textContent = bookTitle;
            favoritesList.appendChild(listItem);

            saveBooksToLocalStorage(); // Save to localStorage
            alert('Book added to favorites!');
        } else {
            alert('Please select a book to add to favorites.');
        }
    });
    
    // Remove book from any list
    document.getElementById('remove-book').addEventListener('click', function () {
        const bookTitle = prompt('Enter the title of the book to remove:');
        if (!bookTitle) return;

        if (removeBookFromList(bookTitle, bookList, 'books') ||
            removeBookFromList(bookTitle, completedList, 'completedBooks') ||
            removeBookFromList(bookTitle, favoritesList, 'favoriteBooks')) {
            alert('Book removed successfully.');
        } else {
            alert('Book not found in any list.');
        }
    });

    function removeBookFromList(bookTitle, list, storageKey) {
        const items = list.getElementsByTagName('li');
        for (let i = 0; i < items.length; i++) {
            if (items[i].textContent.includes(bookTitle)) {
                list.removeChild(items[i]);
                const books = JSON.parse(localStorage.getItem(storageKey)) || [];
                const updatedBooks = books.filter(book => book.title !== bookTitle);
                localStorage.setItem(storageKey, JSON.stringify(updatedBooks));
                return true;
            }
        }
        return false;
    }

    // Save all lists to localStorage
    function saveBooksToLocalStorage() {
        const books = [];
        const completedBooks = [];
        const favoriteBooks = [];

        bookList.querySelectorAll('li').forEach(item => {
            const title = item.querySelector('strong').textContent;
            books.push({ title });
        });

        completedList.querySelectorAll('li').forEach(item => {
            const title = item.querySelector('strong').textContent;
            const rating = item.textContent.split('⭐').length - 1;
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
            listItem.innerHTML = `<strong>${book.title}</strong>: ${'⭐'.repeat(rating)}`
        } else if (list === favoritesList) {
            // Favorites list only shows the title
            listItem.textContent = book.title;
        } else {
            // "To Read" list shows only the title
            listItem.innerHTML = `${withCheckbox ? '<input type="checkbox" class="book-checkbox" /> ' : ''}<strong>${book.title}</strong>`;
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
    // Reset the form
    function resetForm() {
        selectedRating = 0;
        commentText.value = '';
        updateStarRating(0);
        favoritesSection.style.display = 'none';
    }
});
 
function moveLists() {
    const toReadList = document.getElementById('to-read');
    const completedList = document.getElementById('completed');
    const favoritesList = document.getElementById('favorites');
  
    const newParentToRead = document.getElementById('new-parent-to-read'); // Replace with the ID of the new parent element for to-read
    const newParentCompleted = document.getElementById('new-parent-completed'); // Replace with the ID of the new parent element for completed
    const newParentFavorites = document.getElementById('new-parent-favorites'); // Replace with the ID of the new parent element for favorites
  
    const originalParentToRead = document.getElementById('original-parent-to-read'); // Replace with the ID of the original parent element for to-read
    const originalParentCompleted = document.getElementById('original-parent-completed'); // Replace with the ID of the original parent element for completed
    const originalParentFavorites = document.getElementById('original-parent-favorites'); // Replace with the ID of the original parent element for favorites
  
    if (window.innerWidth <= 768) {
      // Move to new parent for smaller screens
      if (newParentToRead && !newParentToRead.contains(toReadList)) {
        newParentToRead.appendChild(toReadList);
      }
      if (newParentCompleted && !newParentCompleted.contains(completedList)) {
        newParentCompleted.appendChild(completedList);
      }
      if (newParentFavorites && !newParentFavorites.contains(favoritesList)) {
        newParentFavorites.appendChild(favoritesList);
      }
    } else {
      // Move back to original parent for larger screens
      if (originalParentToRead && !originalParentToRead.contains(toReadList)) {
        originalParentToRead.appendChild(toReadList);
      }
      if (originalParentCompleted && !originalParentCompleted.contains(completedList)) {
        originalParentCompleted.appendChild(completedList);
      }
      if (originalParentFavorites && !originalParentFavorites.contains(favoritesList)) {
        originalParentFavorites.appendChild(favoritesList);
      }
    }
  }
  
  // Listen for the resize event
  window.addEventListener('resize', moveLists);
  
  // Call the function initially to set the correct parent on page load
  moveLists();

  // Call the function initially to set the correct parent on page load
moveLists();


// Function to toggle overflow classes
function toggleOverflow() {
    const bookList = document.getElementById('book-list-ul');
    const favoritesList = document.getElementById('favorites-list-ul');
    const completedList = document.getElementById('completed-list-ul');
  
    if (bookList) {
      bookList.classList.add('hide-overflow');
      bookList.classList.add('show-overflow');
    }
  
    if (favoritesList) {
      favoritesList.classList.add('hide-overflow');
      favoritesList.classList.add('show-overflow');
    }
  
    if (completedList) {
      completedList.classList.add('hide-overflow');
      completedList.classList.add('show-overflow');
    }
  }
  
  // Call the function to apply the classes
  toggleOverflow();