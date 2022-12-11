/* --- --- --- --- --- --- --- --- ---
   --- CODE IN THIS FILE REQUIRES- ---
   --- -- [URGENT] REFACTORING --- ---
   --- --- --- --- --- --- --- --- --- */

import { RenderElementInterface, CSSColor, AnimationConfig } from "interfaces";
import { createElement } from "./jsx";
import './menu.ts';
import '/render/menu.ts';

export default function (parent: HTMLElement, element: RenderElementInterface) {
  let morph: SVGPathElement, text: SVGTextElement, icon: SVGPathElement;
  let computed = element.morph, width = element.morph?.width;
  let color = element.text?.style.color ?? element.icon?.color!;
  
  let elements: (SVGTextElement | SVGPathElement)[] = [];
  let root: SVGElement = <svg viewBox={`0 0 ${width} ${element.height}`}></svg>

  if (element.text) {
    let font = element.text.style;
    let textLeft = element.icon ? element.icon.gap + element.height : 0;

    let style = `font-family: ${font.type ?? 'text'}; letter-spacing: ${font.letterSpacing}em; font-size: ${font.fontSize}px; line-height: ${element.height+.5}px; opacity: 0;`;
    text = <p style={style}>{element.text.text}</p>;

    if (element.text.style.wrap) 
      root.style.height = element.height + 'px';

    elements.push(text);
    root.append(<foreignObject x={textLeft} width={element.morph?.width + 'px'} height="200px">{text}</foreignObject>);
  }

  if (element.icon) {
    icon = <path opacity="0" d={element.icon?.path ?? ''}/>
    root.append(icon)

    elements.push(icon);
  }

  if (element.morph) {
    let renderElement = () => {
      elements.forEach(e => { e.style.opacity = "1", e.setAttribute("fill", color), e.style.color = color})
      morph.remove();
    };
    
    morph = <path fill="var(--el)" d={computed!.to} fill-rule="evenodd" clip-rule="evenodd">
      <animate attributeName="d" dur="0.8s" values={computed!.from + ';' + computed!.to} 
        calcMode="spline" keySplines="0.87 0 0.13 1" onendEvent={renderElement} />
    </path>

    setTimeout(() => morph.setAttribute('fill', color), 600);
    root.append(toColor(morph, color));
  }

  parent.classList.add('rendered');
  parent.replaceChildren(root);
}

function animate(element: SVGPathElement | SVGTextElement, config: AnimationConfig) {
  element.animate(...config);
  return element;
}

function toColor(element: SVGPathElement | SVGTextElement, color: CSSColor) {
  let config = [
    [{ fill: 'var(--el)' }, { fill: color }],
    { delay: 200, duration: 600, easing: 'cubic-bezier(0.87, 0, 0.13, 1)' }
  ] as AnimationConfig;

  return animate(element, config);
}
