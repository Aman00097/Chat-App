const socket = io('http://localhost:3000', { transports: ['websocket', 'polling', 'flashsocket'] });

const chatForm = document.querySelector('#send_message');
const messageText = document.querySelector('#message');
const msgContainer = document.querySelector('#message_container');
const main = document.querySelector('main');
const audio = new Audio('ting.mp3');

const form = document.querySelector('#form');
const names = document.querySelector("#name");
form.addEventListener('submit', (e) => {
    const formContainer = document.querySelector(".form_container");
    e.preventDefault();
    if (names.value != "") {
        formContainer.classList.add('hidden');
        main.classList.remove('hidden');
        socket.emit('new_user_joined', names.value);
    } else {
        document.querySelector("#form h1").innerHTML = `<span class="alert alert-danger p-1 px-3 fs-6">Enter your name</span>`;
    }

    socket.on('user_joined', name => {
        append(`${name} joined the chat`, 'm-auto', 'bg-secondary');
    });

    socket.on('receive', data => {
        append(`<b>${data.name}</b><br>${data.message}`, 'float-start', 'bg-dark');
    });

    socket.on('lefted', name => {
        if (name.value != "") {
            append(`${name} left the chat`, 'm-auto', 'bg-secondary');
        }
    });
});

const append = (message, position, color) => {
    const div = document.createElement('div');
    div.innerHTML = ` <div class="w-75 ${position} mb-3 text-center">
    <p class="${position} text-light ${color} d-inline-block text-start rounded-3 p-2 px-4">${message}</p>
    </div>`;

    // div.classList.add('w-75');
    // div.classList.add(position);
    // div.classList.add('mb-3');
    // div.classList.add('text-center');
    // const p = document.createElement('p');
    // p.classList.add(position);
    // p.classList.add('text-light');
    // p.classList.add(color);
    // p.classList.add('d-inline-block');
    // p.classList.add('rounded-4');
    // p.classList.add('p-2');
    // p.classList.add('px-4');
    // p.innerHTML = message;
    // div.append(p);

    msgContainer.append(div);

    if (position == 'float-start' || position == 'm-auto') {
        audio.play();
    }
}

chatForm.addEventListener('submit', (e) => {
    const chatInput = document.querySelector("#send_message input");
    e.preventDefault();
    if (chatInput.value != "") {
        const message = messageText.value;
        append(message, 'float-end', 'bg-success');
        socket.emit('send', message);
        messageText.value = "";
    }
});
