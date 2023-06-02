// const firebaseConfig = {
//     apiKey: "AIzaSyA-2KwBqTU23CugMSJitOuK-KwFCG-9OEE",
//     authDomain: "movieland-4aa10.firebaseapp.com",
//     projectId: "movieland-4aa10",
//     storageBucket: "movieland-4aa10.appspot.com",
//     messagingSenderId: "591411419194",
//     appId: "1:591411419194:web:d9a1fa72e73698c535bd03"
//   };
  
//   firebase.initializeApp(firebaseConfig);
  
//   const signupForm = document.getElementById('signup-form');
  
//   signupForm.addEventListener('submit', (e) => {
//     e.preventDefault();
  
//     const email = document.getElementById('email').value;
//     const password = document.getElementById('password').value;
//     const confirmPassword = document.getElementById('confirm-password').value;
  
//     if (password !== confirmPassword) {
//       alert('Passwords do not match. Please try again.');
//       return;
//     }
  
//     firebase.auth().createUserWithEmailAndPassword(email, password)
//       .then((userCredential) => {
//         // Redirect to the login page after successful registration
//         window.location.href = 'login.html';
//       })
//       .catch((error) => {
//         console.error(error);
//         alert('Signup failed. Please try again.');
//       });
//   });
  

//previous code 
const firebaseConfig = {
  apiKey: "AIzaSyA-2KwBqTU23CugMSJitOuK-KwFCG-9OEE",
  authDomain: "movieland-4aa10.firebaseapp.com",
  projectId: "movieland-4aa10",
  storageBucket: "movieland-4aa10.appspot.com",
  messagingSenderId: "591411419194",
  appId: "1:591411419194:web:d9a1fa72e73698c535bd03"
};

firebase.initializeApp(firebaseConfig);

const signupForm = document.getElementById('signup-form');

signupForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirm-password').value;

  if (password !== confirmPassword) {
    alert('Passwords do not match. Please try again.');
    return;
  }

  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Send email verification
      userCredential.user.sendEmailVerification()
        .then(() => {
          alert('Verification email sent. Please check your inbox.');
          // Redirect to the login page after successful registration
          window.location.href = 'login.html';
        })
        .catch((error) => {
          console.error(error);
          alert('Email verification failed. Please try again.');
        });
    })
    .catch((error) => {
      console.error(error);
      alert('Signup failed. Please try again.');
    });
});




