import { ElementConfig, Languages, AnimatingOrder, SourceTextData } from '../interfaces';

// specific dates with custom description
const dates: Record<string, Record<Languages, [string, string]>> = {  
  "6-12":  {
    en: ["🎂 It's my birthday today!", "June 12"],
    sv: ["🎂 Jag fyller år idag!", "Juni 12"],
    uk: ["🎂 Ce moje deń narodžnńa!", "Červeń 12"],
  },
  "8-24": {
    en: ["Restoration of independence of Ukraine", "🇺🇦 August 24"],
    sv: ["Återställande av Ukrainas självständighet", "🇺🇦 Augusti 24"],
    uk: ["Vidnovlenńa nezaležnosti Ukrajiny", "🇺🇦 Serpeń 24"],
  },
  // more dates to come such as celebrations and holidays
  default: {
    en: ["Redefining the way humans interact", "with computers."],
    sv: ["Omdefinierar hur människor interagerar", "med datorer."],
    uk: ["Pereosmysĺuju sposib vzajemodiji", "z compjuteramy."],
  }
};

import titleFromPath from '/assets/raw/titleFromPath.txt?raw';
import nav from '/assets/raw/nav.txt?raw';
import cr from '/assets/raw/copyright.txt?raw';
import lg from '/assets/raw/language.txt?raw';

let date = new Date();
let description = dates[date.getMonth() + '-' + (date.getDate() + 1)] ?? dates.default;

let font = fontStyles;

const elementConfig: Record<string, ElementConfig> = {
/*
  🏷️ Element ID     ✨ FontStyle           ⚙️ Custom placeholder
  ______|______   ________|________     _____________|_____________ */
  tt:           { text: font.title,     from: { path: titleFromPath } },
  d1:           { text: font.subtitle, },
  d2:           { text: font.subtitle, },
  home:         { text: font.menuSelected },
  about:        { text: font.menu },
  projects:     { text: font.menu }, //          🖼️ Icon
  work:         { text: font.menu }, // _____________|_____________
  nav:          { text: font.action,    icon: { path: nav, gap: 8 } },
  cr:           { text: font.footer,    icon: { path: cr,  gap: 0 } },
  lg:           { text: font.footer,    icon: { path: lg,  gap: 2 } },
};

const texts: SourceTextData = {
  en: {
    tt: "Oleksii",
    d1: description["en"][0],
    d2: description["en"][1],
    home: "oleksii.xyz",
    about: "about",
    projects: "projects",
    work: "work",
    nav: "Navigation",
    cr: "2018-2022 Oleksii Besida",
    lg: "English",
  },
  sv: {
    tt: "Oleksiy",
    d1: description["sv"][0],
    d2: description["sv"][1],
    home: "oleksii.xyz",
    about: "om mig",
    projects: "projekts",
    work: "alster",
    nav: "Navigering",
    cr: "2018-2022 Oleksiy Besida",
    lg: "Svenska",
  },
  uk: {
    tt: "Oleksij",
    d1: description["uk"][0],
    d2: description["uk"][1],
    home: "oleksii.xyz",
    about: "pro mene",
    projects: "projekty",
    work: "roboty",
    nav: "Naviǧacija",
    cr: "2018-2022 Oleksij Besida",
    lg: "Ukrajinśka",
  },
};

// more things to come soon;

// inline pictures
import pf from '/assets/images/profilePicture.webp';
import tg from '/assets/vectors/telegram.svg';
import mx from '/assets/vectors/matrix.svg';
import gh from '/assets/vectors/github.svg';
import li from '/assets/vectors/linkedin.svg';
import mt from '/assets/vectors/email.svg';

const images: Record<string, string> = { pf }

const vectors: Record<string, string> = { tg, mx, gh, li, mt, cr, lg }

import indexStylesheet from './styles.css';
import { onMenuClick } from '../render/menu';
import { fontStyles } from '../common/fontStyles';

const stylesheets: string[] = [indexStylesheet];

const restoreLinks: Record<string, Array<string>> = {
  "ps": ["https://t.me/oleksiibesida", "https://matrix.to/#/@human:oleksii.xyz", "https://github.com/oleksiibesida", "https://linkedin.com/in/oleksiibesida/", "mailto:besida@oleksii.xyz"],
  "rg": ["https://oleksii.xyz", "https://oleksii.xyz", "https://oleksii.xyz", "https://oleksii.xyz"],
}

const restoreClicks: Record<string, Array<Function>> = {
  rg: [
    () => onMenuClick('index'),
    () => onMenuClick('about'),
    () => onMenuClick('projects'),
    () => onMenuClick('work'),
  ],
};

// order and details of animating each node

const animatingOrder: Record<string, AnimatingOrder> = {
  "pf":  { image: true,  delay: 0, alt: 'Profile Picture' },
  "tt":  { delay: 50 },
  "d1":  { delay: 500 },
  "d2":  { delay: 0 },
  "ps":  { image: true, delay: 75, children: true },
  "rg":  { delay: 50, children: true },
  "nav": { delay: 100 },
  "cr":  { delay: 100 },
  "lg":  { delay: 100 },
}

import { onload } from '../common/page';
export let load = () => onload({ animatingOrder, elementConfig, images,
  restoreClicks, restoreLinks, stylesheets, texts, vectors });
