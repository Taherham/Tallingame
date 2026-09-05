#!/usr/bin/env node
// Curate short YouTube videos for each unit using the YouTube Data API v3.
//
//   YOUTUBE_API_KEY=... node shrimp/tools/curate-videos.mjs            # search everything, write a shortlist
//   YOUTUBE_API_KEY=... node shrimp/tools/curate-videos.mjs --unit w2   # one unit only
//   node shrimp/tools/curate-videos.mjs --apply shortlist.json          # write chosen videos into js/*.js
//   YOUTUBE_API_KEY=... node shrimp/tools/curate-videos.mjs --verify    # re-check that chosen videos still exist and embed
//
// Rules: embeddable, under 5 minutes, English, from channels we trust when possible.
// Quota: each search costs 100 units of the free 10,000/day. 18 units x 4 queries = 7,200 plus a few
// units for video details. Run the full curation at most once a day.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const jsDir = path.join(here, "..", "js");
const API = "https://www.googleapis.com/youtube/v3";
const KEY = process.env.YOUTUBE_API_KEY;
const MAX_SECONDS = 5 * 60;
const PER_UNIT = 4;

// Channels whose instruction we trust for beginners. Matching is case-insensitive substring on channelTitle.
const TRUSTED = [
  { match: "jordan teaches jiujitsu", boost: 40 },
  { match: "chewjitsu", boost: 30 },
  { match: "stephan kesting", boost: 30 },
  { match: "grapplearts", boost: 30 },
  { match: "jon thomas", boost: 25 },
  { match: "lachlan giles", boost: 25 },
  { match: "absolute mma", boost: 20 },
  { match: "gracie breakdown", boost: 20 },
  { match: "gracie university", boost: 15 },
  { match: "bjj fanatics", boost: 20 },
  { match: "knight jiu-jitsu", boost: 20 },
  { match: "bernardo faria", boost: 15 },
  { match: "keenan", boost: 15 },
  { match: "the grappling academy", boost: 15 },
  { match: "invisible jiu jitsu", boost: 10 },
];

const args = process.argv.slice(2);
const flag = (name) => { const i = args.indexOf(name); return i >= 0 ? (args[i + 1] ?? true) : null; };

// Load unit definitions by evaluating the browser data files in a tiny sandbox.
function loadUnits() {
  const src = fs.readFileSync(path.join(jsDir, "white.js"), "utf8") + "\n" + fs.readFileSync(path.join(jsDir, "blue.js"), "utf8");
  const fn = new Function(src + "\nreturn { WHITE_UNITS, BLUE_UNITS };");
  const { WHITE_UNITS, BLUE_UNITS } = fn();
  return [...WHITE_UNITS.map((u) => ({ ...u, belt: "white" })), ...BLUE_UNITS.map((u) => ({ ...u, belt: "blue" }))];
}

function isoToSeconds(iso) {
  const m = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/.exec(iso || "");
  if (!m) return null;
  return (+m[1] || 0) * 3600 + (+m[2] || 0) * 60 + (+m[3] || 0);
}

async function yt(endpoint, params) {
  const url = new URL(`${API}/${endpoint}`);
  Object.entries({ ...params, key: KEY }).forEach(([k, v]) => url.searchParams.set(k, v));
  const res = await fetch(url);
  const body = await res.json();
  if (!res.ok) throw new Error(`${endpoint} ${res.status}: ${body.error?.message || JSON.stringify(body)}`);
  return body;
}

async function searchQuery(q) {
  // One search per query (100 quota units). Duration is filtered afterwards from videos.list,
  // because YouTube's own duration buckets (short = under 4 min) don't match our 5-minute rule.
  const r = await yt("search", {
    part: "id", type: "video", q, maxResults: 30, videoEmbeddable: "true", videoSyndicated: "true",
    relevanceLanguage: "en", safeSearch: "strict",
  });
  return r.items.map((it) => it.id.videoId).filter(Boolean);
}

async function videoDetails(ids) {
  const out = [];
  for (let i = 0; i < ids.length; i += 50) {
    const r = await yt("videos", { part: "snippet,contentDetails,statistics,status", id: ids.slice(i, i + 50).join(",") });
    out.push(...r.items);
  }
  return out;
}

function score(v, query) {
  const title = v.snippet.title.toLowerCase();
  const channel = v.snippet.channelTitle.toLowerCase();
  let s = 0;
  const trusted = TRUSTED.find((t) => channel.includes(t.match));
  if (trusted) s += trusted.boost;
  const views = +(v.statistics?.viewCount || 0);
  s += Math.min(25, Math.log10(views + 1) * 5);
  const likes = +(v.statistics?.likeCount || 0);
  if (views > 0) s += Math.min(10, (likes / views) * 500);
  query.toLowerCase().split(/\s+/).filter((w) => w.length > 3 && w !== "bjj").forEach((w) => { if (title.includes(w)) s += 3; });
  if (/beginner|basics|fundamental|how to|tutorial|explained/.test(title)) s += 4;
  if (/highlight|compilation|vs\.?|match|fight|funny|reaction|podcast/.test(title)) s -= 20;
  // Perspective mismatch: a video about passing, escaping or countering a position when the
  // query is about playing or attacking from it (and vice versa) teaches the wrong side.
  const q = query.toLowerCase();
  for (const word of ["pass", "escape", "defen", "counter", "stop", "against"]) {
    if (title.includes(word) && !q.includes(word)) s -= 12;
  }
  return Math.round(s);
}

async function curate(onlyUnit) {
  if (!KEY) throw new Error("Set YOUTUBE_API_KEY in the environment.");
  const units = loadUnits().filter((u) => !onlyUnit || u.id === onlyUnit);
  const shortlist = {};
  for (const unit of units) {
    console.error(`\n== ${unit.belt} / ${unit.id} ${unit.title}`);
    const candidates = new Map();
    for (const q of unit.videoQueries) {
      let ids = [];
      try { ids = await searchQuery(q); } catch (e) { console.error(`  search failed for "${q}": ${e.message}`); continue; }
      const details = await videoDetails(ids);
      for (const v of details) {
        const secs = isoToSeconds(v.contentDetails?.duration);
        if (secs == null || secs > MAX_SECONDS || secs < 45) continue;
        if (v.status?.embeddable === false) continue;
        const entry = candidates.get(v.id) || {
          id: v.id, title: v.snippet.title, channel: v.snippet.channelTitle, duration: secs,
          views: +(v.statistics?.viewCount || 0), url: `https://www.youtube.com/watch?v=${v.id}`,
          queries: [], score: 0,
        };
        entry.queries.push(q);
        entry.score = Math.max(entry.score, score(v, q));
        candidates.set(v.id, entry);
      }
    }
    const ranked = [...candidates.values()].sort((a, b) => b.score - a.score);
    // Prefer one video per query so the unit's topics are all covered, then fill by score.
    const chosen = [];
    for (const q of unit.videoQueries) {
      const best = ranked.find((v) => v.queries.includes(q) && !chosen.includes(v));
      if (best) chosen.push(best);
    }
    for (const v of ranked) { if (chosen.length >= PER_UNIT) break; if (!chosen.includes(v)) chosen.push(v); }
    shortlist[unit.id] = { title: unit.title, belt: unit.belt, chosen: chosen.slice(0, PER_UNIT), alternates: ranked.filter((v) => !chosen.includes(v)).slice(0, 8) };
    chosen.slice(0, PER_UNIT).forEach((v) => console.error(`  ${String(v.score).padStart(3)}  ${fmt(v.duration)}  ${v.channel}  —  ${v.title}`));
  }
  return shortlist;
}

const fmt = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

// Write chosen videos into the `videos: []` arrays of white.js / blue.js.
function apply(shortlistPath) {
  const shortlist = JSON.parse(fs.readFileSync(shortlistPath, "utf8"));
  for (const file of ["white.js", "blue.js"]) {
    const p = path.join(jsDir, file);
    let src = fs.readFileSync(p, "utf8");
    for (const [unitId, entry] of Object.entries(shortlist)) {
      const videos = (entry.chosen || []).map((v) => ({ id: v.id, title: v.title, channel: v.channel, duration: v.duration, ...(v.start ? { start: v.start } : {}) }));
      const re = new RegExp(`(id: "${unitId}",[\\s\\S]*?videos: )\\[[\\s\\S]*?\\](,\\n)`);
      if (!re.test(src)) continue;
      const json = videos.length ? "[\n" + videos.map((v) => "      " + JSON.stringify(v)).join(",\n") + "\n    ]" : "[]";
      src = src.replace(re, `$1${json}$2`);
      console.error(`applied ${videos.length} videos to ${unitId} in ${file}`);
    }
    fs.writeFileSync(p, src);
  }
}

async function verify() {
  if (!KEY) throw new Error("Set YOUTUBE_API_KEY in the environment.");
  const units = loadUnits();
  const ids = units.flatMap((u) => (u.videos || []).map((v) => v.id));
  if (!ids.length) { console.error("No videos to verify."); return; }
  const details = await videoDetails(ids);
  const byId = new Map(details.map((v) => [v.id, v]));
  let bad = 0;
  for (const u of units) for (const v of u.videos || []) {
    const d = byId.get(v.id);
    if (!d) { console.error(`MISSING  ${u.id}  ${v.id}  ${v.title}`); bad++; continue; }
    if (d.status?.embeddable === false) { console.error(`NO-EMBED ${u.id}  ${v.id}  ${v.title}`); bad++; }
    const secs = isoToSeconds(d.contentDetails?.duration);
    if (secs > MAX_SECONDS) { console.error(`TOO-LONG ${u.id}  ${v.id}  ${fmt(secs)}  ${v.title}`); bad++; }
  }
  console.error(bad ? `${bad} problem(s).` : `All ${ids.length} videos OK.`);
  process.exitCode = bad ? 1 : 0;
}

(async () => {
  try {
    if (flag("--apply")) return apply(flag("--apply"));
    if (flag("--verify")) return verify();
    const shortlist = await curate(flag("--unit"));
    const out = flag("--out") || path.join(here, "shortlist.json");
    fs.writeFileSync(out, JSON.stringify(shortlist, null, 2));
    console.error(`\nWrote ${out}. Review it, then: node shrimp/tools/curate-videos.mjs --apply ${out}`);
  } catch (e) {
    console.error(e.message);
    process.exitCode = 1;
  }
})();
