

const firebaseConfig = {
  apiKey: "AIzaSyA-2KwBqTU23CugMSJitOuK-KwFCG-9OEE",
  authDomain: "movieland-4aa10.firebaseapp.com",
  projectId: "movieland-4aa10",
  storageBucket: "movieland-4aa10.appspot.com",
  messagingSenderId: "591411419194",
  appId: "1:591411419194:web:d9a1fa72e73698c535bd03"
};

firebase.initializeApp(firebaseConfig);

const API_KEY = '4a7045405b89e8d7f06bb6f90317652a';
const API_URL = `https://api.themoviedb.org/3`;
const IMG_PATH = 'https://image.tmdb.org/t/p/w500';

const searchInput = document.getElementById('searchInput');
const clearButton = document.getElementById('clearButton');
const movieGallery = document.getElementById('movieGallery');
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modalTitle');
const modalContent = document.getElementById('modalContent');
const closeModal = document.getElementById('closeModal');

// Function to fetch popular movies
async function fetchPopularMovies() {
  const response = await fetch(`${API_URL}/discover/movie?api_key=${API_KEY}&sort_by=popularity.desc`);
  const data = await response.json();
  return data.results;
}

// Function to fetch movies based on search query
async function searchMovies(query) {
  const response = await fetch(`${API_URL}/search/movie?api_key=${API_KEY}&query=${query}`);
  const data = await response.json();
  return data.results;
}

// Function to display movies in the gallery
function displayMovies(movies) {
  movieGallery.innerHTML = '';

  movies.forEach(movie => {
    const movieCard = document.createElement('div');
    movieCard.classList.add('cursor-pointer', 'rounded-lg', 'overflow-hidden', 'shadow-lg');

    const movieImage = document.createElement('img');
    movieImage.classList.add('w-full', 'h-64', 'object-cover');
    movieImage.src = `${IMG_PATH}/${movie.poster_path}`;
    movieImage.alt = movie.title;

    movieImage.addEventListener('click', () => {
      displayMovieDetails(movie);
    });

    movieCard.appendChild(movieImage);
    movieGallery.appendChild(movieCard);

    //watchlist button
    const addToWatchlistButton = document.createElement('button');
addToWatchlistButton.innerText = 'Add to Watchlist';
addToWatchlistButton.classList.add('ml-2', 'px-4', 'py-2', 'bg-gray-500', 'text-white', 'rounded-lg', 'focus:outline-none');
addToWatchlistButton.addEventListener('click', () => {
  addToWatchlist(movie.id);
});

movieCard.appendChild(addToWatchlistButton);

  });
}

// Function to display movie details in modal
function displayMovieDetails(movie) {
  modalTitle.textContent = movie.title;
  modalContent.innerHTML = `
    <p class="text-lg mb-4">${movie.overview}</p>
    <p><strong>Release Date:</strong> ${movie.release_date}</p>
    <p><strong>Vote Average:</strong> ${movie.vote_average}</p>
  `;
  modal.classList.remove('hidden');
}

// Function to close the modal
function closeModalHandler() {
  modal.classList.add('hidden');
}

// Function to clear search input and display popular movies
async function clearSearch() {
  searchInput.value = '';
  const popularMovies = await fetchPopularMovies();
  displayMovies(popularMovies);
}

// Event listener for search input
searchInput.addEventListener('input', async () => {
  const query = searchInput.value.trim();

  if (query) {
    const movies = await searchMovies(query);
    displayMovies(movies);
  } else {
    const popularMovies = await fetchPopularMovies();
    displayMovies(popularMovies);
  }
});

// Event listener for clear button
clearButton.addEventListener('click', clearSearch);

// Event listener for close modal button
closeModal.addEventListener('click', closeModalHandler);

// Fetch and display popular movies on page load
window.addEventListener('DOMContentLoaded', async () => {
  const popularMovies = await fetchPopularMovies();
  displayMovies(popularMovies);
});


//sidebar functionality

const sidebar  = document.getElementById('sidebar');
function openSidebar() {
  sidebar.classList.remove('-translate-x-full');
}
function closeSidebar() {
  sidebar.classList.add('-translate-x-full');
}

// function signOut() {
//   window.location.href = 'login.html';
// }
function signOut() {
  firebase.auth().signOut()
    .then(() => {
      // Sign-out successful.
      console.log('User signed out successfully');
      // Clear browser history
      history.replaceState(null, '', 'login.html');
      // Store a flag in local storage to indicate sign-out status
      localStorage.setItem('isSignedOut', 'true');
      // Redirect or perform any additional actions after sign-out.
      window.location.href = 'login.html'; // Redirect to the login page
    })
    .catch((error) => {
      // An error happened.
      console.error(error);
      alert('Failed to sign out. Please try again.');
    });
}



function goAbout() {
  window.location.href = 'about.html';
}


//watchlist functionality

// Add to Watchlist Functionality
// function addToWatchlist(movieId) {
//   const userId = firebase.auth().currentUser.uid;
//   const watchlistRef = firebase.firestore().collection('users').doc(userId);

//   watchlistRef.update({
//     watchlist: firebase.firestore.FieldValue.arrayUnion(movieId)
//   })
//   .then(() => {
//     console.log('Movie added to watchlist');
//   })
//   .catch((error) => {
//     console.error(error);
//     alert('Failed to add movie to watchlist. Please try again.');
//   });
// }

//new watchlist functionality
// Add to Watchlist Functionality
function addToWatchlist(movieId) {
  const userId = firebase.auth().currentUser.uid;
  const watchlistRef = firebase.firestore().collection('users').doc(userId);

  watchlistRef.get()
    .then(doc => {
      if (doc.exists) {
        const watchlist = doc.data().watchlist || [];
        if (!watchlist.includes(movieId)) {
          watchlistRef.update({
            watchlist: firebase.firestore.FieldValue.arrayUnion(movieId)
          })
          .then(() => {
            console.log('Movie added to watchlist');
          })
          .catch((error) => {
            console.error(error);
            alert('Failed to add movie to watchlist. Please try again.');
          });
        } else {
          console.log('Movie already exists in watchlist');
        }
      } else {
        // Create a new document with the user ID and set the watchlist field
        watchlistRef.set({
          watchlist: [movieId]
        })
        .then(() => {
          console.log('New document created in users collection');
          console.log('Movie added to watchlist');
        })
        .catch((error) => {
          console.error(error);
          alert('Failed to add movie to watchlist. Please try again.');
        });
      }
    })
    .catch(error => {
      console.error(error);
      alert('Failed to add movie to watchlist. Please try again.');
    });
}







// Remove from Watchlist Functionality
function removeFromWatchlist(movieId) {
  const userId = firebase.auth().currentUser.uid;
  const watchlistRef = firebase.firestore().collection('users').doc(userId);

  watchlistRef.update({
    watchlist: firebase.firestore.FieldValue.arrayRemove(movieId)
  })
  .then(() => {
    console.log('Movie removed from watchlist');
  })
  .catch((error) => {
    console.error(error);
    alert('Failed to remove movie from watchlist. Please try again.');
  });
}




//newupdated code

// const firebaseConfig = {
//   apiKey: "AIzaSyA-2KwBqTU23CugMSJitOuK-KwFCG-9OEE",
//   authDomain: "movieland-4aa10.firebaseapp.com",
//   projectId: "movieland-4aa10",
//   storageBucket: "movieland-4aa10.appspot.com",
//   messagingSenderId: "591411419194",
//   appId: "1:591411419194:web:d9a1fa72e73698c535bd03"
// };

// firebase.initializeApp(firebaseConfig);

// const API_KEY = '4a7045405b89e8d7f06bb6f90317652a';
// const API_URL = `https://api.themoviedb.org/3`;
// const IMG_PATH = 'https://image.tmdb.org/t/p/w500';

// const searchInput = document.getElementById('searchInput');
// const clearButton = document.getElementById('clearButton');
// const movieGallery = document.getElementById('movieGallery');
// const modal = document.getElementById('modal');
// const modalTitle = document.getElementById('modalTitle');
// const modalContent = document.getElementById('modalContent');
// const closeModal = document.getElementById('closeModal');

// // Function to fetch popular movies
// async function fetchPopularMovies() {
//   const response = await fetch(`${API_URL}/discover/movie?api_key=${API_KEY}&sort_by=popularity.desc`);
//   const data = await response.json();
//   return data.results;
// }

// // Function to fetch movies based on search query
// async function searchMovies(query) {
//   const response = await fetch(`${API_URL}/search/movie?api_key=${API_KEY}&query=${query}`);
//   const data = await response.json();
//   return data.results;
// }

// // Function to display movies in the gallery
// function displayMovies(movies) {
//   movieGallery.innerHTML = '';

//   movies.forEach(movie => {
//     const movieCard = document.createElement('div');
//     movieCard.classList.add('cursor-pointer', 'rounded-lg', 'overflow-hidden', 'shadow-lg');

//     const movieImage = document.createElement('img');
//     movieImage.classList.add('w-full', 'h-64', 'object-cover');
//     movieImage.src = `${IMG_PATH}/${movie.poster_path}`;
//     movieImage.alt = movie.title;

//     movieImage.addEventListener('click', () => {
//       displayMovieDetails(movie);
//     });

//     movieCard.appendChild(movieImage);
//     movieGallery.appendChild(movieCard);

//     // Watchlist button
//     const addToWatchlistButton = document.createElement('button');
//     addToWatchlistButton.innerText = 'Add to Watchlist';
//     addToWatchlistButton.classList.add('ml-2', 'px-4', 'py-2', 'bg-gray-500', 'text-white', 'rounded-lg', 'focus:outline-none');
//     addToWatchlistButton.addEventListener('click', () => {
//       addToWatchlist(movie.id);
//     });

//     movieCard.appendChild(addToWatchlistButton);
//   });
// }

// // Function to display movie details in modal
// function displayMovieDetails(movie) {
//   modalTitle.textContent = movie.title;
//   modalContent.innerHTML = `
//     <p class="text-lg mb-4">${movie.overview}</p>
//     <p><strong>Release Date:</strong> ${movie.release_date}</p>
//     <p><strong>Vote Average:</strong> ${movie.vote_average}</p>
//   `;
//   modal.classList.remove('hidden');
// }

// // Function to close the modal
// function closeModalHandler() {
//   modal.classList.add('hidden');
// }

// // Function to clear search input and display popular movies
// async function clearSearch() {
//   searchInput.value = '';
//   const popularMovies = await fetchPopularMovies();
//   displayMovies(popularMovies);
// }

// // Event listener for search input
// searchInput.addEventListener('input', async () => {
//   const query = searchInput.value.trim();

//   if (query) {
//     const movies = await searchMovies(query);
//     displayMovies(movies);
//   } else {
//     const popularMovies = await fetchPopularMovies();
//     displayMovies(popularMovies);
//   }
// });

// // Event listener for clear button
// clearButton.addEventListener('click', clearSearch);

// // Event listener for close modal button
// closeModal.addEventListener('click', closeModalHandler);

// // Fetch and display popular movies on page load
// window.addEventListener('DOMContentLoaded', async () => {
//   const popularMovies = await fetchPopularMovies();
//   displayMovies(popularMovies);
// });

// // Sidebar functionality
// const sidebar = document.getElementById('sidebar');
// function openSidebar() {
//   sidebar.classList.remove('-translate-x-full');
// }
// function closeSidebar() {
//   sidebar.classList.add('-translate-x-full');
// }

// function signOut() {
//   window.location.href = 'login.html';
// }

// function goAbout() {
//   window.location.href = 'about.html';
// }

// // Watchlist functionality
// // Add to Watchlist Functionality
// function addToWatchlist(movieId) {
//   // const userId = firebase.auth().currentUser.uid;
//   const userId = 'BkHul0sR4pTX8FpWeu6nwXM4QAn1';
//   const watchlistRef = firebase.firestore().collection('users').doc(userId);

//   watchlistRef.get()
//     .then(doc => {
//       if (doc.exists) {
//         const watchlist = doc.data().watchlist || [];
//         if (!watchlist.includes(movieId)) {
//           watchlistRef.update({
//             watchlist: [...watchlist, movieId]
//           })
//           .then(() => {
//             console.log('Movie added to watchlist');
//           })
//           .catch((error) => {
//             console.error(error);
//             alert('Failed to add movie to watchlist. Please try again.');
//           });
//         } else {
//           console.log('Movie already exists in watchlist');
//         }
//       } else {
//         console.log('User document not found');
//       }
//     })
//     .catch(error => {
//       console.error(error);
//       alert('Failed to add movie to watchlist. Please try again.');
//     });
// }

// // Remove from Watchlist Functionality
// function removeFromWatchlist(movieId) {
//   const userId = firebase.auth().currentUser.uid;
//   const watchlistRef = firebase.firestore().collection('users').doc(userId);

//   watchlistRef.get()
//     .then(doc => {
//       if (doc.exists) {
//         const watchlist = doc.data().watchlist || [];
//         if (watchlist.includes(movieId)) {
//           watchlistRef.update({
//             watchlist: watchlist.filter(id => id !== movieId)
//           })
//           .then(() => {
//             console.log('Movie removed from watchlist');
//           })
//           .catch((error) => {
//             console.error(error);
//             alert('Failed to remove movie from watchlist. Please try again.');
//           });
//         } else {
//           console.log('Movie does not exist in watchlist');
//         }
//       } else {
//         console.log('User document not found');
//       }
//     })
//     .catch(error => {
//       console.error(error);
//       alert('Failed to remove movie from watchlist. Please try again.');
//     });
// }
