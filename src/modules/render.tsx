/* --- --- --- --- --- --- --- --- ---
   --- CODE IN THIS FILE REQUIRES- ---
   --- -- [URGENT] REFACTORING --- ---
   --- --- --- --- --- --- --- --- --- */

import { ComputeAPI, FontStyle, RenderData, RenderTextData, TextData, TextsRecord } from "../interfaces";
import { createElement, createFragment } from "./jsx";
import print from './print';
import './menu.ts';
import { byId, tagById } from "./shorthands";

export const computeWorker = window['worker'];

// TODO: merge into one value
let resolveMorph: (value: TextsRecord) => void;
export let textMorphReady = new Promise<TextsRecord>((resolve) => resolveMorph = resolve);

export default async function render(content): Promise<void> {
  // TODO: it's possible to send text data earlier
  computeWorker.postMessage({ deliver: 'texts', data: content.texts });

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

  let renderTextData = await textMorphReady as Record<string, RenderTextData>;

  print("🎨 Render");

  // restore id's for shortened components
  for (let id in content.restoreIDs) {
    let children = byId(id)!.children;
    for (var i = 0; i < children.length; i++)
      children[i].id = content.restoreIDs[id][i];
  }

  for (let id in content.restoreLinks) {
    let children = byId(id)!.children;
    for (var i = 0; i < children.length; i++)
      children[i].setAttribute('href', content.restoreLinks[id][i]);
  }


  byId('lg')!.onmouseenter = function () {
    byId('lg')!.append(<div class="hhh">English</div>);
    byId('lg')!.append(<div class="hhh">Svenska</div>);
    byId('lg')!.append(<div class="hhh">Ukrajinśka</div>);
    byId('lg')!.append(<div class="hhh">Українська</div>);
  }

  byId('lg')!.onmouseleave = function () {
    Array.from(byId('lg')!.getElementsByClassName('hhh')).forEach(e => e.remove())
  }

  let delayCounter: number = 0;

  // TODO: merge all cases into one

  // restore everything;
  for (let item in content.animatingOrder) {
    let data: RenderData = content.animatingOrder[item];
    let node: HTMLElement;

    let queue: Array<string> = [item];
    // if data.children is true, retreive children
    if (data.children) queue = [...byId(item)!.children]
      .map(child => child.id);

    if (data.type == 'img' || data.type == 'both') {
      for (let child of queue) {
        // generate future node;
        node = <img src={images[child]} alt={item} />;
        // insert it to appropriate skeleton element;
        byId(child)?.append(node);
        // schedule animation
        delayCounter += data.delay;
        setTimeout((child) => byId(child)?.classList.add('rendered'), delayCounter, child);
      }
    }

    if (data.type == 'text' || data.type == 'both') {
      for (let child of queue) {
        // TODO: ahhrr clean up code 
        delayCounter += data.delay;
        setTimeout((item) => {
          var data = renderTextData[item] as RenderTextData;

          let vector = <svg viewBox={`0 0 ${content.texts[item].width} ${content.texts[item].font.lineHeight}`}>
            <path fill="var(--el)" fill-rule="evenodd" clip-rule="evenodd">
              <animate attributeName="d" dur="0.8s" values={data.from + ';' + data.to}
                calcMode="spline" keySplines="0.87 0 0.13 1" />
            </path>
            <text y={renderTextData[item].baseline - .25}>{content.texts[item].text}</text>
          </svg>
          byId(item)!.append(vector);

          let font = content.texts[item].font as FontStyle;

          [tagById(item, 'path'), tagById(item, 'text')].forEach(el => el!.animate(
            [{ fill: 'var(--el)' }, { fill: font.color ?? 'var(--secondary)' }],
            { delay: 400, duration: 400, easing: 'cubic-bezier(0.87, 0, 0.13, 1)' },
          ));

          tagById(item, 'path')?.animate(
            [{ opacity: 1 }, { opacity: 0 }],
            { delay: 600, duration: 200 },
          );

          tagById(item, 'text')?.setAttribute("style", `opacity: 0; font-family:${font.type ?? 'text'}; letter-spacing:${font.letterSpacing ?? 0}em; font-size:${font.fontSize}`);

          tagById(item, 'text')?.animate(
            [{ opacity: 0 }, { opacity: 1 }],
            { delay: 600, duration: 200, easing: 'cubic-bezier(0.5, 0, 0.13, 1)' },
          );

          setTimeout(() => {
            tagById(item, 'text')?.setAttribute("style", tagById(item, 'text')?.getAttribute("style") + '; fill: ' + (font.color ?? 'var(--secondary)') + '; opacity:1');
          }, 600);

          byId(item)?.classList.add('rendered');

        }, delayCounter, child);
      }
    }
  }
  document.body.classList.add('rendered'), delayCounter;
}

computeWorker.onmessage = (message) => {
  if (message.data.deliver == 'texts') resolveMorph(message.data.data as TextsRecord);
}
