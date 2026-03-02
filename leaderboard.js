import { db } from "./js/firebase.js";
import { collection, getDocs } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

console.log("Leaderboard JS Running");

const tbody = document.getElementById("leaderboardBody");
const levelSelect = document.getElementById("levelSelect");

let fullLeaderboard = [];

async function loadLeaderboard() {
  try {
    const snapshot = await getDocs(collection(db, "users"));
    console.log("Users Found:", snapshot.size);

    fullLeaderboard = [];

    snapshot.forEach(doc => {
      const data = doc.data();
      const name = data.name || data.email || "Player";

      if (data.bestTimes) {
        Object.entries(data.bestTimes).forEach(([level, time]) => {
          fullLeaderboard.push({
            name: name,
            level: String(level.replace("level", "")), // force string
            time: Number(time)
          });
        });
      }
    });

    renderLeaderboard(fullLeaderboard);

  } catch (error) {
    console.error("Error loading leaderboard:", error);
  }
}

function renderLeaderboard(data) {
  tbody.innerHTML = "";

  // Sort by best time
  const sorted = [...data].sort((a, b) => a.time - b.time);

  sorted.forEach((player, index) => {
    let medal = "";

    if (index === 0) medal = "🥇";
    else if (index === 1) medal = "🥈";
    else if (index === 2) medal = "🥉";

    const row = `
      <tr>
        <td>${medal} ${index + 1}</td>
        <td>${player.name}</td>
        <td>${player.level}</td>
        <td>${player.time}</td>
      </tr>
    `;

    tbody.innerHTML += row;
  });
}

/* ✅ LEVEL FILTER FIXED */
if (levelSelect) {
  levelSelect.addEventListener("change", function () {
    const selectedLevel = String(this.value);

    console.log("Selected Level:", selectedLevel);

    if (selectedLevel === "all") {
      renderLeaderboard(fullLeaderboard);
    } else {
      const filtered = fullLeaderboard.filter(
        player => String(player.level) === selectedLevel
      );

      renderLeaderboard(filtered);
    }
  });
}

loadLeaderboard();