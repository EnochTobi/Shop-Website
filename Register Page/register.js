document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.getElementById("registerForm");

  registerForm.addEventListener("submit", (event) => {
    event.preventDefault(); // Prevent the form from refreshing the page

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    // Basic validation
    if (!name || !email || !password || !confirmPassword) {
      alert("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match. Please try again.");
      return;
    }

    // Simulate registration (replace this with actual backend logic)
    alert("Registration successful! You can now log in.");
    window.location.href = "../Login Page/login.html"; // Redirect to login page
  });
});
