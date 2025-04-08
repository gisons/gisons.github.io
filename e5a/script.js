const quizData = [
    {
        question: "Как назывался первый искусственный спутник Земли? (в ответе напишите только ОДНО слово с БОЛЬШОЙ буквы)",
        type: "text",
        correct: "Спутник-1"
    },
    {
        question: "В каком году был запущен первый искусственный спутник? (в ответе напишите только ЧИСЛО)",
        type: "number",
        correct: "1957"
    },
    {
        question: "На какой высоте находятся геостационарные спутники? (в ответе напишите только ЧИСЛО в километрах)",
        type: "number",
        correct: "36000"
    },
    {
        question: "Какие ракеты используются для запуска спутников?",
        type: "checkbox",
        options: ["Протон", "Союз", "Шаттл", "Falcon 9"],
        correct: ["Протон", "Союз", "Falcon 9"]
    },
    {
        question: "Что обеспечивает энергию спутникам?",
        type: "radio",
        options: ["Аккумуляторы", "Солнечные батареи", "Топливные элементы"],
        correct: "Солнечные батареи"
    },
    {
        question: "Соотнесите типы спутников с их характеристиками",
        type: "match",
        matches: [
            {
                item: "Геостационарные спутники",
                options: [
                    "Находятся на высоте 36 000 км",
                    "Работают на высоте 200–2000 км",
                    "Вращаются синхронно с Землей"
                ],
                correct: "Вращаются синхронно с Землей"
            },
            {
                item: "Низкоорбитальные спутники",
                options: [
                    "Находятся на высоте 36 000 км",
                    "Работают на высоте 200–2000 км",
                    "Вращаются синхронно с Землей"
                ],
                correct: "Работают на высоте 200–2000 км"
            }
        ]
    },
    {
        question: "Что происходит со спутниками после завершения миссии?",
        type: "checkbox",
        options: ["Сгорают в атмосфере", "Остаются на орбите", "Падают на Землю"],
        correct: ["Сгорают в атмосфере", "Остаются на орбите"]
    },
    {
        question: "Какая страна запустила первый спутник?",
        type: "radio",
        options: ["СССР", "США", "Китай"],
        correct: "СССР"
    },
    {
        question: "Для чего используются спутники? (выберите все верные варианты)",
        type: "checkbox",
        options: ["Связь", "Навигация", "Наблюдение за погодой", "Изучение космоса"],
        correct: ["Связь", "Навигация", "Наблюдение за погодой", "Изучение космоса"]
    }
];

const quizContainer = document.getElementById('quiz');
const resultContainer = document.getElementById('result');
const introContainer = document.getElementById('intro');
const navigationContainer = document.querySelector('.navigation');
const prevButton = document.getElementById('prev');
const checkButton = document.getElementById('check');
const nextButton = document.getElementById('next');
const startButton = document.getElementById('start-quiz');
let currentQuestion = 0;
let answers = {};

function createQuestionElement(item, index) {
    const questionDiv = document.createElement('div');
    questionDiv.className = `question ${index === 0 ? 'active' : ''}`;
    questionDiv.dataset.number = index;

    const questionText = document.createElement('p');
    questionText.textContent = `${index + 1}. ${item.question}`;
    questionDiv.appendChild(questionText);

    const optionsDiv = document.createElement('div');
    optionsDiv.className = 'options';
    questionDiv.appendChild(optionsDiv);

    if (item.type === "radio") {
        item.options.forEach(option => {
            const label = document.createElement('label');
            label.className = 'match-option';

            const input = document.createElement('input');
            input.type = 'radio';
            input.name = `question${index}`;
            input.value = option;
            label.appendChild(input);

            const text = document.createTextNode(option);
            label.appendChild(text);
            optionsDiv.appendChild(label);
        });
    } else if (item.type === "text") {
        const input = document.createElement('input');
        input.type = 'text';
        input.id = `text-answer${index}`;
        input.placeholder = 'Введите ответ';
        optionsDiv.appendChild(input);
    } else if (item.type === "checkbox") {
        item.options.forEach(option => {
            const label = document.createElement('label');

            const input = document.createElement('input');
            input.type = 'checkbox';
            input.name = `question${index}`;
            input.value = option;
            label.appendChild(input);

            const text = document.createTextNode(option);
            label.appendChild(text);
            optionsDiv.appendChild(label);

            const br = document.createElement('br');
            optionsDiv.appendChild(br);
        });
    } else if (item.type === "number") {
        const input = document.createElement('input');
        input.type = 'number';
        input.id = `number-answer${index}`;
        input.placeholder = 'Введите число';
        optionsDiv.appendChild(input);
    } else if (item.type === "date") {
        const input = document.createElement('input');
        input.type = 'text';
        input.id = `date-answer${index}`;
        input.placeholder = 'Введите дату (например, 04.10.1957)';
        optionsDiv.appendChild(input);
    } else if (item.type === "match") {
        item.matches.forEach((match, subIndex) => {
            const subDiv = document.createElement('div');
            subDiv.className = 'match-subquestion';

            const p = document.createElement('p');
            p.textContent = match.item;
            subDiv.appendChild(p);

            const select = document.createElement('select');
            select.name = `match${index}-${subIndex}`;

            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.textContent = 'Выберите описание...';
            select.appendChild(defaultOption);

            match.options.forEach(option => {
                const opt = document.createElement('option');
                opt.value = option;
                opt.textContent = option;
                select.appendChild(opt);
            });

            subDiv.appendChild(select);
            optionsDiv.appendChild(subDiv);
        });
    }

    const feedbackDiv = document.createElement('div');
    feedbackDiv.className = 'feedback';
    feedbackDiv.id = `feedback${index}`;
    questionDiv.appendChild(feedbackDiv);

    return questionDiv;
}

function buildQuiz() {
    quizData.forEach((item, index) => {
        const questionElement = createQuestionElement(item, index);
        quizContainer.appendChild(questionElement);
    });
}

function showQuestion(index) {
    const questions = document.querySelectorAll('.question');
    questions[currentQuestion].classList.remove('active');
    questions[index].classList.add('active');
    currentQuestion = index;

    prevButton.style.display = currentQuestion === 0 ? 'none' : 'inline';
    checkButton.style.display = answers[currentQuestion] ? 'none' : 'inline';
    nextButton.style.display = answers[currentQuestion] && currentQuestion < quizData.length - 1 ? 'inline' : 'none';

    updateFeedback();
}

function updateFeedback() {
    const currentQ = document.querySelector(`.question[data-number="${currentQuestion}"]`);
    const feedback = currentQ.querySelector('.feedback');
    if (answers[currentQuestion]) {
        feedback.className = 'feedback';
        feedback.innerHTML = '';
    } else {
        feedback.className = 'feedback';
        feedback.innerHTML = '';
    }
}

function checkAnswer() {
    const currentQ = document.querySelector(`.question[data-number="${currentQuestion}"]`);
    let selected;

    if (quizData[currentQuestion].type === "radio") {
        selected = currentQ.querySelector(`input[name="question${currentQuestion}"]:checked`);
        if (!selected) {
            alert('Пожалуйста, выберите ответ!');
            return;
        }
        answers[currentQuestion] = selected.value;
    } else if (quizData[currentQuestion].type === "text") {
        selected = currentQ.querySelector(`#text-answer${currentQuestion}`).value.trim();
        if (!selected) {
            alert('Пожалуйста, введите ответ!');
            return;
        }
        answers[currentQuestion] = selected;
    } else if (quizData[currentQuestion].type === "checkbox") {
        selected = Array.from(currentQ.querySelectorAll(`input[name="question${currentQuestion}"]:checked`))
            .map(input => input.value);
        if (selected.length === 0) {
            alert('Пожалуйста, выберите хотя бы один вариант!');
            return;
        }
        answers[currentQuestion] = selected;
    } else if (quizData[currentQuestion].type === "number") {
        selected = currentQ.querySelector(`#number-answer${currentQuestion}`).value.trim();
        if (!selected) {
            alert('Пожалуйста, введите число!');
            return;
        }
        answers[currentQuestion] = selected;
    } else if (quizData[currentQuestion].type === "date") {
        selected = currentQ.querySelector(`#date-answer${currentQuestion}`).value.trim();
        if (!selected) {
            alert('Пожалуйста, введите дату!');
            return;
        }
        answers[currentQuestion] = selected;
    } else if (quizData[currentQuestion].type === "match") {
        selected = [];
        for (let subIndex = 0; subIndex < quizData[currentQuestion].matches.length; subIndex++) {
            const match = quizData[currentQuestion].matches[subIndex];
            const selectedOption = currentQ.querySelector(`select[name="match${currentQuestion}-${subIndex}"]`).value;
            if (!selectedOption) {
                alert(`Пожалуйста, выберите описание для "${match.item}"!`);
                return;
            }
            selected.push(selectedOption);
        }
        answers[currentQuestion] = selected;
    }

    checkButton.style.display = 'none';

    if (currentQuestion < quizData.length - 1) {
        showQuestion(currentQuestion + 1);
    } else {
        showResults();
    }
}

function generateCode(score) {
    const baseCode = Math.floor(100000 + Math.random() * 900000);
    return `${baseCode}${score}`;
}

function showResults() {
    let score = 0;
    quizData.forEach((question, index) => {
        if (question.type === "radio" || question.type === "text" || question.type === "number") {
            if (answers[index] === question.correct) score++;
        } else if (question.type === "date") {
            const normalizedAnswer = answers[index]?.replace(/\s/g, '').toLowerCase();
            const normalizedCorrect = question.correct.replace(/\s/g, '').toLowerCase();
            if (normalizedAnswer === normalizedCorrect) score++;
        } else if (question.type === "checkbox") {
            if (JSON.stringify(answers[index]?.sort()) === JSON.stringify(question.correct.sort())) score++;
        } else if (question.type === "match") {
            const correctAnswers = question.matches.map(m => m.correct);
            if (JSON.stringify(answers[index]) === JSON.stringify(correctAnswers)) score++;
        }
    });

    const uniqueCode = generateCode(score);

    quizContainer.style.display = 'none';
    navigationContainer.style.display = 'none';
    resultContainer.style.display = 'block';

    const resultMessage = document.createElement('p');
    resultMessage.textContent = `Викторина завершена! Вы набрали ${score} из ${quizData.length} баллов! Пожалуйста введите код в форму.`;
    resultContainer.appendChild(resultMessage);

    const codeContainer = document.createElement('div');
    const codeLabel = document.createElement('p');
    codeLabel.textContent = 'Ваш уникальный код: ';
    const codeSpan = document.createElement('strong');
    codeSpan.id = 'unique-code';
    codeSpan.textContent = uniqueCode;
    codeLabel.appendChild(codeSpan);
    codeContainer.appendChild(codeLabel);

    const copyButton = document.createElement('button');
    copyButton.id = 'copy-code';
    copyButton.textContent = 'Скопировать код';
    codeContainer.appendChild(copyButton);
    resultContainer.appendChild(codeContainer);

    const formContainer = document.createElement('div');
    formContainer.id = 'yandex-form-container';
    const iframe = document.createElement('iframe');
    iframe.src = 'https://docs.google.com/forms/d/e/1FAIpQLSc46otjgrk50k1CsN0_IX1nXHKPcuPpA7w6T_4BSjxjzTJJ5g/viewform?embedded=true';
    iframe.width = '640';
    iframe.height = '720';
    iframe.frameBorder = '0';
    iframe.marginHeight = '0';
    iframe.marginWidth = '0';
    iframe.setAttribute('sandbox', 'allow-same-origin allow-scripts allow-forms');
    iframe.textContent = 'Загрузка…';
    formContainer.appendChild(iframe);
    resultContainer.appendChild(formContainer);

    copyButton.addEventListener('click', () => {
        const code = codeSpan.textContent;
        navigator.clipboard.writeText(code).then(() => {
            alert('Код скопирован в буфер обмена!');
        }).catch(err => {
            alert('Не удалось скопировать код: ' + err);
        });
    });
}

buildQuiz();

startButton.addEventListener('click', () => {
    introContainer.style.display = 'none';
    quizContainer.style.display = 'block';
    navigationContainer.style.display = 'block';
    showQuestion(0);
});

prevButton.addEventListener('click', () => showQuestion(currentQuestion - 1));
checkButton.addEventListener('click', () => checkAnswer());
nextButton.addEventListener('click', () => showQuestion(currentQuestion + 1));