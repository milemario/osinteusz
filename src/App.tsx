import { type FormEvent, useMemo, useState } from "react";

type PageId = "search" | "facebook" | "x" | "instagram" | "school" | "temple" | "classics" | "cinema" | "travel" | "books";

type BrowserPage = {
  id: PageId;
  url: string;
  title: string;
};

const pages: Record<PageId, BrowserPage> = {
  search: { id: "search", url: "https://www.google.com/search?q=Odysseus", title: "Odysseus — Google Search" },
  facebook: { id: "facebook", url: "https://facebook.example/odysseus", title: "Odysseus | Facebook" },
  x: { id: "x", url: "https://x.example/nobody_sails", title: "Odysseus (@nobody_sails) / X" },
  instagram: { id: "instagram", url: "https://instagram.example/odysseus", title: "Odysseus (@odysseus) • Instagram" },
  school: { id: "school", url: "https://agamemnon-academy.example/documents/class-9b", title: "Class 9B register — Agamemnon Maritime Academy" },
  temple: { id: "temple", url: "https://ithaca-hera-temple.example/news/wedding-2008", title: "Temple news — Hera Temple of Ithaca" },
  classics: { id: "classics", url: "https://classics.example/essays/heroes-at-sea", title: "Heroes at sea in ancient stories" },
  cinema: { id: "cinema", url: "https://cinemagazine.example/reviews/odysseus", title: "Odysseus on the big screen — review" },
  travel: { id: "travel", url: "https://travel.example/ionian-islands/harbours", title: "Ionian Islands: eight harbours to visit" },
  books: { id: "books", url: "https://oldbooks.example/search/odysseus", title: "Odysseus books and audiobooks" },
};

const results = [
  {
    page: "facebook" as PageId,
    host: "facebook.example › odysseus",
    title: "Odysseus | Facebook",
    snippet: "Odysseus's public profile. Photos, posts, an About section, and other personal information.",
  },
  {
    page: "x" as PageId,
    host: "x.example › nobody_sails",
    title: "Odysseus (@nobody_sails) / X",
    snippet: "Just a short trip. Ships, olive trees, stories, and the occasional family post.",
  },
  {
    page: "instagram" as PageId,
    host: "instagram.example › odysseus",
    title: "Odysseus (@odysseus) • Instagram photos",
    snippet: "1,204 followers · 86 following · Journeys, harbours, and unusually long trips home.",
  },
  {
    page: "school" as PageId,
    host: "agamemnon-academy.example › documents › class-9b",
    title: "Class 9B register — Agamemnon Maritime Academy",
    snippet: "A publicly shared school document containing a class register and contact details.",
  },
  {
    page: "temple" as PageId,
    host: "ithaca-hera-temple.example › news › wedding",
    title: "Temple news — Hera Temple of Ithaca",
    snippet: "Community news, ceremonies, and the public archive of the Hera Temple of Ithaca.",
  },
];

const noiseResults = [
  { page: "classics" as PageId, host: "classics.example › essays", title: "Heroes at sea in ancient stories", snippet: "A short literary essay about storms, ships, and storytelling. It is not a biographical profile." },
  { page: "cinema" as PageId, host: "cinemagazine.example › reviews", title: "Odysseus on the big screen: review", snippet: "Spectacular scenes at sea, ancient myths, and a modern adaptation. Cast and release details." },
  { page: "travel" as PageId, host: "travel.example › ionian-islands", title: "Ionian Islands: eight harbours to visit", snippet: "An itinerary, ferry timetables, and restaurant tips for an unforgettable island-hopping holiday." },
  { page: "books" as PageId, host: "oldbooks.example › search", title: "Odysseus books and audiobooks", snippet: "New and used editions, adaptations for young readers, and illustrated map collections." },
];

const noisePages: Record<"classics" | "cinema" | "travel" | "books", {
  brand: string; eyebrow: string; title: string; lead: string; sections: { title: string; text: string }[];
}> = {
  classics: {
    brand: "THE CLASSICS WORKSHOP", eyebrow: "LITERARY ESSAY • 7 MIN READ",
    title: "Heroes at sea in ancient stories",
    lead: "Why do drifting ships, misty shores, and unknown islands appear again and again? This article explores recurring motifs, not the biography of one person.",
    sections: [
      { title: "The sea as a test", text: "In ancient stories, the sea is both a route and an obstacle. A storm often makes the consequences of a hero's decisions visible." },
      { title: "The nameless sailor", text: "Storytellers often let the traveller hide his name, leaving the audience uncertain about whom to trust." },
      { title: "What is left out?", text: "Different adaptations emphasise different subplots, so a literary essay is not a reliable source of present-day personal information." },
    ],
  },
  cinema: {
    brand: "CINEMA MAGAZINE", eyebrow: "REVIEW • SPOILER-FREE",
    title: "Odysseus on the big screen: big waves, little silence",
    lead: "The director builds on spectacle and the idea of returning home, but the film's characters are modern, fictional versions.",
    sections: [
      { title: "What works", text: "Naval battles, misty harbours, and practical sets create a strong atmosphere throughout." },
      { title: "What works less well", text: "The screenplay merges characters, changes names, and invents scenes to keep up the pace." },
      { title: "Verdict", text: "An entertaining adventure film, but as an investigative source it is useful only for suggesting new search terms." },
    ],
  },
  travel: {
    brand: "TRAVEL!", eyebrow: "ITINERARY • IONIAN SEA",
    title: "Eight harbours worth visiting",
    lead: "Ferries, markets, waterfront promenades, and sunset bays on a ten-day island-hopping route.",
    sections: [
      { title: "Stops 1–3", text: "Corfu's old town, the blue caves of Paxos, and the western beaches of Lefkada. Book ahead in summer." },
      { title: "Stops 4–6", text: "The smaller harbours of Kefalonia, Zakynthos, and Meganisi. The wind often rewrites the timetable." },
      { title: "Stops 7–8", text: "Two quiet bays with local fish markets and short hiking routes. This article contains no traveller profiles." },
    ],
  },
  books: {
    brand: "OLD PAGES BOOKSHOP", eyebrow: "18 RESULTS • CATALOGUE",
    title: "Books and audiobooks about Odysseus",
    lead: "Different translations, adaptations for children, and illustrated collections about myths of the sea.",
    sections: [
      { title: "Homeric tales — illustrated edition", text: "Hardback, 216 pages. Two copies in stock." },
      { title: "Storms and wanderers — audiobook", text: "Dramatised selection, 4 hours 38 minutes. Digital edition." },
      { title: "Ancient seafaring for children", text: "An educational book with maps and ship models. This catalogue is not a biographical database." },
    ],
  },
};

const LEAK_EMAIL = "nobody.sails@example.com";
const LEAK_HASH = "2ce4060f9accf343d3eee1267d85aa599bd571df87c14fed416a55ee5980b359";
const PASSWORD_CANDIDATES = [
  "123456", "password", "123456789", "12345678", "12345", "qwerty", "1234567", "111111", "123123", "abc123",
  "qwerty123", "1q2w3e4r", "admin", "letmein", "welcome", "monkey", "dragon", "football", "iloveyou", "sunshine",
  "princess", "master", "shadow", "superman", "trustno1", "passw0rd", "password1", "password123", "Password123", "Password123!",
  "qwertyuiop", "asdfghjkl", "zxcvbnm", "654321", "666666", "121212", "000000", "987654321", "1234", "123321",
  "1qaz2wsx", "qazwsx", "zaq12wsx", "changeme", "secret", "freedom", "whatever", "computer", "internet", "login",
  "guest", "hello", "summer", "winter", "spring", "autumn", "sailing", "sailing123", "Sailing123!", "secret123",
  "Odysseus", "odysseus", "Odysseus1", "nobody", "nobodysails", "NobodySails", "NobodySails!", "Sails2026", "Ithaca", "ithaca",
  "Ithaca2008", "Ithaca2026", "Ithaca!", "Penelope", "Penelope1", "Penelope2008", "Telemachus", "Telemachus9B", "Laertes", "Laertes1",
  "Athena", "Athena1", "Argos", "Argos2025", "Argos!", "OdysseusIthaca", "IthacaOdysseus", "PenelopeIthaca", "ArgosIthaca", "ArgosIthaca2025",
  "IthacaArgos!", "AthenaIthaca!", "LaertesIthaca", "TelemachusIthaca", "NobodyIthaca!", "ArgosIthaca!", "PenelopeArgos!", "Odysseus2008!", "Ithaca20years!", "HomeToIthaca!",
];

const questions = [
  { label: "Wife's name", answers: ["penelope"] },
  { label: "Son's name", answers: ["telemachus"] },
  { label: "Dog's name", answers: ["argos"] },
  { label: "Home", answers: ["ithaca"] },
  { label: "Father's name", answers: ["laertes"] },
  { label: "Divine patron", answers: ["athena"] },
];

function normalize(value: string) {
  return value.trim().toLocaleLowerCase("en").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, "");
}

function Notebook({ answers, setAnswers, checked, onCheck, onClose, onOpenLab }: {
  answers: string[];
  setAnswers: (answers: string[]) => void;
  checked: boolean;
  onCheck: () => void;
  onClose: () => void;
  onOpenLab: () => void;
}) {
  const correct = questions.map((question, index) => question.answers.includes(normalize(answers[index] ?? "")));
  const count = correct.filter(Boolean).length;
  return (
    <div className="notebook-overlay" role="dialog" aria-modal="true" aria-labelledby="notebook-title">
      <section className="notebook">
        <button className="notebook-close" onClick={onClose} aria-label="Close investigation notebook">×</button>
        <span className="notebook-kicker">INVESTIGATION NOTEBOOK • 6 FACTS</span>
        <h2 id="notebook-title">What have you learned about Odysseus?</h2>
        <p>Enter the facts you found. The system checks only your answers; keep recording the source and evidence on your team's answer sheet.</p>
        <div className="answer-grid">
          {questions.map((question, index) => (
            <label className={checked ? correct[index] ? "answer-correct" : "answer-wrong" : ""} key={question.label}>
              <span>{index + 1}</span>
              <div><small>{question.label}</small><input value={answers[index] ?? ""} onChange={(event) => { const next = [...answers]; next[index] = event.target.value; setAnswers(next); }} autoComplete="off" /></div>
              {checked && <b>{correct[index] ? "✓" : "?"}</b>}
            </label>
          ))}
        </div>
        {checked && count < 6 && <div className="notebook-result wrong">{6 - count} {6 - count === 1 ? "answer is" : "answers are"} still incorrect. Return to the sources and verify your evidence.</div>}
        {checked && count === 6 && <div className="notebook-result success"><b>All six facts are correct.</b><span>The targeted candidate list is ready for the local hash demonstration.</span></div>}
        {count === 6 && checked ? <button className="notebook-check success-button" onClick={onOpenLab}>Open hash lab</button> : <button className="notebook-check" onClick={onCheck}>Check answers</button>}
      </section>
    </div>
  );
}

async function sha256(value: string) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest)).map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

type HashAttempt = { candidate: string; hash: string; match: boolean };

function HashLab({ onClose }: { onClose: () => void }) {
  const [status, setStatus] = useState<"ready" | "running" | "cracked">("ready");
  const [progress, setProgress] = useState(0);
  const [attempts, setAttempts] = useState<HashAttempt[]>([]);
  const [found, setFound] = useState("");

  const start = async () => {
    if (status === "running") return;
    setStatus("running"); setProgress(0); setAttempts([]); setFound("");
    for (let index = 0; index < PASSWORD_CANDIDATES.length; index += 1) {
      const candidate = PASSWORD_CANDIDATES[index];
      const hash = await sha256(candidate);
      const match = hash === LEAK_HASH;
      setProgress(index + 1);
      setAttempts((previous) => [...previous.slice(-7), { candidate, hash, match }]);
      if (match) { setFound(candidate); setStatus("cracked"); return; }
      await new Promise((resolve) => window.setTimeout(resolve, 70));
    }
    setStatus("ready");
  };

  return (
    <div className="lab-overlay" role="dialog" aria-modal="true" aria-labelledby="lab-title">
      <section className="hash-lab">
        <button className="lab-close" onClick={onClose} disabled={status === "running"} aria-label="Close hash lab">×</button>
        <header><span className="lab-kicker">LOCAL EDUCATIONAL SIMULATION</span><h2 id="lab-title">Candidate-list hash lab</h2><p>Your browser compares only the fictional exercise's SHA-256 hash with hashes computed locally from the supplied candidates.</p></header>
        <div className="leak-strip"><span>Affected address</span><b>{LEAK_EMAIL}</b><span>SHA-256</span><code>{LEAK_HASH}</code></div>
        <div className="lab-grid">
          <aside className="candidate-panel">
            <header><h3>password_candidates.txt</h3><b>{PASSWORD_CANDIDATES.length} items</b></header>
            <div className="candidate-list">{PASSWORD_CANDIDATES.map((candidate, index) => <div className={progress === index + 1 ? "candidate-current" : progress > index + 1 ? "candidate-done" : ""} key={`${candidate}-${index}`}><span>{String(index + 1).padStart(3, "0")}</span><code>{candidate}</code></div>)}</div>
          </aside>
          <section className="hash-terminal">
            <div className="terminal-head"><span /><span /><span /><b>sha256-demo — local process</b></div>
            <div className="terminal-body">
              <p><i>$</i> target --email {LEAK_EMAIL}</p><p><i>$</i> load password_candidates.txt <em>[{PASSWORD_CANDIDATES.length} candidates]</em></p>
              {status === "ready" && <div className="terminal-idle">The list combines common passwords with targeted variations derived from the OSINT investigation.</div>}
              {attempts.map((attempt, index) => <div className={`hash-row ${attempt.match ? "hash-match" : ""}`} key={`${attempt.candidate}-${index}`}><code>{attempt.candidate}</code><span>→</span><code>{attempt.hash}</code><b>{attempt.match ? "MATCH" : "≠"}</b></div>)}
              {status === "running" && <div className="cursor-line"><i>$</i> hashing… <span className="cursor" /></div>}
              {status === "cracked" && <div className="cracked-box"><span>HASH MATCH</span><p>Password found in the demonstration:</p><strong>{found}</strong></div>}
            </div>
            <div className="progress-track"><span style={{ width: `${(progress / PASSWORD_CANDIDATES.length) * 100}%` }} /></div>
            <footer><b>{progress}/{PASSWORD_CANDIDATES.length}</b><span>{status === "running" ? "hashing candidates…" : status === "cracked" ? "demonstration complete" : "ready to start"}</span></footer>
            <button className="crack-button" onClick={start} disabled={status === "running"}>{status === "running" ? "Calculating hashes…" : status === "cracked" ? "Restart demonstration" : "Test candidate list"}</button>
          </section>
        </div>
        <aside className="ethics-note">This is an educational demonstration. Use only the fictional hash supplied with the exercise; never test real accounts, passwords, or systems.</aside>
      </section>
    </div>
  );
}

function GoogleSearch({ onOpen }: { onOpen: (id: PageId) => void }) {
  const [query, setQuery] = useState("Odysseus");
  const [submitted, setSubmitted] = useState("Odysseus");
  const visibleResults = useMemo(() => {
    const needle = submitted.trim().toLocaleLowerCase("en");
    if (!needle || needle.includes("odysseus")) return results;
    return results.filter((result) =>
      `${result.title} ${result.snippet} ${result.host}`.toLocaleLowerCase("en").includes(needle),
    );
  }, [submitted]);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    setSubmitted(query);
  };

  return (
    <div className="google-page">
      <header className="google-header">
        <div className="google-logo" aria-label="Google">
          <span>G</span><span>o</span><span>o</span><span>g</span><span>l</span><span>e</span>
        </div>
        <form className="search-box" onSubmit={submit}>
          <span>⌕</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} aria-label="Search" />
          <button type="submit">Search</button>
        </form>
        <div className="google-user">O</div>
      </header>
      <nav className="search-tabs"><b>⌕ All</b><span>▧ Images</span><span>▤ News</span><span>▶ Videos</span><span>⋮ More</span></nav>
      <main className="results-column">
        <p className="result-count">About {visibleResults.length * 1270 + 346} results (0.38 seconds)</p>
        <aside className="mission-hint">
          <b>OSINTeusz mission</b>
          <span>Six personal facts are hidden behind these results, but not every result is useful. Verify your sources.</span>
        </aside>
        {noiseResults.slice(0, 2).map((result) => (
          <article className="search-result noise-result" key={result.title}>
            <div className="result-source"><span>C</span><div><b>{result.title}</b><small>{result.host}</small></div></div>
            <button onClick={() => onOpen(result.page)}>{result.title}</button><p>{result.snippet}</p>
          </article>
        ))}
        {visibleResults.map((result) => (
          <article className="search-result" key={result.page}>
            <div className="result-source"><span>{result.title.charAt(0)}</span><div><b>{result.title.split(" | ")[0]}</b><small>{result.host}</small></div></div>
            <button onClick={() => onOpen(result.page)}>{result.title}</button>
            <p>{result.snippet}</p>
          </article>
        ))}
        {visibleResults.length > 0 && noiseResults.slice(2).map((result) => (
          <article className="search-result noise-result" key={result.title}>
            <div className="result-source"><span>•</span><div><b>{result.title}</b><small>{result.host}</small></div></div>
            <button onClick={() => onOpen(result.page)}>{result.title}</button><p>{result.snippet}</p>
          </article>
        ))}
        {visibleResults.length === 0 && (
          <div className="no-results"><h2>No exact results.</h2><p>Try another name or return to the “Odysseus” search.</p></div>
        )}
      </main>
    </div>
  );
}

function NoisePage({ id }: { id: "classics" | "cinema" | "travel" | "books" }) {
  const article = noisePages[id];
  const [notice, setNotice] = useState("");
  const openSection = (label: string) => setNotice(`${label}: this fictional page contains no additional personal information useful to the investigation.`);
  return (
    <div className={`editorial-page editorial-${id}`}>
      <header><b>{article.brand}</b><nav>{["Home", "Latest", "Archive", "About"].map((label) => <button onClick={() => openSection(label)} key={label}>{label}</button>)}</nav></header>
      <main>
        {notice && <div className="editorial-notice"><span>{notice}</span><button onClick={() => setNotice("")} aria-label="Close notification">×</button></div>}
        <span>{article.eyebrow}</span>
        <h1>{article.title}</h1>
        <p className="editorial-lead">{article.lead}</p>
        <div className="editorial-hero" aria-hidden="true"><span>≈</span></div>
        <div className="editorial-columns">
          <article>
            {article.sections.map((section) => <section key={section.title}><h2>{section.title}</h2><p>{section.text}</p></section>)}
          </article>
          <aside><b>Related content</b>{["Five famous stories of the sea", "How can you verify an online source?", "Why do adaptations disagree?"].map((label) => <button onClick={() => openSection(label)} key={label}>{label}</button>)}<small>This is a fictional educational website.</small></aside>
        </div>
      </main>
    </div>
  );
}

function FacebookPage() {
  return (
    <div className="social-page facebook-page">
      <header className="fb-top"><b>facebook</b><div>⌕ Search Facebook</div><span>O</span></header>
      <div className="fb-cover"><div className="sea-cover" /><img src="assets/odysseus-profile.png" alt="Fictional profile picture of Odysseus" /></div>
      <section className="fb-identity"><div><h1>Odysseus</h1><p>1.2K friends</p></div><button>Add friend</button></section>
      <nav className="profile-tabs"><b>Posts</b><span>About</span><span>Friends</span><span>Photos</span></nav>
      <main className="fb-grid">
        <aside className="fb-card">
          <h2>About</h2>
          <p>⚓ Sailor on the Ionian Sea</p>
          <p>⌂ Lives in Greece</p>
          <p>🎓 Maritime Academy</p>
          <p>🗣 Greek and English</p>
          <p>♡ Olive trees, maps, stories of the sea</p>
          <p>◉ <b>Religion:</b> <strong>Athena</strong></p>
          <small>This section of the profile is public.</small>
        </aside>
        <div className="fb-feed">
          <article className="fb-card post noise-post"><header><img src="assets/odysseus-profile.png" alt="" /><div><b>Odysseus</b><small>11 September 2025 · 🌐</small></div></header><p>Bought a new rope for the sail. The shopkeeper called it “storm-proof” — we shall see.</p><footer>♡ 22　💬 3 comments</footer></article>
          <article className="fb-card post noise-post"><header><img src="assets/odysseus-profile.png" alt="" /><div><b>Odysseus</b><small>3 September 2025 · 🌐</small></div></header><p>Finally repaired the old oar. It just needs a little oil now.</p><footer>♡ 31　💬 4 comments</footer></article>
          <article className="fb-card post"><header><img src="assets/odysseus-profile.png" alt="" /><div><b>Odysseus</b><small>26 August 2025 · 🌐</small></div></header><p>Argos knows from the sound of the door that I am home. Some friends never forget, even after twenty years. 🐕</p><img className="post-photo" src="assets/argos-photo.png" alt="Argos, a fictional dog, at the door of a stone house" /><footer>♡ 184　💬 23 comments</footer></article>
          <article className="fb-card post noise-post"><header><img src="assets/odysseus-profile.png" alt="" /><div><b>Odysseus</b><small>19 July 2025 · 🌐</small></div></header><p>No wind. We had better stay in the harbour today. ⛵</p><footer>♡ 48　💬 7 comments</footer></article>
          <article className="fb-card post noise-post"><header><img src="assets/odysseus-profile.png" alt="" /><div><b>Odysseus</b><small>4 July 2025 · 🌐</small></div></header><p>Found an old map in the attic. The edge is missing, but the route is still legible.</p><footer>♡ 57　💬 9 comments</footer></article>
        </div>
      </main>
    </div>
  );
}

function XPage() {
  return (
    <div className="x-page">
      <aside className="x-rail"><b>𝕏</b><span>⌂</span><span>⌕</span><span>♧</span><span>✉</span></aside>
      <main className="x-main">
        <header className="x-title"><span>←</span><div><b>Odysseus</b><small>347 posts</small></div></header>
        <div className="x-cover" />
        <section className="x-profile"><img src="assets/odysseus-profile.png" alt="Fictional profile picture of Odysseus" /><button>Follow</button><h1>Odysseus</h1><p>@nobody_sails</p><div>“Just a short trip.” ⛵</div><small>⚓ Ionian Sea　📅 Joined March 2012</small></section>
        <nav className="x-tabs"><b>Posts</b><span>Replies</span><span>Media</span><span>Likes</span></nav>
        <article className="tweet"><img src="assets/odysseus-profile.png" alt="" /><div><header><b>Odysseus</b> <span>@nobody_sails · 28 Jun</span></header><p>Today's lesson: a new knot is only useful if you can tie it in the dark.</p><footer>↩ 4　♧ 2　♡ 24　⌑ 522</footer></div></article>
        <article className="tweet"><img src="assets/odysseus-profile.png" alt="" /><div><header><b>Odysseus</b> <span>@nobody_sails · 21 Jun</span></header><p>According to the seagulls, the ferry will not leave on time today either.</p><footer>↩ 3　♧ 1　♡ 19　⌑ 403</footer></div></article>
        <article className="tweet">
          <img src="assets/odysseus-profile.png" alt="" />
          <div><header><b>Odysseus</b> <span>@nobody_sails · 16 Jun</span></header><p>Happy Father's Day, <strong>Laertes!</strong> Thank you for all the stories, the olive trees, and teaching me how to find my way home. 🌿</p><footer>↩ 12　♧ 8　♡ 74　⌑ 2.1K</footer></div>
        </article>
        <article className="tweet"><img src="assets/odysseus-profile.png" alt="" /><div><header><b>Odysseus</b> <span>@nobody_sails · 9 Jun</span></header><p>A good map is sometimes worth more than a favourable wind.</p><footer>↩ 5　♧ 4　♡ 28　⌑ 711</footer></div></article>
        <article className="tweet"><img src="assets/odysseus-profile.png" alt="" /><div><header><b>Odysseus</b> <span>@nobody_sails · 31 May</span></header><p>It is always cooler under the olive trees than on the stones of the harbour.</p><footer>↩ 2　♧ 1　♡ 33　⌑ 608</footer></div></article>
        <article className="tweet"><img src="assets/odysseus-profile.png" alt="" /><div><header><b>Odysseus</b> <span>@nobody_sails · 22 May</span></header><p>The wind indicator points east again. A good day for repairs; a bad day to leave.</p><footer>↩ 6　♧ 3　♡ 21　⌑ 477</footer></div></article>
      </main>
      <aside className="x-side"><div><b>Search</b><p>⌕ Search X</p></div><div><b>Trending topics</b><p>#Ithaca</p><p>#FathersDay</p><p>#Homecoming</p></div></aside>
    </div>
  );
}

function InstagramPage() {
  const [selectedPost, setSelectedPost] = useState<number | null>(null);
  const posts = [
    { title: "Harbour morning", caption: "The fish market was noisy before sunrise.", location: "📍 Ionian Sea", image: "assets/argos-photo.png" },
    { title: "Olive grove", caption: "Afternoon shade and an old bench.", location: "📍 Greece", image: "assets/odysseus-profile.png" },
    { title: "After the storm", caption: "The rigging survived. My coffee less so.", location: "📍 Western harbour", image: "assets/argos-photo.png" },
    { title: "Old maps", caption: "Some routes survived only in pencil.", location: "📍 Maritime museum", image: "assets/odysseus-profile.png" },
    { title: "Home again after 20 years", caption: "Home again after 20 years.", location: "📍 Ithaca, Greece", image: "assets/ithaca-selfie.png", clue: true },
    { title: "Ship's log", caption: "Today's wind: changeable. The plan: even more so.", location: "📍 On deck", image: "assets/argos-photo.png" },
    { title: "Rope knots", caption: "Practising until sunset.", location: "📍 South pier", image: "assets/odysseus-profile.png" },
    { title: "Morning coffee", caption: "Strong, short, before departure.", location: "📍 Harbour café", image: "assets/argos-photo.png" },
    { title: "Sail repair", caption: "Not pretty, but it holds.", location: "📍 Workshop", image: "assets/odysseus-profile.png" },
  ];
  return (
    <div className="instagram-page">
      <aside className="ig-rail"><b>Instagram</b><span>⌂ Home</span><span>⌕ Search</span><span>▧ Explore</span><span>♡ Notifications</span><span>⊕ Create</span></aside>
      <main className="ig-main">
        <header className="ig-profile">
          <img src="assets/odysseus-profile.png" alt="Fictional profile picture of Odysseus" />
          <div><div className="ig-name"><h1>odysseus</h1><button>Follow</button><button>Message</button></div><p><b>48</b> posts　<b>1,204</b> followers　<b>86</b> following</p><strong>Odysseus</strong><small>“Just a short trip.”</small></div>
        </header>
        <nav className="ig-tabs"><b>▦ POSTS</b><span>▧ TAGGED</span></nav>
        <div className="ig-noise-grid" aria-label="Earlier posts">
          {posts.map((post, index) => <button onClick={() => setSelectedPost(index)} key={post.title} className={`ig-noise-tile tile-${index + 1}`} aria-label={`Open post: ${post.title}`}><img src={post.image} alt="" /><span>▧</span><small>{post.title}</small></button>)}
        </div>
        {selectedPost !== null && <article className={`ig-post ${posts[selectedPost].clue ? "ig-clue-post" : ""}`}>
          <button className="ig-mini-close" onClick={() => setSelectedPost(null)} aria-label="Close post">×</button>
          <div className="ig-photo-wrap"><img src={posts[selectedPost].image} alt={posts[selectedPost].clue ? "Fictional selfie of Odysseus in front of a Greek island harbour" : posts[selectedPost].title} /></div>
          <div className="ig-caption"><header><img src="assets/odysseus-profile.png" alt="" /><div><b>odysseus</b><small>{posts[selectedPost].location}</small></div><span>•••</span></header><div className="ig-actions">♡　♧　⌁</div><b>{posts[selectedPost].clue ? "1,204" : 120 + selectedPost * 37} likes</b><p><strong>odysseus</strong> {posts[selectedPost].caption}</p><small>View all {12 + selectedPost * 8} comments</small></div>
        </article>}
      </main>
    </div>
  );
}

function SchoolPage() {
  const rows = [
    ["Circe C.", "9B", "Helios", "c.circe@agamemnon.example"],
    ["Mentor M.", "9B", "Alcimus", "a.alcimus@agamemnon.example"],
    ["Eurymachus E.", "9B", "Polybus", "p.polybus@agamemnon.example"],
    ["Telemachus", "9B", "Odysseus", "o.odysseus@ithaca.example"],
    ["Nausicaa N.", "9B", "Alcinous", "a.alcinous@phaeacia.example"],
    ["Polyphemus P.", "9B", "Poseidon", "p.poseidon@sea.example"],
    ["Calypso C.", "9B", "Atlas", "a.atlas@agamemnon.example"],
    ["Elpenor E.", "9B", "Echetus", "e.echetus@agamemnon.example"],
    ["Eumaeus E.", "9B", "Ctesius", "c.ctesius@agamemnon.example"],
    ["Melantho M.", "9B", "Dolius", "d.dolius@agamemnon.example"],
    ["Pisistratus P.", "9B", "Nestor", "n.nestor@agamemnon.example"],
  ];
  return (
    <div className="school-page">
      <header className="school-header"><div className="school-badge">AM</div><div><h1>Agamemnon Maritime Academy</h1><p>Knowledge • Seafaring • Future</p></div></header>
      <nav className="school-nav"><span>About us</span><span>Education</span><span>Student life</span><b>Documents</b><span>Contact</span></nav>
      <main className="school-content">
        <div className="breadcrumbs">Home › Documents › 2026/27 › Class 9B register</div>
        <h2>Class 9B register and contacts</h2>
        <p className="school-lead">Uploaded by the form tutors' working group. Last modified three days ago.</p>
        <div className="sheet-window">
          <div className="sheet-head"><span>▦</span><b>class_9B_register_2026</b><em>Anyone can view</em></div>
          <div className="sheet-table">
            <div className="sheet-row sheet-cols"><b>#</b><b>Student name</b><b>Class</b><b>Parent name</b><b>Contact</b></div>
            {rows.map((row, index) => <div className="sheet-row" key={row[0]}><b>{index + 2}</b>{row.map((cell) => <span key={cell}>{cell}</span>)}</div>)}
          </div>
        </div>
        <aside>⚠ This spreadsheet is publicly accessible. Does every column really belong in public?</aside>
        <section className="school-news">
          <h3>Related school news</h3>
          <div>
            <article><small>3 days ago</small><b>Library opening hours during the break</b><p>Friday's lending period will be one hour shorter.</p></article>
            <article><small>5 days ago</small><b>Sailing club — registration</b><p>The beginners' first session will be in the second week of September.</p></article>
            <article><small>1 week ago</small><b>Class 9B parents' meeting</b><p>The form tutor sent a separate message about the room change.</p></article>
            <article><small>2 weeks ago</small><b>Lost property</b><p>Water bottles and sports equipment can be collected from reception.</p></article>
          </div>
        </section>
      </main>
    </div>
  );
}

function TemplePage() {
  return (
    <div className="temple-page">
      <header className="temple-header"><div className="columns">🏛</div><div><h1>HERA TEMPLE OF ITHACA</h1><p>Community • Ceremonies • News</p></div></header>
      <nav className="temple-nav"><span>Home</span><span>Our temple</span><span>Ceremonies</span><b>News archive</b><span>Contact</span></nav>
      <main className="temple-content">
        <div className="temple-crumb">Home › News › Community events</div>
        <span className="article-label">NEWS ARCHIVE • 2008</span><h2>Community news and ceremonies</h2>
        <div className="temple-archive">
          <article><small>2 July 2008</small><h3>New stone wall completed around the olive grove</h3><p>Twenty-seven volunteers took part in the community project.</p></article>
          <article><small>21 June 2008</small><h3>Summer solstice in the temple garden</h3><p>Music, candle lighting, and a community dinner welcomed visitors.</p></article>
          <article className="archive-clue"><small>14 June 2008 · Ithaca</small><h3>Penelope and Odysseus were married</h3><div className="article-hero"><div>⚭</div><p><b>Penelope</b> and <b>Odysseus</b> were married in our temple, surrounded by family and friends.</p></div></article>
          <article><small>30 May 2008</small><h3>Spring charity collection</h3><p>We collected non-perishable food and blankets for families in the harbour.</p></article>
          <article><small>12 May 2008</small><h3>Eastern colonnade restored</h3><p>The restorers have completed several months of work.</p></article>
          <article><small>28 April 2008</small><h3>New times for family ceremonies</h3><p>The summer schedule is now available from the office.</p></article>
          <article><small>15 April 2008</small><h3>Volunteers wanted</h3><p>Gloves and tools will be provided for the spring gardening work.</p></article>
          <article><small>29 March 2008</small><h3>Spring candle-lighting ceremony</h3><p>The community event begins at sunset by the western gate.</p></article>
          <article><small>8 March 2008</small><h3>New benches in the inner courtyard</h3><p>A local workshop donated three new benches to the temple.</p></article>
        </div>
      </main>
    </div>
  );
}

export default function Home() {
  const [history, setHistory] = useState<PageId[]>(["search"]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [address, setAddress] = useState(pages.search.url);
  const [missionOpen, setMissionOpen] = useState(true);
  const [labOpen, setLabOpen] = useState(false);
  const [notebookOpen, setNotebookOpen] = useState(false);
  const [answers, setAnswers] = useState<string[]>(Array(6).fill(""));
  const [checked, setChecked] = useState(false);
  const correctCount = questions.filter((question, index) => question.answers.includes(normalize(answers[index] ?? ""))).length;
  const labUnlocked = checked && correctCount === 6;
  const currentId = history[historyIndex];
  const current = pages[currentId];

  const navigate = (id: PageId) => {
    const next = history.slice(0, historyIndex + 1);
    next.push(id);
    setHistory(next);
    setHistoryIndex(next.length - 1);
    setAddress(pages[id].url);
  };

  const stepHistory = (delta: number) => {
    const nextIndex = Math.min(history.length - 1, Math.max(0, historyIndex + delta));
    setHistoryIndex(nextIndex);
    setAddress(pages[history[nextIndex]].url);
  };

  const submitAddress = (event: FormEvent) => {
    event.preventDefault();
    const input = address.toLocaleLowerCase("en");
    const match = Object.values(pages).find((page) => {
      const hostname = page.url.replace("https://", "").split("/")[0].toLocaleLowerCase("en");
      return input === page.url.toLocaleLowerCase("en") || input.includes(hostname);
    });
    navigate(match?.id ?? "search");
  };

  return (
    <main className="desktop">
      <section className="browser">
        <header className="browser-tabs">
          <div className="traffic"><i /><i /><i /></div>
          <div className="active-tab"><span>{currentId === "search" ? "G" : current.title.charAt(0)}</span><b>{current.title}</b><button>×</button></div>
          <button className="new-tab">＋</button>
          <button className="notebook-button" onClick={() => setNotebookOpen(true)}>▤ Notebook {correctCount}/6</button>
          <button className={`lab-button ${labUnlocked ? "" : "locked"}`} onClick={() => labUnlocked ? setLabOpen(true) : setNotebookOpen(true)}>⌘ {labUnlocked ? "Hash lab" : "Lab locked"}</button>
          <button className="mission-button" onClick={() => setMissionOpen(true)}>Mission</button>
        </header>
        <div className="browser-toolbar">
          <button onClick={() => stepHistory(-1)} disabled={historyIndex === 0} aria-label="Back">←</button>
          <button onClick={() => stepHistory(1)} disabled={historyIndex === history.length - 1} aria-label="Forward">→</button>
          <button onClick={() => setAddress(current.url)} aria-label="Refresh">↻</button>
          <form onSubmit={submitAddress}><span>🔒</span><input value={address} onChange={(event) => setAddress(event.target.value)} aria-label="Address bar" /><button type="submit">↵</button></form>
          <button>☆</button><button>⋮</button>
        </div>
        <div className="bookmarks"><button onClick={() => navigate("search")}>▣ Google</button><span>School research</span><span>Source verification</span></div>
        <div className="viewport">
          {currentId === "search" && <GoogleSearch onOpen={navigate} />}
          {currentId === "facebook" && <FacebookPage />}
          {currentId === "x" && <XPage />}
          {currentId === "instagram" && <InstagramPage />}
          {currentId === "school" && <SchoolPage />}
          {currentId === "temple" && <TemplePage />}
          {(currentId === "classics" || currentId === "cinema" || currentId === "travel" || currentId === "books") && <NoisePage id={currentId} />}
        </div>
      </section>
      {missionOpen && (
        <div className="mission-overlay" role="dialog" aria-modal="true" aria-labelledby="mission-title">
          <section className="mission">
            <button className="mission-close" onClick={() => setMissionOpen(false)} aria-label="Close">×</button>
            <span className="mission-kicker">OSINTEUSZ 2 • OPEN-SOURCE INVESTIGATION</span>
            <h2 id="mission-title">A data breach has occurred.</h2>
            <p>A leaked database contains email addresses and SHA-256 password hashes. You will need open-source research to identify the subject and create a targeted candidate list.</p>
            <div className="leak-evidence"><span>LEAKED RECORD #041</span><small>Email address</small><b>{LEAK_EMAIL}</b><small>Password hash · SHA-256</small><code>{LEAK_HASH}</code></div>
            <h3>Six facts. Five websites. One subject.</h3>
            <p>Fictional social profiles and websites are hidden behind the Google results. Discover six personal facts about Odysseus.</p>
            <ol>
              <li><b>Wife</b><span>name</span></li>
              <li><b>Son</b><span>name</span></li>
              <li><b>Dog</b><span>name</span></li>
              <li><b>Home</b><span>city or island</span></li>
              <li><b>Father</b><span>name</span></li>
              <li><b>Divine patron</b><span>name</span></li>
            </ol>
            <aside>Record your sources and password ideas on the team's answer sheet, then enter the six facts in the <b>Notebook</b> at the top. Correct answers unlock the hash lab.</aside>
            <button className="start-mission" onClick={() => setMissionOpen(false)}>Start investigation</button>
          </section>
        </div>
      )}
      {notebookOpen && <Notebook answers={answers} setAnswers={(next) => { setAnswers(next); setChecked(false); }} checked={checked} onCheck={() => setChecked(true)} onClose={() => setNotebookOpen(false)} onOpenLab={() => { setNotebookOpen(false); setLabOpen(true); }} />}
      {labOpen && <HashLab onClose={() => setLabOpen(false)} />}
    </main>
  );
}
