const form = document.getElementById('LoginForm');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const response = await fetch("/login", {
        method: "POST",
        headers: {
            "Content-type": "application/json"
            
        },
        body: JSON.stringify({
            email,
            password
        })
    });
    const data = await response.json();
    alert(data.message);
    if (response.ok) {
        window.location.href = "index.html";
    }
});