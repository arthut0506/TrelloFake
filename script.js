//ligação do HTml no Js
const columnsContainer = document.getElementById('columns-container');
const addColumnButton = document.getElementById('add-column-button');
const commentPage = document.getElementById('comment-page');

let draggedCard;
let selectedCard = null;

//Funções para arrastar e soltar
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
        saveBoardState(); // Salva o estado após mover um cartão
    }
};

// Função para criar um novo card "esse demorou um bucado"
const createCard = ({ target }, contentText = '', comments = '') => {
    if (!target.classList.contains("column__cards")) return;

    const card = document.createElement("section");
    card.className = "card";
    card.draggable = "true";

    const content = document.createElement("div");
    content.className = "card__content";
    content.contentEditable = "true";
    content.textContent = contentText; //Carrega o texto do card

    const removeButton = document.createElement("button");
    removeButton.textContent = "X";
    removeButton.className = "card__button";

    removeButton.addEventListener("click", () => {
        card.remove();
        saveBoardState(); //Salva o estado após remover um cartão
    });

    const commentButton = document.createElement("button");
    commentButton.textContent = "C";
    commentButton.className = "card__comment-button";

    commentButton.addEventListener("click", () => {
        openCommentPage(card, comments); //Abre a página de comentários com comentários carregados
    });

    content.addEventListener("input", saveBoardState); //Salva 

    card.append(content, removeButton, commentButton);
    card.addEventListener("dragstart", dragStart);
    card.addEventListener("click", () => {
        selectCard(card);
    });

    target.appendChild(card);
    saveBoardState(); //Salva
};

//Função para selecionar um card
const selectCard = (card) => {
    if (selectedCard) {
        selectedCard.classList.remove("selected");
    }
    selectedCard = card;
    card.classList.add("selected");
};

// Função para abrir a página de comentários
const openCommentPage = (card, comments) => {
    commentPage.innerHTML = ''; // Limpa o conteúdo existente

    const title = document.createElement("h2");
    title.textContent = "Comentários";

    const textarea = document.createElement("textarea");
    textarea.value = comments; // Carrega os comentários

    const saveButton = document.createElement("button");
    saveButton.textContent = "Salvar";

    const closeButton = document.createElement("button");
    closeButton.textContent = "Fechar";
    closeButton.className = "close-button";

    saveButton.addEventListener("click", () => {
        card.dataset.comments = textarea.value; // Salva os comentários no atributo data
        closeCommentPage();
        saveBoardState(); // Salva o estado após adicionar/editar comentários
    });

    closeButton.addEventListener("click", closeCommentPage);

    commentPage.append(title, textarea, saveButton, closeButton);
    commentPage.classList.add("active");
};

//Função para fechar a página de comentários
const closeCommentPage = () => {
    commentPage.classList.remove("active");
    commentPage.innerHTML = ''; // Limpa o conteúdo ao fechar
};

//Função para criar uma nova coluna
const createColumn = (titleText = 'Nova coluna') => {
    const column = document.createElement("div");
    column.className = "column";

    const title = document.createElement("div");
    title.className = "column__title";
    title.contentEditable = "true";
    title.textContent = titleText; //Carrega o título da coluna

    const deleteButton = document.createElement("button");
    deleteButton.className = "column__delete-button";
    deleteButton.textContent = "Excluir";

    deleteButton.addEventListener("click", () => {
        column.remove();
        saveBoardState(); //Salva o estado após remover uma coluna
    });
    //funções de arrastar e soltar, entre outras coisas para ficar bem interativo, tive que estudar um pouco
    const cardsContainer = document.createElement("div");
    cardsContainer.className = "column__cards";
    cardsContainer.addEventListener("dragenter", dragenter);
    cardsContainer.addEventListener("dragleave", dragleave);
    cardsContainer.addEventListener("dragover", dragover);
    cardsContainer.addEventListener("drop", drop);
    cardsContainer.addEventListener("dblclick", createCard);

    title.addEventListener("input", saveBoardState); //Salva o estado após editar o título

    column.append(title, deleteButton, cardsContainer);
    columnsContainer.appendChild(column);
    saveBoardState(); //Salva o estado após adicionar uma coluna
};

//Função para salvar o estado do quadro no localStorage, tive que pesquisar bastante e usar inteligencia artificial para explicar porque tava dificil, mas deu certo
const saveBoardState = () => {
    const columns = [...columnsContainer.querySelectorAll('.column')].map(column => ({
        title: column.querySelector('.column__title').textContent,
        cards: [...column.querySelectorAll('.card')].map(card => ({
            content: card.querySelector('.card__content').textContent,
            comments: card.dataset.comments || ''
        }))
    }));

    localStorage.setItem('boardState', JSON.stringify(columns));
};


const loadBoardState = () => {
    const boardState = JSON.parse(localStorage.getItem('boardState'));
    if (!boardState) return;

    boardState.forEach(({ title, cards }) => {
        createColumn(title);
        const cardsContainer = columnsContainer.lastElementChild.querySelector('.column__cards');

        cards.forEach(({ content, comments }) => {
            createCard({ target: cardsContainer }, content, comments);
        });
    });
};

//Eventos iniciais
addColumnButton.addEventListener('click', () => createColumn());
document.addEventListener('DOMContentLoaded', loadBoardState);
