console.log("✅ auth.js loaded");

// js/auth.js
import { auth, provider, db } from "./firebase.js";
import { signInWithPopup } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Wait until DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("googleSignIn");

  if (!btn) {
    console.error("❌ Google Sign-In button not found");
    return;
  }

  btn.addEventListener("click", async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // ✅ Save user locally
      localStorage.setItem("uid", user.uid);
      localStorage.setItem("email", user.email);
      localStorage.setItem("name", user.displayName || "");
      localStorage.setItem("photo", user.photoURL || "");

      // ✅ Firestore user document
      const userRef = doc(db, "users", user.uid);
      const snap = await getDoc(userRef);

      if (!snap.exists()) {
        await setDoc(userRef, {
          name: user.displayName,
          email: user.email,
          photo: user.photoURL,
          unlockedLevel: 1,
          bestTimes: {}
        });
      }

      console.log("✅ User signed in:", user.uid);
      location.reload();

    } catch (err) {
      console.error("🔥 AUTH ERROR:", err.code, err.message);
      alert("Sign-in failed: " + err.code);
    }
  });
});

window.addEventListener("DOMContentLoaded", () => {
  const wrapper = document.getElementById("profileWrapper");
  const pic = document.getElementById("profilePic");
  const dropdown = document.getElementById("profileDropdown");
  const nameEl = document.getElementById("profileName");
  const emailEl = document.getElementById("profileEmail");
  const logoutBtn = document.getElementById("logoutBtn");

  const name = localStorage.getItem("name");
  const email = localStorage.getItem("email");
  const photo = localStorage.getItem("photo");

  if (name && photo) {
    pic.src = photo;
    nameEl.textContent = name;
    emailEl.textContent = email;

    wrapper.classList.remove("hidden");
  }

  // Toggle dropdown
  pic.onclick = (e) => {
    e.stopPropagation();
    dropdown.classList.toggle("hidden");
  };

  // Close when clicking outside
  document.body.addEventListener("click", () => {
    dropdown.classList.add("hidden");
  });

  // Logout
  logoutBtn.onclick = () => {
    localStorage.clear();
    location.reload();
  };
});
