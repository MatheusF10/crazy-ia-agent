const textarea = document.getElementById('input');

textarea.addEventListener('input', () => {
  textarea.style.height = 'auto';
  textarea.style.height = textarea.scrollHeight + 'px';
});

async function send() {
  const input = document.getElementById('input').value;

  const res = await fetch('http://localhost:3000/agent', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userMessage: input }),
  });

  const data = await res.json();

  executeAction(data);
}

function executeAction(data) {
  const body = document.body;
  body.className = '';

  alert(data.text);

  console.log('data', data.actions);

  // Itera sobre todas as ações
  data.actions.forEach((action) => {
    switch (action) {
      case 'shake':
        body.classList.add('shake');
        break;

      case 'spin':
        body.classList.add('spin');
        break;

      case 'changeColor':
        body.style.background =
          '#' + Math.floor(Math.random() * 16777215).toString(16);
        break;

      case 'explode':
        document.body.innerHTML = '<h1>💥 BOOM 💥</h1>';
        break;

      case 'speak':
        const msg = new SpeechSynthesisUtterance(data.text);
        speechSynthesis.speak(msg);
        break;

      case 'dance':
        body.style.background = 'black';
        body.style.color = 'lime';
        body.classList.add('dance');
        break;
    }
  });
}
