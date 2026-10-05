function landingHome(){
 return `<section class="landing-hero hero" aria-labelledby="hero-title">
  <img class="hero-photo" src="assets/candidate-demo.png" width="1536" height="1024" alt="Иллюстрация: специалист в офисе с видом на Алматы" fetchpriority="high">
  <div class="hero-shade" aria-hidden="true"></div>
  <div class="hero-content">
   <div class="role-switch" aria-label="Выберите свою задачу"><a href="#home" class="selected" aria-current="page">Ищу работу</a><a href="#employers">Ищу сотрудника</a></div>
   <p class="hero-region">Казахстан и Турция</p>
   <h1 id="hero-title">Найдите работу.<br> Покажите себя.</h1>
   <p class="lead">Вакансии, знакомства и новый шаг в карьере. Начните с поиска — или расскажите о себе в анкете.</p>
   ${search()}
   <div class="quick-search"><span>Направления:</span>${['Продажи','Сервис','Производство','Офис'].map(x=>`<button data-category="${x}">${x}</button>`).join('')}</div>
  </div>
 </section>
 <section class="start-paths container" aria-label="Возможности Open Consulting">
  <a class="profile-promo" href="#profile"><div class="promo-copy"><span class="promo-label">Ваша анкета</span><h2>Пусть работа<br> найдёт вас.</h2><p>Добавьте опыт и навыки. Видео поможет<br> познакомиться ближе — если захотите.</p><span class="promo-link">Создать анкету ${icon('arrow')}</span></div><div class="profile-art" aria-hidden="true">${icon('user')}<span>${icon('camera')}</span></div></a>
  <div class="employer-promo"><span class="promo-label">Для компаний</span><h2>Нужен человек<br> в команду?</h2><p>Разместите вакансию и познакомьтесь<br> с кандидатами до собеседования.</p><a href="#employers" class="promo-link">Найти сотрудника ${icon('arrow')}</a></div>
 </section>
 ${landingVideoSection()}
 ${landingJobsSection()}`;
}

function landingJobsSection(){
 return `<section class="homepage-jobs" id="jobs" aria-labelledby="jobs-heading"><div class="container">
  <div class="vacancy-heading"><div><h2 id="jobs-heading">Найдите подходящую вакансию</h2><p>Сравните условия и выберите, куда откликнуться.</p></div><span id="result-count" role="status"></span></div>
  <div class="vacancy-toolbar"><div class="filters" role="group" aria-label="Направление работы">${['Все','Продажи','Сервис','Производство','Офис'].map(category=>`<button class="filter ${category===currentCategory?'active':''}" data-filter="${category}" aria-pressed="${category===currentCategory}">${category}</button>`).join('')}<button class="filter ${noExperience?'active':''}" data-action="no-exp" aria-pressed="${noExperience}">Без опыта</button></div><div class="vacancy-location"><label for="jobs-city">Город / страна</label><select id="jobs-city">${['','Казахстан','Турция','Алматы','Астана','Стамбул'].map(city=>`<option value="${city}" ${city===currentCity?'selected':''}>${city||'Все города'}</option>`).join('')}</select></div></div>
  <p class="vacancy-demo-note">Примеры вакансий. Компании и условия демонстрационные.</p>
  <div class="job-list" id="job-list"></div>
 </div></section>`;
}
function singleJobCard(job){return `<a class="job-card vacancy-card" href="#job-${job.id}"><span class="vacancy-company">${job.company}</span><h3>${job.title}</h3><span class="salary">${job.salary}</span><span class="vacancy-city">${icon('pin')}${job.city}</span><span class="vacancy-conditions"><span>${job.exp}</span><span>${job.schedule}</span></span><span class="vacancy-card-bottom">Подробнее об условиях ${icon('arrow')}</span></a>`;}
document.addEventListener('change',event=>{if(event.target.id!=='jobs-city')return;currentCity=event.target.value;const heroCity=document.getElementById('search-city');if(heroCity)heroCity.value=currentCity;fillJobList();});

function landingVideoSection(){
 return `<section class="instruction-section" id="how" aria-labelledby="video-heading"><div class="container instruction-container">
  <div class="instruction-heading"><h2 id="video-heading">Как заполнить анкету</h2><p>От основных данных до видеоответов и готового профиля.</p></div>
  <div class="instruction-screen" id="instruction-screen">
   <div class="instruction-poster"><div class="instruction-poster-copy"><span>Open Consulting</span><h3>Расскажите о себе.<br> Мы покажем как.</h3><button type="button" class="instruction-open" data-guide="start"><span class="instruction-play">${icon('play')}</span><span>Открыть инструкцию</span></button></div>
    <div class="guide-window" aria-hidden="true"><div class="guide-window-bar"><span>Ваша анкета</span><span>Предпросмотр</span></div><div class="guide-window-body"><div class="guide-mini-fields"><b>Начнём со знакомства</b><span>Имя</span><div>Айгерим</div><span>Профессия</span><div>Администратор</div><span>Опыт работы</span><div>1–3 года</div><em>Продолжить</em></div><div class="guide-mini-photo"><img src="assets/candidate-demo.png" alt="" width="1536" height="1024"><span>Видео — по желанию</span></div></div></div>
   </div>
  </div>
  <div class="instruction-controls" id="instruction-controls"><p>Сейчас доступна пошаговая инструкция. Обучающий ролик добавим позже.</p></div>
  <div class="instruction-bottom"><a class="btn" href="#profile">Создать анкету ${icon('arrow')}</a><p>Видео необязательно.<br> Его можно добавить позже.</p></div>
 </div></section>`;
}
const guideSteps=[
 {title:'Укажите профессию и опыт',text:'Выберите работу, которая вам интересна. Опыт поможет подобрать подходящие вопросы.',fields:[['Профессия','Администратор'],['Опыт работы','1–3 года']]},
 {title:'Добавьте основные данные',text:'Напишите имя, город и навыки. Эти данные составят вашу анкету даже без видео.',fields:[['Имя','Айгерим'],['Город','Алматы'],['Навыки','Общение с клиентами, организация расписания']]},
 {title:'Запишите ответы, если хотите',text:'Вопрос будет виден на экране. Подготовьтесь, ответьте своими словами и посмотрите запись. Ответ можно переснять.',camera:true},
 {title:'Проверьте анкету',text:'Посмотрите данные и ответы. Перед сохранением выберите, кто сможет увидеть вашу анкету.',review:true}
];
let guideStep=0;
function renderInlineGuide(){
 const step=guideSteps[guideStep];
 const visual=step.camera?`<div class="guide-camera-image"><img src="assets/candidate-demo.png" alt="Иллюстрация кадра для видеоответа" width="1536" height="1024"><p>Расскажите о вашем опыте работы</p></div>`:step.review?`<div class="guide-review"><span class="guide-review-avatar">А</span><h4>Айгерим</h4><p>Администратор · Алматы</p><div><b>Кто увидит анкету</b><span>Только компании, которым вы откликнетесь</span></div></div>`:`<div class="guide-fields">${step.fields.map(([label,value])=>`<div><span>${label}</span><p>${value}</p></div>`).join('')}</div>`;
 document.getElementById('instruction-screen').innerHTML=`<div class="inline-guide"><div class="inline-guide-copy"><p class="guide-step-label">Шаг ${guideStep+1} из 4</p><h3>${step.title}</h3><p class="guide-step-text">${step.text}</p></div><div class="inline-guide-visual">${visual}<span class="guide-demo-label">Пример заполнения</span></div></div>`;
 document.getElementById('instruction-controls').innerHTML=`<div class="guide-mobile-copy"><p>Шаг ${guideStep+1} из 4</p><h3>${step.title}</h3><span>${step.text}</span></div><div class="guide-navigation"><button type="button" data-guide="${guideStep?'prev':'restart'}">${guideStep?'Назад':'К началу'}</button><p role="status">${guideStep+1} / 4</p>${guideStep<3?'<button type="button" data-guide="next">Далее '+icon('arrow')+'</button>':'<a href="#profile">Создать анкету '+icon('arrow')+'</a>'}</div>`;
}
document.addEventListener('click',event=>{
 const button=event.target.closest('[data-guide]');if(!button)return;
 const action=button.dataset.guide;
 if(action==='restart'){const scroll=window.scrollY;render();window.scrollTo(0,scroll);return;}
 if(action==='start')guideStep=0;
 if(action==='next')guideStep=Math.min(3,guideStep+1);
 if(action==='prev')guideStep=Math.max(0,guideStep-1);
 renderInlineGuide();
});
