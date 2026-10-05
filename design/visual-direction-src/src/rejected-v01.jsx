import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Theme, Button, Badge, TextField, Select, SegmentedControl, Dialog, Tabs, Progress, Checkbox, Table, IconButton } from '@radix-ui/themes';
import { ArrowRight, ArrowUpRight, Search, MapPin, Play, Video, FileText, CalendarDays, Check, ChevronRight, Menu, X, Globe, Building2, UserRound, CheckCircle2, Clock3, Camera, Mic, Monitor, Smartphone, LayoutGrid, LogOut } from 'lucide-react';
import '@radix-ui/themes/styles.css';
import './style.css';

const assets = '/visual-direction/assets/';
const sourceLinks = {
  radix:'https://www.radix-ui.com/themes/docs/overview/getting-started',
  hh:'https://hh.kz/', enbek:'https://www.enbek.kz/ru', workable:'https://www.workable.com/',
};
function Logo(){return <svg className="logo" role="img" aria-label="Open Consulting" viewBox="40 373 895 227"><image href={assets+'logo-white.png'} width="1024" height="1024"/></svg>}

function App(){
  const [tab,setTab]=useState('home');
  const [device,setDevice]=useState('desktop');
  const [dialog,setDialog]=useState(null);
  const [mobileMenu,setMobileMenu]=useState(false);
  const [profession,setProfession]=useState('');
  const [city,setCity]=useState('all');
  const [saved,setSaved]=useState(false);
  const [consent,setConsent]=useState(false);
  const [language,setLanguage]=useState('ru');
  const announce=(title,body)=>setDialog({title,body});
  const go=(hash)=>document.getElementById(hash)?.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});
  return <Theme accentColor="red" grayColor="slate" radius="medium" panelBackground="solid">
    <Tabs.Root value={tab} onValueChange={setTab}>
      <div className="board-bar">
        <a href="/" className="back-link" aria-label="Вернуться к карте продукта">OC <span>/ Визуальное направление</span></a>
        <Tabs.List className="board-tabs" aria-label="Разделы визуального образца">
          <Tabs.Trigger value="home">Главная</Tabs.Trigger>
          <Tabs.Trigger value="workspace">Кабинет</Tabs.Trigger>
          <Tabs.Trigger value="foundation">Референсы и стиль</Tabs.Trigger>
        </Tabs.List>
        <span className="board-version">02 / Образец для обсуждения</span>
      </div>
      <div className="board-caption">
        <span>Современный деловой · гостиничный сектор · Казахстан → Турция</span>
        {tab!=='foundation'&&<SegmentedControl.Root value={device} onValueChange={v=>v&&setDevice(v)} size="1" aria-label="Размер макета">
          <SegmentedControl.Item value="desktop"><Monitor size={15}/><span>Компьютер</span></SegmentedControl.Item>
          <SegmentedControl.Item value="mobile"><Smartphone size={15}/><span>Телефон</span></SegmentedControl.Item>
        </SegmentedControl.Root>}
      </div>
      <Tabs.Content value="home">
        <div className={'preview '+device}>
          <header className="site-header">
            <Logo/>
            <nav className="site-nav" aria-label="Основная навигация">
              <Button variant="ghost" color="gray" onClick={()=>go('vacancies')}>Вакансии</Button>
              <Button variant="ghost" color="gray" onClick={()=>go('how')}>Как это работает</Button>
              <Button variant="ghost" color="gray" onClick={()=>announce('Для работодателей','Здесь будет регистрация отеля: данные компании, проверка и размещение вакансии. Сейчас показано только визуальное направление.')}>Работодателям</Button>
            </nav>
            <div className="header-actions">
              <Select.Root value={language} onValueChange={v=>{setLanguage(v);if(v!=='ru')announce('Языковая версия','В этом образце тексты пока на русском. В полном интерфейсе предусмотрены русский, казахский, турецкий и английский языки.')}}>
                <Select.Trigger aria-label="Язык интерфейса" variant="ghost"/>
                <Select.Content><Select.Item value="ru">RU</Select.Item><Select.Item value="kz">KZ</Select.Item><Select.Item value="tr">TR</Select.Item><Select.Item value="en">EN</Select.Item></Select.Content>
              </Select.Root>
              <Button variant="outline" color="gray" className="login" onClick={()=>announce('Вход','В дальнейшем здесь будет вход по номеру телефона или ЭЦП. Визуальный образец не собирает персональные данные.')}>Войти <ArrowUpRight size={15}/></Button>
              <IconButton aria-label={mobileMenu?'Закрыть меню':'Открыть меню'} variant="ghost" color="gray" className="mobile-menu-trigger" onClick={()=>setMobileMenu(!mobileMenu)}>{mobileMenu?<X size={22}/>:<Menu size={22}/>}</IconButton>
            </div>
          </header>
          {mobileMenu&&<nav className="mobile-nav" aria-label="Мобильная навигация"><Button variant="ghost" onClick={()=>{go('vacancies');setMobileMenu(false)}}>Вакансии</Button><Button variant="ghost" onClick={()=>{go('how');setMobileMenu(false)}}>Как это работает</Button><Button variant="ghost" onClick={()=>announce('Для работодателей','Раздел отелей будет спроектирован на следующем этапе.')}>Работодателям</Button></nav>}
          <main className="public-main">
            <div className="hero-grid">
              <section className="hero" aria-labelledby="hero-title">
                <img className="hero-photo" src={assets+'hospitality-demo.png'} alt="Демонстрационное изображение сотрудников на стойке регистрации в отеле"/>
                <div className="hero-shade"/>
                <div className="hero-content">
                  <div className="hero-context"><span/>КАЗАХСТАН → ТУРЦИЯ</div>
                  <h1 id="hero-title">Ваша работа<br/>в отелях Турции<span className="red-dot">.</span></h1>
                  <p>Расскажите о себе, познакомьтесь с отелем<br className="desktop-break"/> и пройдите собеседование онлайн.</p>
                  <div className="hero-actions"><Button size="4" onClick={()=>{setTab('workspace');window.scrollTo({top:0,behavior:'instant'})}}>Создать анкету <ArrowRight size={19}/></Button><Button size="4" variant="outline" className="hero-secondary" onClick={()=>announce('Для работодателей','Отель сможет разместить вакансию, посмотреть анкеты и видео кандидатов, предложить онлайн-собеседование.')}>Я работодатель</Button></div>
                </div>
                <div className="hero-bottom"><span>Анкета с видео</span><span>Онлайн-собеседование</span><span>Сопровождение документов</span></div>
              </section>
              <aside className="ad-slot" aria-label="Рекламное место"><span className="eyebrow">Реклама</span><div className="ad-empty"><LayoutGrid strokeWidth={1.3} size={34}/><p>Место<br/>для объявлений</p><small>Рекламный блок<br/>пока не заполнен</small></div><span className="ad-slot-size">Отдельно от вакансий</span></aside>
            </div>
            <section id="vacancies" className="search-section">
              <div className="search-heading"><h2>Найдите свою вакансию</h2><span>Гостиничный сектор</span></div>
              <form className="job-search" onSubmit={e=>{e.preventDefault();announce('Поиск вакансий — пример',`Профессия: ${profession||'любая'}. Регион: ${city==='all'?'вся Турция':city}. Реальная база вакансий подключается после проектирования интерфейса.`)}}>
                <label className="search-field">Профессия или должность<TextField.Root size="3" placeholder="Например, официант" value={profession} onChange={e=>setProfession(e.target.value)}><TextField.Slot><Search size={19}/></TextField.Slot></TextField.Root></label>
                <label className="city-field">Город<Select.Root value={city} onValueChange={setCity}><Select.Trigger size="3" aria-label="Город работы"/><Select.Content><Select.Item value="all">Вся Турция</Select.Item><Select.Item value="Анталья">Анталья</Select.Item><Select.Item value="Стамбул">Стамбул</Select.Item><Select.Item value="Бодрум">Бодрум</Select.Item></Select.Content></Select.Root></label>
                <Button type="submit" size="3" className="search-button">Найти работу <Search size={18}/></Button>
              </form>
              <div className="professions">{['Ресепшен','Ресторан и сервис','Кухня','Уборка номеров'].map(p=><Button key={p} variant="ghost" color="gray" onClick={()=>setProfession(p)}>{p}<ArrowUpRight size={14}/></Button>)}</div>
            </section>
            <section id="how" className="how-section">
              <div className="section-heading"><div><span className="eyebrow">КАК ЭТО РАБОТАЕТ</span><h2>От анкеты — к знакомству с отелем.</h2></div><p>Понятный путь для кандидата.<br/>Один сервис для всех участников.</p></div>
              <div className="steps">{[
                ['01','Расскажите о себе','Опыт, языки, фотографии и короткая видеопрезентация.'],
                ['02','Пройдите собеседование','Отель, кандидат и представитель Open Consulting — онлайн.'],
                ['03','Выберите отель','Подтверждение места и сопровождение подготовки документов.']
              ].map(([n,title,text])=><article key={n}><span className="step-num">{n}</span><h3>{title}</h3><p>{text}</p></article>)}</div>
              <div className="video-feature">
                <div className="recording-preview" aria-label="Образец экрана записи презентации">
                  <div className="rec-top"><span><Video size={16}/> Видеопрезентация</span><span>20–40 сек.</span></div>
                  <div className="frame-guide"><UserRound size={76} strokeWidth={1}/><span>Кадр в полный рост</span></div>
                  <div className="teleprompter"><span>ПРИМЕР ВОПРОСА</span><strong>Какой у вас опыт работы?</strong></div>
                  <div className="rec-bottom"><Camera size={16}/><Mic size={16}/><span>Макет инструкции · камера выключена</span></div>
                </div>
                <div className="video-copy"><span className="eyebrow">ВАША ПРЕЗЕНТАЦИЯ</span><h2>Покажите себя.<br/>Своими словами.</h2><p>Вопросы на экране помогут рассказать о себе. Перед отправкой можно посмотреть запись и переснять её.</p><Button size="3" variant="outline" color="gray" onClick={()=>announce('Как записать презентацию','Это образец инструкции. В интерфейсе записи будут проверка камеры и микрофона, подсказка кадра в полный рост, вопросы, просмотр и пересъёмка. Обучающий видеоролик пока не добавлен.')}><Play size={17}/> Посмотреть инструкцию</Button></div>
              </div>
            </section>
          </main>
          <footer className="site-footer"><Logo/><span>Образец интерфейса · фото создано ИИ для демонстрации</span><Button variant="ghost" color="gray" onClick={()=>setTab('foundation')}>Основа дизайна <ArrowUpRight size={15}/></Button></footer>
        </div>
      </Tabs.Content>
      <Tabs.Content value="workspace">
        <div className={'preview '+device}>
          <div className="workspace">
            <aside className="workspace-sidebar"><Logo/><span className="side-label">КАБИНЕТ КАНДИДАТА</span><nav aria-label="Навигация кабинета">{[[UserRound,'Моя анкета'],[Building2,'Вакансии'],[CalendarDays,'Собеседования'],[FileText,'Документы']].map(([Icon,label],i)=><Button key={label} variant={i===0?'soft':'ghost'} color={i===0?'red':'gray'} className={i===0?'active':''} onClick={()=>i===0?null:announce(label,'Здесь показан только образец оформления кабинета. Полный сценарий раздела будет спроектирован на следующих этапах.')}><Icon size={18}/>{label}</Button>)}</nav><div className="side-bottom"><span>Демонстрационный кабинет</span><Button variant="ghost" color="gray" onClick={()=>setTab('home')}><LogOut size={17}/> На главную</Button></div></aside>
            <main className="workspace-main">
              <header className="workspace-heading"><div><span className="eyebrow">МОЯ АНКЕТА</span><h1>Давайте познакомимся.</h1><p>Заполните профиль, чтобы отель мог узнать вас лучше.</p></div><Badge variant="outline" color="gray">Черновик · пример</Badge></header>
              <div className="workspace-grid">
                <div className="workspace-primary">
                  <section className="profile-progress"><div><strong>Продолжите заполнение</strong><span>3 из 6 разделов · демонстрация</span></div><Progress value={50} size="2" aria-label="В образце заполнены три из шести разделов"/><div className="progress-stages"><span><Check size={14}/> Данные</span><span><Check size={14}/> Фото</span><span><Check size={14}/> Языки</span><strong>Опыт →</strong></div></section>
                  <section className="profile-form"><div className="panel-title"><h2>Опыт работы</h2><span>Шаг 4 / 6</span></div><form onSubmit={e=>{e.preventDefault();setSaved(true)}}><div className="field-pair"><label>Должность<TextField.Root size="3" defaultValue="Официант" required onChange={()=>setSaved(false)}/></label><label>Стаж<Select.Root defaultValue="1-3"><Select.Trigger size="3" aria-label="Стаж работы"/><Select.Content><Select.Item value="0">Без опыта</Select.Item><Select.Item value="1-3">От 1 до 3 лет</Select.Item><Select.Item value="3+">Более 3 лет</Select.Item></Select.Content></Select.Root></label></div><label>Компания<TextField.Root size="3" placeholder="Название ресторана или отеля" onChange={()=>setSaved(false)}/></label><p className="field-hint">Укажите последний или наиболее подходящий опыт.</p><label className="checkbox-row"><Checkbox checked={consent} onCheckedChange={v=>setConsent(v===true)}/> Сейчас работаю на этой должности</label><div className="form-actions"><span role="status">{saved?'Сохранено только в этом образце':'Данные никуда не отправляются'}</span><Button type="submit" size="3">Сохранить <Check size={17}/></Button></div></form></section>
                  <section className="documents-panel"><div className="panel-title"><h2>Документы</h2><Badge color="gray" variant="soft">Пример статусов</Badge></div><Table.Root variant="surface"><Table.Header><Table.Row><Table.ColumnHeaderCell>Документ</Table.ColumnHeaderCell><Table.ColumnHeaderCell>Состояние</Table.ColumnHeaderCell></Table.Row></Table.Header><Table.Body><Table.Row><Table.RowHeaderCell>Паспорт</Table.RowHeaderCell><Table.Cell><Badge color="green"><CheckCircle2 size={13}/> Проверен</Badge></Table.Cell></Table.Row><Table.Row><Table.RowHeaderCell>Справка</Table.RowHeaderCell><Table.Cell><Badge color="amber"><Clock3 size={13}/> На проверке</Badge></Table.Cell></Table.Row><Table.Row><Table.RowHeaderCell>Дополнительный документ</Table.RowHeaderCell><Table.Cell><Badge color="gray">Не загружен</Badge></Table.Cell></Table.Row></Table.Body></Table.Root></section>
                </div>
                <aside className="workspace-secondary">
                  <section className="video-task"><span className="task-icon"><Video size={25}/></span><h2>Следом —<br/>видеопрезентация</h2><p>Коротко расскажите о себе. Вопросы появятся прямо на экране.</p><div className="task-details"><span>20–40 секунд</span><span>6 вопросов</span></div><Button size="3" variant="outline" onClick={()=>announce('Видеопрезентация','На следующем этапе спроектируем запись: разрешения камеры, кадр, вопросы, запись, просмотр, пересъёмка и отправка.')} >Как это устроено <ArrowRight size={16}/></Button></section>
                  <section className="interview-task"><div className="panel-title"><h2>Собеседования</h2><CalendarDays size={19}/></div><p>Запланированных встреч пока нет. Здесь появится время интервью после согласования с отелем.</p><div className="slots"><strong>0 / 3</strong><span>активных предложений<br/>в этом примере</span></div></section>
                  <div className="privacy-note"><FileText size={18}/><p>Доступ к документам зависит от роли и этапа отбора. В образце файлов нет.</p></div>
                </aside>
              </div>
            </main>
          </div>
        </div>
      </Tabs.Content>
      <Tabs.Content value="foundation"><Foundation/></Tabs.Content>
    </Tabs.Root>
    <Dialog.Root open={!!dialog} onOpenChange={open=>!open&&setDialog(null)}><Dialog.Content maxWidth="480px"><Dialog.Title>{dialog?.title}</Dialog.Title><Dialog.Description size="3">{dialog?.body}</Dialog.Description><div className="dialog-footer"><Dialog.Close><Button size="3">Понятно</Button></Dialog.Close></div></Dialog.Content></Dialog.Root>
  </Theme>
}

function Foundation(){return <main className="foundation">
  <section className="foundation-intro"><span className="eyebrow">ОСНОВА НАПРАВЛЕНИЯ</span><h1>Люди — на первом экране.<br/>Порядок — в рабочих процессах.</h1><p>Выразительная фотография для знакомства с сервисом. Чёткая сетка и готовые компоненты для анкет, проверок и собеседований.</p></section>
  <section className="references"><div className="section-heading"><h2>Конкретные референсы</h2><span>Страницы просмотрены 5 октября 2026</span></div><div className="reference-grid">{[
    ['HeadHunter','ref-hh.png',sourceLinks.hh,'Профессиональная фотография, два входа, заметное основное действие.','Применяем на главной: контекст профессии и иерархия действий.'],
    ['Enbek','ref-enbek.png',sourceLinks.enbek,'Поиск работы в центре сценария. Человек в рабочей среде.','Применяем в поиске: профессия, регион и понятная навигация.'],
    ['Workable','ref-workable.png',sourceLinks.workable,'Коммерческая подача: сильный заголовок и видимый пример продукта.','Применяем в кабинете: видимый следующий шаг и рабочее содержимое.']
  ].map(([name,img,url,take,note])=><article key={name}><a href={url} target="_blank" rel="noreferrer"><img src={assets+img} alt={'Просмотренный первый экран '+name}/><h3>{name}<ArrowUpRight size={18}/></h3></a><p>{take}</p><small>{note}</small></article>)}</div></section>
  <section className="style-grid"><div className="palette-section"><span className="eyebrow">ФИРМЕННАЯ ПАЛИТРА</span><h2>Красный задаёт действие.</h2><p>Тёмный графит — для навигации и контраста. Светлая поверхность — для чтения и работы.</p><div className="swatches">{[['#D92D24','Действие'],['#1B242C','Графит'],['#F2F4F6','Фон'],['#FFFFFF','Поверхность'],['#5B6670','Вторичный текст']].map(([hex,label])=><div key={hex}><span style={{background:hex}}/><strong>{label}</strong><small>{hex}</small></div>)}</div><small>Цвет исходного знака сохранён. Более тёмный красный кнопок выбран для читаемости белого текста.</small></div><div className="type-section"><span className="eyebrow">IBM PLEX SANS · SIL OFL 1.1</span><h2>Читается на всех<br/>четырёх языках.</h2><div className="language-samples"><span lang="ru">Работа начинается со знакомства.</span><span lang="kk">Өзіңіз туралы айтып беріңіз.</span><span lang="tr">Kendinizden bahsedin.</span><span lang="en">Tell us about yourself.</span></div><div className="type-spec"><span>Заголовки / 600</span><span>Текст / 400</span><span>Подписи / 500</span></div><small>В шрифте проверены казахские Ә Ғ Қ Ң Ө Ұ Ү Һ І и турецкие İ ı Ğ Ş. Manrope исключён из-за неполного набора казахских символов.</small></div></section>
  <section className="component-section"><div><span className="eyebrow">ГОТОВЫЕ КОМПОНЕНТЫ</span><h2>Radix Themes + Lucide.</h2><p>В образце уже используются готовые кнопки, поля, списки выбора, переключатели, таблица, диалог, статусы и прогресс. Их оформление адаптировано к бренду.</p><div className="source-actions"><Button asChild variant="outline" color="gray"><a href={sourceLinks.radix} target="_blank" rel="noreferrer">Официальная библиотека <ArrowUpRight size={16}/></a></Button><Button asChild variant="outline" color="gray"><a href="https://ui.shadcn.com/docs/components/base/sidebar" target="_blank" rel="noreferrer">Референс навигации shadcn/ui <ArrowUpRight size={16}/></a></Button></div></div><div className="component-list"><span>Button / TextField / Select</span><span>Tabs / SegmentedControl / Dialog</span><span>Table / Checkbox / Badge / Progress</span><small>21st.dev рассмотрен как каталог. Его сторонний код в образец не переносился: сначала проверяем конкретное решение и лицензию.</small></div></section>
  <section className="principles"><article><h3>Композиция</h3><p>Контент до 1280 px. Крупная главная, плотный кабинет. На телефоне действия идут последовательно.</p></article><article><h3>Фотографии</h3><p>Люди во время работы в отеле. Настоящие материалы партнёров — после получения разрешений. Сейчас фото демонстрационное, создано ИИ.</p></article><article><h3>Движение</h3><p>Короткие реакции 160 ms. Без самопрокрутки и зацикленного декора. Учитываем настройку уменьшения анимации.</p></article></section>
  <footer className="foundation-footer"><span>Этап 02 · предложение для обсуждения, ещё не утверждено</span><a href="VISUAL_DIRECTION.md">Спецификация направления <ArrowUpRight size={15}/></a></footer>
</main>}
createRoot(document.getElementById('root')).render(<App/>);
