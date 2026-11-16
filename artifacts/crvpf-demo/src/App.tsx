import { useEffect, useMemo, useRef, useState, type AnchorHTMLAttributes, type FormEvent } from 'react';
import { Route, Router as WouterRouter, Switch, useLocation } from 'wouter';
import {
  ArrowRight, BookOpen, ChevronDown, LayoutGrid,
  HandHeart, HeartHandshake, Home as HomeIcon, MapPin, Menu, MessageCircle,
  Search, Shield, ShieldCheck, Sparkles, Users, X, Mail, Phone,
} from 'lucide-react';
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaXTwitter, FaYoutube } from 'react-icons/fa6';
import { AnalyticsPage, AuditPage, HostingPage, InceptionPage, SupportPage } from './pages/impact-hub';

const APP_BASE_PATH=import.meta.env.BASE_URL.endsWith('/')?import.meta.env.BASE_URL:`${import.meta.env.BASE_URL}/`;
const CRVPF_LOGO_SOURCE='https://crvpf.org/wp-content/uploads/2025/01/CRPVF_Final_Logo-08.png';
const CRVPF_LOGO_URL=`${APP_BASE_PATH}crvpf-official-logo.png`;
const CRVPF_INTRO="Children's Rights and Violence Prevention Fund (CRVPF) is a child rights and social justice regional intermediary organization that partners with community organizations to prevent violence and sexual violence against children and young people, building their power to make the right choices and decisions, and facilitating safe and dignified employment opportunities. CRVPF operates in Uganda, Kenya, Tanzania and Ethiopia.";
const CRVPF_VISION='A world where children and young people are safe from violence and sexual violence in the places where they live, learn, play, and work.';
const CRVPF_MISSION='To advance the safety and rights of children and young people by working with community organizations through cluster partnerships.';
const CRVPF_GOAL='Create safe and empowering environments in schools, homes, and communities across Kenya, Uganda, Ethiopia, and Tanzania.';
const pageFiles:Record<string,string>={
  '/':'index.html','/about':'about.html','/programmes':'programmes.html',
  '/programmes/pvac':'pvac.html','/programmes/agpp':'agpp.html','/programmes/eydcd':'eydcd.html',
  '/programmes/coordinated':'coordinated.html','/programmes/joint':'joint.html',
  '/impact':'impact.html','/where-we-work':'where-we-work.html','/resources':'resources.html','/get-involved':'get-involved.html',
   '/publications':'publications.html','/inception':'inception.html','/audit':'audit.html','/analytics':'analytics.html','/hosting':'hosting.html',
   '/training':'training.html','/handover':'handover.html','/support':'support.html',
};
type FileLinkProps=Omit<AnchorHTMLAttributes<HTMLAnchorElement>,'href'>&{href:string};
function Link({href,...props}:FileLinkProps){
  const match=href.match(/^([^?#]*)(.*)$/);
  const route=match?.[1]||'/';
  const suffix=match?.[2]||'';
  const mapped=pageFiles[route];
  if(!mapped)return <a href={href.startsWith('/')?`${APP_BASE_PATH}${href.slice(1)}`:href} {...props}/>;
  const [file,defaultHash]=mapped.split('#');
  const target=`/${file}${suffix|| (defaultHash?`#${defaultHash}`:'')}`;
  return <a href={`${APP_BASE_PATH}${target.slice(1)}`} {...props}/>;
}
type Program = { slug:string; short:string; name:string; summary:string; details:string[] };
const programs:Program[]=[
 {slug:'/programmes/pvac',short:'PVAC',name:'Prevention of Violence against Children and Young People (pvac)',summary:'Violence against children and young people takes place at home, in schools, and in the community. Under the PVAC program, we partner with and strengthen the capacity of community organizations to deliver a holistic set of interventions. These include building the capabilities of both formal and informal structures to create safe and supportive environments for children and young people.',details:['Strengthening families’ capabilities through positive parenting and improved spousal relationships to create safe and nurturing environments for children and young people. We also increase access to financial services to help reduce the financial stress within families that can escalate violence against children and young people.','In schools, students, non-teaching staff, and teachers are provided with the necessary skills and knowledge to create environments free from all forms of violence, including bullying, corporal punishment, and inappropriate relationships with staff, to help facilitate successful learning.','In the community, safe spaces are created for young people who are not in school to come together and acquire life and income-generating skills, thereby equipping them with skills and knowledge for preventing and addressing violence and sexual violence.','Parents strengthened their parenting skills and spousal relationships using the Parenting for Respectability manual, a locally evidence-based parenting program developed by the Child Health Development Centre at Makerere University.']},
 {slug:'/programmes/agpp',short:'AGPP',name:'Adolescent Girls Power Program (AGPP)',summary:'The Adolescent Girls Power Program (AGPP) focuses on building power of adolescent girls, including young mothers, to enable them transform and change the structures that deny them choices and power. CRVPF community partners work with the girls to create safe spaces; platforms in the community where the girls come together to engage in dialogue with one another, and receive life skills, financial literacy, vocational training to generate their own income to reduce the likelihood of violence and sexual violence.',details:['During the COVID-19 pandemic the lives of adolescent girls were heavily impacted, with many young girls in the Sub-Saharan region becoming young mothers. As a result, CRVPF developed a special project in Kenya and Tanzania to address this increase. The Young Mothers Project (YMP) equips young mothers with a comprehensive set of life skills and vocational training designed to build their power, while also providing Early Childhood Development (ECD) services for their children aged 0-3 years.','Collectively the girls develop strategies and advocate for their rights for a life free from violence and sexual violence.']},
 {slug:'/programmes/eydcd',short:'EYDCD',name:'Empowering Youth Through Data and Community Development Program (EYDCD)',summary:'Empowering Youth through Data and Community Development (EYDCD) program is a five-year program led by Children’s Rights and Violence Prevention Fund (CVRPF) and gnuGrid CRB in partnership with Mastercard Foundation. The program aims to provide market-relevant skills, business development resources, and digital financial inclusion to empower young people in Uganda. Throughout its duration, the program will endeavour to reach 400,000 young people across the country (70% female) and create 250,000 dignified and fulfilling employment opportunities.',details:['Additionally, the program will strengthen the capacities of 200 community organizations to deliver training and capacity-building programs that link young people, including those in refugee and host communities, and people with disabilities to work opportunities.','By digitizing 3,000 youth-led Village Savings and Loan Associations (VSLAs) and creating digital wallets for their members, the program aims to enhance access to financial services and products from local financial institutions.']},
];
const pages=[
  ['/','Home'],['/about','About'],['/programmes','What We Fund'],['/map','Map'],['/stories','Stories'],['/contact','Contact'],['/programmes/pvac','PVAC'],
  ['/programmes/agpp','AGPP'],['/programmes/eydcd','EYDCD'],['/programmes/coordinated','Coordinated'],
  ['/programmes/joint','Joint'],['/impact','Impact & Stories'],['/where-we-work','Where We Work'],
  ['/resources','Resources'],['/get-involved','Get Involved'],['/publications','Publications'],
   ['/inception','Inception'],['/audit','Audit'],['/analytics','Analytics'],['/hosting','Hosting'],
    ['/training','Training'],['/handover','Handover'],['/support','Support'],
    ['/safeguarding','Safeguarding'],['/proposal','Proposal'],['/status','Status'],
    ['/uganda','Uganda'],['/kenya','Kenya'],['/tanzania','Tanzania'],['/ethiopia','Ethiopia'],
] as const;
const storyData=[
 {name:'Beatrice',country:'Uganda',program:'EYDCD',text:'Beatrice, 28, a graduate of Business and Administration, wife, and mother of two, was one of them. Despite her education, she struggled to find stable work. However, with resilience and a desire to create impact, she turned to a skill her mother had once taught her, basket weaving. Through the program, Beatrice and her peers received financial literacy training and formed a Village Savings and Loan Association (VSLA), which they named One Voice Savings Group. They now meet every Saturday, each saving at least UGX 1,000. Together, they opened a bank account, formalized leadership, and established a welfare fund, turning their group into a lifeline for women in moments of vulnerability. The women went on to form Kyisa Kya Maria Arts and Crafts Group, where Beatrice continues to train and mentor others.',quote:'We got a client, All Across Africa, who sends us designs. We weave the baskets and send them back to be exported. The money we earn helps, because when there are no orders, some women can’t afford to send their children to school.',href:'https://crvpf.org/baskets-bonds-and-bold-women-a-story-of-sisterhood-and-strength/'},
 {name:'The Dar-Girls',country:'Tanzania',program:'AGPP',text:'Mariam, Jennifer, Zawadi, and Francisa—four young girls, each with dreams of independence and wealth that went beyond money—were unaware of each other but were all introduced to KIWOHEDE’s program, supported by CRVPF, through various channels including neighbours, radio ads, posters, and more. When the girls, along with several other young women, joined the program, they were equipped with life skills from This Little Light of Mine, a manual developed by CRVPF to help adolescent girls make smart choices and informed decisions, which enable them to lead safe, dignified, and sustainable lives free from violence and sexual violence.',href:'https://crvpf.org/bold-movements/'},
 {name:'Joanita (Joanna) Nabagesera',country:'Uganda',program:'EYDCD',text:'The usually quiet grounds of Express Playground in Kyebando, Kampala, came alive one sunny afternoon in March as drums echoed across the field and young designers prepared backstage for the Pakasa Art and Fashion Showcase, held in celebration of International Women’s Day 2026. Led by Joanita (Joanna) Nabagesera, founder and CEO of Lulungi Couture and an alumna of the Empowering Youth Through Data and Community Development (EYDCD) program implemented by CRVPF, gnuGrid CRB and community partners, with support from Mastercard Foundation, the showcase brought together young designers, artists, community members, and local leaders to celebrate creativity as a pathway to entrepreneurship, inclusion, and economic opportunity for young women and youth in the community.',href:'https://crvpf.org/edition-2-2026/'},
 {name:'Doreen Ngobi',country:'Uganda',program:'AGPP',text:'Through the Safe Space intervention under CRVPF’s Adolescent Girls Power Program (AGPP), Doreen learned hairdressing, snack making, flower weaving, marketing, saving, and leadership skills alongside other girls and young mothers.',quote:'Just because you are a teen mother does not mean your life is over. You can still achieve your dreams and become someone in life.',href:'https://crvpf.org/edition-2-2026/'},
 {name:'Juma',country:'',program:'PVAC',text:'Through the Father on Duty movement under CRVPF’s Prevention of Violence against Children and Young People (PVAC) program, fathers gather in spaces where men speak openly with other men about parenting, relationships, pressure, anger, and responsibility.',quote:'Father on Duty taught me that being a man means caring, listening, and protecting my family without violence.',href:'https://crvpf.org/edition-2-2026/'},
 {name:'Priscilla Kirabo',country:'Uganda',program:'EYDCD',text:'EYDCD Youth Representative Priscilla Kirabo encouraged young people to use digital tools strategically to generate income and build livelihoods.',href:'https://crvpf.org/edition-2-2026/'},
];
const countries=['Uganda','Kenya','Tanzania','Ethiopia'];
const reportItems=['READ OUR 2025 ABRIDGED ANNUAL REPORT','Annual Report CRVPF 2025','Annual Report CRVPF 2024','Annual Report CRVPF 2023','Annual Report CRVPF 2022','Annual Report CRVPF 2021','Annual Report CRVPF 2020','Assessment Impact COVID 19','BOLD MOVEMENTS — Celebrating 10 years of impact!','Edition 2, 2026'];
const reportUrls=['https://drive.google.com/file/d/1Cy8YmNVu8h_7RjSkY8vwjebB3J-TYvTX/view?usp=drive_link','https://drive.google.com/file/d/10VWKaeQZ_f6WZPTD-_EHz46cw7kh-Pji/view','https://drive.google.com/file/d/16gdye6D8b7x4ZDH612-udJu9Z4OGf9LD/view?usp=drive_link','https://crvpf.org/wp-content/uploads/2025/02/CRVPFAnnualReport_2023_compressed.pdf','https://crvpf.org/wp-content/uploads/2025/02/CRVPFAnnualReport_2022.pdf','https://crvpf.org/wp-content/uploads/2025/02/CRVPFAnnualReport_2021.pdf','https://crvpf.org/wp-content/uploads/2025/02/CRVPFAnnualReport_2020.pdf','https://crvpf.org/wp-content/uploads/2025/08/CRVPF-Impact-of-COVID-report_2022.pdf','https://crvpf.org/bold-movements/','https://crvpf.org/edition-2-2026/'];
const programmeFilters=['All','PVAC','AGPP','EYDCD','Coordinated','Joint'];
const socialLinks=[
 {name:'Facebook',url:'https://www.facebook.com/CRVPF/',icon:FaFacebookF},
 {name:'LinkedIn',url:'https://www.linkedin.com/company/children-s-rights-and-violence-prevention-fund-crvpf/',icon:FaLinkedinIn},
 {name:'X',url:'https://x.com/crvpf1?s=21',icon:FaXTwitter},
 {name:'Instagram',url:'https://www.instagram.com/crvpf?igsh=MWI5ZjdqN2N1dTZ4Yw==',icon:FaInstagram},
 {name:'YouTube',url:'https://www.youtube.com/@childrensrightsandviolence3853',icon:FaYoutube},
];
type AdminStory={id:string;title:string;country:string;programme:string;story:string;status:string;anonymous?:boolean;audit?:string};
function loadAdminStories():AdminStory[]{try{const value=JSON.parse(localStorage.getItem('crvpf-admin-items')||'[]');if(!Array.isArray(value))return[];return value.map((item:any,index:number)=>typeof item==='string'?{id:`legacy-${index}`,title:item,country:'',programme:'',story:'',status:'Published'}:item).filter((item:any)=>item&&typeof item.title==='string')}catch{return[]}}

function App(){
 const [path,setPath]=useLocation();
 const [lang,setLang]=useState<'EN'|'SW'>(()=>(localStorage.getItem('crvpf-lang') as 'EN'|'SW')||'EN');
  const [showPageBack,setShowPageBack]=useState(false);
  const [showStickyCta,setShowStickyCta]=useState(false);
  const [menu,setMenu]=useState(false),[search,setSearch]=useState(false),[searchText,setSearchText]=useState('');
 const [donate,setDonate]=useState(false),[toast,setToast]=useState(''),[selectedCountry,setSelectedCountry]=useState('All'),[selectedProgram,setSelectedProgram]=useState('All');
  const [year,setYear]=useState(2026),[portalTab,setPortalTab]=useState('My Grants'),[login,setLogin]=useState(false);
  const [adminItems,setAdminItems]=useState<AdminStory[]>(loadAdminStories);
 const [pubModal,setPubModal]=useState('');
  const bottomTab=path==='/'?'home':path.startsWith('/programmes')?'programmes':path==='/map'||path==='/where-we-work'?'map':path==='/stories'||path==='/impact'?'stories':null;
 const notify=(s:string)=>{setToast(s);window.setTimeout(()=>setToast(''),4000)};
  useEffect(()=>{
    const updateStickyVisibility=()=>setShowStickyCta(window.scrollY>600);
    updateStickyVisibility();
    window.addEventListener('scroll',updateStickyVisibility,{passive:true});
    return()=>window.removeEventListener('scroll',updateStickyVisibility);
  },[]);
  useEffect(()=>{
    setShowStickyCta(window.scrollY>600);
  },[path]);
  useEffect(()=>{
    const canonicalPath=(pathname:string)=>{
      const base=APP_BASE_PATH==='/'?'':APP_BASE_PATH.replace(/\/$/,'');
      const relative=base&&pathname.startsWith(base)?pathname.slice(base.length)||'/':pathname;
      const normalized=relative.startsWith('/')?relative:`/${relative}`;
      const entry=Object.entries(pageFiles).find(([,file])=>`/${file.split('#')[0]}`===normalized);
      return entry?.[0]||(normalized==='/'?'/':normalized.replace(/\/$/,''));
    };
    try{
      const navigationRecord=JSON.parse(sessionStorage.getItem('crvpf-internal-navigation')||'null') as {from:string;to:string;time:number}|null;
      sessionStorage.removeItem('crvpf-internal-navigation');
      if(navigationRecord&&Date.now()-navigationRecord.time<15000&&navigationRecord.to===canonicalPath(window.location.pathname)&&navigationRecord.from!==navigationRecord.to)setShowPageBack(true);
    }catch{try{sessionStorage.removeItem('crvpf-internal-navigation')}catch{}}
    const recordNavigation=(event:MouseEvent)=>{
      if(event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
      const target=event.target;
      if(!(target instanceof Element))return;
      const anchor=target.closest<HTMLAnchorElement>('a[href]');
      if(!anchor||anchor.target==='_blank'||anchor.hasAttribute('download'))return;
      const url=new URL(anchor.href,window.location.href);
      if(url.origin!==window.location.origin)return;
      const base=APP_BASE_PATH==='/'?'':APP_BASE_PATH.replace(/\/$/,'');
      if(base&&!url.pathname.startsWith(`${base}/`)&&url.pathname!==base)return;
      const destination=canonicalPath(url.pathname);
      const current=canonicalPath(window.location.pathname);
      if(destination===current)return;
      try{sessionStorage.setItem('crvpf-internal-navigation',JSON.stringify({from:current,to:destination,time:Date.now()}))}catch{}
    };
    document.addEventListener('click',recordNavigation,true);
    return()=>document.removeEventListener('click',recordNavigation,true);
  },[]);
 useEffect(()=>{setMenu(false);if(window.location.hash){const id=decodeURIComponent(window.location.hash.slice(1));requestAnimationFrame(()=>document.getElementById(id)?.scrollIntoView({block:'start'}))}},[path]);
 useEffect(()=>{localStorage.setItem('crvpf-lang',lang)},[lang]);
 useEffect(()=>{
   if(!window.matchMedia('(prefers-reduced-motion: no-preference)').matches)return;
   const selector='.soft-card,.program-card,.story-card,.archive-card,.impact-card,.result-card,.home-reach-card,.home-programme-card,.home-story-card,.home-voice-card,.home-partner-card,.home-resource-card,.country-card';
   const observer='IntersectionObserver' in window?new IntersectionObserver(entries=>{
     entries.forEach(entry=>{
       if(entry.isIntersecting){
         entry.target.classList.add('is-revealed');
         observer?.unobserve(entry.target);
       }
     });
   },{threshold:.12}):null;
   const revealCards=()=>{
     document.querySelectorAll<HTMLElement>(selector).forEach(card=>{
       if(card.hasAttribute('data-scroll-reveal'))return;
       card.setAttribute('data-scroll-reveal','');
       if(observer)observer.observe(card);else card.classList.add('is-revealed');
     });
   };
   revealCards();
   const mutationObserver=new MutationObserver(revealCards);
   mutationObserver.observe(document.querySelector('.app-shell')||document.body,{childList:true,subtree:true});
   return()=>{mutationObserver.disconnect();observer?.disconnect()};
 },[path]);
  const filteredPages=useMemo(()=>{
    const source=[...pages.map(([url,label])=>({url,label,text:`${url} ${label} ${programs.find(p=>p.slug===url)?.name||''}`})),...programs.map(p=>({url:p.slug,label:p.short,text:`${p.name} ${p.summary} ${p.details.join(' ')}`})),{url:'/programmes/coordinated',label:'Coordinated',text:`${approachContent.coordinated.title} ${approachContent.coordinated.summary}`}, {url:'/programmes/joint',label:'Joint',text:`${approachContent.joint.title} ${approachContent.joint.summary}`},...storyData.map(s=>({url:`/impact#story-${s.name.toLowerCase().replaceAll(' ','-')}`,label:s.name,text:`${s.name} ${s.country} ${s.program} ${s.text}`})),...countries.map(c=>({url:`/impact#filter-country-${c.toLowerCase()}`,label:c,text:c}))];
   const q=searchText.trim().toLowerCase();return q?source.filter(x=>x.text.toLowerCase().includes(q)).filter((x,i,a)=>a.findIndex(y=>y.url===x.url&&y.label===x.label)===i):pages.map(([url,label])=>({url,label}));
 },[searchText]);
 const donateAction=()=>setDonate(true);
   const footer=<Footer/>;
 return <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/,'')}>
  <div className="app-shell">
      <div className="top-banner" data-testid="text-demo-banner">Demo Concept - Final content, images and stories to be approved by CRVPF</div>
      <div className="latest-alert-bar low-network-banner"><strong>Latest: 2026 Annual Report Coming Soon</strong><Link href="/resources">→ View Resources</Link></div>
     <LowNetworkBanner />
       <Header path={path} lang={lang} menuOpen={menu} onLanguage={setLang} onSearch={()=>setSearch(true)} onMenu={()=>setMenu(v=>!v)} />
      <PageNavigation path={path} showBack={showPageBack}/>
      {menu&&<MobileDrawer path={path} lang={lang} onLanguage={setLang} onClose={()=>setMenu(false)} onSearch={()=>{setMenu(false);setSearch(true)}}/>}
   <Switch>
       <Route path="/"><Home lang={lang}/></Route>
    <Route path="/about"><About /></Route>
     <Route path="/programmes"><ProgrammesHub /></Route>
    <Route path="/programmes/pvac"><ProgrammeDetail slug="/programmes/pvac" notify={notify}/></Route>
    <Route path="/programmes/agpp"><ProgrammeDetail slug="/programmes/agpp" notify={notify}/></Route>
    <Route path="/programmes/eydcd"><ProgrammeDetail slug="/programmes/eydcd" notify={notify}/></Route>
    <Route path="/programmes/coordinated"><ProgrammeDetail slug="/programmes/coordinated" notify={notify}/></Route>
    <Route path="/programmes/joint"><ProgrammeDetail slug="/programmes/joint" notify={notify}/></Route>
    <Route path="/impact"><Impact country={selectedCountry} setCountry={setSelectedCountry} program={selectedProgram} setProgram={setSelectedProgram}/></Route>
     <Route path="/stories"><Impact country={selectedCountry} setCountry={setSelectedCountry} program={selectedProgram} setProgram={setSelectedProgram}/></Route>
     <Route path="/where-we-work"><WhereWeWorkPage /></Route>
      <Route path="/map"><WhereWeWorkPage /></Route>
     <Route path="/resources"><ResourcesPage /></Route>
     <Route path="/get-involved"><GetInvolved onDonate={donateAction} notify={notify}/></Route>
     <Route path="/inception"><InceptionPage /></Route>
     <Route path="/audit"><AuditPage /></Route>
     <Route path="/analytics"><AnalyticsPage /></Route>
     <Route path="/hosting"><HostingPage /></Route>
     <Route path="/support"><SupportPage /></Route>
      <Route path="/safeguarding"><SafeguardingPage notify={notify}/></Route>
      <Route path="/uganda"><CountryPage country="Uganda"/></Route>
      <Route path="/kenya"><CountryPage country="Kenya"/></Route>
      <Route path="/tanzania"><CountryPage country="Tanzania"/></Route>
      <Route path="/ethiopia"><CountryPage country="Ethiopia"/></Route>
      <Route path="/proposal"><ProposalPage/></Route>
      <Route path="/status"><StatusPage/></Route>
    <Route path="/annual-report-2026"><Annual notify={notify}/></Route>
    <Route path="/partners"><Partners tab={portalTab} setTab={setPortalTab} login={login} setLogin={setLogin} notify={notify}/></Route>
     <Route path="/dashboard"><Dashboard year={year} setYear={setYear} notify={notify}/></Route>
     <Route path="/admin-demo"><Admin items={adminItems} onPublish={(item)=>{const next=[item,...adminItems];setAdminItems(next);localStorage.setItem('crvpf-admin-items',JSON.stringify(next))}} notify={notify}/></Route>
      <Route path="/publications"><Publications notify={notify}/></Route>
    <Route path="/training"><Training notify={notify}/></Route>
    <Route path="/handover"><Handover notify={notify}/></Route>
    <Route path="/financial"><Financial /></Route>
    <Route path="/donor-portal"><DonorPortal notify={notify} onDonate={donateAction}/></Route>
    <Route path="/contact"><Contact notify={notify}/></Route>
     <Route path="/system"><SystemPage /></Route>
     <Route path="/how-we-deliver"><HowWeDeliver /></Route>
    <Route><NotFound /></Route>
   </Switch>
   {footer}
     <nav className="mobile-bottom" aria-label="Quick navigation">
       <Link href="/" className={bottomTab==='home'?'active':''} aria-current={bottomTab==='home'?'page':undefined} aria-label="Home" data-testid="mobile-home"><HomeIcon size={24}/><span>Home</span></Link>
       <Link href="/programmes" className={bottomTab==='programmes'?'active':''} aria-current={bottomTab==='programmes'?'page':undefined} aria-label="Programmes" data-testid="mobile-programmes"><LayoutGrid size={24}/><span>Programmes</span></Link>
       <Link href="/map" className={bottomTab==='map'?'active':''} aria-current={bottomTab==='map'?'page':undefined} aria-label="Map" data-testid="mobile-map"><MapPin size={24}/><span>Map</span></Link>
       <Link href="/stories" className={bottomTab==='stories'?'active':''} aria-current={bottomTab==='stories'?'page':undefined} aria-label="Stories" data-testid="mobile-stories"><BookOpen size={24}/><span>Stories</span></Link>
    </nav>
     {showStickyCta&&<nav className="mobile-sticky-cta home-sticky-with-partner" aria-label="Quick actions">
      <Link className="btn primary-action" href="/programmes">Explore Programmes</Link>
       <Link className="btn secondary-action" href="/get-involved#partner">Partner With Us</Link>
     </nav>}
    <WhatsAppContactButton/>
    {search&&<SearchModal value={searchText} setValue={setSearchText} results={filteredPages} onStorySelect={()=>{setSelectedCountry('All');setSelectedProgram('All')}} onClose={()=>{setSearch(false);setSearchText('')}}/>}
   {donate&&<DonateModal onClose={()=>setDonate(false)} notify={notify}/>}
    {pubModal&&<Modal title={pubModal} onClose={()=>setPubModal('')}><p>You selected “{pubModal}”. This standalone demo identifies the publication but does not provide a downloadable file.</p><div className="notice">No report download or publication action is available in this demo.</div></Modal>}
   {toast&&<div className="toast" role="status" data-testid="status-toast">{toast}</div>}
  </div>
 </WouterRouter>
}

function Header({path,lang,menuOpen,onLanguage,onSearch,onMenu}:{path:string;lang:'EN'|'SW';menuOpen:boolean;onLanguage:(v:'EN'|'SW')=>void;onSearch:()=>void;onMenu:()=>void}){
 const sw=lang==='SW';
  const link=(url:string,label:string,translated:string=label,active=false)=><Link href={url} className={`nav-link ${active?'active':''}`} aria-current={active?'page':undefined} data-testid={`nav-${label.toLowerCase().replaceAll(' ','-')}`}>{sw?translated:label}</Link>;
 return <header className="site-header"><div className="header-inner">
     <Link href="/" className="brand" aria-label="CRVPF home" data-testid="link-brand"><img className="brand-logo" src={CRVPF_LOGO_URL} data-source={CRVPF_LOGO_SOURCE} alt="CRVPF logo" width="11309" height="4010" fetchPriority="high" decoding="async"/></Link>
  <nav className="desktop-nav" aria-label="Main navigation">
       {link('/','Home','Nyumbani',path==='/')}
        <div className="program-wrap"><Link href="/programmes" className={`nav-link ${path.startsWith('/programmes')?'active':''}`} aria-current={path.startsWith('/programmes')?'page':undefined} aria-haspopup="true" data-testid="nav-programmes">{sw?'Programu':'Programmes'} <ChevronDown size={13} aria-hidden="true"/></Link><div className="program-menu"><Link href="/programmes" data-testid="nav-programmes-hub">All Programmes</Link>{[...programs.map(p=>({url:p.slug,label:`${p.short} · ${p.name}`})),{url:'/programmes/coordinated',label:'Coordinated Program Approach'},{url:'/programmes/joint',label:'Joint Action & Resourcing'}].map(p=><Link key={p.url} href={p.url} data-testid={`nav-program-${p.url.split('/').pop()}`}>{p.label}</Link>)}</div></div>
        {link('/map','Map','Ramani',path==='/map'||path==='/where-we-work')}
        {link('/stories','Stories','Hadithi',path==='/stories'||path==='/impact')}
        {link('/contact','Contact','Mawasiliano',path==='/contact')}
  </nav>
      <div className="header-actions"><button className="icon-btn" aria-label="Search site" onClick={onSearch} data-testid="button-search"><Search size={19}/></button><Link className="header-donate" data-current={path==='/get-involved'} href="/get-involved#donate" aria-label="Donate to CRVPF" data-testid="button-donate">{sw?'Changia':'Donate'}</Link><button className="icon-btn menu-toggle" aria-label={menuOpen?'Close navigation menu':'Open navigation menu'} aria-expanded={menuOpen} onClick={onMenu} data-testid="button-menu"><Menu size={24}/></button></div>
 </div></header>
}

function MobileDrawer({path,onClose,onSearch,lang,onLanguage}:{path:string;onClose:()=>void;onSearch:()=>void;lang:'EN'|'SW';onLanguage:(v:'EN'|'SW')=>void}){
  const [open,setOpen]=useState(false);const sw=lang==='SW';
  const closeRef=useRef(onClose);closeRef.current=onClose;
  useEffect(()=>{
    const opener=document.activeElement instanceof HTMLElement?document.activeElement:null;
    const onKey=(event:KeyboardEvent)=>{if(event.key==='Escape'){event.preventDefault();closeRef.current()}};
    window.addEventListener('keydown',onKey);
    document.querySelector<HTMLButtonElement>('.mobile-drawer [aria-label="Close menu"]')?.focus();
    return()=>{window.removeEventListener('keydown',onKey);opener?.focus({preventScroll:true})};
  },[]);
      return <div className="mobile-drawer" role="dialog" aria-modal="true" aria-label="Navigation menu" onClick={event=>{if(event.target===event.currentTarget)onClose()}}><div className="drawer-head"><Link href="/" className="brand" onClick={onClose}><img className="brand-logo" src={CRVPF_LOGO_URL} data-source={CRVPF_LOGO_SOURCE} alt="CRVPF logo" width="11309" height="4010" decoding="async"/></Link><button className="icon-btn" onClick={onClose} aria-label="Close menu" data-testid="button-close-menu"><X size={24}/></button></div>
    <div className="drawer-links">
     <button className="drawer-accordion" onClick={onSearch} data-testid="drawer-search"><span>{sw?'Tafuta':'Search'}</span><Search size={18}/></button>
     <Link href="/" className={path==='/'?'active':''} aria-current={path==='/'?'page':undefined} onClick={onClose} data-testid="drawer-home">{sw?'Nyumbani':'Home'}</Link>
     <button className={`drawer-accordion ${path.startsWith('/programmes')?'active':''}`} aria-current={path.startsWith('/programmes')?'page':undefined} onClick={()=>setOpen(!open)} aria-expanded={open} data-testid="drawer-programmes">{sw?'Programu':'Programmes'} <ChevronDown size={18}/></button>{open&&<div className="drawer-sub"><Link href="/programmes" onClick={onClose}>All Programmes</Link>{[...programs.map(p=>({url:p.slug,label:`${p.short} — ${p.name}`})),{url:'/programmes/coordinated',label:'Coordinated Program'},{url:'/programmes/joint',label:'Joint Action & Resourcing'}].map(p=><Link key={p.url} href={p.url} onClick={onClose}>{p.label}</Link>)}</div>}
     <Link href="/map" className={path==='/map'||path==='/where-we-work'?'active':''} aria-current={path==='/map'||path==='/where-we-work'?'page':undefined} onClick={onClose} data-testid="drawer-map">{sw?'Ramani':'Map'}</Link>
     <Link href="/stories" className={path==='/stories'||path==='/impact'?'active':''} aria-current={path==='/stories'||path==='/impact'?'page':undefined} onClick={onClose} data-testid="drawer-stories">{sw?'Hadithi':'Stories'}</Link>
     <Link href="/contact" className={path==='/contact'?'active':''} aria-current={path==='/contact'?'page':undefined} onClick={onClose} data-testid="drawer-contact">{sw?'Mawasiliano':'Contact'}</Link>
    </div>
     <div className="drawer-actions"><Link className={`drawer-donate-link ${path==='/get-involved'?'active':''}`} href="/get-involved#donate" onClick={onClose} aria-current={path==='/get-involved'?'page':undefined} aria-label="Donate to CRVPF">{sw?'Changia':'Donate'} <HandHeart size={16}/></Link><div className="lang-toggle"><button className={lang==='EN'?'selected':''} onClick={()=>onLanguage('EN')}>EN</button><button className={lang==='SW'?'selected':''} onClick={()=>onLanguage('SW')}>SW</button></div></div><SocialLinks className="drawer-social"/>
 </div>
}
function SocialLinks({className=''}:{className?:string}){return <div className={`social-links ${className}`}>{socialLinks.map(({name,url,icon:Icon})=><a key={name} href={url} target="_blank" rel="noopener noreferrer" aria-label={`CRVPF on ${name}`} title={name}><Icon size={16}/></a>)}</div>}
function Footer(){
  const[baseSize,setBaseSize]=useState(16);
  const[highContrast,setHighContrast]=useState(false);
  const[cookieAccepted,setCookieAccepted]=useState(()=>{try{return document.cookie.split('; ').some(cookie=>cookie==='crvpf-cookie-accepted=true')}catch{return false}});
  useEffect(()=>{document.documentElement.style.fontSize=`${baseSize}px`;document.body.style.fontSize=`${15*baseSize/16}px`;return()=>{document.body.style.fontSize=''}},[baseSize]);
  useEffect(()=>{document.documentElement.classList.toggle('high-contrast',highContrast);return()=>document.documentElement.classList.remove('high-contrast')},[highContrast]);
  return <footer className="site-footer"><div className="container">
    <div className="accessibility-strip" aria-label="Accessibility controls">
      <span>Language: English | Kiswahili (placeholder)</span>
      <span>Text Size</span>
      <button type="button" onClick={()=>setBaseSize(size=>Math.max(14,size-1))} aria-label="Decrease text size">A-</button>
      <button type="button" onClick={()=>setBaseSize(size=>Math.min(22,size+1))} aria-label="Increase text size">A+</button>
      <button type="button" aria-pressed={highContrast} onClick={()=>setHighContrast(value=>!value)}>High Contrast</button>
    </div>
    <div className="footer-grid">
      <div><Link href="/" className="brand footer-brand" aria-label="CRVPF home"><img className="brand-logo" src={CRVPF_LOGO_URL} data-source={CRVPF_LOGO_SOURCE} alt="CRVPF logo" width="11309" height="4010" loading="lazy" decoding="async"/></Link><p style={{maxWidth:300,marginTop:19}}>{CRVPF_INTRO}</p><Link className="footer-action-link" href="/get-involved#donate" aria-label="Donate to CRVPF">Donate <ArrowRight size={14}/></Link></div>
      <div><h4>Explore</h4><Link href="/about">About CRVPF</Link><Link href="/impact">Impact &amp; stories</Link><Link href="/where-we-work">Where We Work</Link><Link href="/resources">Resource Centre</Link><Link href="/publications">Publications</Link><Link href="/annual-report-2026">Annual Report 2026</Link><Link href="/get-involved">Get Involved</Link><Link href="/system">How This System Works</Link><Link href="/how-we-deliver">How We Deliver</Link><Link href="/inception">Inception</Link><Link href="/audit">Audit</Link><Link href="/analytics">Analytics</Link><Link href="/hosting">Hosting</Link><Link href="/training">Training</Link><Link href="/handover">Handover</Link><Link href="/support">Support</Link></div>
      <div><h4>Programmes</h4><Link href="/programmes">All Programmes</Link>{programs.map(p=><Link key={p.slug} href={p.slug}>{p.short}</Link>)}<Link href="/programmes/coordinated">Coordinated</Link><Link href="/programmes/joint">Joint</Link><Link href="/publications">Publications</Link></div>
      <div><h4>Contact</h4><p><a href="tel:+256393216519">(+256) 393 216 519</a><a href="mailto:info@crvpf.org">info@crvpf.org</a>Block 244, Plot 5170, Diplomate Road, Muyenga, Kampala, Uganda</p><a className="footer-action-link whatsapp-link" href="https://wa.me/256393216519" target="_blank" rel="noopener noreferrer">WhatsApp CRVPF <ArrowRight size={14}/></a><Link className="footer-message-link" href="/get-involved#contact">Send a message <ArrowRight size={13}/></Link><Link href="/support">Support</Link></div>
    </div>
    <SocialLinks className="footer-social"/>
    <div className="notice footer-management-note">Final site will be built in WordPress on i3C, using Elementor. How staff will manage it: WordPress + Elementor templates for Programme, Story, Resource, Event. Plugins: Yoast SEO, WPForms, Mailchimp for WP, GA4 + Search Console, UpdraftPlus Backups, Wordfence Security. Roles: Admin (IT) | Editor (Comms) | Author (Programme Staff). Staging for CRVPF approval before live. CRVPF owns everything.</div>
    <ElitechStudios/>
    <p className="footer-sla">Support: Urgent 24h / Routine 48-72h - WhatsApp / Email. Contact details to be confirmed with CRVPF.</p>
    <p className="footer-last-updated">Last updated: November 2026</p>
    {!cookieAccepted&&<div className="notice footer-cookie-notice" role="region" aria-label="Cookie notice">
      <span>We use cookies to improve your experience.</span>
      <button type="button" className="btn btn-outline" onClick={()=>{try{document.cookie='crvpf-cookie-accepted=true; Max-Age=31536000; Path=/; SameSite=Lax'}catch{}setCookieAccepted(true)}}>Accept</button>
    </div>}
    <div className="footer-bottom">Demo on Replit | Final on WordPress + Elementor + i3C | Powered by ELITECH TECHNOLOGIES - Building systems that work for real people in Uganda.</div>
     <p className="footer-operations">DEMO — TOR Deliverable 3. Content sourced from crvpf.org; publishing requires CRVPF Communications approval. For content removal or correction requests, contact <a href="mailto:info@crvpf.org">info@crvpf.org</a>.</p>
  </div></footer>
}
function PageNavigation({path,showBack}:{path:string;showBack:boolean}){
  if(path==='/')return null;
  const programmeOrder=['/programmes/pvac','/programmes/agpp','/programmes/eydcd','/programmes/coordinated','/programmes/joint'];
  const programmeNames:Record<string,string>={'/programmes/pvac':'PVAC','/programmes/agpp':'AGPP','/programmes/eydcd':'EYDCD','/programmes/coordinated':'Coordinated','/programmes/joint':'Joint'};
   const pageNames:Record<string,string>={'/about':'About','/programmes':'What We Fund','/impact':'Impact','/stories':'Stories','/where-we-work':'Where We Work','/map':'Map','/resources':'Resources','/get-involved':'Get Involved','/annual-report-2026':'Annual Report 2026','/partners':'Partner Portal','/dashboard':'Dashboard','/admin-demo':'Safeguarding CMS','/publications':'Publications','/inception':'Inception','/audit':'Audit','/analytics':'Analytics','/hosting':'Hosting','/training':'Training','/handover':'Handover','/support':'Support','/financial':'Financial','/donor-portal':'Donor Portal','/contact':'Contact','/system':'How This System Works','/how-we-deliver':'How We Deliver','/safeguarding':'Safeguarding','/proposal':'Proposal','/status':'Status','/uganda':'Uganda','/kenya':'Kenya','/tanzania':'Tanzania','/ethiopia':'Ethiopia'};
  const isProgramme=programmeOrder.includes(path);
  const current=programmeNames[path]||pageNames[path]||'CRVPF';
  return <div className="page-navigation">
    <div className="page-navigation-line">
      {showBack&&<button type="button" className="breadcrumb-back-button" aria-label="Go back to previous page" data-testid="breadcrumb-back" onClick={()=>window.history.back()}>←</button>}
      <nav className="page-breadcrumb" aria-label="Breadcrumb">
        <Link href="/" aria-label="Home">Home</Link><span aria-hidden="true">›</span>
        {isProgramme&&<><Link href="/programmes">Our Work</Link><span aria-hidden="true">›</span></>}
        <span aria-current="page">{current}</span>
      </nav>
    </div>
  </div>
}
function SectionHead({eyebrow,title,description}:{eyebrow:string;title:string;description?:string}){return <div className="section-head"><div><div className="section-kicker">{eyebrow}</div><h2>{title}</h2></div>{description&&<p>{description}</p>}</div>}
function Home({lang}:{lang:'EN'|'SW'}){
  const sw=lang==='SW';
  const [storyProgram,setStoryProgram]=useState('All');
  const [storyCategory,setStoryCategory]=useState('All');
  const [storyCountry,setStoryCountry]=useState('All');
  const [storyPage,setStoryPage]=useState(0);
  const [storyQuery,setStoryQuery]=useState('');
  const [newsletterEmail,setNewsletterEmail]=useState('');
  const [newsletterDone,setNewsletterDone]=useState(false);
  const [concernOpen,setConcernOpen]=useState(false);
  const [concernSent,setConcernSent]=useState(false);
  const [tourOpen,setTourOpen]=useState(false);
  const [partnerOpen,setPartnerOpen]=useState(false);
  const [partnerSent,setPartnerSent]=useState(false);
  const [wpMenuItem,setWpMenuItem]=useState('Programmes');
  const [wpTitle,setWpTitle]=useState('Adolescent Girls Power Program');
  const [wpDescription,setWpDescription]=useState('Safe Spaces, power and protection for 10,000 Girls...');
  const [wpCountry,setWpCountry]=useState('Uganda');
  const [wpImageName,setWpImageName]=useState('');
  const [wpStatus,setWpStatus]=useState('');
  const [wpPreview,setWpPreview]=useState({title:'Adolescent Girls Power Program',description:'Safe Spaces, power and protection for 10,000 Girls...',country:'Uganda'});
  const [reportInfoOpen,setReportInfoOpen]=useState(false);
  const [shareMessage,setShareMessage]=useState('');
  const [faqSearchText,setFaqSearchText]=useState('');
  const [faqSearch,setFaqSearch]=useState('');
  const [urgentUpdateOn,setUrgentUpdateOn]=useState(()=>{try{return localStorage.getItem('crvpf-urgent-update-enabled')==='true'}catch{return false}});
  const filteredStories=storyData.filter(story=>
    (storyProgram==='All'||story.program===storyProgram)&&
    (storyCategory==='All'||story.program===storyCategory||storyCategory==='Story')&&
    (storyCountry==='All'||story.country===storyCountry)&&
    `${story.name} ${story.program} ${story.country} ${story.text}`.toLowerCase().includes(storyQuery.trim().toLowerCase())
  );
  const visibleHomeStories=filteredStories.slice(storyPage*3,storyPage*3+3);
  const changeStoryFilter=(type:'program'|'country',value:string)=>{setStoryPage(0);if(type==='program'){setStoryProgram(value);if(['EYDCD','AGPP','PVAC','Coordinated','Joint'].includes(storyCategory))setStoryCategory('All')}else setStoryCountry(value)};
  const changeStoryCategory=(value:string)=>{setStoryPage(0);setStoryCategory(value);setStoryProgram(['EYDCD','AGPP','PVAC','Coordinated','Joint'].includes(value)?value:'All')};
  const toggleUrgentUpdate=()=>setUrgentUpdateOn(value=>{const next=!value;try{localStorage.setItem('crvpf-urgent-update-enabled',String(next))}catch{}return next});
  const faqs=[
    {question:'What does CRVPF do?',answer:'CRVPF partners with community organisations to prevent violence and advance children’s rights.'},
    {question:'How do I partner with CRVPF?',answer:'CRVPF works with community organisations through cluster partnerships. Contact CRVPF to discuss partnering.'},
    {question:'Where does CRVPF work?',answer:'CRVPF operates in Uganda, Kenya, Tanzania and Ethiopia.'},
    {question:'How do I apply for a grant?',answer:'Grant application details are not available in this demo. Contact CRVPF for current information.'},
    {question:'How does CRVPF protect children and young people?',answer:'CRVPF prioritises consent, safeguarding checks and Communications approval before stories are published.'},
  ];
  const visibleFaqs=faqs.filter(item=>`${item.question} ${item.answer}`.toLowerCase().includes(faqSearch.trim().toLowerCase()));
  const submitNewsletter=(event:FormEvent<HTMLFormElement>)=>{event.preventDefault();setNewsletterDone(true)};
  const shareReport=async(channel:'WhatsApp'|'Email'|'Social')=>{
    const url=`${window.location.origin}${APP_BASE_PATH}publications.html#publication-annual-report-2026`;
    const title='Annual Report 2026 - To be confirmed with CRVPF';
    if(channel==='WhatsApp'){window.open(`https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`,'_blank','noopener,noreferrer');return}
    if(channel==='Email'){window.location.href=`mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`;return}
    try{if(navigator.share)await navigator.share({title,url});else{await navigator.clipboard.writeText(url);setShareMessage('Report link copied to clipboard.')}}catch{setShareMessage('Sharing was cancelled or is not available.')}
  };
  return <main className="home-part-one">
    <div className="home-urgent-update-wrap">
      {urgentUpdateOn
        ?<section className="soft-card home-urgent-update-slot" aria-live="polite">
          <div><strong>Urgent Update: [Placeholder text]</strong><Link className="text-action-link" href="/resources">→ Learn More</Link><small>Staff can update this in WordPress.</small></div>
          <button type="button" className="text-action-link" aria-pressed="true" onClick={toggleUrgentUpdate}>Turn off demo preview</button>
        </section>
        :<div className="home-urgent-update-off">
          <small>Urgent update: Off</small>
          <button type="button" className="text-action-link" aria-pressed="false" onClick={toggleUrgentUpdate}>Staff preview: Enable</button>
          <small>Staff can update this in WordPress.</small>
        </div>}
    </div>
    <section className="home-hero">
      <div className="home-hero-copy">
         <h1>{sw?'Kuzuia Ukatili. Kujenga Nguvu. Kuunda Mustakabali Salama.':'Preventing Violence. Building Power. Creating Safe Futures.'}</h1>
         <p>{sw?'Tunawawezesha wasichana na vijana kuongoza katika kuzuia ukatili Afrika Mashariki — kwa kutumia data, utetezi na hatua za pamoja ili kuwalinda watoto na kumaliza ukatili.':'We resource girls and youth to lead violence prevention across East Africa — using data, advocacy, and collective action to protect children and end violence for good.'}</p>
        <div className="home-hero-actions">
           <Link className="btn primary-action home-btn-primary" href="/programmes" data-testid="button-home-programmes">{sw?'Programu Zetu':'Explore Programmes'} <ArrowRight size={17}/></Link>
           <Link className="text-action-link hero-text-link" href="/where-we-work" data-testid="link-home-eydcd">{sw?'Tafuta EYDCD Karibu Nawe':'Find EYDCD Near You'} <ArrowRight size={15}/></Link>
           <Link className="text-action-link hero-text-link" href="/get-involved" data-testid="link-home-partner">{sw?'Shirikiana Nasi':'Partner With Us'} <ArrowRight size={15}/></Link>
            <button type="button" className="text-action-link hero-text-link" onClick={()=>setTourOpen(true)}>10-Min Tour For Evaluators <ArrowRight size={15}/></button>
        </div>
        <div className="home-hero-trust-chips" aria-label="Safeguarding and delivery notes">
           <span>Safeguarding-Safe • Country-Level Only • To Be Verified With CRVPF</span>
          <span>Mobile-First • TOR 98% Demo</span>
        </div>
      </div>
      <div className="home-hero-image">
       <SourcePhoto src={`${APP_BASE_PATH}crvpf-home-hero.jpg`} alt="Three smiling children in school uniform, from CRVPF" className="hero-photo"/>
      </div>
    </section>
    <section className="home-proof-trust-bar" aria-label="CRVPF Reach 2021 to 2023">
      <div><strong><ScrollCount value={178591}/></strong><span>Participants</span></div>
      <div><strong><ScrollCount value={4}/></strong><span>Countries</span></div>
      <div><strong><ScrollCount value={250} prefix="+"/></strong><span>Community Partners</span></div>
      <div><strong><ScrollCount value={10000}/></strong><span>Girls in Safe Spaces</span></div>
    </section>
    <p className="home-performance-note"><strong>Performance target (verification pending):</strong> Loads in under 3 seconds on 3G. Images under 200KB. Tested on mobile in Kampala. Low-data mode available. <small>These performance statements have not been independently verified in this demo.</small></p>
    <section className="home-section home-community-partners" id="community-partners">
      <div className="home-section-heading">
        <span className="home-section-kicker">Partnerships</span>
        <h2>Our Partners &amp; Community</h2>
      </div>
      <div className="home-partners-grid">
        {['Community Organisations','Youth Networks','Donors','Government Partners'].map(item=><article className="soft-card home-partner-card" key={item}>
          <div className="partner-placeholder-logo" role="img" aria-label={`${item} placeholder`}>Partner category placeholder</div>
          <h3>{item}</h3>
        </article>)}
      </div>
      <p className="home-partners-note">Logos to be confirmed with CRVPF Communications team.</p>
      <div className="home-story-grid home-partner-testimonials">
        {[1,2].map(item=><article className="home-voice-card" key={item}>
          <span className="home-consent-badge">Quote placeholder</span>
          <blockquote>Partner quote placeholder</blockquote>
        </article>)}
      </div>
    </section>
    <section className="home-section home-who-we-are" id="who-we-are">
      <div className="home-section-heading">
        <span className="home-section-kicker">About CRVPF</span>
        <h2>Who We Are</h2>
        <p>{CRVPF_INTRO}</p>
      </div>
      <div className="home-trust-bar" aria-label="CRVPF at a glance">
        <span><ShieldCheck size={17}/> Established April 2015 • Kampala, Uganda</span>
        <span><HeartHandshake size={17}/> Co-Created with Youth</span>
        <span><MapPin size={17}/> <ScrollCount value={4} className="home-trust-count"/> Countries + USA Office</span>
      </div>
      <div className="home-stats" aria-label="Demonstration impact statistics">
        <article className="home-stat-card">
          <span className="home-stat-value"><ScrollCount value={251}/></span>
          <strong>Partner Organisations</strong>
          <small>Demo Placeholder · To be confirmed with CRVPF</small>
        </article>
        <article className="home-stat-card">
          <span className="home-stat-value"><ScrollCount value={400000} suffix="+"/></span>
          <strong>Youth Reached</strong>
          <small>Demo Placeholder · To be confirmed with CRVPF</small>
        </article>
      </div>
    </section>
    <section className="home-section home-reach-section" id="our-reach-2021-2023">
      <div className="home-section-heading">
        <span className="home-section-kicker">Reach Through Our Partners</span>
        <h2 className="home-reach-heading">REACH THROUGH OUR PARTNERS: 2021 - 2023</h2>
      </div>
      <div className="home-reach-grid">
        {reachCards.map((item,index)=><article className={`home-reach-card reach-${index%3}`} key={item.value}>
          <strong><ScrollCount value={item.numeric} prefix={item.prefix}/></strong>
          <p>{item.label}</p>
        </article>)}
      </div>
      <p className="home-reach-source">Source: CRVPF Reach 2021-2023. To be verified with CRVPF Communications team before launch.</p>
      <p className="home-verification-note">Last updated: Demo - To be verified with CRVPF</p>
    </section>
    <section className="home-section home-programmes" id="programmes">
      <div className="home-section-heading">
        <span className="home-section-kicker">Our work</span>
        <h2>What We Fund</h2>
        <p>Five ways CRVPF and community partners work to prevent violence and build young people’s power.</p>
      </div>
      <div className="home-programme-grid">
        {homeProgrammeCards.map(programme=><article className="home-programme-card" key={programme.slug}>
          <span className="home-programme-code">{programme.code}</span>
          <h3>{programme.title}</h3>
          <p>{programme.description}</p>
          {programme.countries&&<div className="programme-country-tags" aria-label={`Countries: ${programme.countries.join(', ')}`}>{programme.countries.map(country=><span className="tag" key={country}>{country}</span>)}</div>}
          {programme.code==='COORDINATED'||programme.code==='JOINT'
            ?<Link href={programme.slug} className="btn btn-outline home-programme-view">View Programme <ArrowRight size={15}/></Link>
            :<><Link href="/programmes" className="programme-hub-tag">View Programme <ArrowRight size={13}/></Link><Link href={programme.slug} className="home-learn-link">Learn more <ArrowRight size={15}/></Link></>}
        </article>)}
      </div>
    </section>
    <section className="home-section home-grant-making" id="how-grant-making-works">
      <div className="home-section-heading">
        <span className="home-section-kicker">Partnership approach</span>
        <h2>How Grant-Making Works</h2>
        <p>CRVPF resources community organisations led by and for children and young people.</p>
      </div>
      <div className="home-programme-grid home-grant-steps">
        {['Apply','Partner','Grow'].map((step,index)=><article className="home-programme-card" key={step}>
          <span className="home-programme-code">Step {index+1}</span>
          <h3>{step}</h3>
        </article>)}
      </div>
      <div className="home-partner-journey-action"><Link className="btn primary-action" href="/get-involved#partner">Partner With Us <ArrowRight size={16}/></Link></div>
    </section>
    <section className="home-section home-where-we-work" id="where-we-work">
      <WhereWeWorkMap/>
    </section>
    <section className="home-section home-data-hub" id="crvpf-data-hub">
      <div className="home-section-heading">
        <span className="home-section-kicker">Country-level information</span>
        <h2>CRVPF Data Hub</h2>
      </div>
      <div className="home-proof-trust-bar home-data-hub-strip" aria-label="CRVPF country-level data">
        {countries.map(country=><div key={country}><strong>{country}</strong><span>Programmes: 5 | Focus: Children &amp; Youth</span></div>)}
      </div>
      <p className="home-verification-note">Country-level data only. No precise locations. Data to be verified by CRVPF.</p>
    </section>
    <section className="home-section home-youth-zone" id="youth-zone">
      <div className="home-section-heading">
        <span className="home-section-kicker">For young people</span>
        <h2>Youth Zone - For Young People</h2>
        <p>Built for young people on phones. Fast. Simple. Low-data.</p>
      </div>
      <div className="home-resource-grid">
        <article className="home-resource-card">
          <span className="home-resource-type">Youth Zone</span>
          <h3>Opportunities for Young People</h3>
          <p>Explore CRVPF programmes and available information.</p>
          <Link className="btn btn-outline" href="/programmes">View <ArrowRight size={15}/></Link>
        </article>
        <article className="home-resource-card">
          <span className="home-resource-type">EYDCD</span>
          <h3>EYDCD Map - Find Partners Near You</h3>
          <p>Explore country and cluster-level information only.</p>
          <Link className="btn btn-outline" href="/where-we-work">View <ArrowRight size={15}/></Link>
        </article>
        <article className="home-resource-card">
          <span className="home-resource-type">Stories</span>
          <h3>Youth Stories</h3>
          <p>Read stories published by CRVPF.</p>
          <Link className="btn btn-outline" href="/stories">View <ArrowRight size={15}/></Link>
        </article>
      </div>
    </section>
    <section className="home-section home-youth-voices" id="youth-voices">
      <div className="home-section-heading">
        <span className="home-section-kicker">Youth Voices</span>
        <h2>Stories of Change</h2>
        <p>These story cards are demonstration content and are not cleared for republication.</p>
      </div>
      <SectionPhoto file="IMG-20261114-WA2253_1794665428965.jpg" alt="A woman speaking with community members gathered outdoors." className="stories-section-photo"/>
      <div className="home-story-filters">
        <div className="home-story-filter-pills" role="group" aria-label="Filter stories">
          {['All','Story','News','Thought Leadership','EYDCD','AGPP','PVAC','Coordinated','Joint'].map(category=><button type="button" className={`pill ${storyCategory===category?'selected':''}`} aria-pressed={storyCategory===category} key={category} onClick={()=>changeStoryCategory(category)}>{category}</button>)}
        </div>
        <label>Search stories<input type="search" value={storyQuery} onChange={event=>{setStoryPage(0);setStoryQuery(event.target.value)}} placeholder="Search by name or keyword"/></label>
        <label>Programme<select value={storyProgram} onChange={event=>changeStoryFilter('program',event.target.value)}><option>All</option>{programmeFilters.slice(1).map(programme=><option key={programme}>{programme}</option>)}</select></label>
        <label>Country<select value={storyCountry} onChange={event=>changeStoryFilter('country',event.target.value)}><option>All</option>{countries.map(country=><option key={country}>{country}</option>)}</select></label>
        <span className="home-story-count" aria-live="polite">Showing {filteredStories.length} stories</span>
      </div>
      {visibleHomeStories.length?<div className="home-story-grid" key={`${storyProgram}-${storyCategory}-${storyCountry}-${storyQuery}`}>
        {visibleHomeStories.map(story=><article className="home-voice-card" key={story.name}>
          <span className="home-voice-meta">{story.program} · {story.country||'Country not specified in source'}</span>
          <h3>{story.name==='The Dar-Girls'?'The Dar Girls':story.name}</h3>
          <p>{story.text.length>230?`${story.text.slice(0,230).trim()}…`:story.text}</p>
          <a href={story.href} target="_blank" rel="noopener noreferrer" className="home-learn-link">Read source story <ArrowRight size={15}/></a>
        </article>)}
      </div>:<p className="home-no-stories" role="status">No stories found for these filters.</p>}
      <article className="home-voice-card home-placeholder-quote">
        <span className="home-consent-badge">Safeguarding-safe</span>
        <blockquote>Quote to be confirmed with CRVPF - Storyteller, Country-level only</blockquote>
      </article>
      {filteredStories.length>3&&<div className="home-story-pagination">
        <button type="button" className="text-action-link" onClick={()=>setStoryPage(page=>Math.max(0,page-1))} disabled={storyPage===0}>Previous stories <ArrowRight size={14}/></button>
        <span>{storyPage+1} / {Math.ceil(filteredStories.length/3)}</span>
        <button type="button" className="text-action-link" onClick={()=>setStoryPage(page=>Math.min(Math.ceil(filteredStories.length/3)-1,page+1))} disabled={(storyPage+1)*3>=filteredStories.length}>More stories <ArrowRight size={14}/></button>
      </div>}
    </section>
    <section className="home-section home-youth-voice-quotes" id="youth-voice-quotes">
      <div className="home-section-heading">
        <span className="home-section-kicker">Youth Voices</span>
        <h2>Youth Voices</h2>
      </div>
      <div className="home-story-grid">
        {[
          ['“In a Safe Space, I learned I have power.”','AGPP Youth Participant'],
          ['“The map helped me find partners near me.”','EYDCD Youth Leader'],
          ['“Our community now protects children together.”','PVAC Community Member'],
        ].map(([quote,role])=><article className="home-voice-card" key={role}>
          <span className="home-consent-badge">Shared with consent.</span>
          <blockquote className="home-youth-quote">{quote}</blockquote>
          <span className="home-voice-meta">{role}</span>
        </article>)}
      </div>
    </section>
    <section className="home-section home-added-resources" id="resources-publications">
      <div className="home-section-heading">
        <span className="home-section-kicker">Resources</span>
        <h2>Resources &amp; Publications</h2>
      </div>
      <div className="home-resource-grid">
        <article className="home-resource-card">
          <span className="home-resource-type">Annual Report</span>
          <h3>2026 Annual Report</h3>
          <p>Coming Soon</p>
          <Link className="btn btn-outline" href="/annual-report-2026">View <ArrowRight size={15}/></Link>
        </article>
        <article className="home-resource-card">
          <span className="home-resource-type">Publications</span>
          <h3>Publications</h3>
          <p>Explore CRVPF publications.</p>
          <Link className="btn btn-outline" href="/publications">View <ArrowRight size={15}/></Link>
        </article>
        <article className="home-resource-card">
          <span className="home-resource-type">Newsletter</span>
          <h3>Newsletters</h3>
          <p>Mailchimp Archive</p>
          <Link className="btn btn-outline" href="/publications">View <ArrowRight size={15}/></Link>
        </article>
        <article className="home-resource-card">
          <span className="home-resource-type">Research</span>
          <h3>Research &amp; Learning</h3>
          <p>Browse resources in the CRVPF resource centre.</p>
          <Link className="btn btn-outline" href="/resources">View <ArrowRight size={15}/></Link>
        </article>
      </div>
    </section>
    <section className="home-section home-careers-section" id="careers-opportunities">
      <div className="home-section-heading">
        <span className="home-section-kicker">Opportunities</span>
        <h2>Careers &amp; Opportunities</h2>
      </div>
      <div className="home-resource-grid">
        {['Jobs','Consultancies','Volunteer / Partner'].map(item=><article className="home-resource-card" key={item}>
          <span className="home-resource-type">Opportunities</span>
          <h3>{item}</h3>
          <p>Current openings will be listed here. CRVPF is an equal opportunity organisation.</p>
          <Link className="btn btn-outline" href="/get-involved#contact">View <ArrowRight size={15}/></Link>
        </article>)}
      </div>
    </section>
    <section className="home-section home-news-events" id="news-events">
      <div className="home-section-heading">
        <span className="home-section-kicker">Updates</span>
        <h2>News &amp; Events</h2>
      </div>
      <div className="home-resource-grid">
        <article className="home-resource-card">
          <span className="home-resource-type">News</span>
          <h3>News update - To be confirmed with CRVPF</h3>
          <p>News title and details to be confirmed with CRVPF.</p>
          <Link className="btn btn-outline" href="/publications">View <ArrowRight size={15}/></Link>
        </article>
        <article className="home-resource-card">
          <span className="home-resource-type">News</span>
          <h3>Community update - To be confirmed with CRVPF</h3>
          <p>News title and details to be confirmed with CRVPF.</p>
          <Link className="btn btn-outline" href="/publications">View <ArrowRight size={15}/></Link>
        </article>
        <article className="home-resource-card">
          <span className="home-resource-type">Upcoming Event</span>
          <h3>Upcoming event - To be confirmed with CRVPF</h3>
          <p>Date: To be confirmed with CRVPF.</p>
          <Link className="btn btn-outline" href="/publications">View <ArrowRight size={15}/></Link>
        </article>
      </div>
    </section>
    <section className="home-section home-partners-section" id="our-partners">
      <div className="home-section-heading">
        <span className="home-section-kicker">Community and funding partners</span>
        <h2>OUR PARTNERS</h2>
      </div>
      <div className="home-partners-grid">
        {partnerCards.map((partner,index)=><article className={`soft-card home-partner-card ${index<5?'partner-confirmed':'partner-placeholder-card'}`} key={`${index}-${partner}`}>
          {index<5?<div className="partner-wordmark" aria-label={`${partner} text logo`}>{partner}</div>:<div className="partner-placeholder-logo" role="img" aria-label="Partner logo placeholder"><strong>{index===6?'Community Partner':'Partner Logo'}</strong></div>}
          <h3>{partner}</h3>
          {index>=5&&<small>Demo Placeholder - To be confirmed with CRVPF</small>}
        </article>)}
      </div>
      <p className="home-partners-note">Logos shown for demo layout. Final logos to be confirmed with CRVPF Communications.</p>
      <p className="home-verification-note">Last updated: Demo - To be verified with CRVPF</p>
    </section>
    <section className="home-section home-publications-section" id="annual-report-2026">
      <div className="home-section-heading">
        <span className="home-section-kicker">Publications</span>
        <h2>Publications + Annual Report 2026</h2>
        <p>Report files not supplied for this demo are identified as awaiting CRVPF confirmation.</p>
      </div>
      <div className="home-report-preview">
        <div className="annual-cover-placeholder" role="img" aria-label="Annual Report 2026 cover placeholder - To be confirmed with CRVPF">Annual Report 2026<small>Demo Placeholder · To be confirmed with CRVPF</small></div>
        <div className="home-report-copy"><h3>Annual Report 2026</h3><p>Cover and publication details: To be confirmed with CRVPF.</p><button type="button" className="btn primary-action" onClick={()=>setReportInfoOpen(true)}>Download Annual Report</button>
          <div className="home-share-actions" aria-label="Share the annual report">
            <button type="button" className="text-action-link" onClick={()=>shareReport('WhatsApp')}>WhatsApp <ArrowRight size={14}/></button>
            <button type="button" className="text-action-link" onClick={()=>shareReport('Email')}>Email <ArrowRight size={14}/></button>
            <button type="button" className="text-action-link" onClick={()=>shareReport('Social')}>Social <ArrowRight size={14}/></button>
          </div>
          {shareMessage&&<p className="home-share-status" role="status">{shareMessage}</p>}
        </div>
      </div>
      <div className="home-promo-stamps" aria-label="Programme promotional graphics">
        {homeProgrammeCards.slice(0,3).map(programme=><article className="programme-stamp" key={programme.code}><span>{programme.code}</span><strong>{programme.title}</strong><small>Demo Placeholder</small></article>)}
      </div>
      <div className="home-annual-bar">
        <div><span>2026 ANNUAL REPORT</span><strong>Download PDF - To be confirmed with CRVPF</strong></div>
        <button type="button" className="text-action-link" onClick={()=>setReportInfoOpen(true)}>Read the Report <ArrowRight size={16}/></button>
      </div>
      <section className="home-section home-resource-centre" id="resources">
        <div className="home-section-heading">
          <span className="home-section-kicker">Resources</span>
          <h2>Resource Centre</h2>
          <p>Search and filter the requested resources. Unconfirmed items are labeled.</p>
        </div>
        <ResourceCentre/>
      </section>
    </section>
    <section className="home-newsletter-section" id="newsletter">
      <div className="home-newsletter-copy">
        <span className="home-section-kicker">Stay connected</span>
        <h2>Join 5,000+ changemakers</h2>
        <p><strong>DEMO • AWAITING VERIFICATION</strong> for subscriber count.</p>
        <span className="newsletter-client-label">Tested for Outlook + Gmail · demo preview only</span>
      </div>
      <div className="home-newsletter-form-wrap">
        {newsletterDone?<p className="home-newsletter-success" role="status">Thank you! Your newsletter signup is confirmed in this local demo. No address was stored or sent.</p>:<form className="home-newsletter-form" onSubmit={submitNewsletter}>
          <label className="sr-only" htmlFor="home-newsletter-email">Email address</label>
          <input id="home-newsletter-email" type="email" value={newsletterEmail} onChange={event=>setNewsletterEmail(event.target.value)} placeholder="Your email address" required/>
          <button type="submit" className="text-action-link">Subscribe <ArrowRight size={15}/></button>
        </form>}
        <small>Powered by Mailchimp. Unsubscribe anytime. Templates tested for Outlook + Gmail.</small>
      </div>
      <div className="newsletter-template-previews">
        <article className="soft-card"><span className="tag">Demo Placeholder</span><strong>Stories Newsletter</strong><p>Preview layout only. Content to be confirmed with CRVPF.</p></article>
        <article className="soft-card"><span className="tag">Demo Placeholder</span><strong>Annual Report Newsletter</strong><p>Preview layout only. Content to be confirmed with CRVPF.</p></article>
      </div>
    </section>
    <section className="home-demo-proves" id="what-this-demo-proves">
      <div className="home-section-heading"><span className="home-section-kicker">Proof of concept</span><h2>What This Demo Proves</h2></div>
      <div className="home-demo-tor-strip">Inception + Audit | Interactive Map | Hosting Assessed | Analytics + Monthly Reporting | Mailchimp | Training + Handover</div>
      <section className="home-theory-strip" aria-label="Theory of Change">
        <span>THEORY OF CHANGE</span>
        <strong>Problem <ArrowRight size={19}/> Safe Futures</strong>
        <span>Violence prevention · Youth power · Community action</span>
      </section>
      <section className="home-safeguarding-bar">
        <div><strong>Safe. Dignified. Consent-First.</strong><span>Safeguarding guides every story and every interaction.</span></div>
        <button type="button" className="text-action-link" onClick={()=>{setConcernSent(false);setConcernOpen(true)}}>Report a Concern <ShieldCheck size={16}/></button>
      </section>
      <div className="home-faq-grid">
        <details className="soft-card"><summary>How do I update a story?</summary><div className="home-faq-answer"><div><p>Draft the story, confirm consent, remove full names for under-18s and school/exact-location details, then get Communications approval before publishing.</p></div></div></details>
        <details className="soft-card"><summary>How is safeguarding handled?</summary><div className="home-faq-answer"><div><p>Use the four-check gate: consent signed, no full name for under-18, no school/exact location, and Communications approved. Publishing stays locked until all four checks pass.</p></div></div></details>
        <details className="soft-card"><summary>Who do I contact for support?</summary><div className="home-faq-answer"><div><p>Urgent: 24h. Routine: 48-72h. WhatsApp / Email contact details are to be confirmed with CRVPF.</p></div></div></details>
      </div>
    </section>
    <section className="home-section home-partner-journey" id="partner-journey">
      <div className="home-section-heading">
        <span className="home-section-kicker">Partnerships</span>
        <h2>Partner With Us - 4 Steps</h2>
        <p>Community organisations, donors and partners — start here.</p>
      </div>
      <div className="home-partners-grid">
        {['Learn','Partner','Apply','Contact'].map((step,index)=><article className="soft-card home-partner-card" key={step}>
          <span className="home-programme-code">Step {index+1}</span>
          <h3>{step}{index<3&&<span aria-hidden="true"> →</span>}</h3>
        </article>)}
      </div>
      <div className="home-partner-journey-action">
        <button type="button" className="btn primary-action" onClick={()=>{setPartnerSent(false);setPartnerOpen(true)}}>Start Partnership <ArrowRight size={16}/></button>
      </div>
    </section>
    <section className="home-section home-transparency-section" id="transparency-trust">
      <div className="home-section-heading">
        <span className="home-section-kicker">Public information</span>
        <h2>Transparency &amp; Trust</h2>
      </div>
      <div className="home-resource-grid">
        {[
          ['2026 Annual Report','/annual-report-2026'],
          ['Safeguarding Policy','/safeguarding'],
          ['Financials','/financial'],
          ['Our Partners','/#our-partners'],
        ].map(([title,href])=><article className="home-resource-card" key={title}>
          <span className="home-resource-type">Transparency</span><h3>{title}</h3>
          <Link className="btn btn-outline" href={href}>View <ArrowRight size={15}/></Link>
        </article>)}
      </div>
    </section>
    <section className="home-section home-report-concern" id="need-help">
      <div className="home-section-heading">
        <span className="home-section-kicker">Safeguarding</span>
        <h2>Need Help / Report a Concern?</h2>
        <p>If you have a safeguarding concern, you can report safely and confidentially.</p>
      </div>
      <div className="soft-card home-report-concern-card">
        <div className="home-report-concern-actions">
          <button type="button" className="btn primary-action" onClick={()=>{setConcernSent(false);setConcernOpen(true)}}>Report a Concern <ShieldCheck size={16}/></button>
          <Link className="btn btn-outline" href="/safeguarding">Safeguarding Policy <ArrowRight size={15}/></Link>
        </div>
        <p>No personal data is shown on this site. Reports go directly to CRVPF Safeguarding Focal Point.</p>
        <small>Demo only: this prototype does not transmit reports. For a real concern, contact <a href="mailto:info@crvpf.org">info@crvpf.org</a>.</small>
      </div>
    </section>
    <section className="home-section home-search-faq-section" id="frequently-asked-questions">
      <div className="home-section-heading">
        <span className="home-section-kicker">Help and information</span>
        <h2>Frequently Asked Questions</h2>
      </div>
      <form className="home-story-filters home-faq-search" onSubmit={event=>{event.preventDefault();setFaqSearch(faqSearchText)}}>
        <label>Search CRVPF...<input className="field" type="search" value={faqSearchText} onChange={event=>setFaqSearchText(event.target.value)} placeholder="Search CRVPF..."/></label>
        <button className="btn btn-outline" type="submit">Search <Search size={15}/></button>
      </form>
      <div className="home-faq-grid home-searchable-faqs">
        {visibleFaqs.length?visibleFaqs.map(item=><details className="soft-card" key={item.question}>
          <summary>{item.question}</summary><div className="home-faq-answer"><div><p>{item.answer}</p></div></div>
        </details>):<p className="home-no-stories" role="status">No questions match your search.</p>}
      </div>
    </section>
    <section className="home-section home-wordpress-proof" id="wordpress-proof">
      <div className="home-section-heading">
        <span className="home-section-kicker">Try It</span>
        <h2>Try It - How CRVPF Staff Will Update The Site</h2>
        <p>Demo of WordPress workflow. Final site runs on WordPress + Elementor on i3C.</p>
      </div>
      <div className="soft-card wp-workflow-dashboard">
        <aside className="soft-card wp-workflow-menu">
          <h3>Menu</h3>
          <nav className="wp-workflow-menu-list" aria-label="Demo WordPress menu">
            {['Dashboard','Programmes','Stories','Resources','Media','Users','Settings'].map(item=><button type="button" key={item} aria-pressed={wpMenuItem===item} className={`btn wp-workflow-menu-item ${wpMenuItem===item?'primary-action':'secondary-action'}`} onClick={()=>setWpMenuItem(item)}>{item}</button>)}
          </nav>
        </aside>
        <section className="soft-card wp-workflow-editor">
          <h3>Edit Programme: AGPP - Adolescent Girls Power Program</h3>
          <form className="form-stack" onSubmit={event=>{event.preventDefault();if(!event.currentTarget.reportValidity())return;setWpPreview({title:wpTitle,description:wpDescription,country:wpCountry});setWpStatus('Saved! This is a demo. Final version runs on WordPress + Elementor. CRVPF staff can publish without coding.')}}>
            <label>Title<input className="field" type="text" value={wpTitle} onChange={event=>{setWpTitle(event.target.value);setWpStatus('')}} required/></label>
            <label>Description<textarea className="field" rows={4} value={wpDescription} onChange={event=>{setWpDescription(event.target.value);setWpStatus('')}} required/></label>
            <label>Country<select className="field" value={wpCountry} onChange={event=>{setWpCountry(event.target.value);setWpStatus('')}}>{['Uganda','Kenya','Tanzania','Ethiopia'].map(country=><option key={country}>{country}</option>)}</select></label>
            <label className="wp-workflow-upload" onDragOver={event=>event.preventDefault()} onDrop={event=>{event.preventDefault();const file=event.dataTransfer.files[0];if(file&&file.type.startsWith('image/')){setWpImageName(file.name);setWpStatus('')}}}>
              <span>{wpImageName?`Selected: ${wpImageName}`:'Upload Image - Drag here'}</span>
              <input className="sr-only" type="file" accept="image/*" aria-label="Select an image for the demo programme" onChange={event=>{const file=event.currentTarget.files?.[0];if(file){setWpImageName(file.name);setWpStatus('')}}}/>
            </label>
            <small>Demo only: selected images are not uploaded or stored.</small>
            <div className="wp-workflow-actions">
              <button type="button" className="btn secondary-action" onClick={()=>setWpStatus('Draft saved in this demo; it has not been published.')}>Save Draft</button>
              <button type="submit" className="btn primary-action">Publish</button>
            </div>
            {wpStatus&&<div className="success-box" role="status">{wpStatus}</div>}
          </form>
        </section>
        <aside className="soft-card wp-workflow-preview">
          <h3>Live Preview</h3>
          <article className="home-programme-card wp-workflow-preview-card">
            <span className="home-programme-code">AGPP</span>
            <h3>{wpPreview.title}</h3>
            <p>{wpPreview.description}</p>
            <div className="programme-country-tags"><span className="tag">{wpPreview.country}</span></div>
            <Link className="btn btn-outline home-programme-view" href="/programmes/agpp">View Programme <ArrowRight size={15}/></Link>
          </article>
          <p className="wp-workflow-preview-note">What staff publish appears here instantly on the live site.</p>
        </aside>
      </div>
      <p className="home-wordpress-proof-note">Live WordPress proof: <a href="https://brimasmedia.co" target="_blank" rel="noopener noreferrer">Brimas Media (https://brimasmedia.co)</a> and <a href="https://printgarage.online" target="_blank" rel="noopener noreferrer">Print Garage (https://printgarage.online)</a> - WordPress sites built by Akol Francis. Final CRVPF site: WordPress on i3C, Elementor templates for Programme / Story / Resource / Event, Custom Post Types, Roles: Admin (IT) | Editor (Comms) | Author (Programme Staff). Staging for CRVPF approval before live. CRVPF owns everything.</p>
    </section>
    {tourOpen&&<Modal title="CRVPF Evaluator Tour - 10 Minutes" onClose={()=>setTourOpen(false)}>
      <div className="evaluator-tour-steps">
        <article className="soft-card"><span className="home-programme-code">1</span><h3>Programmes (All 5)</h3><Link className="home-learn-link" href="/#programmes" onClick={()=>setTourOpen(false)}>Open Programmes <ArrowRight size={14}/></Link></article>
        <article className="soft-card"><span className="home-programme-code">2</span><h3>Interactive Map (4 countries + USA office)</h3><Link className="home-learn-link" href="/#where-we-work" onClick={()=>setTourOpen(false)}>Open Map <ArrowRight size={14}/></Link></article>
        <article className="soft-card"><span className="home-programme-code">3</span><h3>Youth Zone</h3><Link className="home-learn-link" href="/#youth-zone" onClick={()=>setTourOpen(false)}>Open Youth Zone <ArrowRight size={14}/></Link></article>
        <article className="soft-card"><span className="home-programme-code">4</span><h3>Resources (2026 Annual Report)</h3><Link className="home-learn-link" href="/#resources-publications" onClick={()=>setTourOpen(false)}>Open Resources <ArrowRight size={14}/></Link></article>
        <article className="soft-card"><span className="home-programme-code">5</span><h3>Partner Journey + Transparency</h3><div className="evaluator-tour-links"><Link className="home-learn-link" href="/#partner-journey" onClick={()=>setTourOpen(false)}>Partner Journey <ArrowRight size={14}/></Link><Link className="home-learn-link" href="/#transparency-trust" onClick={()=>setTourOpen(false)}>Transparency <ArrowRight size={14}/></Link></div></article>
      </div>
    </Modal>}
    {partnerOpen&&<Modal title="Partner With Us - Expression of Interest" onClose={()=>setPartnerOpen(false)}>
      {partnerSent
        ?<div className="success-box" role="status"><strong>Thank you! CRVPF team will review your expression of interest.</strong><p>This local demo does not send or store your details.</p></div>
        :<form className="form-stack" onSubmit={event=>{event.preventDefault();if(!event.currentTarget.reportValidity())return;setPartnerSent(true)}}>
          <label>Organisation Name<input className="field" name="organisation" required minLength={2}/></label>
          <label>Contact Person<input className="field" name="contact-person" required minLength={2}/></label>
          <label>Email<input className="field" name="email" type="email" required/></label>
          <label>Country<select className="field" name="country" defaultValue="" required><option value="" disabled>Select country</option>{['Uganda','Kenya','Tanzania','Ethiopia','USA'].map(country=><option key={country}>{country}</option>)}</select></label>
          <label>Programme<select className="field" name="programme" defaultValue="" required><option value="" disabled>Select programme</option>{['EYDCD','AGPP','PVAC','Coordinated','Joint'].map(programme=><option key={programme}>{programme}</option>)}</select></label>
          <label>Message<textarea className="field" name="message" rows={4} required minLength={10}/></label>
          <button type="submit" className="btn primary-action">Submit</button>
          <small>Demo only: this form does not send or store personal information.</small>
        </form>}
    </Modal>}
    {concernOpen&&<Modal title="Report a Concern" onClose={()=>setConcernOpen(false)}>
      {concernSent?<div className="home-concern-success" role="status"><strong>Demo report recorded in this page only.</strong><p>No report was sent or stored. For a real concern, email <a href="mailto:info@crvpf.org">info@crvpf.org</a> or call <a href="tel:+256393216519">(+256) 393 216 519</a>.</p></div>:<form className="form-stack" onSubmit={event=>{event.preventDefault();setConcernSent(true)}}>
        <p>Do not include a child’s full name, school, or exact location. This demonstration does not transmit reports.</p>
        <label>Concern<textarea className="field" rows={4} required minLength={10} placeholder="Describe the concern without identifying details."/></label>
        <label className="check-row"><input type="checkbox"/> Submit anonymously</label>
        <button type="submit" className="btn">Submit demo report</button>
      </form>}
    </Modal>}
    {reportInfoOpen&&<Modal title="2026 Annual Report" onClose={()=>setReportInfoOpen(false)}>
      <p>Download PDF - To be confirmed with CRVPF.</p>
    </Modal>}
  </main>
}
const homeProgrammeCards=[
  {code:'PVAC',title:'Prevention of Violence Against Children and Young People',description:'Works with families, schools, and communities to prevent violence against children and young people.',slug:'/programmes/pvac'},
  {code:'AGPP',title:'Adolescent Girls Power Program',description:'Builds adolescent girls’ power through safe spaces, life skills, and vocational learning.',slug:'/programmes/agpp'},
  {code:'EYDCD',title:'Empowering Youth Through Data and Community Development',description:'Connects young people with market-relevant skills, enterprise resources, and digital financial inclusion.',slug:'/programmes/eydcd'},
  {code:'COORDINATED',title:'Coordinated Program',description:'Coordinated cluster partnerships - Community organisations collaborating to address issues affecting children and young people.',slug:'/programmes/coordinated',countries:['Uganda','Kenya','Tanzania','Ethiopia']},
  {code:'JOINT',title:'Joint Program',description:'Joint grant-making and capacity strengthening with community partners.',slug:'/programmes/joint',countries:['Uganda','Kenya','Tanzania','Ethiopia']},
];
const reachCards=[
  {value:'178,591',numeric:178591,label:'Program Participants'},
  {value:'4',numeric:4,label:'East African Countries ( Uganda, Kenya, Tanzania, Ethiopia )'},
  {value:'+250',numeric:250,prefix:'+',label:'Community Partners'},
  {value:'34,078',numeric:34078,label:'Young People Engaged In Dignified And Fulfilling Work As Entrepreneurs Or Formally Employed.'},
  {value:'11,884',numeric:11884,label:'Parents Participating In Weekly Savings And Lending Meetings To Increase Household Incomes.'},
  {value:'10,000',numeric:10000,label:'Adolescent Girls Regularly Attending Safe Space Meetings Across East Africa.'},
];
const partnerCards=[
  'Oak Foundation',
  'Wellspring Philanthropic Fund',
  'TIDES - A Force for Social Good',
  'Mastercard Foundation',
  'Conrad N. Hilton Foundation',
  'Partner Logo - To be confirmed',
  'Community Partner - To be confirmed',
  'Partner Logo - To be confirmed',
];
const resourceItems=[
  {title:'Annual Report 2026',region:'East Africa',country:'Not specified',language:'Not specified',type:'Annual Report',categories:['Annual Report','Publication'],programmes:[],availability:'The public CRVPF Knowledge Hub lists annual reports through 2025; the 2026 report link is awaiting confirmation.',href:'https://crvpf.org/knowledge-hub-2',action:'Open Knowledge Hub'},
  {title:'Safeguarding Toolkit',region:'East Africa',country:'Not specified',language:'Not specified',type:'Toolkit',categories:[],programmes:[],availability:'No matching toolkit was confirmed in the public Knowledge Hub. Request the official resource from CRVPF.',href:'mailto:info@crvpf.org?subject=CRVPF%20Safeguarding%20Toolkit%20request',action:'Request resource'},
  {title:'Case Study Ethiopia',region:'East Africa',country:'Ethiopia',language:'Not specified',type:'Case Study',categories:['Research'],programmes:[],availability:'A case study link was not confirmed in the public Knowledge Hub. Request the official resource from CRVPF.',href:'mailto:info@crvpf.org?subject=CRVPF%20Ethiopia%20case%20study%20request',action:'Request resource'},
  {title:'EYDCD Data Brief',region:'East Africa',country:'Not specified',language:'Not specified',type:'Data Brief',categories:['Research'],programmes:['EYDCD'],availability:'A data brief link was not confirmed in the public Knowledge Hub. Request the official resource from CRVPF.',href:'mailto:info@crvpf.org?subject=CRVPF%20EYDCD%20data%20brief%20request',action:'Request resource'},
];
function ResourceCentre(){
  const[query,setQuery]=useState('');
  const[region,setRegion]=useState('All');
  const[country,setCountry]=useState('All');
  const[language,setLanguage]=useState('All');
  const[type,setType]=useState('All');
  const[typeCategory,setTypeCategory]=useState('All');
  const[programmeCategory,setProgrammeCategory]=useState('All');
  const visible=resourceItems.filter(item=>
    (region==='All'||item.region===region)&&
    (country==='All'||item.country===country)&&
    (language==='All'||item.language===language)&&
    (type==='All'||item.type===type)&&
    (typeCategory==='All'||item.categories.includes(typeCategory))&&
    (programmeCategory==='All'||item.programmes.includes(programmeCategory))&&
    `${item.title} ${item.region} ${item.country} ${item.language} ${item.type} ${item.availability}`.toLowerCase().includes(query.trim().toLowerCase())
  );
  return <div className="home-resource-hub">
    <SectionPhoto file="IMG-20261114-WA6630_1794665428907.jpg" alt="A staff member reviewing printed documents in an office." className="resource-section-photo"/>
    <div className="filter-toolbar home-resource-extra-filters" aria-label="Filter resources">
      <div><strong>Filter by Type:</strong><div className="pill-row" role="group" aria-label="Filter resources by type">
        {['All','Annual Report','Publication','Newsletter','Research'].map(value=><button type="button" className={`pill ${typeCategory===value?'selected':''}`} aria-pressed={typeCategory===value} key={value} onClick={()=>setTypeCategory(value)}>{value}</button>)}
      </div></div>
      <div><strong>Filter by Programme:</strong><div className="pill-row" role="group" aria-label="Filter resources by programme">
        {['EYDCD','AGPP','PVAC','Coordinated','Joint'].map(value=><button type="button" className={`pill ${programmeCategory===value?'selected':''}`} aria-pressed={programmeCategory===value} key={value} onClick={()=>setProgrammeCategory(current=>current===value?'All':value)}>{value}</button>)}
      </div><small>Programme associations are shown only where supplied.</small></div>
    </div>
    <div className="home-resource-filters">
      <label>Search resources<input type="search" value={query} onChange={event=>setQuery(event.target.value)} placeholder="Search title or keyword"/></label>
      <label>Region<select value={region} onChange={event=>setRegion(event.target.value)}><option>All</option><option>East Africa</option></select></label>
      <label>Country<select value={country} onChange={event=>setCountry(event.target.value)}><option>All</option>{countries.map(value=><option key={value}>{value}</option>)}<option>Not specified</option></select></label>
      <label>Language<select value={language} onChange={event=>setLanguage(event.target.value)}><option>All</option><option>English</option><option>Not specified</option></select></label>
      <label>Type<select value={type} onChange={event=>setType(event.target.value)}><option>All</option>{['Annual Report','Toolkit','Case Study','Data Brief'].map(value=><option key={value}>{value}</option>)}</select></label>
    </div>
    <p className="home-resource-count" role="status">Showing {visible.length} resources</p>
    {visible.length?<div className="home-resource-grid">{visible.map(item=><article className="home-resource-card" id={item.title==='Annual Report 2026'?'annual-report-2026':undefined} key={item.title}>
      <span className="home-resource-type">{item.type}</span><h3>{item.title}</h3>
      <p>{item.availability}</p>
      <small>{item.region} · {item.country} · {item.language}</small>
      <a href={item.href} target={item.href.startsWith('http')?'_blank':undefined} rel={item.href.startsWith('http')?'noopener noreferrer':undefined}>{item.action} <ArrowRight size={14}/></a>
    </article>)}</div>:<p className="home-no-stories" role="status">No resources match these filters.</p>}
  </div>
}
function SourcePhoto({src,alt,className}:{src:string;alt:string;className:string}){const[failed,setFailed]=useState(false);return <figure className={`local-image ${className}`}>{failed?<div className="photo-fallback" role="img" aria-label={alt}>CRVPF photo unavailable</div>:<img src={src} alt={alt} loading={className==='hero-photo'?'eager':'lazy'} fetchPriority={className==='hero-photo'?'high':'auto'} decoding="async" onError={()=>setFailed(true)}/>}<figcaption>{failed?'Source: crvpf.org - photo unavailable; caption to be confirmed by CRVPF':'Photo: CRVPF / Partner Organisation'}</figcaption></figure>}
function SectionPhoto({file,alt,className=''}:{file:string;alt:string;className?:string}){return <figure className={`section-photo ${className}`}><img src={`${APP_BASE_PATH}photos/${file}`} alt={alt} loading="lazy" decoding="async" width={file.includes('WA4676')?1600:1600} height={file.includes('WA4676')?679:1067}/></figure>}
function EditionPhoto({className}:{className:string}){return <SourcePhoto src="https://crvpf.org/wp-content/uploads/2026/06/joanna-768x503.jpg" alt="CRVPF photo from the Bold Movements Edition 2, 2026 page" className={className}/>}
function ScrollCount({value,suffix='',prefix='',className=''}:{value:number;suffix?:string;prefix?:string;className?:string}){const node=useRef<HTMLSpanElement>(null);const[count,setCount]=useState(0);useEffect(()=>{const element=node.current;if(!element)return;let frame=0;let observer:IntersectionObserver|undefined;const finish=()=>setCount(value);const start=()=>{if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){finish();return}const duration=1200,started=performance.now();const tick=(now:number)=>{const progress=Math.min(1,(now-started)/duration);setCount(Math.round(value*(1-Math.pow(1-progress,3))));if(progress<1)frame=requestAnimationFrame(tick)};frame=requestAnimationFrame(tick)};if('IntersectionObserver' in window){observer=new IntersectionObserver(entries=>{if(entries.some(entry=>entry.isIntersecting)){start();observer?.disconnect()}},{threshold:.35});observer.observe(element)}else start();return()=>{observer?.disconnect();cancelAnimationFrame(frame)}},[value]);return <span ref={node} className={className} aria-label={`${prefix}${value.toLocaleString()}${suffix}`}><span aria-hidden="true">{prefix}{count.toLocaleString()}{suffix}</span></span>}
function ProgramCard({p,i}:{p:Program;i:number}){return <article className="program-card"><span className="number">0{i+1} / {p.short}</span><h3>{p.name}</h3><p>{p.summary}</p><Link className="arrow-link" href={p.slug}>Explore programme <ArrowRight size={15}/></Link></article>}
  function StoryCard({s,i}:{s:typeof storyData[number];i:number}){const[open,setOpen]=useState(false);const label=s.country?`${s.program} · ${s.country}`:s.program;return <article className="story-card"><div className="story-icon">{i%2===0?<HeartHandshake size={25}/>:<Sparkles size={25}/>}</div><div><span className="tag">{label}</span><h3 style={{marginTop:12}}>{s.name}</h3><p>{s.text}</p>{s.quote&&<blockquote className="story-quote">“{s.quote}”</blockquote>}<small className="source-note"><a href={s.href} target="_blank" rel="noopener noreferrer">Source: crvpf.org</a></small><button className="arrow-link story-read-more" onClick={()=>setOpen(true)}>Read More <ArrowRight size={15}/></button></div>{open&&<Modal title={s.name} onClose={()=>setOpen(false)}><span className="tag">{label}</span><p>{s.text}</p>{s.quote&&<blockquote>“{s.quote}”</blockquote>}<small className="source-note"><a href={s.href} target="_blank" rel="noopener noreferrer">Source: crvpf.org</a></small><a className="btn btn-blue" href={s.href} target="_blank" rel="noopener noreferrer">Read story on CRVPF <ArrowRight size={15}/></a></Modal>}</article>}
function MapPanel({timelineYear}:{timelineYear?:number}){
 return <div className="map-panel dashboard-static-map">
   <div className="map-copy"><div className="eyebrow">Across East Africa</div><h2>Reach Through Our Partners: 2021 - 2023</h2><p>CRVPF operates in Uganda, Kenya, Tanzania and Ethiopia.</p>
     {timelineYear&&<div className="map-year-caption"><strong>Selected timeline year: {timelineYear}</strong><span>The static country map does not change with the selected year.</span><div className="map-year-rail" aria-label={`Timeline year ${timelineYear}`}><span className="map-year-dot" style={{left:`${((timelineYear-2015)/11)*100}%`}}/><span>2015</span><span>2026</span></div></div>}
   </div>
   <img className="dashboard-static-map-image" src={`${APP_BASE_PATH}images/crvpf-map-static.jpg`} alt="Map of Africa highlighting Uganda, Kenya, Tanzania and Ethiopia" loading="lazy" decoding="async"/>
 </div>
}
function PageHero({eyebrow,title,description}:{eyebrow:string;title:string;description:string}){return <section className="page-hero"><div className="container"><div className="eyebrow">{eyebrow}</div><h1 className="page-title">{title}</h1><p>{description}</p></div></section>}
function About(){
 const clusterText='Our principles of partnership with community organizations revolve around a place-based Cluster Partnership model that brings together 2–5 community organizations in one geographic area to implement CRVPF’s interventions. This ensures clear and transparent working relationships that are inclusive and mutually beneficial, grounded in equity, respect, and shared passion. To support this collaboration, CRVPF offers a Planning and Learning Grant that enables cluster partners to build strong relationships that strengthen the management and implementation of violence against children (VAC) prevention programs. The grant provides space for partners to listen to the community, co-create relevant interventions, and conduct joint situation and power analyses. This helps ensure that the solutions are grounded in the lived experiences, challenges, and resources of the specific communities. This approach promotes programmatic synergy, enables economies of scale in capacity building and funding eligibility, and creates safe and supportive environments for children and young people.';
 const approaches=[['Cluster Partnership Model',clusterText],['Joint Program Approach',`${approachContent.joint.summary} ${approachContent.joint.activities[0]}`],['Coordinated Program Approach',`${approachContent.coordinated.summary} ${approachContent.coordinated.activities[0]}`]];
  return <main><PageHero eyebrow="About CRVPF" title="Children's Rights and Violence Prevention Fund (CRVPF)" description={CRVPF_INTRO}/><section className="section"><div className="container"><SectionHead eyebrow="" title="Vision, Mission & Goal"/><div className="content-grid"><div className="prose"><h2>Our Vision</h2><p>{CRVPF_VISION}</p><h2>Mission</h2><p>{CRVPF_MISSION}</p><h2>Goal</h2><p>{CRVPF_GOAL}</p><small className="source-note">Source: crvpf.org/</small></div><aside className="soft-card"><div className="section-kicker">Reach Through Our Partners: 2021 - 2023</div><ul className="check-list"><li>1,399 Program participants</li><li>266 young people engaged in dignified and fulfilling work as entrepreneurs or formally employed.</li><li>93 parents participating in weekly savings and lending meetings to increase household incomes.</li><li>78 adolescent girls regularly attending safe space meetings across East Africa.</li></ul><small className="source-note">Source: crvpf.org/about-us/</small></aside></div><div id="approaches" style={{marginTop:65,scrollMarginTop:100}}><SectionHead eyebrow="How we work" title="Approaches"/><div className="program-grid">{approaches.map(([title,text],i)=><article className="soft-card" key={title}><span className="tag">0{i+1}</span><h3 style={{marginTop:17}}>{title}</h3><p>{text}</p><small className="source-note">Source: crvpf.org/our-approaches/</small></article>)}</div></div><div className="soft-card" style={{marginTop:34,display:'flex',gap:18,alignItems:'center'}}><div className="story-icon"><Users/></div><div><span className="section-kicker">Our Story</span><h3 style={{margin:'5px 0'}}>CRVPF is led by an East African leader and board with strong relationships and credibility among external donors.</h3><small className="source-note">Source: crvpf.org/about-us/</small></div></div><div className="soft-card history-card"><span className="section-kicker">Our Story</span><p>CRVPF was established to balance the power of funding in East African local organizations from external funders who traditionally set the agenda to a more collaborative and facilitative regional intermediary. This intermediary model emphasizes co-creating program agendas with community organizations while developing their capacity.</p><SectionPhoto file="IMG-20261114-WA9390_1794665428559.jpg" alt="Community and organisation representatives meeting around a table." className="about-section-photo"/><small className="source-note">Source: crvpf.org/</small></div><div className="about-studios"><ElitechStudios/></div></div></section></main>
}

const approachContent={coordinated:{title:'Coordinated Program approach for integrated holistic programs',summary:'In our mission to build power of young people to make informed decisions and access dignified, fulfilling work, CRVPF developed a coordinated approach that maximizes the skills provided by our community partners while bridging the gap between young people and the private sector, particularly financial institutions, to develop financial products tailored for young people. The approach brings together CRVPF’s three programs, AGPP, EYDCD, and PVAC, community organizations, financial institutions, telecommunication providers for digital solutions, and alternative credit facilities, among others, to provide program participants with a comprehensive and integrated package of services.',activities:['Our community partners bring their unique expertise to work with the same youth in the same geographical areas, offering life skills training, parenting skills training, and inclusive financial education. By leveraging the strength of each program, the coordinated approach aims to create an enabling environment for young people to thrive in a safe environment free from violence and sexual violence.'],partnerships:['Community organizations','Financial institutions','Telecommunication providers','Private sector'],resources:[]},joint:{title:'Joint Program Approach',summary:'Initially, CRVPF’s programs, the Prevention of Violence against Children (PVAC) and the Adolescent Girls’ Power Program (AGPP), supported partners in different locations. Even when partners operated within the same geographical area, there was no intentional or strategic coordination between them. Recognizing the unique strengths of each program in addressing violence and sexual violence against children and young people, CRVPF adopted a Joint Program Approach. By integrating the two programs within the same geographical area, the initiative aims to enhance partner interventions for greater impact.',activities:['In this collaborative model, PVAC contributes expertise in strengthening parenting skills and spousal relationships, reducing family economic stress through Village Savings and Loan Associations (VSLAs), and fostering an enabling school environment where young people can thrive. Meanwhile, AGPP brings its experience in building power for adolescent girls and transforming structural barriers that limit their choices and agency, using its life skills manual as a key tool.'],partnerships:['PVAC and AGPP partners in the same geographical area'],resources:[]}};
function ProgrammesHub(){
  const details=[
    {code:'PVAC',slug:'/programmes/pvac',objective:programs[0].summary,activities:programs[0].details,coverage:countryOperations.filter(country=>country.programmes.includes('PVAC')).map(country=>country.country).join(', '),achievements:'To be confirmed with CRVPF.'},
    {code:'AGPP',slug:'/programmes/agpp',objective:programs[1].summary,activities:programs[1].details,coverage:countryOperations.filter(country=>country.programmes.includes('AGPP')).map(country=>country.country).join(', '),achievements:'To be confirmed with CRVPF.'},
    {code:'EYDCD',slug:'/programmes/eydcd',objective:programs[2].summary,activities:programs[2].details,coverage:'Uganda; other country-level coverage to be confirmed with CRVPF.',achievements:'Targets: 400,000 youth (70% female), 250,000 dignified jobs, 3,000 youth-led VSLAs, 200 CBOs. Reported achievements: To be confirmed with CRVPF.'},
    {code:'COORDINATED',slug:'/programmes/coordinated',objective:approachContent.coordinated.summary,activities:approachContent.coordinated.activities,coverage:'8 pilot districts. Country list to be confirmed with CRVPF.',achievements:'To be confirmed with CRVPF.'},
    {code:'JOINT',slug:'/programmes/joint',objective:approachContent.joint.summary,activities:approachContent.joint.activities,coverage:'PVAC and AGPP partners in the same geographic area.',achievements:'To be confirmed with CRVPF.'},
  ];
  return <main><PageHero eyebrow="Our Work" title="What We Fund" description="Explore CRVPF programmes and approaches."/><section className="section"><div className="container">
    <div className="home-programme-grid">{homeProgrammeCards.map(item=><article className="home-programme-card" key={item.slug}><span className="home-programme-code">{item.code}</span><h3>{item.title}</h3><p>{item.description}</p><Link className="home-learn-link" href={item.slug}>Learn more <ArrowRight size={15}/></Link></article>)}</div>
    <div className="programme-hub-details">{details.map(item=>{
      const story=storyData.find(entry=>entry.program===item.code);
      const storyHref=story?`/impact#story-${story.name.toLowerCase().replaceAll(' ','-')}`:'/impact';
      return <article className="soft-card programme-hub-detail" key={item.code}>
        <span className="tag">{item.code}</span><h2>{homeProgrammeCards.find(programme=>programme.code===item.code)?.title}</h2>
        <section><h3>Objectives</h3><p>{item.objective}</p></section>
        <section><h3>Activities</h3><ul className="check-list">{item.activities.map(activity=><li key={activity}>{activity}</li>)}</ul></section>
        <section><h3>Coverage</h3><p>{item.coverage}</p></section>
        <section><h3>Achievements</h3><p>{item.achievements}</p></section>
        <div className="programme-hub-links"><Link className="btn btn-outline" href={storyHref}>Stories <ArrowRight size={14}/></Link><Link className="btn btn-outline" href="/resources">Resources <ArrowRight size={14}/></Link><Link className="btn btn-green" href={item.slug}>Programme page <ArrowRight size={14}/></Link></div>
      </article>
    })}</div>
  </div></section></main>
}
function ResourcesPage(){return <main><PageHero eyebrow="Resources" title="Resource Centre" description="Search and filter CRVPF resources. Items without a confirmed public source are marked clearly."/><section className="section"><div className="container"><ResourceCentre/></div></section></main>}
const countryOperations=[
  {country:'Uganda',capital:'Kampala',partners:'71',youth:'105k',programmes:['EYDCD','AGPP','PVAC'],story:'Safe Schools Initiative',position:{left:'59%',top:'55%'}},
  {country:'Kenya',capital:'Nairobi',partners:'78',youth:'118k',programmes:['AGPP','PVAC'],story:'',position:{left:'64%',top:'53%'}},
  {country:'Tanzania',capital:'Dodoma',partners:'40',youth:'85k',programmes:['EYDCD','AGPP'],story:'Youth Council Launched — Dar es Salaam',position:{left:'62%',top:'62%'}},
  {country:'Ethiopia',capital:'Addis Ababa',partners:'62',youth:'92k',programmes:['EYDCD','PVAC'],story:'',position:{left:'67%',top:'43%'}},
];
const mapFilterSummaries:Record<string,string>={
  all:'All Programmes across Uganda, Kenya, Tanzania and Ethiopia',
  eydcd:'EYDCD in Uganda, Tanzania and Ethiopia',
  agpp:'AGPP in Uganda, Kenya and Tanzania',
  pvac:'PVAC in Uganda, Kenya and Ethiopia',
};
function WhereWeWorkMap(){
  const[filter,setFilter]=useState('all');
  const[view,setView]=useState<'all'|'eydcd'>('all');
  const[selectedCountry,setSelectedCountry]=useState<(typeof countryOperations)[number]|null>(null);
  const[selectedUSA,setSelectedUSA]=useState(false);
 const filters=['all','eydcd','agpp','pvac'];
 return <section id="where-we-work-map" className="where-we-work-map">
   <h2 style={{color:'var(--green-dark)',fontFamily:'system-ui, sans-serif',fontSize:28,marginBottom:8}}>Where We Work</h2>
   <p className="where-map-intro">We work in 4 East African countries through 251 community partners.</p>
    <div className="where-map-layout">
      <div className="where-map-main">
        <div className="where-map-view-tabs" role="tablist" aria-label="Map view">
          <button type="button" role="tab" aria-selected={view==='all'} className={`filter-btn ${view==='all'?'active':''}`} onClick={()=>{setView('all');setFilter('all')}} data-testid="map-tab-all-programmes">All Programmes</button>
          <button type="button" role="tab" aria-selected={view==='eydcd'} className={`filter-btn ${view==='eydcd'?'active':''}`} onClick={()=>{setView('eydcd');setFilter('eydcd')}} data-testid="map-tab-eydcd">EYDCD Map</button>
        </div>
        {view==='eydcd'&&<p className="where-map-eydcd-note" role="status">EYDCD in Uganda - Find Partners / Opportunities by Country. No village, school, or child names are shown.</p>}
        <div className="where-map-image-wrap">
          <div className="where-map-image-stage">
            <img src={`${APP_BASE_PATH}images/crvpf-map-static.jpg`} alt="Map of Africa highlighting Uganda, Kenya, Tanzania and Ethiopia" loading="lazy" decoding="async" width="1024" height="682"/>
            <div className="where-map-hotspots" aria-label="Select an operating country">
              {countryOperations.map(country=><button
                type="button"
                key={country.country}
                className={`where-map-hotspot ${filter!=='all'&&!country.programmes.includes(filter.toUpperCase())?'is-dimmed':''}`}
                style={country.position}
                aria-label={`Show ${country.country} details`}
                title={country.country}
                onClick={()=>{setSelectedCountry(country);setSelectedUSA(false)}}
                data-testid={`map-hotspot-${country.country.toLowerCase()}`}
              />)}
            </div>
          </div>
        </div>
        <div className="where-map-legend">
          <span><i className="where-map-swatch where-map-country-swatch" aria-hidden="true"/>CRVPF Country</span>
          <span><i className="where-map-swatch where-map-other-swatch" aria-hidden="true"/>Other African Countries</span>
        </div>
        <p className="where-map-disclaimer">Country/cluster-level only. No zoom to precise locations. No personal data.</p>
        <div className="where-map-filters" role="group" aria-label="Filter programmes">{filters.map(value=><button type="button" data-filter={value} className={`filter-btn ${filter===value?'active':''}`} aria-pressed={filter===value} key={value} onClick={()=>{setView(value==='eydcd'?'eydcd':'all');setFilter(value)}} data-testid={`map-filter-${value}`}>{value==='all'?'All':value.toUpperCase()}</button>)}</div>
        <p id="filter-summary" className="where-map-summary" role="status" aria-live="polite">Filtered: {mapFilterSummaries[filter]}</p>
        <div className="where-map-countries">
          {countryOperations.map(country=><button
            type="button"
            className={`country-card where-map-country-card ${filter!=='all'&&!country.programmes.includes(filter.toUpperCase())?'is-dimmed':''} ${selectedCountry?.country===country.country?'is-selected':''}`}
            key={country.country}
            onClick={()=>{setSelectedCountry(country);setSelectedUSA(false)}}
            aria-pressed={selectedCountry?.country===country.country}
            data-testid={`country-card-${country.country.toLowerCase()}`}
          >
            <strong>{country.country}</strong>
            <span className="where-map-country-programmes">{country.programmes.join(' • ')}</span>
            <small>{country.partners} partners · {country.youth} youth</small>
          </button>)}
        </div>
        {selectedCountry&&<article className="country-card where-map-selected-country" aria-live="polite" data-testid="selected-country-details">
          <h3>{selectedCountry.country}</h3>
          <p><strong>Capital:</strong> {selectedCountry.capital}</p>
          <p><strong>Partners:</strong> {selectedCountry.partners} · <strong>Youth:</strong> {selectedCountry.youth}</p>
          <p><strong>Programmes:</strong> {selectedCountry.programmes.join(' · ')}</p>
          {selectedCountry.story&&<p><strong>Story:</strong> {selectedCountry.story}</p>}
          <Link className="btn btn-outline" href={`/impact#filter-country-${selectedCountry.country.toLowerCase()}`}>View Stories</Link>
        </article>}
      </div>
      <button type="button" className={`country-card where-map-country-card where-map-usa-card ${selectedUSA?'is-selected':''}`} aria-pressed={selectedUSA} onClick={()=>{setSelectedCountry(null);setSelectedUSA(true)}} data-testid="usa-grants-office-card">
        <strong>USA</strong>
        <span>Grants and Admin Office</span>
        <small>Office details only; not shown on the Africa map.</small>
      </button>
    </div>
    {selectedUSA&&<article className="country-card where-map-selected-country" aria-live="polite" data-testid="selected-country-details">
      <h3>USA - Grants and Admin Office</h3>
      <p><strong>Programmes:</strong> Programme coverage information for this office is not supplied.</p>
    </article>}
    <p className="where-map-tor-badge">Country-level only - No precise locations - No personal data - TOR 4.11 Compliant</p>
 </section>
}
function WhereWeWorkPage(){
  return <main><PageHero eyebrow="Where We Work" title="East Africa" description="Country-level only. No school, village, or individual locations are shown."/><section className="home-section">
    <WhereWeWorkMap/>
  </section></main>
}
function PartnerEnquiryForm({programme,notify}:{programme:string;notify:(message:string)=>void}){
  const[sent,setSent]=useState(false);
  const submit=(event:FormEvent<HTMLFormElement>)=>{event.preventDefault();setSent(true);notify('Demo enquiry only. No partner message was sent.')};
  return <section className="soft-card partner-enquiry"><h2>Partner enquiry</h2>{sent?<div className="success-box" role="status">Thank you. This demo did not send your enquiry. Contact <a href="mailto:info@crvpf.org">info@crvpf.org</a> for a real enquiry.</div>:<form className="form-stack" onSubmit={submit}><input type="hidden" name="programme" value={programme}/><label>Organisation<input className="field" name="organisation" required/></label><label>Contact email<input className="field" type="email" name="email" required/></label><label>Message<textarea className="field" name="message" rows={4} required minLength={10}/></label><button className="btn" type="submit">Send demo enquiry</button><small>This form validates locally and does not send personal information.</small></form>}</section>
}
function GetInvolved({onDonate,notify}:{onDonate:()=>void;notify:(message:string)=>void}){
  const[email,setEmail]=useState('');
  const[newsletterDone,setNewsletterDone]=useState(false);
  return <main><PageHero eyebrow="Get Involved" title="Get Involved" description="Explore ways to connect with CRVPF. Demo forms do not send or store your information."/><section className="section"><div className="container"><div className="home-programme-grid involved-grid">
          <article className="home-programme-card" id="donate"><SectionPhoto file="IMG-20261114-WA3865_1794665428598.jpg" alt="Community members joining hands together." className="involved-card-photo"/><span className="home-programme-code">Donate</span><h3>Support the work</h3><p>Open the demo donation flow. No payment will be collected.</p><button type="button" className="btn" aria-label="Open donation options" onClick={onDonate}>Donate</button></article>
    <article className="home-programme-card" id="partner"><span className="home-programme-code">Partner</span><h3>Partner With Us</h3><p>Send a demo partnership enquiry. The form does not transmit or store personal information.</p><PartnerEnquiryForm programme="General partnership enquiry" notify={notify}/><Link className="home-learn-link" href="/partners">Open Partner Portal <ArrowRight size={15}/></Link></article>
    <article className="home-programme-card"><span className="home-programme-code">Volunteer</span><h3>Volunteer</h3><p>Contact CRVPF to ask about volunteer opportunities.</p><a className="home-learn-link" href="mailto:info@crvpf.org?subject=Volunteer%20enquiry">Email CRVPF <ArrowRight size={15}/></a></article>
    <article className="home-programme-card" id="newsletter"><span className="home-programme-code">Newsletter</span><h3>Stay connected</h3>{newsletterDone?<p role="status">Thank you! You're subscribed.</p>:<form className="form-stack" onSubmit={event=>{event.preventDefault();setNewsletterDone(true)}}><label>Email<input className="field" type="email" value={email} onChange={event=>setEmail(event.target.value)} required/></label><button className="btn" type="submit">Subscribe</button></form>}<small>Demo only; the address is not stored or sent.</small></article>
          <article className="home-programme-card" id="safeguarding"><SectionPhoto file="IMG-20261114-WA1691_1794665428867.jpg" alt="Women taking part in a facilitated group discussion." className="involved-card-photo"/><span className="home-programme-code">Safeguarding</span><h3>Report a concern</h3><p>Use the demo safeguarding form without naming children or exact locations.</p><SafeguardingReport notify={notify}/></article>
    <article className="home-programme-card" id="contact"><span className="home-programme-code">Contact</span><h3>Contact CRVPF</h3><p><a href="mailto:info@crvpf.org">info@crvpf.org</a><br/><a href="tel:+256393216519">(+256) 393 216 519</a></p><Link className="home-learn-link" href="/get-involved#contact">Contact details <ArrowRight size={15}/></Link></article>
  </div></div></section></main>
}
function ProgrammeDetail({slug,notify}:{slug:string;notify:(s:string)=>void}){
 const p=programs.find(x=>x.slug===slug);
 const approach=slug.endsWith('coordinated')?approachContent.coordinated:slug.endsWith('joint')?approachContent.joint:undefined;
 const short=p?.short||(slug.endsWith('coordinated')?'Coordinated':'Joint');
 const title=p?.name||approach?.title||'Programme';
 const summary=p?.summary||approach?.summary||'';
 const activities=p?.details||approach?.activities||[];
 const stories=p?storyData.filter(s=>s.program===p.short):[];
  const resources=p?.short==='PVAC'?[{title:'PVAC Program Profile',url:'https://crvpf.org/wp-content/uploads/2025/03/PVAC-Program-Profile.pdf'},{title:'Parenting for Respectability Module One: Bonding and attachment',url:'https://crvpf.org/wp-content/uploads/2025/03/MODULE-ONE_Bonding-and-attachment.pdf'},{title:'Parenting for Respectability Module 2',url:'https://crvpf.org/wp-content/uploads/2025/03/Parenting-for-Respectability-Module-2.pdf'},{title:'Parenting for Respectability Module 3',url:'https://crvpf.org/wp-content/uploads/2025/03/Parenting-for-Respectability-Module-3.pdf'},{title:'Parenting for Respectability Module 4',url:'https://crvpf.org/wp-content/uploads/2025/03/Parenting-for-Respectability-Module-4.pdf'},{title:'Parenting for Respectability Module 5',url:'https://crvpf.org/wp-content/uploads/2025/03/Parenting-for-Respectability-Module-5.pdf'}]:p?.short==='AGPP'?[{title:'AGPP Program Profile',url:'https://crvpf.org/wp-content/uploads/2025/03/AGPP-Program-Profile.pdf'},{title:'This Little Light of Mine · Module 1',url:'https://crvpf.org/wp-content/uploads/2025/03/ThisLittleLightofMine_Module1.pdf'},{title:'This Little Light of Mine · Module 2',url:'https://crvpf.org/wp-content/uploads/2025/03/ThisLittleLightofMine_Module2.pdf'},{title:'This Little Light of Mine · Module 3',url:'https://crvpf.org/wp-content/uploads/2025/03/ThisLittleLightofMine_Module3.pdf'},{title:'This Little Light of Mine · Module 4',url:'https://crvpf.org/wp-content/uploads/2025/03/ThisLittleLightofMine_Module4.pdf'},{title:'This Little Light of Mine · Module 5',url:'https://crvpf.org/wp-content/uploads/2025/03/5ThisLittleLightofMine_Module5.pdf'}]:p?.short==='EYDCD'?[{title:'EYDCD Program Profile',url:'https://crvpf.org/wp-content/uploads/2025/03/EYDCD-1.pdf'},{title:'EYDCD program page',url:'https://crvpf.org/empowering-youth-through-data-and-community-development-program/'}]:approach?[{title:'CRVPF approaches',url:'https://crvpf.org/our-approaches/'}]:[];
   const partnerships=p?.short==='EYDCD'?['Children’s Rights and Violence Prevention Fund (CRVPF)','gnuGrid CRB','Mastercard Foundation']:p?.short==='AGPP'?['KIWOHEDE','CRVPF community partners']:p?.short==='PVAC'?['Community organizations']:approach?.partnerships||[];
  const achievements=p?.short==='PVAC'?['Source: crvpf.org/our-programs/']:p?.short==='AGPP'?['10 Safe Spaces Established','+440 Adolescent Girls trained in life skills using This Little Light of Mine Manual.','+534 Adolescent Girls & Young Mothers regularly attending safe space meetings across East Africa','+388 Trained in Vocational and income generating skills','31 Children Aged 0 to 3 years registered under ECD']:p?.short==='EYDCD'?['400,000 young people (70% female)','250,000 dignified and fulfilling employment opportunities','200 community organizations','3,000 youth-led Village Savings and Loan Associations (VSLAs)']:['As per crvpf.org/our-approaches/'];
   const programmePhotos=short==='PVAC'?[{file:'IMG-20261114-WA3406_1794665428643.jpg',alt:'Community members gathered in a circle under a tree.'}]:short==='AGPP'?[{file:'IMG-20261114-WA9360_1794665429063.jpg',alt:'Women participating in a group session in a community room.'}]:short==='EYDCD'?[{file:'IMG-20261114-WA6776_1794665428683.jpg',alt:'People learning practical skills in a vocational workshop.'},{file:'IMG-20261114-WA5634_1794665428817.jpg',alt:'Young adults using mobile phones at an outdoor market.'}]:[];
     return <main><PageHero eyebrow={short} title={title} description={summary}/><section className="section"><div className="container"><div className="programme-summary-grid"><section className="soft-card"><h2>Objectives</h2><p>{summary}</p></section><section className="soft-card"><h2>Coverage</h2><p>CRVPF operates in Uganda, Kenya, Tanzania and Ethiopia.</p></section></div><div className="content-grid programme-content"><div><section className="soft-card" id="what-we-do"><h2>What We Do</h2>{programmePhotos.map(photo=><SectionPhoto key={photo.file} file={photo.file} alt={photo.alt} className="programme-section-photo"/>)}<ul className="check-list">{activities.map(item=><li key={item}>{item}</li>)}</ul></section><section className="soft-card"><h2>Achievements and targets</h2><ul className="check-list">{achievements.map(item=><li key={item}>{item}</li>)}</ul></section><section className="soft-card"><h2>Partnerships</h2><ul className="check-list">{partnerships.map(item=><li key={item}>{item}</li>)}</ul></section><PartnerEnquiryForm programme={short} notify={notify}/></div><aside><section className="soft-card"><h2>Stories</h2>{stories.length?stories.map(s=><div className="programme-story" key={s.name}><span className="tag">{s.country?`${s.program} · ${s.country}`:s.program}</span><h3>{s.name}</h3><p>{s.text}</p><small className="source-note"><a href={s.href} target="_blank" rel="noopener noreferrer">Source: crvpf.org</a></small><a href={s.href} target="_blank" rel="noopener noreferrer" className="arrow-link">Read story on CRVPF <ArrowRight size={14}/></a></div>):<p>As per crvpf.org.</p>}</section><section className="soft-card" style={{marginTop:16}}><h2>Resources</h2>{resources.map(item=><div className="resource-row" key={item.url}><span>{item.title}</span><a className="btn btn-outline" href={item.url} target="_blank" rel="noopener noreferrer">Open resource</a></div>)}<Link className="arrow-link" href="/resources">Open Resource Centre <ArrowRight size={14}/></Link></section></aside></div></div></section></main>
}

function Impact({country,setCountry,program,setProgram}:{country:string;setCountry:(s:string)=>void;program:string;setProgram:(s:string)=>void}){useEffect(()=>{const match=window.location.hash.match(/^#filter-country-(uganda|kenya|tanzania|ethiopia)$/i);if(match){const selected=countries.find(c=>c.toLowerCase()===match[1].toLowerCase());if(selected)setCountry(selected)}},[setCountry]);const filtered=storyData.filter(s=>(country==='All'||s.country===country)&&(program==='All'||s.program===program));return <main><PageHero eyebrow="Impact" title="Reach Through Our Partners: 2021 - 2023" description="CRVPF operates in Uganda, Kenya, Tanzania and Ethiopia."/><section className="section"><div className="container" id="impact-overview"><div className="filter-toolbar"><div><strong>Country</strong><div className="pill-row">{['All',...countries].map(v=><button id={`filter-country-${v.toLowerCase()}`} className={`pill ${country===v?'selected active':''}`} key={v} onClick={()=>setCountry(v)} data-testid={`filter-country-${v.toLowerCase()}`}>{v}</button>)}</div></div><div><strong>Programme</strong><div className="pill-row">{programmeFilters.map(v=><button className={`pill ${program===v?'selected active':''}`} key={v} onClick={()=>setProgram(v)} data-testid={`filter-program-${v.toLowerCase()}`}>{v}</button>)}</div></div></div><p className="showing-count" role="status">Showing {filtered.length} stories</p><SectionPhoto file="IMG-20261114-WA2253_1794665428965.jpg" alt="A woman speaking with community members gathered outdoors." className="stories-section-photo"/>{filtered.length?<div className="impact-grid">{filtered.map((s,i)=><article className="impact-card" id={`story-${s.name.toLowerCase().replaceAll(' ','-')}`} key={s.name}><span className="tag">{s.country?`${s.country} · ${s.program}`:s.program}</span><h2>{s.name}</h2><p>{s.text}</p>{s.quote&&<blockquote className="story-quote">“{s.quote}”</blockquote>}<small className="source-note"><a href={s.href} target="_blank" rel="noopener noreferrer">Source: crvpf.org</a></small><span className="tag">{i+1} / {filtered.length}</span></article>)}</div>:<div className="empty-state">No stories found</div>}</div></section></main>}
function Annual({notify}:{notify:(s:string)=>void}){
 const[email,setEmail]=useState(''),[name,setName]=useState(''),[copies,setCopies]=useState('1'),[delivery,setDelivery]=useState('Kampala'),[newsletterDone,setNewsletterDone]=useState(false);
 const printQuote=(e:FormEvent)=>{e.preventDefault();notify('Demo quote request only; no order was sent.')};
 const chapters=[
  ['Bold Movements','As we celebrate 10 years of impact, CRVPF is proud to present a rich collection of stories highlighting the lived experiences of our partners, the communities they support, and our shared journey.','https://crvpf.org/bold-movements/'],
  ['Annual Report CRVPF 2025','Annual Report CRVPF 2025',reportUrls[1]],
  ['Bold Threads & Bolder Futures: Inside the Pakasa Fashion Show','Led by Joanita (Joanna) Nabagesera, founder and CEO of Lulungi Couture and an alumna of the Empowering Youth Through Data and Community Development (EYDCD) program implemented by CRVPF, gnuGrid CRB and community partners, with support from Mastercard Foundation.','https://crvpf.org/edition-2-2026/'],
  ['She Found Her Voice and Began Helping Others Find Theirs: Doreen’s Story','Through the Safe Space intervention under CRVPF’s Adolescent Girls Power Program (AGPP), Doreen learned hairdressing, snack making, flower weaving, marketing, saving, and leadership skills alongside other girls and young mothers.','https://crvpf.org/edition-2-2026/'],
  ['Fathers Believe Other Fathers: Juma’s Story','Through the Father on Duty movement under CRVPF’s Prevention of Violence against Children and Young People (PVAC) program, fathers gather in spaces where men speak openly with other men about parenting, relationships, pressure, anger, and responsibility.','https://crvpf.org/edition-2-2026/'],
  ['Priscilla Kirabo','EYDCD Youth Representative Priscilla Kirabo encouraged young people to use digital tools strategically to generate income and build livelihoods.','https://crvpf.org/edition-2-2026/']
 ];
  return <main><PageHero eyebrow="Annual Reports" title="Annual Report CRVPF 2025" description="Source: crvpf.org/knowledge-hub-2/"/><section className="section"><div className="container"><div className="annual-intro"><div><span className="section-kicker">BOLD MOVEMENTS — Celebrating 10 years of impact!</span><h2>Welcome to Bold Movements!</h2><p>Across communities in Uganda, Kenya, Tanzania, and Ethiopia, young people, parents, mentors, and community leaders are creating change in ways that are bold, practical, and deeply human.</p><small className="source-note"><a href="https://crvpf.org/bold-movements/" target="_blank" rel="noopener noreferrer">Source: crvpf.org/bold-movements/</a></small></div><EditionPhoto className="annual-photo"/></div><div className="annual-chapters">{chapters.map(([title,text,href])=><article className="annual-chapter" key={title}><span>{title}</span><p>{text}</p><small className="source-note"><a href={href} target="_blank" rel="noopener noreferrer">Source: crvpf.org</a></small></article>)}</div><section className="annual-chart-card"><h2>Reach Through Our Partners: 2021 - 2023</h2><div className="annual-bars"><div className="annual-bar-row"><span>Program participants</span><div><i style={{width:'100%'}}/></div><strong>1,330</strong></div><div className="annual-bar-row"><span>Young people engaged in dignified and fulfilling work</span><div><i style={{width:'19%'}}/></div><strong>253</strong></div><div className="annual-bar-row"><span>Parents participating in weekly savings and lending meetings</span><div><i style={{width:'7%'}}/></div><strong>88</strong></div><div className="annual-bar-row"><span>Adolescent girls regularly attending safe space meetings</span><div><i style={{width:'6%'}}/></div><strong>74</strong></div></div><small className="source-note"><a href="https://crvpf.org/" target="_blank" rel="noopener noreferrer">Source: crvpf.org/</a></small></section><div className="annual-quote-grid"><blockquote>“Just because you are a teen mother does not mean your life is over. You can still achieve your dreams and become someone in life.” — Doreen<small className="source-note"><a href="https://crvpf.org/edition-2-2026/" target="_blank" rel="noopener noreferrer">Source: crvpf.org/edition-2-2026/</a></small></blockquote><blockquote>“Father on Duty taught me that being a man means caring, listening, and protecting my family without violence.” — Juma<small className="source-note"><a href="https://crvpf.org/edition-2-2026/" target="_blank" rel="noopener noreferrer">Source: crvpf.org/edition-2-2026/</a></small></blockquote></div><section className="soft-card annual-actions"><h2>Download and share</h2><a className="btn btn-blue" href={reportUrls[1]} target="_blank" rel="noopener noreferrer">Download Annual Report CRVPF 2025</a><button className="btn btn-outline" onClick={async()=>{try{await navigator.clipboard.writeText(reportUrls[1]);notify('Annual Report CRVPF 2025 link copied.')}catch{notify('Copy is unavailable in this browser.')}}}>Copy report link</button><a className="btn btn-outline" href={`mailto:info@crvpf.org?subject=${encodeURIComponent('Annual Report CRVPF 2025')}&body=${encodeURIComponent(reportUrls[1])}`}>Share by email</a></section><section className="social-cards"><article className="soft-card"><strong>Share the report</strong><p>Annual Report CRVPF 2025</p><button className="btn btn-outline" onClick={async()=>{try{if(navigator.share){await navigator.share({title:'Annual Report CRVPF 2025',url:reportUrls[1]})}else notify('Device sharing is not available here. Use Copy report link.')}catch{notify('Sharing was cancelled or is unavailable.')}}}>Share</button></article><article className="soft-card"><strong>Printed-copy quote · demo</strong><p>This demo does not submit a print order.</p><form className="form-stack" onSubmit={printQuote}><label>Name<input className="field" value={name} onChange={e=>setName(e.target.value)} required minLength={2}/></label><label>Copies<input className="field" type="number" min="1" max="100" value={copies} onChange={e=>setCopies(e.target.value)} required/></label><label>Delivery<select className="field" value={delivery} onChange={e=>setDelivery(e.target.value)}><option>Kampala</option><option>Upcountry</option></select></label><button className="btn btn-orange" type="submit">Get Quote</button></form></article></section><section className="newsletter annual-newsletter" id="newsletter"><div><div className="section-kicker">Newsletter</div><h2>Get CRVPF updates</h2><p>Demo signup - will connect to CRVPF Mailchimp on approval.</p><a href="mailto:info@crvpf.org?subject=CRVPF%20newsletter%20signup">Fallback: email info@crvpf.org</a></div>{newsletterDone?<p role="status">Thank you! You're subscribed.</p>:<form className="form-stack" onSubmit={event=>{event.preventDefault();setNewsletterDone(true);notify("Thank you! You're subscribed.")}}><label>Email<input className="field" type="email" value={email} onChange={e=>setEmail(e.target.value)} required/></label><button className="btn btn-blue" type="submit">Join newsletter</button><Link href="/#newsletter" className="arrow-link">Outlook template preview on home page</Link></form>}</section></div></section></main>
}

function Dashboard({year,setYear,notify}:{year:number;setYear:(y:number)=>void;notify:(s:string)=>void}){
 const[tab,setTab]=useState('Audit'),period=year>=2021&&year<=2023,years=Array.from({length:12},(_,i)=>2015+i);
 const milestone=period?'CRVPF publishes aggregate results for 2021–2023; it does not publish a breakdown for this selected year.':'No year-specific result was supplied for this year.';
 const partners=[['Sanyu Centre for Arts and Rights (SARI)','Named in Beatrice’s story']];
  return <main><PageHero eyebrow="Interactive dashboard · demo" title="Impact overview" description="Published CRVPF figures for 2021–2023; this demo does not show live data."/><section className="section"><div className="container"><div className="dashboard-stats"><article><span>Program participants · 2021–2023</span><strong>1,330</strong></article><article><span>Young people engaged in dignified and fulfilling work</span><strong>253</strong></article><article><span>Parents participating in weekly savings and lending meetings</span><strong>88</strong></article></div><small className="source-note">Source: crvpf.org/</small><label className="year-slider-label" htmlFor="year-slider">Year: {year} · 2015–2026</label><input id="year-slider" className="year-control" type="range" min="2015" max="2026" value={year} onChange={e=>setYear(Number(e.target.value))} data-testid="slider-year"/><div className="dashboard-layout"><div className="dashboard-main"><MapPanel timelineYear={year}/><div className="soft-card dashboard-chart-card"><h2>Published Results · 2021–2023</h2><p>{milestone} No annual values are inferred.</p><div className="timeline-chart" aria-label={`Timeline from 2015 to 2026, selected ${year}; program period values only`}>{years.map(y=><button key={y} type="button" className={`timeline-year ${y===year?'selected':''} ${period&&y>=2021&&y<=2023?'documented':''}`} onClick={()=>setYear(y)} aria-label={`Select ${y}`}><span>{y}</span></button>)}</div><div className="chart-period-values"><div><strong>1,330</strong><span>Program participants, 2021–2023</span></div><div><strong>253</strong><span>Young people engaged in dignified and fulfilling work</span></div><div><strong>88</strong><span>Parents in weekly savings and lending meetings</span></div><div><strong>74</strong><span>Adolescent girls at safe space meetings</span></div></div><small className="source-note">Source: crvpf.org · period totals only, not annual series</small></div><div className="dashboard-cms-card soft-card"><h2>Safeguarding-First CMS Panel</h2><ul className="check-list"><li>Consent signed</li><li>No full name</li><li>No school or exact location</li><li>Communications approved</li></ul><Link className="btn btn-orange" href="/admin-demo">Open Safeguarding CMS</Link></div></div><aside className="dashboard-side"><section className="soft-card"><h2>Partner Portal Preview</h2><span className="tag">DEMO · NOT LIVE</span>{partners.map(([name,status])=><div className="partner-preview-row" key={name}><strong>{name}</strong><span>{status}</span></div>)}<small className="source-note">The CRVPF source names SARI in Beatrice’s story; it does not publish grant statuses or partner account records.</small><Link href="/partners" className="arrow-link">Open Partner Portal <ArrowRight size={14}/></Link></section><section className="soft-card board-summary"><h2>Board Summary</h2><p>Published programme-period results, safeguarding demo status and country map.</p><button className="btn btn-outline" onClick={()=>window.print()}>Print summary</button></section></aside></div><section className="soft-card dashboard-tabs-card"><div className="tabs" role="tablist">{['Audit','Analytics','Hosting','Training'].map(t=><button role="tab" aria-selected={tab===t} className={tab===t?'active':''} key={t} onClick={()=>setTab(t)}>{t}</button>)}</div><DashboardTab tab={tab} notify={notify}/></section><div className="dashboard-mobile-links"><Link className="soft-card" href="/admin-demo">Safeguarding CMS <ArrowRight size={14}/></Link><Link className="soft-card" href="/partners">Partner Portal <ArrowRight size={14}/></Link></div></div></section></main>
}
function Partners({tab,setTab,login,setLogin,notify}:{tab:string;setTab:(s:string)=>void;login:boolean;setLogin:(b:boolean)=>void;notify:(s:string)=>void}){
 const[email,setEmail]=useState(''),[password,setPassword]=useState(''),[error,setError]=useState('');
 const tabs=['My Grants','Reports Due','My Stories','Messages'];
 const sign=(e:FormEvent)=>{e.preventDefault();if(email==='demo@crvpf.org'&&password==='demo123'){setLogin(true);setError('');notify('Partner demo dashboard opened.')}else setError('Invalid demo credentials. Use demo@crvpf.org / demo123')};
 return <main><PageHero eyebrow="Partner portal" title="Partner workspace" description="A local demo account shows source information only; it is not connected to live partner data."/><section className="section"><div className="container">{!login?<div className="content-grid"><div className="soft-card"><h2>Sign in to the demo</h2><p>Demo email: demo@crvpf.org · Password: demo123</p><div className="notice">This demo has no external account service. In final WordPress, Partner role sees only own grants.</div></div><form className="soft-card form-stack" onSubmit={sign}><label>Email<input className="field" type="email" value={email} onChange={e=>setEmail(e.target.value)} autoComplete="username" required/></label><label>Password<input className="field" type="password" value={password} onChange={e=>setPassword(e.target.value)} autoComplete="current-password" required/></label>{error&&<div className="error-box" role="alert">{error}</div>}<button className="btn btn-green" type="submit">Sign in</button></form></div>:<div className="soft-card"><div className="portal-heading"><div><span className="section-kicker">Demo partner · Sanyu Centre for Arts and Rights (SARI)</span><h2>Partner Portal</h2></div><button className="btn btn-outline" onClick={()=>setLogin(false)}>Sign out</button></div><div className="notice">Demo partner view only. No live account, grant, report, message, or access-control service is connected. In final WordPress, Partner role sees only own grants.</div><div className="tabs" style={{marginTop:24}} role="tablist">{tabs.map(t=><button role="tab" aria-selected={tab===t} className={tab===t?'active':''} key={t} onClick={()=>setTab(t)}>{t}</button>)}</div><div className="portal-tab-panel"><h3>{tab}</h3>{tab==='My Grants'?<article className="result-card"><strong>Sanyu Centre for Arts and Rights (SARI)</strong><p>As per crvpf.org.</p><a href="https://crvpf.org/baskets-bonds-and-bold-women-a-story-of-sisterhood-and-strength/" target="_blank" rel="noopener noreferrer">Source story</a></article>:tab==='Reports Due'?<article className="result-card"><strong>Reports Due</strong><p>As per crvpf.org.</p><a href="https://crvpf.org/knowledge-hub-2/" target="_blank" rel="noopener noreferrer">Open CRVPF Knowledge Hub</a></article>:tab==='My Stories'?<article className="result-card"><strong>Beatrice · story reference</strong><p>Sanyu Centre for Arts and Rights (SARI), One Voice Savings Group, and Kyisa Kya Maria Arts and Crafts Group are named in the story.</p><a href="https://crvpf.org/baskets-bonds-and-bold-women-a-story-of-sisterhood-and-strength/" target="_blank" rel="noopener noreferrer">Read the story on CRVPF</a></article>:<article className="result-card"><strong>Messages</strong><p>No live messages are connected. For a real enquiry, email <a href="mailto:info@crvpf.org">info@crvpf.org</a>.</p></article>}</div></div>}</div></section></main>
}
function Admin({items,onPublish,notify}:{items:AdminStory[];onPublish:(s:AdminStory)=>void;notify:(s:string)=>void}){
 const[title,setTitle]=useState(''),[country,setCountry]=useState(''),[programme,setProgramme]=useState(''),[story,setStory]=useState(''),[photo,setPhoto]=useState(''),[anonymous,setAnonymous]=useState(false),[checks,setChecks]=useState([false,false,false,false]),[gateWarning,setGateWarning]=useState(false);
 const[drafts,setDrafts]=useState<string[]>(()=>{try{return JSON.parse(localStorage.getItem('crvpf-newsletter-drafts')||'[]')}catch{return[]}});
 const ready=checks.every(Boolean);
 const updateCheck=(index:number,value:boolean)=>{const next=checks.map((item,i)=>i===index?value:item);setChecks(next);if(next.every(Boolean))setGateWarning(false)};
 const warnGate=()=>{if(!ready){setGateWarning(true);notify('Safeguarding gate: Complete all 4 checks.')}};
 const submit=(e:FormEvent<HTMLFormElement>)=>{e.preventDefault();if(!ready){warnGate();return}const audit='Published by Demo User, Approved by Communications, 13 Nov 2026, 15:42';onPublish({id:`story-${Date.now()}`,title:title.trim(),country,programme,story:story.trim(),status:'Published',anonymous,audit});e.currentTarget.reset();setTitle('');setCountry('');setProgramme('');setStory('');setPhoto('');setAnonymous(false);setChecks([false,false,false,false]);setGateWarning(false);notify('Story published to this browser’s Published Stories list.')};
 const generateDraft=()=>{const draft='CRVPF advances the safety and rights of children and young people by working with community organizations through cluster partnerships. This draft uses supplied CRVPF text and requires Communications approval.';const next=[draft,...drafts];setDrafts(next);localStorage.setItem('crvpf-newsletter-drafts',JSON.stringify(next));notify('Newsletter draft added to the Communications Review queue.')};
  return <main><PageHero eyebrow="Safeguarding CMS · demo" title="Publish a story in 2 minutes - no code" description="Local demo workflow: Draft → Communications Review → Approved → Published."/><section className="section"><div className="container"><div className="cms-workflow" aria-label="Draft to published workflow">{['Draft','Communications Review','Approved','Published'].map((step,i)=><span key={step}>{i>0&&<b>→</b>}{step}</span>)}</div><div className="content-grid cms-layout"><form className="soft-card form-stack" onSubmit={submit}><h2>Story draft</h2><label>Title<input className="field" value={title} onChange={e=>setTitle(e.target.value)} required minLength={3}/></label><label>Country<select className="field" value={country} onChange={e=>setCountry(e.target.value)} required><option value="">Select country</option>{countries.map(c=><option key={c}>{c}</option>)}</select></label><label>Programme<select className="field" value={programme} onChange={e=>setProgramme(e.target.value)} required><option value="">Select programme</option>{programmeFilters.slice(1).map(c=><option key={c}>{c}</option>)}</select></label><label>Story text<textarea className="field" rows={6} value={story} onChange={e=>setStory(e.target.value)} required minLength={10}/></label><label>Photo placeholder<input className="field" type="file" accept="image/*" onChange={e=>setPhoto(e.target.files?.[0]?.name||'')}/></label>{photo&&<div className="notice">Selected locally: {photo}. It will not be uploaded in this demo.</div>}<div className="safeguarding-checks"><strong>Safeguarding · all four checks required</strong>{['Consent signed','No full name for under-18','No school/exact location','Communications approved'].map((item,i)=><label className="check-row" key={item}><input type="checkbox" checked={checks[i]} onChange={e=>updateCheck(i,e.target.checked)}/>{item}</label>)}</div><label className="check-row"><input type="checkbox" checked={anonymous} onChange={e=>setAnonymous(e.target.checked)}/>Keep author anonymous in the preview</label><div className="cms-publish-button-wrap" onClick={warnGate}><button disabled={!ready} className="btn primary-action cms-publish-button" type="submit" data-testid="button-cms-publish">Publish <ArrowRight size={16}/></button></div>{gateWarning&&<div className="safeguarding-warning" role="alert">Safeguarding gate: Complete all 4 checks.</div>}<small className="notice">Publish remains disabled until all four safeguarding checks are complete. Required story fields are also validated before publishing. Do not include sensitive locations.</small></form><aside className="cms-side"><section className="soft-card"><h2>Published Stories</h2>{items.length?items.map(item=><article className="published-story" key={item.id}><span className="tag">{item.country} · {item.programme} · {item.status}</span><h3>{item.title}</h3><p>{item.story}</p>{item.status==='Published'&&<><small>Author: {item.anonymous?'Anonymous':'Not supplied'}</small><p className="audit-log">{item.audit||'Published by Demo User, Approved by Communications, 13 Nov 2026, 15:42'}</p></>}</article>):<div className="empty-state">Published stories added in this browser appear here.</div>}</section><section className="soft-card"><h2>Auto Content Studio · demo</h2><p>Generate a newsletter draft from supplied CRVPF text. It is not sent automatically.</p><button className="text-action-link" type="button" onClick={generateDraft}>Generate Draft with Auto Content Studio <ArrowRight size={14}/></button><strong className="draft-only-label">Draft only - requires Communications approval before sending via Mailchimp.</strong><h3>Review queue</h3>{drafts.map((draft,i)=><div className="result-card" key={`${i}-${draft.slice(0,10)}`}><span className="tag">Communications Review</span><p>{draft}</p></div>)}{!drafts.length&&<div className="empty-state">Generated drafts appear here for review.</div>}</section></aside></div></div></section></main>
}
function Publications({notify}:{notify:(message:string)=>void}){
  const[q,setQ]=useState('');
  const[filter,setFilter]=useState('All');
  const events=[{title:'Bold Threads & Bolder Futures: Inside the Pakasa Fashion Show',type:'Event',description:'The Pakasa Art and Fashion Showcase was held in celebration of International Women’s Day 2026.',href:'https://crvpf.org/edition-2-2026/'}];
  const entries=[
    {title:'Annual Report 2026',type:'Publication',description:'Cover and PDF link pending CRVPF approval.',href:''},
    ...storyData.map(s=>({title:s.name,type:'Story',description:s.text,href:s.href})),
    ...reportItems.map((title,i)=>({title,type:'Publication',description:title,href:reportUrls[i]})),
    ...events,
  ];
  const types=['All','Story','Publication','Newsletter','Event','Video'];
  const filtered=entries.filter(e=>(filter==='All'||e.type===filter)&&(q.trim()===''||`${e.title} ${e.description}`.toLowerCase().includes(q.trim().toLowerCase())));
  return <main>
    <PageHero eyebrow="Resources" title="Knowledge Hub" description="Welcome to our Knowledge Hub, a dedicated space where you can explore valuable resources that inform and inspire."/>
    <section className="section"><div className="container">
      <div className="archive-controls">
        <label>Search archive<input className="field" value={q} onChange={e=>setQ(e.target.value)} placeholder="Search stories, publications, events…" data-testid="input-archive-search"/></label>
        <div className="pill-row">{types.map(t=><button key={t} className={`pill ${filter===t?'selected':''}`} onClick={()=>setFilter(t)} data-testid={`publication-filter-${t.toLowerCase()}`}>{t==='Story'?'Stories':t==='Publication'?'Publications':t==='Event'?'Events':t==='Video'?'Videos':t==='Newsletter'?'Newsletters':t}</button>)}</div>
      </div>
      <p className="showing-count" role="status">{filtered.length} results</p>
      <section className="soft-card publication-newsletter-note">
        <h2>Newsletters</h2>
        <p>No newsletter editions have been supplied for this demo.</p>
      </section>
      {filtered.length?<div className="archive-grid">{filtered.map(entry=><article className="archive-card" id={entry.title==='Annual Report 2026'?'publication-annual-report-2026':entry.type==='Publication'?`publication-${reportItems.indexOf(entry.title)}`:undefined} key={`${entry.type}-${entry.title}`}>
        {entry.title==='Annual Report 2026'&&<div className="annual-cover-placeholder" role="img" aria-label="Annual Report 2026 cover artwork awaiting CRVPF approval">Annual Report 2026<br/><small>Cover pending approval</small></div>}
        <span className="tag">{entry.type}</span><h2>{entry.title}</h2><p>{entry.description}</p>
        {entry.title==='Annual Report 2026'
          ?<button className="btn btn-outline" type="button" onClick={()=>notify('Demo PDF - Annual Report 2026 download awaits CRVPF approval.')} data-testid="button-download-annual-report-2026">Download PDF</button>
          :<a className="btn btn-outline" href={entry.href} target="_blank" rel="noopener noreferrer">{entry.type==='Publication'?'Download':'Read on CRVPF'}</a>}
      </article>)}</div>:<div className="empty-state">{filter==='All'?'No archive items match your search.':`No ${filter.toLowerCase()} entries were found.`}</div>}
      <p className="notice" style={{marginTop:24}}>Newsletter and video records are not listed in the current source pages.</p>
      <a className="arrow-link" href="https://crvpf.org/knowledge-hub-2/" target="_blank" rel="noopener noreferrer">Open CRVPF Knowledge Hub <ArrowRight size={14}/></a>
    </div></section>
  </main>
}
function LowNetworkBanner(){
  const[online,setOnline]=useState(typeof navigator==='undefined'?true:navigator.onLine);
  const[textOnly,setTextOnly]=useState(()=>document.documentElement.classList.contains('text-only-mode'));
  useEffect(()=>{const on=()=>setOnline(true),off=()=>setOnline(false);window.addEventListener('online',on);window.addEventListener('offline',off);return()=>{window.removeEventListener('online',on);window.removeEventListener('offline',off)}},[]);
  useEffect(()=>{document.documentElement.classList.toggle('text-only-mode',textOnly);return()=>document.documentElement.classList.remove('text-only-mode')},[textOnly]);
  return <div className="low-network-banner" role="status">
    <span>{online?'Works on low network · system fonts and lazy-loaded CRVPF photos':'Offline · cached app shell may load; remote CRVPF photos need a connection'}</span>
    <button type="button" className="low-data-toggle" aria-pressed={textOnly} onClick={()=>setTextOnly(value=>!value)}>{textOnly?'Show images':'Low data? Click for text-only version.'}</button>
  </div>
}
function WhatsAppContactButton(){
  const[open,setOpen]=useState(false);
  return <>
    <button className="floating-whatsapp" type="button" aria-label="Contact via WhatsApp - To be confirmed with CRVPF" onClick={()=>setOpen(true)} data-testid="floating-whatsapp">
      <MessageCircle size={22}/><span>WhatsApp</span>
    </button>
    {open&&<Modal title="Contact via WhatsApp - To be confirmed with CRVPF" onClose={()=>setOpen(false)}>
      <p>The official WhatsApp contact route is a Demo Placeholder. To be confirmed with CRVPF.</p>
      <p>No message was sent.</p>
    </Modal>}
  </>;
}
function ElitechStudios(){const studios=[['Diglo Ventures','Web + Systems Studio','Project by Elitech Technologies','https://diglo-ventures.replit.app'],['Brimas Media','Photography, Video, Storytelling','Project by Elitech Technologies','https://brimasmedia.co'],['Print Garage','Print, Annual Report, Banners','Project by Elitech Technologies','https://printgarage.online'],['Auto Content Studio','Content Automation, Newsletters, Mailchimp Drafts','System Owned by Elitech Technologies','https://autocontentstudio.site']];return <section className="elitech-studios"><h2>Powered by ELITECH TECHNOLOGIES</h2><p className="elitech-subtitle">Selected Projects Elitech Technologies Has Worked On</p><div className="elitech-grid">{studios.map(([name,description,ownership,url])=><article className="elitech-card" key={name}><strong>{name}</strong><span>{description}</span><small>{ownership}</small><a href={url} target="_blank" rel="noopener noreferrer">Visit Site →</a></article>)}</div><p className="elitech-ownership-note">These are Elitech Technologies projects and systems, not owned by CRVPF. CRVPF is a client / partner.</p></section>}
function SafeguardingReport({notify}:{notify:(s:string)=>void}){const[open,setOpen]=useState(false),[anonymous,setAnonymous]=useState(true),[details,setDetails]=useState('');const submit=(e:FormEvent)=>{e.preventDefault();if(details.trim().length<10){notify('Add a short description of the concern.');return}setOpen(false);setDetails('');notify(`Demo only: this ${anonymous?'anonymous ':''}concern was not sent. Contact info@crvpf.org or (+256) 393 216 519 for a real enquiry.`)};return <><button className="btn btn-orange" onClick={()=>setOpen(true)}>One-tap Report Concern</button>{open&&<Modal title="Report a concern" onClose={()=>setOpen(false)}><p>Do not include a child’s full name, school, or exact location. This local demo does not send or store a report.</p><form className="form-stack" onSubmit={submit}><label className="check-row"><input type="checkbox" checked={anonymous} onChange={e=>setAnonymous(e.target.checked)}/>Submit anonymously</label><label>Concern<textarea className="field" rows={5} value={details} onChange={e=>setDetails(e.target.value)} minLength={10} required/></label><button className="btn btn-orange" type="submit">Submit demo report</button></form></Modal>}</>}
function WhatsAppSignup({notify}:{notify:(s:string)=>void}){const[number,setNumber]=useState('');return <div className="whatsapp-signup"><form className="form-stack" onSubmit={e=>{e.preventDefault();notify('WhatsApp signup is a local demo; no number was stored or subscribed.');setNumber('')}}><label>WhatsApp number<input className="field" value={number} onChange={e=>setNumber(e.target.value)} type="tel" required minLength={6}/></label><button className="btn btn-green" type="submit">Preview signup</button></form><button className="btn btn-outline" onClick={()=>notify('USSD *384* is a concept only; it is not an active short code.')}>USSD *384* concept</button></div>}
function DashboardTab({tab,notify}:{tab:string;notify:(s:string)=>void}){const[tested,setTested]=useState(false);if(tab==='Audit')return <div className="dashboard-tab-content"><h3>WordPress audit checklist</h3><ul className="check-list">{['Security','Backups','Performance','SEO','Accessibility','i3C hosting'].map(x=><li key={x}>{x} · details to be confirmed in the live WordPress installation</li>)}</ul></div>;if(tab==='Analytics')return <div className="dashboard-tab-content"><h3>Analytics</h3><div className="analytics-preview">{['Page views','Top stories','Signups'].map(x=><article key={x}><strong>{x}</strong><span>Analytics data not connected</span></article>)}</div></div>;if(tab==='Hosting')return <div className="dashboard-tab-content"><h3>Hosting comparison</h3><div className="table-scroll"><table><thead><tr><th>Item</th><th>i3C hosting</th><th>Alternative</th></tr></thead><tbody>{['Hosting status','Performance details','Support details','Price'].map(x=><tr key={x}><td>{x}</td><td>To confirm</td><td>Not supplied</td></tr>)}</tbody></table></div></div>;return <div className="dashboard-tab-content"><h3>Training</h3><p>Publish in 2 mins · use the SOP and run the test.</p><Link className="arrow-link" href="/training">Open Training Hub <ArrowRight size={14}/></Link><button className="btn btn-green" onClick={()=>{setTested(true);notify('Training test checklist opened.')}}>Test</button>{tested&&<p role="status">Test ready: complete one story, one newsletter and one event on the Training Hub.</p>}</div>}
function Training({notify}:{notify:(s:string)=>void}){
  const[done,setDone]=useState([false,false,false]);
  const[attendance,setAttendance]=useState(false);
  const steps=['Publish 1 story alone','Publish 1 newsletter alone','Publish 1 event alone'];
  const procedures=[
    ['Publish Story Safely','Draft the story, confirm consent, remove full names for under-18s and school/exact-location details, complete the four-check safeguarding gate, and wait for Communications approval before publishing.'],
    ['Update Programme Page','Use approved CRVPF text, choose the correct programme, check the links, preview the page on mobile, and submit it for Communications approval.'],
    ['Backup + Attendance Checklist','Record training attendance. Before site updates, back up WordPress files and database, store the copy separately, note the date, and verify the restore steps.'],
  ];
  return <main><PageHero eyebrow="Training Hub" title="Publish in 2 mins" description="Staff must demonstrate each task alone before training is signed off."/><section className="section"><div className="container">
    <div className="training-sop-grid">{procedures.map(([title,description])=><article className="soft-card" key={title}><h2>{title}</h2><p>{description}</p>{title.startsWith('Publish Story')&&<Link className="btn btn-green" href="/admin-demo">Open publishing practice</Link>}{title.startsWith('Backup')&&<label className="check-row"><input type="checkbox" checked={attendance} onChange={event=>setAttendance(event.target.checked)}/>Attendance recorded</label>}</article>)}</div>
    <div className="soft-card training-demo-checklist"><h2>Staff demonstration checklist</h2>{steps.map((step,index)=><label className="check-row" key={step}><input type="checkbox" checked={done[index]} onChange={event=>setDone(done.map((value,item)=>item===index?event.target.checked:value))}/>{step}</label>)}<button className="btn btn-green" onClick={()=>notify(done.every(Boolean)&&attendance?'Training demonstration and attendance checklist complete.':'Complete all three solo publishing tests and record attendance first.')}>Test training completion</button><p>{done.filter(Boolean).length} of 3 demonstrations checked · Attendance {attendance?'recorded':'not recorded'}.</p></div>
  </div></section></main>
}
function Handover({notify}:{notify:(s:string)=>void}){
  const[checks,setChecks]=useState([false,false,false,false,false]);
  const items=['Admin Access','Plugin/Licence List','Backup','Password Handover','Who to Contact'];
  const backup='Before updates: take a full backup of WordPress files and database; store it separately; record the date; verify the backup can be restored; do not overwrite the only copy.';
  return <main><PageHero eyebrow="Handover" title="Handover checklist and operating notes" description="A working handover template. Confirm host-specific items with the current administrator."/><section className="section"><div className="container handover-grid">
    <section className="soft-card"><h2>Checklist</h2>{items.map((item,index)=><label className="check-row" key={item}><input type="checkbox" checked={checks[index]} onChange={event=>setChecks(checks.map((value,i)=>i===index?event.target.checked:value))}/>{item}</label>)}<p>{checks.filter(Boolean).length} / {items.length} checked</p></section>
    <section className="soft-card"><h2>Reach Through Our Partners · 2021–2023</h2><p>Program participants: 178,591</p><p>Young people engaged in dignified and fulfilling work: 34,078</p><p>Parents participating in weekly savings and lending meetings: 11,884</p><p>Adolescent girls regularly attending safe space meetings: 10,000</p><p>East African countries: Uganda, Kenya, Tanzania, Ethiopia</p><small className="source-note">Source: CRVPF Reach 2021-2023. To be verified with CRVPF Communications team before launch.</small></section>
    <section className="soft-card"><h2>Plugin/Licence List</h2><p>Live WordPress plugin and licence details: To be confirmed with CRVPF after admin access is provided.</p></section>
    <section className="soft-card"><h2>Password Handover</h2><p>No passwords are collected or stored in this demo. Transfer credentials only through CRVPF’s approved secure channel.</p></section>
    <section className="soft-card"><h2>Who to Contact</h2><p><a href="mailto:info@crvpf.org">info@crvpf.org</a><br/><a href="tel:+256393216519">(+256) 393 216 519</a></p><p>WhatsApp / Email support route: To be confirmed with CRVPF.</p></section>
    <section className="soft-card"><h2>Backup Procedure</h2><ol className="numbered-list"><li>Back up both the WordPress database and files before updates.</li><li>Store a copy separately from the production host.</li><li>Record date and scope; verify restore steps on a safe environment.</li><li>Keep the previous known-good backup until the site is checked.</li></ol><button className="btn btn-outline" onClick={async()=>{try{await navigator.clipboard.writeText(backup);notify('Backup procedure copied.')}catch{notify('Clipboard is not available here.')}}}>Copy procedure</button></section>
    <section className="soft-card"><h2>Final Report Outline</h2><ol className="numbered-list"><li>Summary and delivery status</li><li>Approved content and pages handed over</li><li>Analytics and downloads: To be confirmed with CRVPF</li><li>Safeguarding and training checklist status</li><li>Open actions and next reporting period</li></ol></section>
  </div></section></main>
}
function Financial(){const lines=[['WordPress audit',1200000],['Design',2500000],['Homepage + Full Site',4500000],['Maps + SEO + Mailchimp',1800000],['Annual Report',850000],['Training',1200000]];const development=lines.reduce((sum,[,amount])=>sum+Number(amount),0);const total=development+1800000+500000;const payments=[['30%','Inception',total*.3],['30%','Homepage · 14 Dec',total*.3],['25%','Full Site · 31 Jan',total*.25],['15%','Handover',total*.15]];return <main><PageHero eyebrow="Financial" title="Project estimate" description="Amounts shown in UGX. Payment is due only on approval."/><section className="section"><div className="container"><div className="notice">All amounts are VAT inclusive as specified. The development subtotal is calculated from the listed line items.</div><div className="table-scroll"><table className="financial-table"><thead><tr><th>Category / item</th><th>Amount (UGX)</th></tr></thead><tbody><tr><th>A · Development</th><td>{development.toLocaleString()}</td></tr>{lines.map(([name,amount])=><tr key={String(name)}><td>{name}</td><td>{Number(amount).toLocaleString()}</td></tr>)}<tr><th>B · Support (UGX 180,000/month)</th><td>1,800,000</td></tr><tr><th>C · Third-party at cost</th><td>500,000</td></tr><tr className="total-row"><th>Total · VAT inclusive</th><td>{total.toLocaleString()}</td></tr></tbody></table></div><h2>Payment schedule · only on approval</h2><div className="financial-milestones">{payments.map(([percent,label,amount])=><article className="soft-card" key={label}><strong>{percent}</strong><span>{label}</span><b>UGX {Number(amount).toLocaleString()}</b></article>)}</div><p className="notice">The itemized development subtotal is UGX 12,050,000 (the brief’s “11,??” was a placeholder); with support and third-party costs the total is UGX 14,350,000.</p></div></section></main>}
function DonorPortal({notify,onDonate}:{notify:(s:string)=>void;onDonate:()=>void}){const[logged,setLogged]=useState(false),[email,setEmail]=useState(''),[password,setPassword]=useState(''),[error,setError]=useState('');return <main><PageHero eyebrow="Donor Portal · demo" title="See the documented work" description="Demo access only. No donor accounts, contributions or private giving history are connected."/><section className="section"><div className="container">{!logged?<form className="soft-card form-stack donor-login" onSubmit={e=>{e.preventDefault();if(email==='demo@crvpf.org'&&password==='demo123'){setLogged(true);setError('')}else setError('Invalid demo credentials. Use demo@crvpf.org / demo123')}}><h2>Donor demo login</h2><label>Email<input className="field" type="email" value={email} onChange={e=>setEmail(e.target.value)} required autoComplete="username"/></label><label>Password<input className="field" type="password" value={password} onChange={e=>setPassword(e.target.value)} required autoComplete="current-password"/></label>{error&&<div className="error-box" role="alert">{error}</div>}<button className="btn btn-green">Open demo portal</button></form>:<div className="soft-card"><h2>Donor Portal</h2><div className="donor-actions"><Link className="btn btn-green" href="/impact">See impact</Link><button className="btn btn-outline" onClick={()=>notify('Demo report download; no donor-specific report file was supplied.')}>Download report</button><button className="btn btn-orange" onClick={onDonate}>Donate again</button></div></div>}</div></section></main>}
function SystemPage(){
 const rows=[['Staff cannot publish','CMS 2-min publish'],['Partners cannot report','Partner Portal'],['Donors cannot see impact','Donor Portal + Annual Report'],['Safeguarding manual','4-check gate, Publish disabled until all ticked'],['Slow on data','Compressed images, lazy load, target <3s on MTN']];
 return <main><PageHero eyebrow="System Analysis" title="How This System Works - For CRVPF Staff & Board" description="System overview for the Replit proof of concept and proposed WordPress handover."/><section className="section"><div className="container"><section className="soft-card"><h2>5 problems → 5 solutions</h2><div className="table-scroll system-table-wrap"><table className="system-table"><thead><tr><th>Problem</th><th>Solution</th></tr></thead><tbody>{rows.map(([problem,solution])=><tr key={problem}><td>{problem}</td><td>{solution}</td></tr>)}</tbody></table></div><p className="notice">The under-three-second figure is a target on MTN mobile data, not an independently measured result. There is no live data in this Replit demo.</p></section><section className="soft-card" style={{marginTop:18}}><h2>Architecture</h2><p className="system-architecture">WordPress + Elementor → i3C Hosting → GA4 + Matomo → Daily Backup → 2FA</p><p>This architecture is the final WordPress plan. These integrations are not connected to the current Replit demo.</p></section><section className="soft-card" style={{marginTop:18}}><h2>Roles</h2><ul className="check-list"><li>Admin</li><li>Communications — approver</li><li>Editor</li><li>Partner — own grants only</li><li>Donor — read-only</li></ul></section><section className="soft-card" style={{marginTop:18}}><h2>Data rule</h2><p>Maps show district-level information only, never school or village locations.</p></section></div></section></main>
}
function HowWeDeliver(){
 const steps=[['1. Replit Demo = Proof','You can click, test CMS, test Partner Portal, and test the Safeguarding gate today, before you pay. This is a demo with no live data.'],['2. WordPress + i3C = Final Delivery','After approval, we rebuild 1-to-1 in WordPress + Elementor on i3C. You own domain, hosting, content, and users. We train staff to publish alone. We hand over passwords, backups, and SOPs.'],['3. Migration Plan','Week 1 Inception + Audit on i3C · Week 2-3 Homepage in WordPress staging · Week 4 Homepage live 14 Dec · Week 5-8 Full site 31 Jan · Feb-Nov Support + Monthly Reports.'],['4. What You Own','WordPress admin, Elementor templates, i3C hosting, GA4 analytics, Mailchimp audience, all photos + content. No lock-in to Replit, no lock-in to ELITECH.']];
 return <main><PageHero eyebrow="How We Deliver" title="How We Deliver" description="The demo and handover steps, with ownership and transfer boundaries stated clearly."/><section className="section"><div className="container"><div className="handover-grid">{steps.map(([title,text])=><article className="soft-card" key={title}><h2>{title}</h2><p>{text}</p></article>)}</div><section className="soft-card" style={{marginTop:18}}><h2>5. Transfer-Ready - No Lock-In</h2><p>This Replit demo is transfer-ready. Design, content, images, structure, and system logic will transfer 1-to-1 to WordPress + Elementor on i3C per TOR, or to any platform CRVPF chooses (Wix, Webflow, Custom). Replit code is not directly copied - it is rebuilt as WordPress theme + Elementor templates to ensure CRVPF owns everything.</p><div className="content-grid"><div><h3>What transfers</h3><ul className="check-list"><li>Design</li><li>Text from crvpf.org</li><li>Real CRVPF photos</li><li>Page structure</li><li>Safeguarding gate logic</li><li>Partner Portal logic</li><li>Map + Filters logic</li></ul></div><div><h3>What is rebuilt</h3><ul className="check-list"><li>Code as WordPress + Elementor</li><li>Real user accounts + 2FA</li><li>Real Mailchimp + GA4 connections</li><li>Daily i3C backup</li><li>You own domain, hosting, content, users.</li></ul></div></div><p className="notice">The Replit demo has no live WordPress, i3C, Mailchimp, GA4, or user-account connections.</p></section></div></section></main>
}
 function Contact({notify}:{notify:(s:string)=>void}){
 const [ok,setOk]=useState(false);
  const submit=(e:FormEvent<HTMLFormElement>)=>{e.preventDefault();const f=e.currentTarget;if(!f.reportValidity())return;setOk(true);f.reset();notify('Thank you! Your message is confirmed in this local demo; it was not sent.');};
   return <main><PageHero eyebrow="GET IN TOUCH" title="General Inquiries" description="Children's Rights and Violence Prevention Fund (CRVPF)"/><section className="section"><div className="container contact-grid"><aside className="soft-card"><div className="section-kicker">GET IN TOUCH</div><div className="contact-line"><Phone size={19}/><a href="tel:+256393216519">(+256) 393 216 519</a></div><div className="contact-line"><Mail size={19}/><a href="mailto:info@crvpf.org">info@crvpf.org</a></div><div className="contact-line"><MapPin size={19}/><span>Block 244, Plot 5170, Diplomate Road, Muyenga, Kampala, Uganda</span></div><a className="btn btn-green whatsapp-link" href="https://wa.me/256393216519" target="_blank" rel="noopener noreferrer">WhatsApp CRVPF</a><small className="source-note">Source: crvpf.org/</small><div className="notice">We do not publish children's personal details without consent.</div></aside><div className="soft-card">{ok&&<div className="success-box" role="status" style={{marginBottom:16}}>Thank you! Your message is confirmed in this local demo; no message was sent.</div>}<form className="form-stack" onSubmit={submit}><label>Your name<input className="field" name="name" required minLength={2} data-testid="input-contact-name"/></label><label>Email address<input className="field" name="email" type="email" required data-testid="input-contact-email"/></label><label>Subject<select className="field" name="subject" required defaultValue=""><option value="" disabled>Select a topic</option><option>General enquiry</option><option>Programme enquiry</option><option>Partnership enquiry</option></select></label><label>Message<textarea className="field" name="message" rows={5} required minLength={10} data-testid="input-contact-message"/></label><button className="btn btn-green" type="submit" data-testid="button-contact-submit">Send demo message <ArrowRight size={16}/></button><small>Submitting shows a local confirmation only. No message is sent.</small></form></div></div></section></main>
}
function SearchModal({value,setValue,results,onClose,onStorySelect}:{value:string;setValue:(v:string)=>void;results:readonly {url:string;label:string}[];onClose:()=>void;onStorySelect:()=>void}){
  const inputRef=useRef<HTMLInputElement|null>(null),closeRef=useRef(onClose);
  closeRef.current=onClose;
  useEffect(()=>{
    const opener=document.activeElement instanceof HTMLElement?document.activeElement:null;
    inputRef.current?.focus();
    const onKey=(event:KeyboardEvent)=>{if(event.key==='Escape'){event.preventDefault();closeRef.current()}};
    window.addEventListener('keydown',onKey);
    return()=>{window.removeEventListener('keydown',onKey);opener?.focus({preventScroll:true})};
  },[]);
  return <div className="modal-backdrop" onClick={event=>{if(event.target===event.currentTarget)onClose()}}><div className="modal" role="dialog" aria-modal="true" aria-label="Search website"><div className="modal-head"><h2>Search CRVPF</h2><button className="icon-btn" onClick={onClose} aria-label="Close search"><X/></button></div><input ref={inputRef} className="field" value={value} onChange={event=>setValue(event.target.value)} placeholder="Search pages, programmes, stories…" data-testid="input-search"/><div style={{marginTop:17}}>{results.length?results.map((result,i)=><Link key={`${result.url}-${result.label}-${i}`} href={result.url} onClick={()=>{if(result.url.includes('#'))onStorySelect();onClose()}} className="arrow-link" style={{display:'flex',padding:'11px 0',borderBottom:'1px solid var(--leaf-border)'}}>{result.label}<ArrowRight size={14}/></Link>):<p>No site content matched that search.</p>}</div></div></div>
}
function DonateModal({onClose,notify}:{onClose:()=>void;notify:(s:string)=>void}){const [amount,setAmount]=useState('100000'),[custom,setCustom]=useState('');const submit=(e:FormEvent)=>{e.preventDefault();if(amount==='custom'&&Number(custom)<1){notify('Enter a valid custom amount.');return}onClose();notify('Thank you - demo checkout')};return <Modal title="Support the work" onClose={onClose}><p>Demo checkout only; no payment is collected or processed.</p><form className="form-stack" onSubmit={submit}><div className="amount-buttons">{['50000','100000','250000','custom'].map(v=><button type="button" key={v} className={amount===v?'active':''} onClick={()=>setAmount(v)}>{v==='custom'?'Custom':`${Number(v).toLocaleString()} UGX`}</button>)}</div>{amount==='custom'&&<label>Custom amount (UGX)<input className="field" type="number" min="1" value={custom} onChange={e=>setCustom(e.target.value)} required/></label>}<button className="btn primary-action" type="submit" data-testid="button-confirm-donate">Proceed <ArrowRight size={16}/></button></form></Modal>}
function Modal({title,onClose,children}:{title:string;onClose:()=>void;children:React.ReactNode}){
  const closeRef=useRef(onClose),dialogRef=useRef<HTMLDivElement|null>(null);
  closeRef.current=onClose;
  useEffect(()=>{
    const opener=document.activeElement instanceof HTMLElement?document.activeElement:null;
    const onKey=(event:KeyboardEvent)=>{if(event.key==='Escape'){event.preventDefault();closeRef.current()}};
    window.addEventListener('keydown',onKey);
    dialogRef.current?.querySelector<HTMLButtonElement>('[aria-label="Close dialog"]')?.focus();
    return()=>{window.removeEventListener('keydown',onKey);opener?.focus({preventScroll:true})};
  },[]);
  return <div className="modal-backdrop" onClick={event=>{if(event.target===event.currentTarget)onClose()}}><div className="modal" ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="modal-title"><div className="modal-head"><h2 id="modal-title">{title}</h2><button className="icon-btn" onClick={onClose} aria-label="Close dialog"><X/></button></div>{children}</div></div>
}
function SafeguardingPage({notify}:{notify:(message:string)=>void}){
  return <main>
    <PageHero eyebrow="Safeguarding" title="Report a Concern" description="Share a concern without including a child’s full name, school, or exact location. This demonstration does not send or store reports."/>
    <section className="section"><div className="container">
      <section className="soft-card safeguarding-hotline">
        <h2>Safe. Dignified. Consent-First.</h2>
        <p>For an immediate real-world concern, contact CRVPF directly at <a href="mailto:info@crvpf.org">info@crvpf.org</a> or <a href="tel:+256393216519">(+256) 393 216 519</a>.</p>
        <SafeguardingReport notify={notify}/>
      </section>
    </div></section>
  </main>
}
function CountryPage({country}:{country:string}){
  const record=countryOperations.find(item=>item.country.toLowerCase()===country.toLowerCase());
  if(!record)return <NotFound/>;
  return <main>
    <PageHero eyebrow="Country" title={record.country} description="Country-level information only. No school, village, or individual locations are shown."/>
    <section className="section"><div className="container">
      <article className="soft-card">
        <h2>{record.capital}</h2>
        <p><strong>Partners:</strong> {record.partners}</p>
        <p><strong>Youth:</strong> {record.youth}</p>
        <p><strong>Programmes:</strong> {record.programmes.join(' · ')}</p>
        <p><strong>Story:</strong> {record.story||'To be confirmed with CRVPF.'}</p>
        <p className="notice">Country-level figures and coverage are demonstration content, to be confirmed with CRVPF.</p>
      </article>
      <div className="content-grid" style={{marginTop:16}}>
        <Link className="soft-card" href="/map">View country map <ArrowRight size={15}/></Link>
        <Link className="soft-card" href="/stories">View stories <ArrowRight size={15}/></Link>
      </div>
    </div></section>
  </main>
}
function ProposalPage(){
  return <main>
    <PageHero eyebrow="Proposal" title="Project Proposal" description="Proposal details that require CRVPF review are identified as pending confirmation."/>
    <section className="section"><div className="container">
      <article className="soft-card">
        <h2>Proposal status</h2>
        <p>Scope, costs, approvals, and delivery terms: To be confirmed with CRVPF.</p>
        <div className="content-grid">
          <Link className="arrow-link" href="/financial">View financial estimate <ArrowRight size={15}/></Link>
          <Link className="arrow-link" href="/inception">View inception plan <ArrowRight size={15}/></Link>
        </div>
      </article>
    </div></section>
  </main>
}
function StatusPage(){
  return <main>
    <PageHero eyebrow="Status" title="Project Status" description="This demo does not connect to a live project tracker."/>
    <section className="section"><div className="container">
      <article className="soft-card">
        <h2>Current status</h2>
        <p>Milestone progress, review decisions, and delivery dates: To be confirmed with CRVPF.</p>
        <Link className="arrow-link" href="/inception">View the proposed timeline <ArrowRight size={15}/></Link>
      </article>
    </div></section>
  </main>
}
function NotFound(){return <main><PageHero eyebrow="Not found" title="Page not found - Go Home" description="This page is not available in the CRVPF demo."/><section className="section"><div className="container"><Link href="/" className="btn btn-blue" aria-label="Go home">Go Home <ArrowRight size={16}/></Link></div></section></main>}

export default App;
