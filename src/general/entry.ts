import { PageContent } from '../interfaces';

import print from '../scripts/print';
import render from '../scripts/render';

// --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---

export async function onload(content: PageContent) {
  print("🔥 Load Event");

  render(content);

  // webvitals file is loaded after load event and render call,
  // and meant to help measure this webpage quality
  print("😏 Loading web vitals");
  import('../scripts/webvitals');

  // to contain navigator, theme specs, and other dynamic things
}
