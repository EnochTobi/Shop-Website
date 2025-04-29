function handleSubmit(event) {
    event.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    alert(`Thank you for your message, ${name}! We'll get back to you at ${email} soon.`);
    
    
    event.target.reset();
    
    return false;
}


document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contact-form');
    if (form) {
        form.addEventListener('submit', handleSubmit);
    }
});