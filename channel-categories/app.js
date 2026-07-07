"use strict";

const CONFIG = {
  chE: "#654EA3",
  chP: "#0E7C8C",
  ink: "#1A1A1A",
  n500: "#71737E",
  dur: matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 800
};

const CAT_COLOR = {
  "education-general": "#654EA3",
  "education-school": "#4A2D87",
  "education-preschool": "#7B66B8",
  "education-extracurricular": "#9E5FAB",
  "improvement-general": "#2D6BAB",
  "improvement-streets": "#1A4F82",
  heritage: "#A0571F",
  greenery: "#3D7C3F",
  "afu-support": "#3F4049",
  accessibility: "#0E7C8C",
  other: "#71737E"
};

const NBSP = " ";

const fmtInt = n => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, NBSP);

const fmtPct = (x, d = 1) => x.toFixed(d).replace(".", ",") + "%";

const catLabel = k => COPY.categories && COPY.categories[k] || k;

const catColor = k => CAT_COLOR[k] || CONFIG.n500;

const paperPct = r => 100 * r.paper / (r.electronic + r.paper);

const total = r => r.electronic + r.paper;

const tpl = (str, vars) => String(str).replace(/\{([^{}]+)\}/g, (m, k) => vars && k in vars ? vars[k] : m);

function applyStaticCopy() {
  document.title = COPY.pageTitle;
  const md = document.getElementById("metaDesc");
  if (md) md.setAttribute("content", COPY.metaDescription);
  document.querySelectorAll("[data-copy]").forEach(el => {
    const v = COPY[el.dataset.copy];
    if (v != null) el.textContent = v;
  });
  document.querySelectorAll("[data-aria]").forEach(el => {
    const v = COPY[el.dataset.aria];
    if (v != null) el.setAttribute("aria-label", v);
  });
  document.getElementById("loadingText").textContent = COPY.loading;
  const noteList = document.getElementById("noteList");
  noteList.innerHTML = "";
  (COPY.notes || []).forEach(t => {
    const li = document.createElement("li");
    li.textContent = t;
    noteList.appendChild(li);
  });
}

const state = {
  year: null,
  category: null
};

let DB = null;

let YEARS = [];

let byYear = new Map;

let byCat = new Map;

window.addEventListener("DOMContentLoaded", async () => {
  applyStaticCopy();
  try {
    const resp = await fetch("data/channel_categories.json");
    if (!resp.ok) throw new Error("HTTP " + resp.status);
    DB = await resp.json();
  } catch (e) {
    document.getElementById("loadingText").textContent = COPY.loadError;
    console.error(e);
    return;
  }
  YEARS = DB.meta.years.slice();
  DB.by_year_category_channel.forEach(r => {
    if (r.electronic == null || r.paper == null) return;
    if (!byYear.has(r.year)) byYear.set(r.year, []);
    byYear.get(r.year).push(r);
    if (!byCat.has(r.category)) byCat.set(r.category, []);
    byCat.get(r.category).push(r);
  });
  byCat.forEach(arr => arr.sort((a, b) => a.year - b.year));
  state.year = YEARS[YEARS.length - 1];
  document.getElementById("loading").hidden = true;
  buildAxis();
  renderBars(false);
  renderPanel();
  let t = null;
  new ResizeObserver(() => {
    clearTimeout(t);
    t = setTimeout(() => {
      if (state.category) renderPanel();
    }, 150);
  }).observe(document.querySelector(".panel"));
});

function buildAxis() {
  const axis = document.getElementById("yearAxis");
  axis.innerHTML = "";
  YEARS.forEach(y => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "year-btn";
    b.textContent = y;
    b.dataset.year = y;
    b.setAttribute("aria-pressed", String(y === state.year));
    b.setAttribute("aria-label", tpl(COPY.yearAria, {
      рік: y
    }));
    b.addEventListener("click", () => selectYear(y));
    axis.appendChild(b);
  });
  axis.addEventListener("keydown", e => {
    const btns = [ ...axis.querySelectorAll(".year-btn") ];
    const i = btns.indexOf(document.activeElement);
    if (i < 0) return;
    let j = null;
    if (e.key === "ArrowRight") j = Math.min(i + 1, btns.length - 1); else if (e.key === "ArrowLeft") j = Math.max(i - 1, 0); else if (e.key === "Home") j = 0; else if (e.key === "End") j = btns.length - 1;
    if (j !== null) {
      e.preventDefault();
      btns[j].focus();
      btns[j].click();
    }
  });
}

function selectYear(y) {
  if (state.year === y) return;
  state.year = y;
  if (state.category && !byYear.get(y).some(r => r.category === state.category)) {
    state.category = null;
  }
  document.querySelectorAll(".year-btn").forEach(b => {
    b.setAttribute("aria-pressed", String(Number(b.dataset.year) === y));
  });
  renderBars(true);
  renderPanel();
}

function renderBars(animate) {
  const wrap = document.getElementById("bars");
  const rows = (byYear.get(state.year) || []).map(r => ({
    ...r,
    pp: paperPct(r),
    tot: total(r)
  })).sort((a, b) => b.pp - a.pp);
  wrap.innerHTML = "";
  rows.forEach(r => {
    const eW = r.electronic / r.tot * 100;
    const pW = r.paper / r.tot * 100;
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "bar-row";
    btn.dataset.cat = r.category;
    btn.setAttribute("aria-pressed", String(state.category === r.category));
    btn.setAttribute("aria-label", tpl(COPY.barAria, {
      категорія: catLabel(r.category),
      рік: state.year,
      частка: fmtPct(r.pp),
      онлайн: fmtInt(r.electronic),
      цнап: fmtInt(r.paper)
    }));
    btn.innerHTML = `<div class="bar-top">\n         <span class="bar-name">${catLabel(r.category)}</span>\n         <span class="bar-count">${fmtInt(r.tot)}</span>\n         <span class="bar-val">${fmtPct(r.pp)}<span class="suffix"> ${COPY.barValueSuffix}</span></span>\n       </div>\n       <div class="bar-track" role="img"\n            aria-label="${fmtInt(r.electronic)} онлайн, ${fmtInt(r.paper)} через ЦНАП">\n         <span class="seg seg-e" style="width:${animate ? 0 : eW.toFixed(2)}%"></span>\n         <span class="seg seg-p" style="width:${animate ? 0 : pW.toFixed(2)}%"></span>\n       </div>`;
    btn.addEventListener("click", () => selectCategory(r.category));
    wrap.appendChild(btn);
    if (animate) {
      requestAnimationFrame(() => {
        btn.querySelector(".seg-e").style.width = eW.toFixed(2) + "%";
        btn.querySelector(".seg-p").style.width = pW.toFixed(2) + "%";
      });
    }
  });
  fillSceneCap(rows);
}

function selectCategory(cat) {
  state.category = state.category === cat ? null : cat;
  document.querySelectorAll(".bar-row").forEach(b => {
    b.setAttribute("aria-pressed", String(b.dataset.cat === state.category));
  });
  renderPanel();
}

function fillSceneCap(rows) {
  const cap = document.getElementById("sceneCap");
  if (!rows.length) {
    cap.textContent = "";
    return;
  }
  const hi = rows[0], lo = rows[rows.length - 1];
  cap.innerHTML = tpl(COPY.sceneCap, {
    рік: state.year,
    макс: catLabel(hi.category),
    максЧастка: fmtPct(hi.pp),
    мін: catLabel(lo.category),
    мінЧастка: fmtPct(lo.pp)
  });
}

function renderPanel() {
  const p = document.getElementById("panel");
  const rows = (byYear.get(state.year) || []).map(r => ({
    ...r,
    pp: paperPct(r),
    tot: total(r)
  })).sort((a, b) => b.pp - a.pp);
  if (!state.category) {
    p.innerHTML = panelYear(rows);
    return;
  }
  const cur = rows.find(r => r.category === state.category);
  if (!cur) {
    state.category = null;
    p.innerHTML = panelYear(rows);
    return;
  }
  p.innerHTML = panelCategory(cur, rows);
  const back = p.querySelector(".back-btn");
  if (back) back.addEventListener("click", () => selectCategory(state.category));
  drawTrend(p.querySelector("#trendSvg"), state.category);
}

function panelYear(rows) {
  const eSum = d3.sum(rows, r => r.electronic);
  const pSum = d3.sum(rows, r => r.paper);
  const pp = 100 * pSum / (eSum + pSum);
  const hi = rows[0], lo = rows[rows.length - 1];
  return `\n    <p class="panel-overline">${COPY.panelYearOverline} ${state.year}</p>\n    <div class="lead">\n      <span class="num">${fmtPct(pp)}</span>\n      <span class="lab">${COPY.panelYearLeadLab}</span>\n    </div>\n    <div class="stat-pair">\n      <div class="stat"><span class="num">${fmtInt(eSum)}</span>\n        <span class="lab">${COPY.labOnlineVotes}</span></div>\n      <div class="stat"><span class="num is-offline">${fmtInt(pSum)}</span>\n        <span class="lab">${COPY.labOfflineVotes}</span></div>\n    </div>\n    <div class="panel-sec">\n      <p class="panel-note">${tpl(COPY.panelYearRange, {
    макс: catLabel(hi.category),
    максЧастка: fmtPct(hi.pp),
    мін: catLabel(lo.category),
    мінЧастка: fmtPct(lo.pp)
  })}</p>\n      <p class="panel-hint">${COPY.panelYearHint}</p>\n    </div>`;
}

function panelCategory(cur, rows) {
  const ann = annotationFor(cur, rows);
  const series = byCat.get(state.category) || [];
  const trend = series.length > 1 ? `<div class="panel-sec">\n         <h3>${COPY.trendTitle}</h3>\n         <p class="sec-cap">${COPY.trendCap}</p>\n         <div class="trend"><svg id="trendSvg" class="trend-svg" aria-hidden="true"></svg></div>\n       </div>` : `<div class="panel-sec">\n         <p class="panel-note">${tpl(COPY.trendSingleYear, {
    рік: cur.year
  })}</p>\n       </div>`;
  return `\n    <button type="button" class="back-btn">${COPY.backToYear}</button>\n    <p class="panel-overline"><i class="chip" style="background:${catColor(cur.category)}"></i>${tpl(COPY.panelCatOverline, {
    рік: state.year
  })}</p>\n    <h2 class="panel-title">${catLabel(cur.category)}</h2>\n    <div class="lead">\n      <span class="num">${fmtPct(cur.pp)}</span>\n      <span class="lab">${COPY.panelCatLeadLab}</span>\n    </div>\n    <div class="stat-pair">\n      <div class="stat"><span class="num">${fmtInt(cur.electronic)}</span>\n        <span class="lab">${COPY.labCatOnline}</span></div>\n      <div class="stat"><span class="num is-offline">${fmtInt(cur.paper)}</span>\n        <span class="lab">${COPY.labCatOffline}</span></div>\n    </div>\n    ${trend}\n    <p class="panel-note">${ann}</p>`;
}

function annotationFor(cur, rows) {
  const eSum = d3.sum(rows, r => r.electronic);
  const pSum = d3.sum(rows, r => r.paper);
  const yearPP = 100 * pSum / (eSum + pSum);
  if (cur.pp >= yearPP + 3) return COPY.annHighOffline;
  if (cur.pp <= yearPP - 3) return COPY.annLowOffline;
  return COPY.annMid;
}

function drawTrend(svg, cat) {
  if (!svg) return;
  const series = byCat.get(cat) || [];
  const pts = series.map(r => ({
    year: r.year,
    pp: paperPct(r)
  }));
  const present = new Set(pts.map(p => p.year));
  const sel = d3.select(svg);
  const W = svg.clientWidth || svg.parentNode.clientWidth || 280;
  const H = 110;
  const m = {
    t: 22,
    r: 14,
    b: 22,
    l: 14
  };
  sel.attr("viewBox", `0 0 ${W} ${H}`).attr("height", H).selectAll("*").remove();
  const x = d3.scalePoint().domain(YEARS).range([ m.l, W - m.r ]).padding(.5);
  const maxPP = d3.max(pts, p => p.pp) || 1;
  const y = d3.scaleLinear().domain([ 0, maxPP * 1.25 ]).range([ H - m.b, m.t ]);
  const line = d3.line().x(p => x(p.year)).y(p => y(p.pp));
  const path = sel.append("path").attr("class", "trend-line").attr("d", line(pts));
  if (CONFIG.dur) {
    const len = path.node().getTotalLength();
    path.attr("stroke-dasharray", `${len} ${len}`).attr("stroke-dashoffset", len).transition().duration(CONFIG.dur).ease(d3.easeCubicOut).attr("stroke-dashoffset", 0);
  }
  sel.selectAll("text.trend-year").data(YEARS).join("text").attr("class", "trend-year").attr("x", d => x(d)).attr("y", H - 6).attr("text-anchor", "middle").attr("opacity", d => present.has(d) ? 1 : .4).text(d => d);
  const g = sel.selectAll("g.pt").data(pts).join("g").attr("class", "pt");
  g.append("circle").attr("class", p => "trend-dot" + (p.year === state.year ? " is-current" : "")).attr("cx", p => x(p.year)).attr("cy", p => y(p.pp)).attr("r", 4);
  g.append("text").attr("class", "trend-lbl").attr("x", p => x(p.year)).attr("y", p => y(p.pp) - 9).attr("text-anchor", "middle").text(p => fmtPct(p.pp, p.pp < 10 ? 1 : 0));
}
