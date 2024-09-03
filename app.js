const firebaseConfig = {
    apiKey: "AIzaSyCFv1u12-I9AGfI5yHbtsdVMXahR3c_wng",
    authDomain: "crud-cda59.firebaseapp.com",
    databaseURL: "https://crud-cda59-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "crud-cda59",
    storageBucket: "crud-cda59.appspot.com",
    messagingSenderId: "923543580003",
    appId: "1:923543580003:web:437971f5d8c20bca793756",
    measurementId: "G-BSTBWV9M2X"
  };

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-app.js";
import { getDatabase, ref, serverTimestamp, set, onChildAdded, onValue, remove, update } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-database.js";

//initialize database and global db ref
const app = initializeApp(firebaseConfig);
var db = getDatabase(app);
var reviews = document.getElementById("reviews");
var reviewsRef = ref(db, "reviews");

setupEventHandlers();

function setupEventHandlers() {

    //user clicks the submit button (create or update)
    reviewForm.addEventListener("submit", e => {
        e.preventDefault(); //prevent page reload

        handleSubmit();
        Materialize.updateTextFields();
    });

    //user updates/deletes a particular review
    reviews.addEventListener("click", e => {
        updateReview(e);
        deleteReview(e);
    });

    //Firebase events
    onChildAdded(reviewsRef, (snapshot) => {
        const data = snapshot.val();
        const li = document.createElement("li");
        li.id = snapshot.key;
        li.innerHTML = reviewTemplate(data);
        reviews.appendChild(li);
    })

    // reviewsRef.on("child_changed", data => {
    //     var reviewNode = document.getElementById(data.key);
    //     reviewNode.innerHTML = reviewTemplate(data.val());
    // });

    // reviewsRef.on("child_removed", data => {
    //     var reviewNode = document.getElementById(data.key);
    //     reviewNode.parentNode.removeChild(reviewNode);
    // });
}

//CRUD operations
function handleSubmit() {
    var reviewForm = document.getElementById("reviewForm");
    var fullName = document.getElementById("fullName");
    var message = document.getElementById("message");
    var tags = document.getElementById("tags");
    var hiddenId = document.getElementById("hiddenId");

    //perform simple client-side validation
    if (!fullName.value || !message.value || !tags) return null;

    var id = hiddenId.value || Date.now();

    //create new node / update existing node in Firebase    
    set(ref(db,"reviews/" + id), {
     fullName: fullName.value,
        message: message.value,
        tags: tags.value,
        createdAt: serverTimestamp()
    });
    clearForm();
}

function readReviews(data) {
    var li = document.createElement("li");
    li.id = data.key;
    li.innerHTML = reviewTemplate(data.val());
    reviews.appendChild(li);
}

function updateReview(e) {
    var reviewNode = e.target.parentNode;

    if (e.target.classList.contains("edit")) {
        fullName.value = reviewNode.querySelector(".fullName").innerText;
        message.value = reviewNode.querySelector(".message").innerText;
        tags.value = reviewNode.querySelector(".tags").innerText;

        hiddenId.value = reviewNode.id;
        Materialize.updateTextFields();
    }
}

function deleteReview(e) {
    var reviewNode = e.target.parentNode;

    if (e.target.classList.contains("delete")) {
        var id = reviewNode.id;
        db.ref("reviews/" + id).remove(); //Delete node at Firebase
        clearForm();
    }
}


function reviewTemplate({ fullName, message, tags, createdAt }) {
    var createdAtFormatted = new Date(createdAt);

    return `
    <div>
      <label>Full Name:</label>
      <label class="fullName"><strong>${fullName}</strong></label>
    </div>
    <div>
      <label>Message:</label>
      <label class="message">${message}</label>
    </div>
    <div>
      <label>Tags:</label>
      <label class="tags">${tags}</label>
    </div>
    <div>
      <label>Created:</label>
     <label class="createdAt">${createdAtFormatted}</label>
    </div>
    <br>
    <button class="waves-effect waves-light btn delete">Delete</button>
    <button class="waves-effect waves-light btn edit">Edit</button>
    <br><br><br><br>
  `;
}

// Utility method to clear the form
function clearForm() {
    fullName.value = "";
    message.value = "";
    tags.value = "";
    hiddenId.value = "";
}