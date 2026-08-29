# OSINTeusz feltöltése GitHub Pages-re

Ehhez a változathoz nem kell saját szerver, adatbázis vagy előfizetés. A játék teljes egészében a hallgató böngészőjében fut.

## A legegyszerűbb feltöltés

1. Jelentkezz be a GitHubra, majd válaszd a **New repository** lehetőséget.
2. A repository neve legyen **`milemario.github.io`**. Így a játék címe `https://milemario.github.io/` lesz.
3. Állítsd **Public** értékre, majd hozd létre. Első alkalommal ne adj hozzá külön README-t vagy más kezdőfájlt.
4. Csomagold ki a letöltött ZIP-et a számítógépeden.
5. A repository oldalán kattints az **Add file → Upload files** lehetőségre.
6. Húzd be a kicsomagolt mappa **teljes tartalmát**, nem magát a külső mappát. A rejtett **`.github`** mappának is fel kell kerülnie.
7. Kattints a **Commit changes** gombra.
8. Nyisd meg a **Settings → Pages** oldalt. A **Build and deployment / Source** mezőnél válaszd a **GitHub Actions** lehetőséget.
9. Az **Actions** fülön várd meg, amíg a „Deploy OSINTeusz to GitHub Pages” folyamat zöld pipát kap.
10. Nyisd meg: `https://milemario.github.io/`

Ha a `milemario.github.io` nevű repository már foglalt, hozz létre egy **`osinteusz`** nevűt. Ekkor a cím `https://milemario.github.io/osinteusz/` lesz. A csomag mindkét címtípussal működik.

## Későbbi frissítés

Töltsd fel és írd felül a módosított forrásfájlokat ugyanebben a repositoryban. A `main` ágra kerülő minden változás automatikusan újraépíti és közzéteszi az oldalt.

## Gyors hibakeresés

- **404 vagy üres oldal:** ellenőrizd, hogy a Pages forrása valóban **GitHub Actions**.
- **Nem indult el telepítés:** valószínűleg kimaradt a `.github/workflows/deploy.yml` fájl.
- **Piros hiba az Actions fülön:** nyisd meg a hibás futást; a konkrét hibaüzenet alapján javítható.
- **Régi változat látszik:** várj egy percet, majd frissíts gyorsítótár nélkül (`Ctrl+F5` vagy `Cmd+Shift+R`).
