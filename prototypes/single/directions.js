const directionChoice=Math.max(1,Math.min(3,Number(new URLSearchParams(location.search).get('direction'))||1));
document.body.classList.add(`video-direction-${directionChoice}`);
const directionDescriptions=['Кинематографичный баннер. Большой кадр и центральный запуск инструкции.','Светлая демонстрация продукта. Сначала видно, какую анкету предстоит заполнить.','Обучающий раздел. Можно выбрать нужную тему и сразу перейти к ней.'];
const baseInstruction=landingVideoSection;
landingVideoSection=function(){
 let content=baseInstruction();
 if(directionChoice===1){content=content.replace('Как заполнить анкету','Посмотрите, как это работает').replace('От основных данных до видеоответов и готового профиля.','Заполните анкету в своём темпе. Мы покажем каждый шаг.').replace('class="instruction-poster"','class="instruction-poster cinematic-poster"').replace('Расскажите о себе.<br> Мы покажем как.','Ваша история.<br> Ваша следующая работа.');}
 if(directionChoice===2){content=content.replace('Как заполнить анкету','Всё начинается с вашей анкеты').replace('От основных данных до видеоответов и готового профиля.','Посмотрите, какие данные нужны и как добавить видеоответы.').replace('Расскажите о себе.<br> Мы покажем как.','Заполнить анкету.<br> Проще, чем кажется.');}
 if(directionChoice===3){content=content.replace('Как заполнить анкету','Разберёмся вместе.').replace('От основных данных до видеоответов и готового профиля.','Выберите тему — и посмотрите, как пройти этот шаг.').replace('</div>\n  <div class="instruction-screen"','<div class="guide-chapters" role="group" aria-label="Темы инструкции"><button data-guide-jump="0">Основные данные '+icon('arrow')+'</button><button data-guide-jump="2">Видеоответы '+icon('arrow')+'</button><button data-guide-jump="3">Проверка анкеты '+icon('arrow')+'</button></div></div>\n  <div class="instruction-screen"').replace('Расскажите о себе.<br> Мы покажем как.','От первого поля<br> до готовой анкеты.');}
 return content;
};
landingHome=function(){return `<div class="direction-picker container"><nav aria-label="Направления дизайна">${['Кинематографичный','Светлый продукт','Обучающий раздел'].map((name,i)=>`<a href="?direction=${i+1}#how" ${directionChoice===i+1?'aria-current="page"':''}>${name}</a>`).join('')}</nav><p>${directionDescriptions[directionChoice-1]}</p></div>${landingVideoSection()}`;};
header=function(){return `<header class="header"><div class="container header-inner">${brand()}<a class="direction-back" href="./#how">Вернуться на сайт ${icon('arrow')}</a></div></header>`;};
document.addEventListener('click',event=>{const button=event.target.closest('[data-guide-jump]');if(!button)return;guideStep=Number(button.dataset.guideJump);renderInlineGuide();document.querySelectorAll('[data-guide-jump]').forEach(item=>item.setAttribute('aria-pressed',item===button));});
render();
document.title='Open Consulting — варианты видеоинструкции';
