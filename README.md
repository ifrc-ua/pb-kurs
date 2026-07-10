# Десять весен івано-франківського бюджету участі

Інтерактивні матеріали до аналітичного лонгріду про десять років Бюджету участі Івано-Франківської громади (2016–2026): **15 iframe-віджетів** та текст статті (`content.md`).

Кожен віджет — окрема тека з власним `index.html`, стилями, кодом і даними. Нема жодних зовнішніх залежностей, окрім фонової карти у двох мапних віджетах (див. нижче).

Дані у віджетах агреговані, знеособлені.

## Перегляд і вставка

> На GitHub ці файли відкриваються як код. Щоб **побачити віджети наживо** і взяти код для вставки — відкрийте галерею.

### ▶ [Галерея віджетів →](https://ifrc-ua.github.io/pb-kurs/)

Кожен віджет показано наживо; поруч — готовий код і кнопка «Копіювати». Вставляється на будь-який сайт, як відео з YouTube: скопіювали код, додали в HTML-блок сторінки.

Або одразу конкретний віджет (відкриється у браузері):

- [10 років за один погляд](https://ifrc-ua.github.io/pb-kurs/at-a-glance/)
- [Хто творить місто](https://ifrc-ua.github.io/pb-kurs/who-builds/)
- [Клуб постійних](https://ifrc-ua.github.io/pb-kurs/cohort-river/)
- [Пульс голосування](https://ifrc-ua.github.io/pb-kurs/clock-map/)
- [Цифровий розрив](https://ifrc-ua.github.io/pb-kurs/digital-divide/)
- [Проєкти по громадах](https://ifrc-ua.github.io/pb-kurs/communities-projects/)
- [Де живуть виборці](https://ifrc-ua.github.io/pb-kurs/city-heatmap/)
- [Потоки: місто ↔ села](https://ifrc-ua.github.io/pb-kurs/flows/)
- [Прожектор проєкту](https://ifrc-ua.github.io/pb-kurs/spotlight/)
- [Еволюція пріоритетів](https://ifrc-ua.github.io/pb-kurs/priorities/)
- [Голоси проти грошей](https://ifrc-ua.github.io/pb-kurs/votes-vs-money/)
- [Графік фінансування](https://ifrc-ua.github.io/pb-kurs/budget-bars/)
- [Ширина голосу](https://ifrc-ua.github.io/pb-kurs/vote-breadth/)
- [Правила по роках](https://ifrc-ua.github.io/pb-kurs/rules-timeline/)
- [Канал по категоріях](https://ifrc-ua.github.io/pb-kurs/channel-categories/)

## Склад

- 15 тек віджетів – `at-a-glance`, `budget-bars`, `channel-categories`, `city-heatmap`, `clock-map`, `cohort-river`, `communities-projects`, `digital-divide`, `flows`, `priorities`, `rules-timeline`, `spotlight`, `vote-breadth`, `votes-vs-money`, `who-builds`
- текст статті — `content.md`.

## Технічні примітки

- **Бібліотеки** підключені локально (у теці `lib/` кожного віджета): d3 7.9.0, d3-sankey 0.12.3, MapLibre GL 4.7.1, deck.gl 9.1.3, h3-js 4.1.0.
- **Шрифти** — локальні (`fonts/`): Inter, Inter Tight (woff2, латиниця+кирилиця) та фірмовий Phenomena.
- **Потребують інтернету:** `spotlight` і `city-heatmap` тягнуть векторні тайли фонової карти з `tiles.openfreemap.org`. Решта 13 віджетів працюють повністю автономно (без жодних зовнішніх запитів).
- **Дизайн-система** (типографіка, кольори, токени): [ifrc-ua/pb-design](https://github.com/ifrc-ua/pb-design)

## Джерела даних

Дані Івано-Франківської міської ради; межі громад — UN OCHA ([cod-ab-ukr](https://data.humdata.org/dataset/cod-ab-ukr)).

## Ліцензії

- **Код** (розмітка, стилі, скрипти віджетів) — [MIT](LICENSE).
- **Дані** (агреговані JSON) — [CC BY 4.0](LICENSE-data.md): вільне використання за умови зазначення джерела.

Оригінал статті опубліковано на сайті онлайн-медіа КУРС: [«Десять весен івано-франківського бюджету участі»](https://kurs.if.ua/article/desyat-vesen-ivano-frankivskogo-byudzhetu-uchasti/).

Зафіксована версія матеріалів — липень 2026 року.
