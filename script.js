window.addEventListener('resize', () => {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
});

const hardVersion = {
    'yarik-k': [
        'Вот шлюхи!'
    ],
    'pasha': [
        'Еб@ла жаба гадюку!',
        'Так а вы шо там, пацики?',
        'Тю, так а ты шо там?',
        'Делать мы этого, конечно же, не будем',
        'Как уе*у, сука!',
        'Шоб да - то нє',
        'Курва, я пердоле',
    ],
    'alex': [
        'Инвестиции - это конечно хорошо',
        'Мне нечего есть',
    ],
    'anton': [
        'Наеб@ть меня решил?',
        'А ты не при*уел?'
    ],
    'yarik-l': [
        'Славик красивый - пи*дец!',
        'У прынцыпи...',
        'Моё почтение',
    ],
    'slavik': [
        'Чисто технически все готово',
        'Пропустил пробел',
        'Та это не дорого!',
    ],
    'bodya': [
        'Нормально вжарил!'
    ],
    'ruslan': [
        'Горшочек, не вари!',
        'Через 20 минут будет готово...'
    ],
    'andrew': [
        '...',
    ],
}

const liteVersion = {
    'yarik-k': [
        'Сударь, кажется вы ошиблись...',
        'Не изволите чаю? Зеленого...',
    ],
    'pasha': [
        'Как ваши дела, милейший?',
        'Нет ни малейшего желания этим заниматься',
        'А вы знаете как земноводные проводят свой досуг?',
    ],
    'alex': [
        'Полагаю, нам нужен компромисс, месье',
        'Предпочитаю не обращать внимания',
    ],
    'anton': [
        'Какой досадный инцидент!',
        'Предположу, что вы это случайно',
    ],
    'yarik-l': [
        'Созерцаю красоту неземных масштабов!',
        'Простите мне моё увлечение',
    ],
    'slavik': [
        'Не желаете ли присоединиться ко мне за обедом?',
        'Вынужден с вами не согласиться',
    ],
    'bodya': [
        'Ваше здоровье!',
        'Боюсь, я не разглашал эту информацию...',
    ],
    'ruslan': [
        'Настаиваю на сохранении вашей нервной системы',
        'Не соизволите ли вы объясниться?',
    ],
    'andrew': [
        'Не найдется ли для меня какой-нибудь работы?',
        'Вы, должно быть, ошиблись',
    ],
}

let isGameStopped = true;

window.addEventListener('load', () => {
    const places = [...document.getElementsByClassName('place')];
    const screen = document.getElementById('screen');
    const startBtn = document.getElementById('start');
    const status = document.getElementById('status');
    const lives = [...document.getElementsByClassName('lives-item')];
    let livesCount = lives.length;
    let speech;

    startBtn?.addEventListener('click', () => {
        setVersion();
        screen.classList.add('active');
        setTimeout(startGame, 1000);
    });

    function setVersion() {
        speech = document.getElementById('age-check').checked
            ? hardVersion
            : liteVersion;
        speechCounter = {};
    };

    function startGame() {
        isGameStopped = false;
        status.dataset.status = '';
        bustedPlaces = 0;
        places.forEach((place) => activatePlace(place));
        activateTimer();
    }

    let bustedPlaces = 0;
    document.getElementById('grid')?.addEventListener('click', (evt) => {
        const targetPlace = evt.target;
        if (!targetPlace.matches('.place') || targetPlace.matches('.busted')) return;

        if (targetPlace.matches('.free')) {
            targetPlace.classList.add('busted');
            bustedPlaces++;
            if (bustedPlaces >= places.length) stopGame('win');
        } else {
            targetPlace.classList.add('miss');
            showSpeech(targetPlace);
            takeLife();
        }

        targetPlace.classList.remove('free');
    });

    let speechCounter = {};
    function showSpeech(target) {
        const id = target.id;
        const poolCap = speech[id].length - 1;
        let current = speechCounter[id];

        current == undefined || current == poolCap
            ? current = 0
            : current++

        target.nextElementSibling.innerHTML = speech[id][current];
        speechCounter[id] = current;
    }

    function takeLife() {
        const idx = livesCount - 1;
        lives[idx].classList.add('missed');
        if (--livesCount == 0) stopGame('loose');
    }

    function stopGame(res) {
        isGameStopped = true;
        screen.classList.remove('active');
        places.forEach((item) => item.classList.remove('busted', 'miss', 'free'));
        lives.forEach((item) => item.classList.remove('missed'));
        dropTimer();
        livesCount = lives.length;
        status.dataset.status = res;
    }

    let seconds, timer;
    const timerEl = document.getElementById('timer');
    function tick() {
        if (seconds < 60) {
            timerEl.innerHTML = `0:${('0' + seconds).slice(-2)}`;
        }
        seconds > 0 ? seconds-- : stopGame('timeout');
    }
    function activateTimer() {
        if (!timer) {
            timerEl.innerHTML = `1:00`;
            seconds = 60;
            timer = setInterval(tick, 1000);
        }
    }
    function dropTimer() {
        clearInterval(timer);
        timer = null;
    }
});

function activatePlace(place) {
    function goAway() {
        if (place.matches('.busted') || isGameStopped) return;
        place.matches('.miss') && place.classList.remove('miss');
        place.classList.add('free');

        var rand = Math.round(Math.random() * (1800 - 600)) + 600;
        isGameStopped || setTimeout(goBack, rand);
    }

    function goBack() {
        place.classList.remove('free');
        place.matches('.busted') || prepareToGo();
    }

    function prepareToGo() {
        var rand = Math.round(Math.random() * (10000 - 3000)) + 3000;
        isGameStopped || setTimeout(goAway, rand);
    }

    prepareToGo();
}
