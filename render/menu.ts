import MotionBlur from "./motionBlur";
import { byId, tagById } from "./shorthands";
import compute from "./worker";
import fontStyles from "/common/fontStyles";
import navigate, { RouteName } from "/common/navigate";

/* --- --- --- --- --- --- --- --- ---
   --- CODE IN THIS FILE REQUIRES- ---
   --- -- [URGENT] REFACTORING --- ---
   --- --- --- --- --- --- --- --- --- */

let rg = byId("rg")!;
let cnt = byId("cnt")!;
let nav = byId("nav")!;

var ignoreMouse = false;

const backgroundKeyframes: Keyframe[] = [
  { backgroundPosition: "0px 0px",   boxShadow: "inset 0px 0px 0px 50vh #FFF0" },
  { backgroundPosition: "-32px 0px", boxShadow: "inset 0px 0px 0px 50vh var(--bg)" },
];

const backgroundAnimation: KeyframeAnimationOptions = {
  easing: "cubic-bezier(0.25, 0.25, 0, 1)",
  duration: 600,
};

function menuItemHover(this: Element) {
  Array.from(rg.children).forEach(subling => subling.classList.remove("hover"));
  this.classList.add("hover");
}

Array.from(rg.children).forEach(child =>
  child.addEventListener("mouseover", menuItemHover))

function hideBGPattern() {
  document.body.animate(backgroundKeyframes, backgroundAnimation);
  document.body.classList.add("menu")
  motionStart();
}

function showBGPattern() {
  document.body.animate(backgroundKeyframes.reverse(), backgroundAnimation);
  document.body.classList.add("menu")

  Array.from(rg.children).forEach(child => child.classList.remove("hover"));
  navBlur.drop();
}

function openDesktopMenu(event: MouseEvent) {
  if (!cnt.classList.contains("navTapped")) {
    cnt.classList.add("navOpened");
    rg.classList.add("hover");

    hideBGPattern();

    var hovered = false;
    for (let child of rg.children)
      hovered = child.classList.contains("hover") || hovered;

    if (!hovered) {
      if (event.clientY < window.innerHeight / 2)
        rg.firstElementChild?.classList.add("hover");
      else rg.lastElementChild?.classList.add("hover");
    }
  }
}

export function onMenuItemClick(route: RouteName) {
  hideDesktopMenu(true), navigate(route)
}

export function hideDesktopMenu (clicked: boolean = false) {
  if (clicked) ignoreMouse = true;
  showBGPattern();

  // remove classes
  cnt.classList.remove("navOpened");
  rg.classList.remove("hover");
};

let isNavHovered = false;

nav.onclick = function () {
  if (!cnt.classList.contains("navTapped")) {
    // open menu
    compute({
      from: { skeleton: [24, 24, 24]},
      to: { text: { style: fontStyles.action, text: 'close' } }
    }).then(console.log)

    cnt.classList.add("navTapped");
    //motionStart()
    tagById("nav", "text")!.innerHTML = "Close";
    byId('nav')?.children[0].setAttribute("viewBox", "0 0 80 24");
    byId('nav').style.opacity = 0.5;
    hideBGPattern();
  } else {
    //close menu
    cnt.classList.remove("navTapped");
    tagById("nav", "text")!.innerHTML = "Navigation";
    byId('nav')?.children[0].setAttribute("viewBox", "0 0 114 24");
    byId('nav').style.opacity = 1;
    showBGPattern();
  }
};

let navBlur = new MotionBlur({ blurID: "cnt", watchID: "work", mult: 1 });

let motionStart = function () {
  navBlur.mult = window.innerWidth < 920 ? 1 : 0.5;
  navBlur.invoke();
};

document.body.onclick = function () {
  if (!isNavHovered) {
    cnt.classList.remove("navTapped");
    tagById("nav", "text")!.innerHTML = "Navigation";
  }
};

nav.onmouseover = () => (isNavHovered = true);
nav.onmouseleave = () => (isNavHovered = false);

rg.addEventListener("mousemove", event =>
  (!ignoreMouse || (ignoreMouse && 0 < event.movementX)) ? (openDesktopMenu(event), ignoreMouse = false) : 0);

rg.addEventListener("mouseleave", () => hideDesktopMenu(false));