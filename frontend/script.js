
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
