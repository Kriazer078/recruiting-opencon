import React, {useState, useRef} from 'react';
import {createRoot} from 'react-dom/client';
import {Theme, Button, IconButton, TextField, Select, Dialog, DropdownMenu, SegmentedControl} from '@radix-ui/themes';
import {Search, MapPin, ArrowRight, Video, Menu, ChevronDown} from 'lucide-react';
import '@radix-ui/themes/styles.css';
import './home.css';
import './home-options.css';

const photo='/visual-direction/home/assets/reception.jpg';
const logo='/visual-direction/assets/logo-white.png';
function Logo({light=false}){return <svg className="brand-logo" viewBox="40 373 895 227" role="img" aria-label="Open Consulting"><defs><clipPath id="wordmark-region"><rect x="395" y="373" width="600" height="240"/></clipPath></defs><image href={logo} width="1024" height="1024"/>{light&&<image className="dark-wordmark" clipPath="url(#wordmark-region)" href={logo} width="1024" height="1024"/>}</svg>}
const options={
  '1':{name:'Светлые блоки',description:'Белая шапка и отдельный белый блок анкеты. Каждый элемент имеет свою область.'},
  '2':{name:'Компактная навигация',description:'Два пути в переключателе. Блок анкеты приподнят над краем фотографии.'},
  '3':{name:'Красный акцент',description:'Тёмная шапка отделена от обложки. Анкета — самостоятельная красная полоса.'}
};

function App(){
  const [profession,setProfession]=useState('');
  const [city,setCity]=useState('Вся Турция');
  const [modal,setModal]=useState(null);
  const params=new URLSearchParams(location.search);
  const comparing=params.get('compare')==='1';
  const [variant,setVariant]=useState(options[params.get('variant')]?params.get('variant'):comparing?'1':'original');
  const light=variant==='1'||variant==='2';
  const changeVariant=v=>{setVariant(v);const p=new URLSearchParams(location.search);p.set('variant',v);history.replaceState(null,'',location.pathname+'?'+p.toString()+location.hash)};
  const input=useRef(null);
  const show=(title,text)=>setModal({title,text});
  const employer=()=>show('Работодателям','В следующем шаге спроектируем отдельный вход для отеля: регистрация компании, проверка и размещение вакансий.');
  const profile=()=>show('Создать анкету','Следующий экран — регистрация кандидата. Затем: сведения о себе, фотографии и короткая видеопрезентация. Сейчас показан только первый экран.');
  const focusSearch=()=>input.current?.focus();
  const search=e=>{e.preventDefault();show('Поиск вакансий',`Профессия: ${profession.trim()||'любая'}. Место работы: ${city}. Это макет первого экрана; реальные вакансии ещё не подключены.`)};
  const profileBlock=<section className="profile-entry" aria-label="Создание анкеты">
    <div className="profile-copy"><Video size={29} strokeWidth={1.7}/><div><h2>Пусть отель познакомится с вами</h2><p>Создайте анкету и расскажите о своём опыте в коротком видео.</p></div></div>
    <Button size="3" variant={variant==='1'||variant==='2'?'solid':'outline'} color={variant==='1'?'red':'gray'} className="profile-button" onClick={profile}>Создать анкету <ArrowRight size={18}/></Button>
  </section>;
  return <Theme accentColor="red" grayColor="slate" radius="medium" className={'home-theme variant-'+variant}>
    {comparing&&<aside className="comparison-tools" aria-label="Сравнение оформления"><div><strong>Шапка и блок анкеты</strong><span>{options[variant]?.description}</span></div><SegmentedControl.Root value={variant} onValueChange={changeVariant} size="2" aria-label="Вариант оформления">{Object.entries(options).map(([key,o])=><SegmentedControl.Item key={key} value={key}>{key}. {o.name}</SegmentedControl.Item>)}</SegmentedControl.Root></aside>}
    <header className="site-header"><div className="header-inner">
      <a href="#home" className="brand" aria-label="Open Consulting — главная"><Logo light={light}/></a>
      <nav className="desktop-nav" aria-label="Главная навигация">
        {variant==='2'?<><SegmentedControl.Root value="candidate" onValueChange={v=>v==='hotel'?employer():focusSearch()} size="2" aria-label="Я хочу"><SegmentedControl.Item value="candidate">Ищу работу</SegmentedControl.Item><SegmentedControl.Item value="hotel">Я работодатель</SegmentedControl.Item></SegmentedControl.Root><Button variant="ghost" color="gray" className="nav-button" onClick={focusSearch}>Вакансии</Button></>:<>
        <Button variant="ghost" color="gray" className="nav-button selected" onClick={focusSearch}>Соискателям</Button>
        <Button variant="ghost" color="gray" className="nav-button" onClick={employer}>Работодателям</Button>
        <Button variant="ghost" color="gray" className="nav-button" onClick={focusSearch}>Вакансии</Button>
        </>}
      </nav>
      <div className="header-actions">
        <DropdownMenu.Root><DropdownMenu.Trigger><Button variant="ghost" color="gray" className="language-button" aria-label="Язык сайта: русский">RU <ChevronDown size={14}/></Button></DropdownMenu.Trigger><DropdownMenu.Content>{[['RU','Русский'],['KZ','Қазақша'],['TR','Türkçe'],['EN','English']].map(([code,name])=><DropdownMenu.Item key={code} onSelect={()=>code==='RU'?null:show(name,'Перевод интерфейса будет подготовлен после выбора оформления. Этот макет пока на русском.')}>{name}</DropdownMenu.Item>)}</DropdownMenu.Content></DropdownMenu.Root>
        <Button variant="outline" color="gray" className="login-button" onClick={()=>show('Войти','В следующем шаге спроектируем вход кандидата и работодателя. Авторизация пока не подключена.')}>Войти</Button>
        <DropdownMenu.Root><DropdownMenu.Trigger><IconButton variant="ghost" color="gray" className="mobile-menu" aria-label="Открыть меню"><Menu size={23}/></IconButton></DropdownMenu.Trigger><DropdownMenu.Content><DropdownMenu.Item onSelect={focusSearch}>Соискателям</DropdownMenu.Item><DropdownMenu.Item onSelect={employer}>Работодателям</DropdownMenu.Item><DropdownMenu.Item onSelect={focusSearch}>Вакансии</DropdownMenu.Item></DropdownMenu.Content></DropdownMenu.Root>
      </div>
    </div></header>

    <main id="home" className="home-shell">
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-photo"><img src={photo} alt="Сотрудники ресепшен за работой; стоковая фотография Rodrigo Salomon" fetchPriority="high"/></div>
        <div className="hero-shade"/>
        <div className="hero-content">
          <p className="hero-context">Для кандидатов из Казахстана</p>
          <h1 id="hero-title">Работа в отелях<br/>Турции<span className="brand-dot">.</span></h1>
          <p className="hero-description">Найдите подходящую вакансию и познакомьтесь<br className="desktop-break"/> с работодателем через анкету с видео.</p>
          <form className="job-search" onSubmit={search} aria-label="Поиск работы">
            <label className="profession-label"><span>Кем хотите работать?</span><TextField.Root ref={input} size="3" value={profession} onChange={e=>setProfession(e.target.value)} placeholder="Например, официант" aria-label="Профессия"><TextField.Slot><Search size={20}/></TextField.Slot></TextField.Root></label>
            <label className="city-label"><span>Город работы</span><Select.Root value={city} onValueChange={setCity}><Select.Trigger size="3" aria-label="Город работы"><span className="city-value"><MapPin size={19}/><span>{city}</span></span></Select.Trigger><Select.Content>{['Вся Турция','Анталья','Стамбул','Аланья'].map(v=><Select.Item key={v} value={v}>{v}</Select.Item>)}</Select.Content></Select.Root></label>
            <Button type="submit" size="4" className="search-button">Найти работу <ArrowRight size={19}/></Button>
          </form>
        </div>
        {variant==='original'&&profileBlock}
      </section>
      {variant!=='original'&&profileBlock}
      <footer className="preview-note"><span>Макет первого экрана · вакансии и вход пока не подключены</span><a href="https://pixabay.com/photos/receptionists-phone-call-hotel-5975962/" target="_blank" rel="noreferrer">Фото: Rodrigo Salomon / Pixabay</a></footer>
    </main>
    <Dialog.Root open={!!modal} onOpenChange={v=>!v&&setModal(null)}><Dialog.Content maxWidth="470px"><Dialog.Title>{modal?.title}</Dialog.Title><Dialog.Description size="3">{modal?.text}</Dialog.Description><div className="dialog-actions"><Dialog.Close><Button size="3">Понятно</Button></Dialog.Close></div></Dialog.Content></Dialog.Root>
  </Theme>;
}
createRoot(document.getElementById('root')).render(<App/>);
