/* Sube de Rango · motor del juego.
   Los ejercicios llegan cifrados en cadena (datos.js): cada uno se abre con la llave que deja el anterior resuelto
   bien. Aquí no hay respuestas: se comprueba descifrando. Al fallar solo se abre el porqué de lo elegido. */
(() => {
'use strict';
const J = window.JUEGO, STK = window.STICKERS || [], CLAVE = 'sube-de-rango';
const NIVELES = ['Ninguna', '1FN', '2FN', '3FN', 'FNBC', '4FN', '5FN'];
const LEMA = { Ninguna: 'ni siquiera 1FN', '1FN': 'una celda, un dato', '2FN': 'toda la clave', '3FN': 'nada más que la clave',
  FNBC: 'todo el que manda es clave', '4FN': 'sin listas independientes juntas', '5FN': 'piezas que vuelven a unirse' };
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const barajar = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

/* ---------------- íconos (SVG, sin emojis) ---------------- */
const ic = (d, vb = '0 0 24 24') => `<svg class="ic" viewBox="${vb}" aria-hidden="true">${d}</svg>`;
const IC = {
  corazon: ic('<path fill="#FF4B4B" d="M12 21s-7.5-4.6-9.6-9.2C.9 8.4 3 4.5 6.8 4.5c2.1 0 3.6 1.1 5.2 3 1.6-1.9 3.1-3 5.2-3 3.8 0 5.9 3.9 4.4 7.3C19.5 16.4 12 21 12 21z"/>'),
  llama: ic('<path fill="#FF9600" d="M12 2c1 3.5 5.5 5.8 5.5 11.2a5.5 5.5 0 0 1-11 0c0-2.6 1.3-4.2 2.5-5.4.2 1.8 1 3 2.3 3.5C10.9 8.6 11.3 5.2 12 2z"/>'),
  rayo: ic('<path fill="#FFC800" d="M13.5 2 4 14h6.5l-1.5 8 9.5-12.5H12z"/>'),
  candado: ic('<path fill="currentColor" d="M7 10V7a5 5 0 0 1 10 0v3h1a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1zm2 0h6V7a3 3 0 0 0-6 0z"/>'),
  check: ic('<path d="M5 12.5 10 17.5 19.5 7" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/>'),
  estrella: ic('<path fill="currentColor" d="m12 2.5 2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5-4.8-4.6 6.6-.9z"/>'),
  x: ic('<path d="M6 6l12 12M18 6 6 18" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>'),
  ayuda: ic('<circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2.4"/><path d="M9.3 9.3a2.8 2.8 0 1 1 3.9 2.5c-.8.4-1.2 1-1.2 1.9v.6" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/><circle cx="12" cy="17.6" r="1.4" fill="currentColor"/>'),
  llave: ic('<circle cx="7.5" cy="12" r="4.2" fill="none" stroke="currentColor" stroke-width="2.4"/><path d="M11.7 12H21M18 12v3.2M21 12v2.4" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>'),
  sonido: ic('<path fill="currentColor" d="M3 9h4l5-4v14l-5-4H3z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>'),
  mudo: ic('<path fill="currentColor" d="M3 9h4l5-4v14l-5-4H3z"/><path d="M16 9l5 6M21 9l-5 6" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>'),
  trofeo: ic('<path fill="currentColor" d="M7 3h10v2h3v3a5 5 0 0 1-4.6 5 5 5 0 0 1-2.4 2.3V18h3v3H8v-3h3v-2.7A5 5 0 0 1 8.6 13 5 5 0 0 1 4 8V5h3zm-1 4v1a3 3 0 0 0 1.2 2.4A6.9 6.9 0 0 1 7 9V7zm12 0h-1v2c0 .5 0 1-.2 1.4A3 3 0 0 0 18 8z"/>'),
  libro: ic('<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v14H6.5A2.5 2.5 0 0 0 4 19.5zm0 14A2.5 2.5 0 0 0 6.5 22H20v-5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"/>'),
  info: ic('<circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2.2"/><path d="M12 11v6" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/><circle cx="12" cy="7.4" r="1.4" fill="currentColor"/>'),
  tabla: ic('<rect x="3" y="4" width="18" height="16" rx="3" fill="none" stroke="currentColor" stroke-width="2.2"/><path d="M3 9.5h18M9.5 9.5V20" stroke="currentColor" stroke-width="2.2"/>'),
  une: ic('<circle cx="9" cy="12" r="6" fill="none" stroke="currentColor" stroke-width="2.2"/><circle cx="15" cy="12" r="6" fill="none" stroke="currentColor" stroke-width="2.2"/>'),
  persona: ic('<circle cx="12" cy="8" r="4" fill="currentColor"/><path fill="currentColor" d="M4 21a8 8 0 0 1 16 0z"/>'),
  repasar: ic('<path d="M20 12a8 8 0 1 1-2.4-5.7M20 4v5h-5" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>'),
  copiar: ic('<rect x="8" y="8" width="12" height="13" rx="2.5" fill="none" stroke="currentColor" stroke-width="2.2"/><path d="M5 16V5.5A2.5 2.5 0 0 1 7.5 3H15" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>'),
  imprimir: ic('<path d="M7 9V3h10v6M7 17H5a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2M7 14h10v7H7z" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"/>'),
  reloj: ic('<circle cx="12" cy="12" r="9.5" fill="none" stroke="currentColor" stroke-width="2.4"/><path d="M12 7v5l3.5 2" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>'),
  diana: ic('<circle cx="12" cy="12" r="9.5" fill="none" stroke="currentColor" stroke-width="2.4"/><circle cx="12" cy="12" r="5" fill="none" stroke="currentColor" stroke-width="2.4"/><circle cx="12" cy="12" r="1.6" fill="currentColor"/>'),
  escalon: ic('<path d="M3 20h6v-5h6v-5h6" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>'),
  okGrande: '<svg viewBox="0 0 52 52" aria-hidden="true"><circle cx="26" cy="26" r="24" fill="#58CC02"/><path d="M15 27l7.5 7.5L38 19" fill="none" stroke="#fff" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round"/></svg>'
};

/* la mascota: Bit, un cubito con una tabla en la panza */
function bit(cls = '') {
  return `<svg class="bit ${cls}" viewBox="0 0 120 120" aria-hidden="true">
    <g class="arriba"><path d="M18 70 6 44M102 70l12-26" stroke="#1B8A80" stroke-width="8" stroke-linecap="round"/></g>
    <path d="M60 22V10" stroke="#1B8A80" stroke-width="4" stroke-linecap="round"/><circle cx="60" cy="9" r="6.5" fill="#FFC800" stroke="#E5A500" stroke-width="2"/>
    <rect x="16" y="22" width="88" height="82" rx="24" fill="#2EC4B6" stroke="#1B8A80" stroke-width="4"/>
    <rect x="34" y="72" width="52" height="23" rx="5" fill="#fff" stroke="#1B8A80" stroke-width="2.5"/>
    <path d="M34 83.5h52M51.3 72v23M68.6 72v23" stroke="#93d6cf" stroke-width="2"/>
    <circle cx="44" cy="47" r="11" fill="#fff"/><circle cx="76" cy="47" r="11" fill="#fff"/>
    <g class="normal"><circle cx="46" cy="49" r="5.5" fill="#1f2933"/><circle cx="78" cy="49" r="5.5" fill="#1f2933"/>
      <path d="M52 62q8 5 16 0" stroke="#1f2933" stroke-width="3" fill="none" stroke-linecap="round"/></g>
    <g class="feliz"><path d="M38 49q6-8 12 0M70 49q6-8 12 0" stroke="#1f2933" stroke-width="3.5" fill="none" stroke-linecap="round"/>
      <path d="M50 60q10 11 20 0z" fill="#1f2933"/></g>
    <g class="triste"><circle cx="44" cy="51" r="5" fill="#1f2933"/><circle cx="76" cy="51" r="5" fill="#1f2933"/>
      <path d="M52 66q8-6 16 0" stroke="#1f2933" stroke-width="3" fill="none" stroke-linecap="round"/></g>
    <circle cx="29" cy="61" r="5" fill="#FF9DB5" opacity=".8"/><circle cx="91" cy="61" r="5" fill="#FF9DB5" opacity=".8"/>
    <rect x="34" y="102" width="16" height="10" rx="4" fill="#1B8A80"/><rect x="70" y="102" width="16" height="10" rx="4" fill="#1B8A80"/></svg>`;
}

/* ---------------- estado guardado ---------------- */
const base = () => ({ nombre: '', apellido: '', k: {}, hecho: {}, resp: {}, xp: 0, racha: 0, mejor: 0, lec: {}, guia: {}, sonido: true });
function cargar() { try { return Object.assign(base(), JSON.parse(localStorage.getItem(CLAVE)) || {}); } catch { return base(); } }
function guardar() { try { localStorage.setItem(CLAVE, JSON.stringify(E)); } catch { /* sin almacenamiento: se juega igual */ } }
let E = cargar(), M = null, LEC = [], S = null, X = null, ocupado = false;
window.__sr = { estado: () => E, leccion: () => S, ocupado: () => ocupado };   // lo leen las pruebas automáticas

/* ---------------- descifrar ---------------- */
const abrirCon = async (dato, ...partes) => Cifra.abrir(await Cifra.llave(...partes), dato);
const parte = (g, nombre, i, valor) => abrirCon(J.retos[g].p[nombre][i], E.k[g], 'g' + g, nombre, valor);
async function fin(g, canon) { try { return await abrirCon(J.retos[g].x, E.k[g], 'g' + g, 'fin', canon); } catch { return null; } }

/* ---------------- sonidos cortos ---------------- */
let actx = null;
function sonar(tipo) {
  if (!E.sonido) return;
  try { actx = actx || new (window.AudioContext || window.webkitAudioContext)(); } catch { return; }
  const notas = { bien: [[660, 0], [880, .1]], mal: [[220, 0], [175, .13]], fin: [[523, 0], [659, .12], [784, .24], [1047, .36]], par: [[784, 0]] }[tipo] || [];
  const t0 = actx.currentTime;
  notas.forEach(([f, t]) => {
    const o = actx.createOscillator(), g = actx.createGain();
    o.type = tipo === 'mal' ? 'square' : 'sine'; o.frequency.value = f;
    g.gain.setValueAtTime(.0001, t0 + t); g.gain.exponentialRampToValueAtTime(tipo === 'mal' ? .04 : .1, t0 + t + .015);
    g.gain.exponentialRampToValueAtTime(.0001, t0 + t + .2);
    o.connect(g).connect(actx.destination); o.start(t0 + t); o.stop(t0 + t + .22);
  });
}

/* ---------------- utilidades de pantalla ---------------- */
function pantalla(html) { const d = $('#dlg'); if (d.open) d.close(); $('#app').innerHTML = html; window.scrollTo(0, 0); }
function dlg(html, botones, color, alEsc) {
  const d = $('#dlg'); let porBoton = false;
  d.className = color ? 'c-' + color : '';
  $('#dlg-cuerpo').innerHTML = html; $('#dlg-pie').innerHTML = '';
  botones.forEach(([txt, cls, fn]) => {
    const b = document.createElement('button'); b.className = 'btn ' + (cls || ''); b.textContent = txt;
    b.onclick = () => { porBoton = true; d.close(); if (fn) fn(); };
    $('#dlg-pie').append(b);
  });
  d.onclose = () => { if (!porBoton && alEsc) alEsc(); };
  d.showModal(); $('#dlg-cuerpo').scrollTop = 0;
}
function tablaHTML(t, modo, op = {}) {
  const th = t.cols.map(c => modo === 'columnas'
    ? `<th class="toca" data-id="${esc(c)}" tabindex="0" role="button" aria-pressed="false">${esc(c)}</th>` : `<th>${esc(c)}</th>`).join('');
  const tb = t.filas.map((f, r) => `<tr${modo === 'filas' ? ` class="toca" data-id="${r}" tabindex="0" role="button" aria-pressed="false"` : ''}>${f.map((v, c) => {
    const vac = v === '' ? ' vacia' : '', txt = v === '' ? '—' : esc(v);
    return modo === 'celdas' ? `<td class="toca${vac}" data-id="${r}:${esc(t.cols[c])}" tabindex="0" role="button" aria-pressed="false">${txt}</td>`
      : `<td class="${vac.trim()}" data-c="${c}">${txt}</td>`;
  }).join('')}</tr>`).join('');
  return `<div class="tabla-bloque"${op.id ? ` id="${op.id}"` : ''}><p class="tnom">${esc(t.nombre)}</p><div class="tabla-env">
    <table class="t${op.chica ? ' chica' : ''}"><thead><tr>${th}</tr></thead><tbody>${tb}</tbody></table></div></div>`;
}
const pulsable = (el, fn) => { el.onclick = fn; el.onkeydown = ev => { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); fn(ev); } }; };

/* ---------------- arranque ---------------- */
async function iniciar() {
  try { M = await abrirCon(J.mapa, J.sal, 'mapa'); }
  catch { $('#app').innerHTML = '<p style="padding:30px">Este navegador no permite abrir el juego. Prueba con otro navegador actualizado.</p>'; return; }
  if (!E.k[0]) { E.k[0] = await Cifra.huella(J.sal, 'inicio'); guardar(); }
  LEC = [];
  M.unidades.forEach((u, ui) => u.lecciones.forEach((l, li) => LEC.push({ ...l, u: ui, l: li, id: ui + '-' + li })));
  E.nombre ? camino() : portada();
}

function portada() {
  pantalla(`<section class="portada">${bit('es-feliz salta')}<h1>Sube de Rango</h1>
    <p class="lema">Normaliza las tablas de la Copa Byte y sube de la 1FN a la 5FN, una lección a la vez.</p>
    <form class="registro" id="registro" novalidate>
      <label>Nombre<input id="nom" maxlength="40" autocomplete="given-name"></label>
      <label>Apellido<input id="ape" maxlength="40" autocomplete="family-name"></label>
      <p class="aviso" id="aviso" aria-live="polite">Tu nombre y tu apellido aparecerán en tu informe y en tu constancia.</p>
      <button class="btn ancho" type="submit">Empezar</button></form></section>`);
  $('#registro').onsubmit = ev => {
    ev.preventDefault();
    const n = $('#nom').value.trim().replace(/\s+/g, ' '), a = $('#ape').value.trim().replace(/\s+/g, ' ');
    if (n.length < 2 || a.length < 2) { $('#aviso').textContent = 'Escribe tu nombre y tu apellido para empezar.'; $('#aviso').style.color = 'var(--rojo-o)'; return; }
    E.nombre = n; E.apellido = a; guardar(); camino();
  };
}

function barra() {
  return `<header class="barra"><span class="jugador">${IC.persona} ${esc(E.nombre)} ${esc(E.apellido)}</span>
    <span class="stat racha" title="Racha de aciertos al primer intento">${IC.llama}<span>${E.racha}</span></span>
    <span class="stat xp" title="Puntos de experiencia">${IC.rayo}<span>${E.xp}</span></span>
    <button class="icono-btn" id="sonido" aria-label="${E.sonido ? 'Silenciar' : 'Activar sonido'}">${E.sonido ? IC.sonido : IC.mudo}</button></header>`;
}
const estadoLec = i => E.lec[LEC[i].id]?.hecho ? 'hecho' : (i === 0 || E.lec[LEC[i - 1].id]?.hecho) ? 'actual' : 'bloq';

function camino() {
  const OFF = [0, 46, 64, 46, 0, -46, -64, -46];
  let k = 0, html = barra() + '<div class="camino">';
  M.unidades.forEach((u, ui) => {
    html += `<section class="unidad c-${u.color}"><div class="banda"><div class="txt"><small>UNIDAD ${ui + 1}</small><h2>${esc(u.titulo)}</h2></div>
      <button class="guia" data-u="${ui}" aria-label="Guía de la unidad ${ui + 1}">${IC.libro} Guía</button></div><div class="nodos">`;
    u.lecciones.forEach(l => {
      const i = LEC.findIndex(x => x.g0 === l.g0), st = estadoLec(i);
      html += `<div class="nodo-f ${st}" style="transform:translateX(${OFF[k++ % 8]}px)">${st === 'actual' ? '<span class="globito">EMPEZAR</span>' : ''}
        <button class="nodo ${st}" data-i="${i}"${st === 'bloq' ? ' disabled' : ''} aria-label="Lección ${i + 1}: ${esc(l.titulo)}${st === 'bloq' ? ' (bloqueada)' : st === 'hecho' ? ' (completada)' : ''}">
        ${st === 'hecho' ? IC.check : st === 'bloq' ? IC.candado : IC.estrella}</button><span class="tit">${esc(l.titulo)}</span></div>`;
    });
    html += '</div></section>';
  });
  const todo = LEC.every(L => E.lec[L.id]?.hecho);
  html += `<div class="meta"><div class="nodo-f${todo ? ' actual' : ''}"><button class="nodo${todo ? '' : ' bloq'}" id="trofeo"${todo ? '' : ' disabled'} aria-label="Informe y constancia">${IC.trofeo}</button>
    <span class="tit">Informe y constancia</span></div></div>
    <div class="pie-camino"><button class="enlace" id="reiniciar">Empezar de cero con otro nombre</button></div></div>`;
  pantalla(html);
  $('#sonido').onclick = () => { E.sonido = !E.sonido; guardar(); camino(); };
  $$('.guia').forEach(b => { b.onclick = () => guia(+b.dataset.u); });
  $$('.nodo[data-i]').forEach(b => { b.onclick = () => leccion(+b.dataset.i); });
  $('#trofeo').onclick = informe;
  $('#reiniciar').onclick = () => dlg('<h2>¿Empezar de cero?</h2><p>Se borra el avance guardado en este navegador y se pide un nombre nuevo.</p>',
    [['Cancelar', 'blanco'], ['Borrar avance', 'rojo', () => { try { localStorage.removeItem(CLAVE); } catch { } E = base(); iniciar(); }]]);
  const act = $('.nodo-f.actual');
  if (act) act.scrollIntoView({ block: 'center' });
}

function guiaHTML(ui) {
  const u = M.unidades[ui];
  return `<h2 id="dlg-titulo">Unidad ${ui + 1} · ${esc(u.titulo)}</h2><p>${esc(u.tema)}</p>
    <h3>El caso</h3><p>${esc(u.caso)}</p>${tablaHTML(u.tabla, null, { chica: true })}
    <h3>Reglas del negocio</h3><ul>${u.reglas.map(r => `<li>${esc(r)}</li>`).join('')}</ul>
    <h3>La clave</h3><p>${esc(u.clave)}</p>
    ${ui === 0 ? `<h3>Cómo se juega</h3><ol>${M.como.map(c => `<li>${esc(c)}</li>`).join('')}</ol>` : ''}`;
}
function guia(ui, alEmpezar) {
  if (alEmpezar) dlg(guiaHTML(ui), [['Empezar la lección', '', alEmpezar]], M.unidades[ui].color, alEmpezar);
  else dlg(guiaHTML(ui), [['Entendido', '']], M.unidades[ui].color);
}

/* ---------------- lección ---------------- */
function leccion(i) {
  const L = LEC[i];
  let paso = 0;
  if (!E.lec[L.id]?.hecho) while (paso < L.n && E.hecho[L.g0 + paso]) paso++;   // retoma donde quedó
  S = { i, u: L.u, g0: L.g0, n: L.n, paso: paso >= L.n ? 0 : paso, vidas: 5, err: 0, xp: 0, hechos: 0, limpios: 0, t0: Date.now() };
  if (!E.guia[L.u]) { E.guia[L.u] = true; guardar(); return guia(L.u, ejercicio); }
  ejercicio();
}

async function ejercicio() {
  const g = S.g0 + S.paso;
  if (!E.k[g]) return camino();
  ocupado = true;
  let pub;
  try { pub = await abrirCon(J.retos[g].c, E.k[g], 'g' + g, 'reto'); } catch { ocupado = false; return camino(); }
  ocupado = false;
  const u = M.unidades[S.u];
  X = { g, pub, fallado: false, bloqueado: false, listoAhora: false, alReintentar: null };
  pantalla(`<div class="leccion c-${u.color}" data-g="${g}" data-tipo="${pub.tipo}">
    <header class="lbar"><button class="icono-btn" id="salir" aria-label="Salir de la lección">${IC.x}</button>
      <div class="prog" role="progressbar" aria-label="Avance de la lección" aria-valuemin="0" aria-valuemax="${S.n}" aria-valuenow="${S.paso}"><i style="width:${S.paso / S.n * 100}%"></i></div>
      <span class="stat vidas" aria-label="Vidas">${IC.corazon}<span id="nvidas">${S.vidas}</span></span></header>
    <div class="cuerpo"><div class="cuerpo-in">
      <span class="chip-tema">${esc(pub.tema)}</span>
      <h2 class="mision">${esc(pub.mision)}</h2>
      <div class="bit-dice">${bit()}<div class="globo"><b>Lo que debe saber</b><p>${esc(pub.saber)}</p></div></div>
      <div class="zona" id="zona"></div>
      <p class="como">${IC.info}<span><b>Cómo se resuelve:</b> ${esc(pub.como)}</span></p>
      ${pub.reglas ? `<div class="reglas"><b>Reglas del caso</b><ul>${pub.reglas.map(r => `<li>${esc(r)}</li>`).join('')}</ul></div>` : ''}
    </div></div>
    <footer class="pie" id="pie"></footer></div>`);
  $('#salir').onclick = () => dlg('<h2>¿Salir de la lección?</h2><p>Lo que ya resolviste queda guardado.</p>',
    [['Seguir aquí', 'blanco'], ['Salir', 'rojo', camino]]);
  ({ celdas: zonaSel, filas: zonaSel, columnas: zonaSel, escalon: zonaEscalon, empareja: zonaEmpareja, armar: zonaArmar })[pub.tipo]();
  pieNormal();
}

function pieNormal() {
  const pie = $('#pie'); pie.className = 'pie';
  pie.innerHTML = `<div class="pie-in"><button class="btn-ayuda" id="ayuda" aria-label="Repetir las instrucciones">${IC.ayuda}</button>
    <button class="btn" id="comprobar" disabled>Comprobar</button></div>`;
  $('#ayuda').onclick = ayuda;
  $('#comprobar').onclick = comprobar;
  listo(X.listoAhora);
}
function listo(v) { X.listoAhora = !!v; const b = $('#comprobar'); if (b) b.disabled = !v || X.bloqueado; }

function ayuda() {
  const p = X.pub, u = M.unidades[S.u];
  dlg(`<h2 id="dlg-titulo">${esc(p.tema)}</h2><h3>Lo que debe saber</h3><p>${esc(p.saber)}</p><h3>Su misión</h3><p>${esc(p.mision)}</p>
    <h3>Cómo se resuelve</h3><p>${esc(p.como)}</p>${p.reglas ? `<h3>Reglas del caso</h3><ul>${p.reglas.map(r => `<li>${esc(r)}</li>`).join('')}</ul>` : ''}`,
  [['Ver la guía', 'blanco', () => guia(S.u)], ['Entendido', '']], u.color);
}

async function comprobar() {
  if (ocupado || X.bloqueado || !X.listoAhora) return;
  ocupado = true; $('#comprobar').disabled = true;
  try {
    const sec = await fin(X.g, X.canon());
    if (sec) acierto(sec);
    else fallo(await X.motivos());
  } finally { ocupado = false; }
}

const FRASES = ['¡Bien hecho!', '¡Excelente!', '¡Correcto!', '¡Así se hace!'];
function acierto(sec) {
  const g = X.g;
  if (!(g in E.resp)) E.resp[g] = true;
  if (!E.hecho[g]) { E.hecho[g] = true; const gana = X.fallado ? 5 : 10; E.xp += gana; S.xp += gana; }
  if (sec.sig && g + 1 < J.retos.length) E.k[g + 1] = sec.sig;
  if (!X.fallado) { E.racha++; E.mejor = Math.max(E.mejor, E.racha); S.limpios++; }
  S.hechos++;
  guardar(); sonar('bien');
  X.bloqueado = true; $('#zona').classList.add('cerrada');
  const pie = $('#pie'); pie.className = 'pie ok';
  pie.innerHTML = `<div class="pie-in"><div class="res" role="status"><span class="sello">${IC.okGrande}</span><div>
    <h3>${FRASES[g % FRASES.length]}</h3>${!X.fallado && E.racha >= 3 ? `<span class="racha-msg">${IC.llama} ¡${E.racha} seguidas!</span>` : ''}
    <p class="pq"><b>Por qué así:</b> ${esc(sec.explica)}</p></div></div>
    <button class="btn" id="continuar">Continuar</button></div>`;
  $('#continuar').onclick = siguiente; $('#continuar').focus({ preventScroll: true });
}

function fallo(motivos) {
  const g = X.g;
  if (!(g in E.resp)) E.resp[g] = false;
  X.fallado = true; X.bloqueado = true; E.racha = 0; S.err++; S.vidas = Math.max(0, S.vidas - 1);
  guardar(); sonar('mal');
  $('#nvidas').textContent = S.vidas;
  const pie = $('#pie'); pie.className = 'pie mal';
  pie.innerHTML = `<div class="pie-in"><div class="res" role="alert"><span class="sello">${STK.length ? STK[(g + S.err) % STK.length] : ''}</span><div>
    <h3>No es así</h3><ul class="pq">${[...new Set(motivos)].map(m => `<li>${esc(m)}</li>`).join('')}</ul>
    ${S.vidas ? '' : '<p class="pq"><b>Te quedaste sin vidas.</b></p>'}</div></div>
    <button class="btn" id="reintentar">${S.vidas ? 'Reintentar' : 'Continuar'}</button></div>`;
  $('#reintentar').onclick = () => {
    if (!S.vidas) return sinVidas();
    X.bloqueado = false; pieNormal(); if (X.alReintentar) X.alReintentar();
  };
  $('#reintentar').focus({ preventScroll: true });
}

function siguiente() { S.paso++; if (S.paso >= S.n) completa(); else ejercicio(); }

function confeti() {
  const c = document.createElement('div'); c.className = 'confeti';
  const col = ['#58CC02', '#1CB0F6', '#FFC800', '#FF9600', '#CE82FF', '#FF4B4B'];
  for (let i = 0; i < 46; i++) {
    const p = document.createElement('i');
    p.style.left = Math.random() * 100 + '%'; p.style.background = col[i % col.length];
    p.style.animationDelay = Math.random() * .8 + 's'; c.append(p);
  }
  return c;
}

function completa() {
  const L = LEC[S.i], previo = E.lec[L.id]?.hecho;
  const prec = S.hechos ? Math.round(100 * S.limpios / S.hechos) : 100;
  let bono = 0;
  if (!previo && S.err === 0) { bono = 5; E.xp += 5; }
  E.lec[L.id] = { hecho: true, prec: previo ? E.lec[L.id].prec : prec };
  guardar(); sonar('fin');
  const seg = Math.round((Date.now() - S.t0) / 1000);
  pantalla(`<section class="fin">${bit('es-feliz salta')}<h1>¡Lección completada!</h1>
    <p class="lema">${esc(L.titulo)}${bono ? ' · ¡Sin errores! +5 XP extra' : ''}</p>
    <div class="tarjetas"><div class="tarjeta" style="--uc2:#E5A500"><b>XP GANADOS</b><span>${IC.rayo}${S.xp + bono}</span></div>
      <div class="tarjeta" style="--uc2:#46A302"><b>PRECISIÓN</b><span>${IC.diana}${prec} %</span></div>
      <div class="tarjeta" style="--uc2:#1899D6"><b>TIEMPO</b><span>${IC.reloj}${Math.floor(seg / 60)}:${String(seg % 60).padStart(2, '0')}</span></div></div>
    <button class="btn" id="seguir">Continuar</button></section>`);
  $('#app').append(confeti());
  $('#seguir').onclick = camino;
}

function sinVidas() {
  pantalla(`<section class="fin triste">${bit('es-triste')}<h1>Te quedaste sin vidas</h1>
    <p class="lema">Repasa la guía y vuelve a intentar la lección desde el principio. Lo que ya resolviste no se pierde.</p>
    <div class="acciones" style="justify-content:center"><button class="btn blanco" id="verguia">${IC.libro} Ver la guía</button>
    <button class="btn" id="repetir">${IC.repasar} Repetir la lección</button></div>
    <button class="enlace" id="alcamino">Volver al camino</button></section>`);
  $('#verguia').onclick = () => guia(S.u);
  $('#repetir').onclick = () => { Object.assign(S, { paso: 0, vidas: 5, err: 0, xp: 0, hechos: 0, limpios: 0, t0: Date.now() }); ejercicio(); };
  $('#alcamino').onclick = camino;
}

/* ---------------- tipos de ejercicio ---------------- */
function zonaSel() {
  const p = X.pub, modo = p.tipo, sel = new Set();
  let html = '';
  if (p.referencia) html += `<details class="ref" open><summary>Tabla ${esc(p.referencia.nombre)}</summary>${tablaHTML(p.referencia, null, { chica: true })}</details>`;
  if (p.piezas) html += `<div class="fila-tablas">${p.piezas.map(t => `<div>${tablaHTML(t, null, { chica: true })}</div>`).join('')}</div>
    <p class="une">${IC.une} Unión de las dos piezas</p>`;
  $('#zona').innerHTML = html + tablaHTML(p.tabla, modo, { id: 'tj' });
  const todos = modo === 'celdas' ? p.tabla.filas.flatMap((_, r) => p.tabla.cols.map(c => `${r}:${c}`))
    : modo === 'columnas' ? p.tabla.cols.slice() : p.tabla.filas.map((_, r) => String(r));
  const pinta = el => {
    const on = sel.has(el.dataset.id);
    el.classList.toggle('sel', on); el.classList.remove('malsel'); el.setAttribute('aria-pressed', on);
    if (modo === 'columnas') { const c = p.tabla.cols.indexOf(el.dataset.id); $$(`#tj td[data-c="${c}"]`).forEach(td => td.classList.toggle('colsel', on)); }
  };
  $$('#tj .toca').forEach(el => pulsable(el, () => {
    if (X.bloqueado) return;
    const id = el.dataset.id; sel.has(id) ? sel.delete(id) : sel.add(id);
    pinta(el); listo(sel.size > 0);
  }));
  X.canon = () => [...sel].sort().join(',');
  X.motivos = async () => {
    const m = [];
    for (const id of todos.filter(t => sel.has(t))) {
      const fb = await parte(X.g, 'el', todos.indexOf(id), id);
      if (!fb.ok) { m.push(fb.porque); $(`#tj [data-id="${CSS.escape(id)}"]`).classList.add('malsel'); }
    }
    const que = { celdas: 'celdas', filas: 'filas', columnas: 'encabezados' }[modo];
    return m.length ? m : [`Vas bien, pero te faltan ${que}: son ${p.n} en total.`];
  };
}

function zonaEscalon() {
  const p = X.pub;
  $('#zona').innerHTML = tablaHTML(p.tabla, null) + `<div class="escalera" role="radiogroup" aria-label="Rangos de normalización">${NIVELES.map((n, i) =>
    `<button class="escalon" data-n="${n}" role="radio" aria-checked="false" style="width:${58 + i * 7}%">${IC.escalon}<span><b>${n}</b><br><span class="n">${LEMA[n]}</span></span></button>`).join('')}</div>`;
  $$('.escalon').forEach(b => { b.onclick = () => {
    if (X.bloqueado) return;
    X.op = b.dataset.n;
    $$('.escalon').forEach(x => { const on = x === b; x.classList.toggle('sel', on); x.classList.remove('malsel'); x.setAttribute('aria-checked', on); });
    listo(true);
  }; });
  X.canon = () => X.op;
  X.motivos = async () => {
    const fb = await parte(X.g, 'op', NIVELES.indexOf(X.op), X.op);
    $(`.escalon[data-n="${X.op}"]`).classList.add('malsel');
    return [fb.porque];
  };
}

function zonaEmpareja() {
  const p = X.pub, n = p.izq.length, hechas = {};
  let li = null, rj = null;
  $('#zona').innerHTML = `<div class="parejas"><div class="col">${barajar([...p.izq.keys()]).map(i => `<button class="pz" data-l="${i}">${esc(p.izq[i])}</button>`).join('')}</div>
    <div class="col">${barajar([...p.der.keys()]).map(j => `<button class="pz" data-r="${j}">${esc(p.der[j])}</button>`).join('')}</div></div>`;
  const intentar = async () => {
    if (li === null || rj === null) return;
    const i = li, j = rj; li = rj = null;
    const bl = $(`.pz[data-l="${i}"]`), br = $(`.pz[data-r="${j}"]`);
    ocupado = true;
    let fb; try { fb = await parte(X.g, 'm' + i, j, p.der[j]); } finally { ocupado = false; }
    bl.classList.remove('activo'); br.classList.remove('activo');
    if (fb.ok) {
      hechas[i] = j; [bl, br].forEach(b => { b.classList.remove('mal'); b.classList.add('hecho'); b.disabled = true; }); sonar('par');
      if (Object.keys(hechas).length === n) listo(true);
    } else {
      [bl, br].forEach(b => { b.classList.add('mal'); setTimeout(() => b.classList.remove('mal'), 650); });
      fallo([fb.porque]);
    }
  };
  $$('.pz').forEach(b => { b.onclick = () => {
    if (X.bloqueado || ocupado || b.disabled) return;
    const lado = 'l' in b.dataset ? 'l' : 'r';
    $$(`.pz[data-${lado}]`).forEach(x => x.classList.toggle('activo', x === b));
    if (lado === 'l') li = +b.dataset.l; else rj = +b.dataset.r;
    intentar();
  }; });
  X.canon = () => [...Array(n).keys()].map(i => `${i}=${p.der[hechas[i]]}`).join('|');
  X.motivos = async () => ['Completa todas las parejas.'];
}

function zonaArmar() {
  const p = X.pub, D = p.destinos, F = p.fichas, pos = D.map(() => []), key = D.map(() => new Set());
  let act = 0;
  $('#zona').innerHTML = tablaHTML(p.tabla, null, { chica: true }) + '<div id="arma"></div>';
  const pinta = () => {
    $('#arma').innerHTML = `<div class="destinos">${D.map((d, ti) => `<div class="destino${ti === act ? ' activo' : ''}" data-t="${ti}" role="button" tabindex="0" aria-label="Tabla ${esc(d)}${ti === act ? ', elegida' : ''}">
      <div class="dnom">${IC.tabla} ${esc(d)}${ti === act && D.length > 1 ? ' <span class="act">ELEGIDA</span>' : ''}</div>
      <div class="ranura">${pos[ti].length ? pos[ti].map(k => `<span class="puesta${key[ti].has(k) ? ' clave' : ''}" data-t="${ti}" data-k="${k}">
        <button class="llave" aria-pressed="${key[ti].has(k)}" aria-label="Marcar ${esc(F[k])} como clave en ${esc(d)}">${IC.llave}</button><span class="ftxt">${esc(F[k])}</span>
        <button class="quita" aria-label="Quitar ${esc(F[k])} de ${esc(d)}">${IC.x}</button></span>`).join('') : '<span class="vacio">Toca las fichas para ponerlas aquí</span>'}</div></div>`).join('')}</div>
      <div class="banco">${F.map((f, k) => `<button class="ficha${pos.some(x => x.includes(k)) ? ' usada' : ''}" data-f="${k}">${esc(f)}</button>`).join('')}</div>`;
    $$('#arma .destino').forEach(d => pulsable(d, ev => { if (ev.target.closest('button') || X.bloqueado) return; act = +d.dataset.t; pinta(); }));
    $$('#arma .ficha').forEach(b => { b.onclick = () => { if (X.bloqueado) return; const k = +b.dataset.f; if (!pos[act].includes(k)) pos[act].push(k); pinta(); }; });
    $$('#arma .llave').forEach(b => { b.onclick = () => { if (X.bloqueado) return; const s = b.closest('.puesta'), ti = +s.dataset.t, k = +s.dataset.k;
      key[ti].has(k) ? key[ti].delete(k) : key[ti].add(k); pinta(); }; });
    $$('#arma .quita').forEach(b => { b.onclick = () => { if (X.bloqueado) return; const s = b.closest('.puesta'), ti = +s.dataset.t, k = +s.dataset.k;
      pos[ti] = pos[ti].filter(x => x !== k); key[ti].delete(k); pinta(); }; });
    listo(D.every((_, ti) => pos[ti].length && key[ti].size));
  };
  pinta();
  X.canon = () => D.map((d, ti) => d + ':' + pos[ti].map(k => F[k] + (key[ti].has(k) ? '*' : '')).sort().join(',')).join(';');
  X.motivos = async () => {
    const m = [];
    for (let ti = 0; ti < D.length; ti++) for (let k = 0; k < F.length; k++) {
      const va = pos[ti].includes(k);
      const fb = await parte(X.g, `e${ti}_${k}`, va ? 0 : 1, va ? 'si' : 'no');
      if (!fb.ok) { m.push(fb.porque); if (va) $(`.puesta[data-t="${ti}"][data-k="${k}"]`).classList.add('malsel'); }
      if (va) { const c = key[ti].has(k), fk = await parte(X.g, `k${ti}_${k}`, c ? 0 : 1, c ? 'si' : 'no'); if (!fk.ok) m.push(fk.porque); }
    }
    return m.length ? m : ['Revisa las tablas.'];
  };
}

/* ---------------- informe y constancia ---------------- */
function resumen() {
  let ok = 0, n = 0;
  const unidades = M.unidades.map((u, ui) => {
    const temas = [];
    u.lecciones.forEach(l => l.temas.forEach((t, k) => { const b = E.resp[l.g0 + k] === true; ok += b; n++; temas.push([t, b]); }));
    return { u, ui, temas };
  });
  return { ok, n, pct: Math.round(100 * ok / n), unidades, fecha: new Date().toLocaleDateString('es-EC', { day: '2-digit', month: '2-digit', year: 'numeric' }) };
}
function constanciaHTML(R) {
  return `<div class="constancia"><h2>Constancia</h2><p>Sube de Rango · Normalización de tablas</p><p>Se otorga a</p>
    <p class="quien">${esc(E.nombre)} ${esc(E.apellido)}</p><p>por completar las ${M.unidades.length} unidades y los ${R.n} ejercicios, de la 1FN a la 5FN.</p>
    <p><b>Resultado:</b> ${R.ok} de ${R.n} al primer intento (${R.pct} %) · ${E.xp} XP · mejor racha: ${E.mejor}</p><p><b>Fecha:</b> ${R.fecha}</p></div>`;
}
function informeHTML(R) {
  return R.unidades.map(({ u, ui, temas }) => `<section class="inf-u c-${u.color}"><h3>Unidad ${ui + 1} · ${esc(u.titulo)}</h3><table>
    ${temas.map(([t, b]) => `<tr><td>${esc(t)}</td><td class="${b ? 'bien' : 'repasar'}">${b ? IC.check + ' Primer intento' : IC.repasar + ' Repasar'}</td></tr>`).join('')}</table></section>`).join('');
}
function informe() {
  const R = resumen();
  pantalla(`${barra()}<div class="informe"><h1>Informe de entendimiento</h1>
    <p>Cada tema muestra si lo resolviste al primer intento. Lo que dice «Repasar» lo lograste después de un error: vuelve a la guía de esa unidad.</p>
    ${constanciaHTML(R)}${informeHTML(R)}
    <div class="acciones"><button class="btn azul" id="copiar">${IC.copiar} Copiar informe</button><button class="btn blanco" id="imprimir">${IC.imprimir} Imprimir</button>
    <button class="btn" id="volver">Volver al camino</button></div><p class="aviso" id="copiado" aria-live="polite"></p></div>`);
  $('#sonido').onclick = () => { E.sonido = !E.sonido; guardar(); informe(); };
  $('#volver').onclick = camino;
  $('#imprimir').onclick = () => { $('#imprimible').innerHTML = constanciaHTML(R) + informeHTML(R); window.print(); };
  $('#copiar').onclick = async () => {
    const txt = [`Sube de Rango · Informe de entendimiento`, `Jugador: ${E.nombre} ${E.apellido}`, `Fecha: ${R.fecha}`,
      `Resultado: ${R.ok} de ${R.n} al primer intento (${R.pct} %) · ${E.xp} XP · mejor racha: ${E.mejor}`, '',
      ...R.unidades.flatMap(({ u, ui, temas }) => [`Unidad ${ui + 1} · ${u.titulo}`, ...temas.map(([t, b]) => `  - ${t}: ${b ? 'primer intento' : 'repasar'}`)])].join('\n');
    let ok = false;
    try { await navigator.clipboard.writeText(txt); ok = true; } catch {
      const ta = document.createElement('textarea'); ta.value = txt; document.body.append(ta); ta.select();
      try { ok = document.execCommand('copy'); } catch { } ta.remove();
    }
    $('#copiado').textContent = ok ? 'Informe copiado.' : 'No se pudo copiar: usa «Imprimir».';
  };
}

iniciar();
})();
