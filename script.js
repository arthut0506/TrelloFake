const columnsContainer = document.getElementById('columns-container');
const addColumnButton = document.getElementById('add-column-button');
const commentPage = document.getElementById('comment-page');

let draggedCard;
let selectedCard = null;

// Funções para arrastar e soltar
const dragStart = (event) => {
    draggedCard = event.target;
    event.dataTransfer.effectAllowed = "move";
};

const dragover = (event) => {
    event.preventDefault();
};

const dragenter = ({ target }) => {
    if (target.classList.contains("column__cards")) {
        target.classList.add("column__highlight");
    }
};

const dragleave = ({ target }) => {
    target.classList.remove("column__highlight");
};

const drop = ({ target }) => {
    if (target.classList.contains("column__cards")) {
        target.classList.remove("column__highlight");
        target.append(draggedCard);
    }
};

// Função para criar um novo card
const createCard = ({ target }) => {
    if (!target.classList.contains("column__cards")) return;

    const card = document.createElement("section");
    card.className = "card";
    card.draggable = "true";

    const content = document.createElement("div");
    content.className = "card__content";
    content.contentEditable = "true";

    const removeButton = document.createElement("button");
    removeButton.textContent = "X";
    removeButton.className = "card__button";

    removeButton.addEventListener("click", () => {
        card.remove();
    });

    const commentButton = document.createElement("button");
    commentButton.textContent = "+";
    commentButton.className = "card__comment-button";

    commentButton.addEventListener("click", () => {
        openCommentPage(card);
    });

    card.appendChild(content);
    card.appendChild(removeButton);
    card.appendChild(commentButton);

    content.addEventListener("focusout", () => {
        if (!content.textContent.trim()) {
            card.remove();
        }
    });

    card.addEventListener("dragstart", dragStart);
    target.append(card);
    content.focus();
};

// Função para criar uma nova coluna
const createColumn = () => {
    const column = document.createElement('section');
    column.className = 'column';

    const title = document.createElement('h2');
    title.className = 'column__title';
    title.textContent = 'NOVA COLUNA';
    title.setAttribute('contenteditable', 'true'); // Torna o título editável

    const cardsContainer = document.createElement('section');
    cardsContainer.className = 'column__cards';

    // Botão de excluir coluna
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'X';
    deleteButton.className = 'column__delete-button';
    deleteButton.addEventListener('click', () => {
        column.remove();
    });

    column.appendChild(deleteButton);
    column.appendChild(title);
    column.appendChild(cardsContainer);

    columnsContainer.appendChild(column);

    // Adiciona os eventos de arrastar e soltar à nova coluna
    column.addEventListener('dragover', dragover);
    column.addEventListener('dragenter', dragenter);
    column.addEventListener('dragleave', dragleave);
    column.addEventListener('drop', drop);
    column.addEventListener('dblclick', createCard);
};

// Função para abrir a página de comentários
const openCommentPage = (card) => {
    selectedCard = card;
    const comments = selectedCard.getAttribute('data-comments') || '';
    commentPage.innerHTML = `
        <h2>Comentários</h2>
        <textarea id="comment-textarea">${comments}</textarea>
        <button id="save-comments">Salvar Comentários</button>
        <button class="close-button">Fechar</button>
    `;
    commentPage.classList.add('active');

    // Adiciona eventos aos botões
    document.getElementById('save-comments').addEventListener('click', saveComments);
    document.querySelector('.close-button').addEventListener('click', closeCommentPage);
};

// Função para salvar comentários
const saveComments = () => {
    const comments = document.getElementById('comment-textarea').value;
    if (selectedCard) {
        selectedCard.setAttribute('data-comments', comments);
    }
    closeCommentPage();
};

// Função para fechar a página de comentários
const closeCommentPage = () => {
    commentPage.classList.remove('active');
    selectedCard = null;
};

// Adiciona evento de clique ao botão de adicionar coluna
addColumnButton.addEventListener('click', createColumn);

// Função para selecionar/deselecionar o cartão
const selectCard = (event) => {
    const previouslySelectedCard = document.querySelector(".card.selected");
    if (previouslySelectedCard) {
        previouslySelectedCard.classList.remove("selected");
    }

    const clickedCard = event.currentTarget;
    if (clickedCard.classList.contains("card")) {
        clickedCard.classList.add("selected");
    }
};

// Adiciona eventos aos cartões existentes
const addCardEventListeners = () => {
    document.querySelectorAll(".card").forEach(card => {
        card.addEventListener("click", selectCard);
    });
};

document.addEventListener("DOMContentLoaded", addCardEventListeners);
document.addEventListener("click", addCardEventListeners);
