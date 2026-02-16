# DESIGN.md

## 1. Atmosféra a Vizuální Směr

* **Styl:** Moderní „SaaS Tech“ vzhled, čisté linie, vysoký kontrast.
* **Režim:** Primárně **Dark Mode** (tmavý režim) s akcenty Firebase barev.
* **Pocit:** Rychlost, profesionalita, bezpečnost.

## 2. Barevná Paleta (Firebase Identity)

* **Background (Primární):** `#0F172A` (Slate 900) – hluboká námořnická.
* **Surface (Karty/Moduly):** `#1E293B` (Slate 800).
* **Primary (Akcent):** `#FFCA28` (Firebase Yellow) – pro hlavní tlačítka a ikony.
* **Secondary (Akcent):** `#F57C00` (Firebase Orange) – pro aktivní stavy a detaily.
* **Error:** `#EF4444` (Red 500).
* **Text:**
  * Hlavní: `#F8FAFC` (Slate 50).
  * Popisky: `#94A3B8`.

## 3. Typografie

* **Písmo:** `Inter` nebo `Geist` (bezpatkové, moderní).
* **Nadpisy:** Semi-bold, mírně stažený prostrk (letter-spacing: -0.02em).
* **Body:** Pravidelný řez, vysoká čitelnost.

## 4. Komponenty a UI Pravidla

* **Tlačítka:**
  * Zaoblení: `8px` (`rounded-lg`).
  * Efekt: Jemný glow efekt u primárních tlačítek.
* **Karty:**
  * Okraj: Tenký border `#334155`.
  * Stín: Mírný stín (`shadow-sm`).
* **Inputy:**
  * Pozadí: Transparentní.
  * Okraj: Bílý s opacity 10% (`border-white/10`).
  * Focus: Barva Primary (`ring-firebase-yellow`).
* **Ikony:** Lineární (Lucide React), tloušťka čáry `1.5px`.

## 5. React & Tailwind Specifikace

* **Framework:** Tailwind CSS třídy.
* **Responzivita:** Mobile-first přístup.
* **Interakce:** Jemné hover animace (`duration-200`, `ease-in-out`).

## 6. Struktura Aplikace (High-Level)

* **Main Dashboard:** Přehledová tabulka/grid analyzovaných aut.
* **Car Card:** Detailní karta vozu s "Expert Score" a cenovou kalkulací.
* **Search/Import:** Vstupní pole pro URL inzerátu nebo manuální data.
