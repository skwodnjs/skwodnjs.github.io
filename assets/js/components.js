const link = document.createElement("link");
link.rel = "icon";
link.type = "image/png";
link.href = "/assets/favicon.png";

document.head.appendChild(link);

fetch("/components/footer.html")
    .then(res => res.text())
    .then(html => {
        document.body.insertAdjacentHTML("beforeend", html);
    });

const date = document.querySelector(".date");
const time = document.querySelector(".time");

function updateDateTime() {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');

    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours === 0 ? 12 : hours;

    hours = String(hours).padStart(2, '0');

    if (date) {
        date.innerHTML = `${year}. ${month}. ${day}.`;
    }

    if (time) {
        time.innerHTML = `${year}. ${month}. ${day}. ${hours}:${minutes}:${seconds} ${ampm}`;
    }
}

updateDateTime();
setInterval(updateDateTime, 1000);