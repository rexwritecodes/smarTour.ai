async function fetchPlaces() {
    try {
        const response = await fetch('/api/get-places');  
        const data = await response.json();

        console.log("Received Places Data:", data);  // Debugging

        if (!data.places || data.places.length === 0) {
            console.error("No places received from API");
            return;
        }

        const placesContainer = document.getElementById("places-list");
        placesContainer.innerHTML = "";

        data.places.forEach(place => {
            const placeDiv = document.createElement("div");
            placeDiv.classList.add("place-card");

            placeDiv.innerHTML = `
                <img src="${place.image || 'default-placeholder.jpg'}" alt="${place.name}">
                <h3>${place.name}</h3>
                <p>${place.description || 'No description available'}</p>
                <a href="${place.url}" target="_blank">Learn More</a>
            `;

            placesContainer.appendChild(placeDiv);
        });
    } catch (error) {
        console.error("Error fetching places:", error);
    }
}


if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("/service-worker.js")
        .then((registration) => {
          console.log("Service Worker registered with scope:", registration.scope);
        })
        .catch((error) => {
          console.error("Service Worker registration failed:", error);
        });
    });
  }
  

// Call function when page loads
fetchPlaces();
function toggleMenu() {
    document.querySelector(".nav-links").classList.toggle("show");
}
document.addEventListener("DOMContentLoaded", function () {
    const overlay = document.getElementById("image-overlay");
    const overlayImg = document.getElementById("overlay-img");
    const closeBtn = document.getElementById("close-btn");

    // Select all images inside .place-card
    document.querySelectorAll(".place-card img").forEach(img => {
        img.addEventListener("click", function () {
            overlayImg.src = this.src; // Set overlay image source
            overlay.classList.add("show"); // Show overlay
        });
    });

    // Close overlay on button click
    // closeBtn.addEventListener("click", function () {
    //     overlay.classList.remove("show");
    // });

    // Close overlay when clicking outside the image
    // overlay.addEventListener("click", function (event) {
    //     if (event.target === overlay) {
    //         overlay.classList.remove("show");
    //     }
    // });
});
