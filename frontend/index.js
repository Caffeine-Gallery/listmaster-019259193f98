import { backend } from 'declarations/backend';

document.addEventListener('DOMContentLoaded', async () => {
  const form = document.getElementById('item-form');
  const input = document.getElementById('item-input');
  const list = document.getElementById('shopping-list');

  const renderItems = async () => {
    const items = await backend.getItems();
    list.innerHTML = '';
    items.forEach(item => {
      const li = document.createElement('li');
      li.innerHTML = `
        <span class="${item.completed ? 'completed' : ''}">${item.text}</span>
        <div>
          <button class="complete-btn" data-id="${item.id}">
            <i class="fas fa-check"></i>
          </button>
          <button class="delete-btn" data-id="${item.id}">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      `;
      list.appendChild(li);
    });
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (text) {
      await backend.addItem(text);
      input.value = '';
      await renderItems();
    }
  });

  list.addEventListener('click', async (e) => {
    if (e.target.closest('.complete-btn')) {
      const id = Number(e.target.closest('.complete-btn').dataset.id);
      const item = (await backend.getItems()).find(item => item.id === id);
      if (item) {
        await backend.updateItem(id, !item.completed);
        await renderItems();
      }
    } else if (e.target.closest('.delete-btn')) {
      const id = Number(e.target.closest('.delete-btn').dataset.id);
      await backend.deleteItem(id);
      await renderItems();
    }
  });

  await renderItems();
});
