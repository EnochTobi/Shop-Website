document.addEventListener("DOMContentLoaded", () => {
  const bannerImages = [
    "../Home Images/IMG_0140.png",
    "../Home Images/IMG_0116.png",
    "../Home Images/IMG_0243.png",
    "../Home Images/IMG_0150.png",
    "../Home Images/IMG_0096.png",
    "../Home Images/IMG_0158.png",
    "../Home Images/IMG_0118.png",
    "../Home Images/IMG_0176.png",
    "../Home Images/IMG_0194.png",
  ];

  const carouselContainer = document.querySelector(".carousel-container");

  if (!carouselContainer) {
    console.error("Carousel container not found!");
    return;
  }

  bannerImages.forEach((src) => {
    const img = document.createElement("img");
    img.src = src;
    img.alt = "Carousel Image";
    carouselContainer.appendChild(img);
  });

  let scrollPosition = 0;

  function scrollCarousel() {
    scrollPosition -= 1;
    carouselContainer.style.transform = `translateX(${scrollPosition}px)`;

    if (Math.abs(scrollPosition) >= carouselContainer.scrollWidth / 2) {
      scrollPosition = 0;
    }

    requestAnimationFrame(scrollCarousel);
  }

  scrollCarousel();
});
