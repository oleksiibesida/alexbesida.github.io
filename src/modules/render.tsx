/* --- --- --- --- --- --- --- --- ---
   --- CODE IN THIS FILE REQUIRES- ---
   --- -- [URGENT] REFACTORING --- ---
   --- --- --- --- --- --- --- --- --- */

import { AnimatingOrder, ComputedTextData, ComputeRecord, InputMorphData, PageContent, RenderElementConfig, CSSColor, AnimationConfig, IconConfig, FontStyle, TextConfig } from "../interfaces";
import { createElement, createFragment } from "./jsx";
import print from './print';
import './menu.ts';
import { byId, tagById } from "./shorthands";
import { onMenuClick } from "./menu";
import { fontStyles } from "./fontStyles";

export default async function render(content: PageContent, computed: ComputeRecord<'computed'>): Promise<void> {
  if (!sessionStorage.getItem('loaded')) {
    await window["skeleton"];
    sessionStorage.setItem('loaded', 'true');
  }

  // TODO: organize things here

  /* --- FROM OLD SOURCES.TSX --- */

  let images = {};
  Object.assign(images, content.images, content.vectors);

  document.head.append(...content.head);

  for (var style of content.stylesheets) {
    document.head.append(<link rel="stylesheet" href={style} />)
  }

  /* --- --- --- --- --- --- --- */

  print("🎨 Render");

  for (let id in content.restoreClicks) {
    let children = byId(id)!.children;
    for (var i = 0; i < children.length; i++) {
      let childIndex = i;
      children[i].addEventListener("click", () => content.restoreClicks[id][childIndex]()),
        children[i].setAttribute("onclick", "return false");
    }
  }

  byId('lg')!.addEventListener("mouseenter", function () {
    for (let lg in content.languages) {
      byId('lg')!.append(<div onclick={() => window.history.pushState({}, '', `?${lg}`)} class="lgItem">{content.languages[lg]}</div>);
    }
  });

  byId('lg')!.addEventListener("mouseleave", function () {
    onMenuClick();
    Array.from(byId('lg')!.getElementsByClassName('lgItem')).forEach(e => e.remove())
  });

  let delay: number = 0;

  const urlSearchParams = new URLSearchParams(window.location.search);
  const lang = Object.keys(Object.fromEntries(urlSearchParams.entries()))[0];

  // restore everything;
  for (let item in content.animatingOrder) {
    let data: AnimatingOrder = content.animatingOrder[item];
    let queue: Array<string> = [item];

    // if it's about animation children, put children into a queue
    if (data.children) queue = [...byId(item)!.children]
      .map(child => child.id); 
      
    if (data.image) {
      for (let child of queue) {
        // insert node to an appropriate skeleton element;
        let node = <img src={images[child]} alt={item} />;
        byId(child)?.append(node);
        // schedule the animation
        let render = child => byId(child)?.classList.add('rendered');
        setTimeout(render, delay += data.delay, child);
      } 
      // skip morphing as we have inserted the image element
      continue;
    }

    // iterate over queue
    for (let child of queue) {
      let current = content.elementConfig[child];

      let config = {
        id: child,
        color: current.color,
        height: current.height,
        morph: computed[child],
        icon: current.element.icon,
        text: {
          style: current.element.text?.style,
          text: content.texts[lang][child]
        } as TextConfig,
      } as RenderElementConfig;

      setTimeout(renderElement, delay += data.delay, config);
    }
  }

  document.body.classList.add('rendered');
}

function renderElement(element: RenderElementConfig) {
  let parent = byId(element.id)!;

  let morph: SVGPathElement, text: SVGTextElement, icon: SVGPathElement;
  let computed = element.morph, width = parent.clientWidth;

  let root: SVGElement = <svg viewBox={`0 0 ${width} ${element.height}`}></svg>

  if (element.morph) {
    morph = <path fill="var(--el)" fill-rule="evenodd" clip-rule="evenodd">
      <animate attributeName="d" dur="0.8s" values={computed!.from + ';' + computed!.to} calcMode="spline" keySplines="0.87 0 0.13 1" />
    </path>

    root.append(toColor(morphOpacity(morph), element.color));
  }

  if (element.text) {
    let font = fontStyles[element.text.style] as FontStyle;
    let textLeft = element.icon ? element.icon.gap + element.height : 0;

    let style = `font-family:${font.type}; letter-spacing:${font.letterSpacing}em; font-size:${font.fontSize}px`;
    text = <text opacity="0" style={style} x={textLeft} y={computed!.baseline! - .25}>{element.text}</text>;

    setTimeout(() => {
      text.setAttribute("opacity", "1");
      text.setAttribute("fill", element.color);
    }, 600);

    root.append(toColor(elementOpacity(text), element.color));
  }

  if (element.icon) {
    icon = <path opacity="1" d={element.icon?.path ?? ''}/>
    root.append(toColor(elementOpacity(icon), element.color));

    setTimeout(() => {
      text.setAttribute("opacity", "1");
      text.setAttribute("fill", element.color);
    }, 600);
  }

  parent.classList.add('rendered');
  parent.append(root);
}

function animate(element: SVGPathElement | SVGTextElement, config: AnimationConfig) {
  element.animate(...config);
  return element;
}

function toColor(element: SVGPathElement | SVGTextElement, color: CSSColor) {
  let config = [
    [{ fill: 'var(--el)' }, { fill: color }],
    { delay: 400, duration: 400, easing: 'cubic-bezier(0.87, 0, 0.13, 1)' }
  ] as AnimationConfig;

  return animate(element, config);
}


function morphOpacity(element: SVGPathElement | SVGTextElement) {
  let config =[
    [{ opacity: 1 }, { opacity: 0 }],
    { delay: 600, duration: 200 },
  ] as AnimationConfig;

  return animate(element, config);
}

function elementOpacity(element: SVGPathElement | SVGTextElement) {
  let config =[
    [{ opacity: 0 }, { opacity: 1 }],
    { delay: 600, duration: 200, easing: 'cubic-bezier(0.5, 0, 0.13, 1)' },
  ] as AnimationConfig;

  return animate(element, config);
}
