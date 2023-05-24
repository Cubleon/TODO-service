'use strict'
let eps = 0.000000000000000004
// Общее кол-во заданий
let tasks = 0
// Кол-во завершенных заданий
let completedTasks = 0



// Подгрузка задача из localStorage
if(localStorage.getItem("tasksHTML") != null){
    tasks = parseInt(localStorage.getItem("tasksNumber"));
    completedTasks = parseInt(localStorage.getItem("completedTasksNumber"));
    allTasks.innerHTML = localStorage.getItem("tasksHTML");

    // Добавление обработчиков событий для всех карточек
    cardActions();

    // Очистка полей ввода
    mainTask.value = '';
    taskDescription.value = '';

    // Показ надписи "У вас пока нет заданий"
    noTasks.hidden = (localStorage.getItem("tasksHTML") != "");

    // Прокрутка окна при добавлении задачи
    window.scroll({
        top: document.body.scrollHeight,
        left: 0,
        behavior: "smooth",
    });

    // Изменение прогресс-бара
    changeProgress();

}



// Разделы в навигации
let taskSections = document.querySelectorAll("li")

// Обработка нажатий на разделы
for(let section of taskSections){
    section.addEventListener("click", function(){
        // Переход по разделам, если общее количество заданий равно 0
        if(tasks != 0){
            // Обработка отображения карточек
            hideCards(section.id);
        }
        else{
            UIkit.notification({
                message: 'У вас пока нет заданий',
                status: 'danger',
                timeout: 500
            });
        }
    })
}

// Добавление новой задачи
addTask.addEventListener('click', function(){
    // Добавление задачи, если поле с задачей или описание задачи пустое
    if(mainTask.value == ''){
        UIkit.notification({
            message: 'Введите задачу',
            status: 'danger',
            timeout: 500
        });
    }
    else if(taskDescription.value == ''){
        UIkit.notification({
            message: 'Введите описание задачи',
            status: 'danger',
            timeout: 500
        });
    }
    else{
        // Принудительный переход в раздел "Все"
        hideCards("allT");

        // Шаблон карточки
        let task = `
        <div id="card">
            <div class="uk-card uk-card-default uk-card-hover">
                <div class="uk-card-header">
                    <div class="uk-flex-inline uk-margin-remove">
                        <div><input class="uk-checkbox" type="checkbox"></div>
                        <a uk-icon="close" class="uk-align-right"></a>
                    </div>
                    
                    <h4 class="uk-card-title uk-margin-remove-top" id="cardHeader">${mainTask.value}</h4>   
                    <button class="uk-button uk-button-primary" id="showCnt">Показать содержание</button>
                </div>
                <div class="uk-card-body" hidden id="cardBody">
                    ${taskDescription.value}
                </div>
            </div>
        </div>
        `
        allTasks.innerHTML += task;

        // Добавление обработчиков событий для всех карточек
        cardActions();

        // Очистка полей ввода
        mainTask.value = '';
        taskDescription.value = '';

        // Скрытие надписи "У вас пока нет заданий"
        noTasks.hidden = true;

        // Прокрутка окна при добавлении задачи
        window.scroll({
            top: document.body.scrollHeight,
            left: 0,
            behavior: "smooth",
        });

        // Изменение прогресс-бара
        tasks++;
        changeProgress();

    }
})

// Очистка всех задач
clearTasks.addEventListener('click', function(){
    hideCards("allT");
    allTasks.innerHTML = '';
    noTasks.hidden = false;
    completedTasks = 0;
    tasks = 0;
    changeProgress();
})


// Сохранение данных при закрытии окна
window.addEventListener("unload", function(){
    localStorage.setItem("tasksHTML", allTasks.innerHTML);
    localStorage.setItem("tasksNumber", tasks);
    localStorage.setItem("completedTasksNumber", completedTasks);
})



// Функция, изменяющая прогресс-бар и надпись под ним
function changeProgress(){
    progressValue.value = parseInt(completedTasks / (tasks + eps) * 100);
    if(completedTasks == 0){
        progressText.innerHTML = "Вы пока не выполнили ни одного задания";
    }
    else if(completedTasks == tasks){
        progressText.innerHTML = "Вы выполнили все задания";
    }
    else{
        progressText.innerHTML = `Вы выполнили ${progressValue.value}% заданий`;
    }
} 

// Функция, добавляющая обработчики событий для карточки
function cardActions(){
    // Получение карточек
    let cards = document.querySelectorAll("#card");

    // Добавление обработчиков
    for(let i = 0; i < cards.length; i++){
        // Показать содержание
        cards[i].querySelector("#showCnt").addEventListener('click', function(){
            cards[i].querySelector("#cardBody").hidden = !cards[i].querySelector("#cardBody").hidden;
        })

        // Кнопка удаления карточки
        cards[i].querySelector("a[uk-icon=close]").addEventListener("click", function(){
            tasks--;
            completedTasks -= cards[i].querySelector(".uk-checkbox").checked;
            cards[i].remove();
            
            changeProgress();

            if(tasks == 0){
                hideCards("allT");
                noTasks.hidden = false;
            }
        })

        // Отметить выполнена ли задача
        cards[i].querySelector(".uk-checkbox").addEventListener("change", function(){
            if(cards[i].querySelector(".uk-checkbox").checked){
                // Зачеркивание заголовка карточки
                cards[i].querySelector("#cardHeader").style.textDecoration = "line-through";
                
                // Фиксирование значения чекбокса
                cards[i].querySelector(".uk-checkbox").setAttribute("checked", "checked");
            }
            else{
                // Возврат к исходному состоянию заголовка карточки
                cards[i].querySelector("#cardHeader").style.textDecoration = "none";
                
                // Фиксирование значения чекбокса
                cards[i].querySelector(".uk-checkbox").removeAttribute("checked");
            }

            // Изменение прогресс-бара
            completedTasks += cards[i].querySelector(".uk-checkbox").checked * 2 - 1;
            changeProgress();

            // Динамическая обработка отображения карточек
            for(let el of taskSections){
                if(el.classList.contains("uk-active")){
                    hideCards(el.id);
                }
            }            
        })
    }
}
function hideCards(id){
    // Анимация выбоора раздела
    for(let el of taskSections){
        el.classList.remove("uk-active");
    }
    document.querySelector(`#${id}`).classList.add("uk-active");

    // Получение карточек
    let cards = document.querySelectorAll("#card");
    for(let card of cards){
        // Выбран раздел "Все"
        if(id == "allT"){
            card.hidden = false;
        }
        // Выбран раздел "Активные"
        else if(card.querySelector("#cardHeader").style.textDecoration == "line-through"){
            card.hidden = (id == "activeT");
        }
        // Выбран раздел "Завершенные"
        else{
            card.hidden = (id == "completedT");
        }
    }
    // Отображение надписи "В этом разделе пока нет заданий"
    if((id == "completedT" && completedTasks == 0) || (id == "activeT" && completedTasks == tasks)){
        noSectionTasks.hidden = false;
    }
    else{
        noSectionTasks.hidden = true;
    }
}



