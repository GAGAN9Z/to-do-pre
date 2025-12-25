const items = [
    "Сделать проектную работу",
    "Полить цветы",
    "Пройти туториал по Реакту",
    "Сделать фронт для своего проекта",
    "Прогуляться по улице в солнечный день",
    "Помыть посуду",
];

const listElement = document.querySelector(".to-do__list");
const formElement = document.querySelector(".to-do__form");
const inputElement = document.querySelector(".to-do__input");

function loadTasks() {
    const savedTasks = localStorage.getItem('tasks'); // сохранённые задачи
    if (savedTasks) { // если есть задачи
        return JSON.parse(savedTasks); // преобразуем json в массив
    }
    return items; // если задачи нет - возвращаем
}

function createItem(item) {
    const template = document.getElementById("to-do__item-template");
    const clone = template.content.querySelector(".to-do__item").cloneNode(true);
    const textElement = clone.querySelector(".to-do__item-text");
    const deleteButton = clone.querySelector(".to-do__item-button_type_delete");
    const duplicateButton = clone.querySelector(".to-do__item-button_type_duplicate");
    const editButton = clone.querySelector(".to-do__item-button_type_edit");
    
    textElement.textContent = item; // ставим текст в элемент
    
    deleteButton.addEventListener('click', function() { // обработчик события для удаления
        clone.remove(); // удаляем элемент из DOM
        const currentItems = getTasksFromDOM(); // из DOM текущий список задач
        saveTasks(currentItems); // сохраняем обновлённый список
    });
    
    duplicateButton.addEventListener('click', function() { // обработчик события для копирования
        const itemName = textElement.textContent; // получаем текст текущей задачи
        const newItem = createItem(itemName); // создаём эл-нт с таким же текстмо
        listElement.prepend(newItem); // добавляем эл-нт в начало списка
        
        const currentItems = getTasksFromDOM(); // из DOM текущий список задач
        saveTasks(currentItems); // сохраняем обновлённый список
    });
    
    editButton.addEventListener('click', function() { // обработчик события для редактирования
        textElement.setAttribute('contenteditable', 'true'); // делаем текст редактируемым
        textElement.focus(); // устанавливаем фокус на редактирование
    });
    
    textElement.addEventListener('blur', function() { // обработчик события потери фокуса при редактировании
        textElement.setAttribute('contenteditable', 'false'); // отключение возможности редактирования
        const currentItems = getTasksFromDOM(); // из DOM текущий список задач
        saveTasks(currentItems); // сохраняем обновлённый список
    });
    
    textElement.addEventListener('keydown', function(event) { // обработчик события нажатия клавиши при редактировании
        if (event.key === 'Enter') { // если нажали ввод
            event.preventDefault(); // отменяем перенос строки
            textElement.blur(); // сохраняем изменения
        }
    });
    
    return clone; // возвращаем созданный эл-нт
}

function getTasksFromDOM() { // функция получения из DOM текущего списка задач
    const itemsNamesElements = document.querySelectorAll('.to-do__item-text'); // находим все эл-ты с текстом задач
    const tasks = []; // создаём пустой массив для хранения
    
    itemsNamesElements.forEach(function(element) { // перебираем все найденные эл-ты
        tasks.push(element.textContent); // добавляем текст каждой задачи в массив
    });
    
    return tasks; // возвращаем массив задач
}

function saveTasks(tasks) { // сохранение задач в localstorage
    localStorage.setItem('tasks', JSON.stringify(tasks)); // делаем массив json фалом и сохраняем в localstorage
}

const itemsArray = loadTasks(); // загрузка задач
itemsArray.forEach(function(item) { // для каждой задачи - создание эл-та и добавление его в список
    const newItem = createItem(item); // создаём эл-нт лдля задачи
    listElement.append(newItem); // добавляем эл-нт в конец списка
});

formElement.addEventListener('submit', function(event) { // обработчик события отправки формы
    event.preventDefault(); // предотвращаем перезагрузку страницы
    
    const taskText = inputElement.value.trim(); // получаем значение из ввода и удаляем лишние пробелы
    
    const newItem = createItem(taskText); // создаём новый эл-нт списка
    listElement.prepend(newItem); /// добавляем этот эл-нт в начало списка
    const currItems = getTasksFromDOM(); // обновляем массив из DOM
    saveTasks(currItems); // сохраняем обновлённый список задач

    inputElement.value = ''; // очищаем ввод
});