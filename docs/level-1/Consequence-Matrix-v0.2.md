# Level 1 — Consequence Matrix v0.2

## هدف
هر انتخاب مهم باید اثر واقعی داشته باشد. حداقل یکی از ستون‌های Immediate یا Future باید برای هر Decision غیرخالی باشد.

| Decision | Immediate | Same-level consequence | Future / persistent | Hidden / discovery |
|---|---|---|---|---|
| گرفتن Bread از نانوا | Bread +1 | Route A باز | Baker remembers help attempt | Farmer clue meaningful می‌شود |
| رد کردن Bread | Inventory خالی می‌ماند | نیاز به exploration بیشتر | XP exploration potential بیشتر | Service routes زودتر کشف می‌شوند |
| Bread → Farmer | Bread -1, Repaired Bike +1 | مسیر سریع توپ باز | Farmer Trust +1 | Bread دیگر برای مسیرهای دیگر در دسترس نیست |
| کمک به جعبه‌های Farmer | Time +1, Carrot +2 | Route B باز؛ پاداش Old Bike قابل بازشدن | Farmer Trust +2 | clue درباره نجار |
| Carrot → Carpenter | Carrot -1, Wood +1 | repair route باز | Carpenter Trust +1 | انبار ممکن است معرفی شود |
| کمک به Carpenter بدون trade | Time +1 | clue/shortcut | Trust +1 | optional storage route |
| بردن Old Bike خراب به BallSeller | معامله رد می‌شود | clue: نیاز به repair | بدون جریمه دائمی | تفاوت ارزش سالم/خراب کشف می‌شود |
| Repair Bike با Wood | Wood -1, Repaired Bike +1 | Ball trade باز | Mechanic Trust +1 | — |
| کمک به Mechanic | Time +1 | repair بدون Wood ممکن | Trust +2 | امکان Route کوتاه در آینده |
| Repaired Bike → Ball | Bike -1, Ball +1 | هدف تقریباً حل | BallSeller Trust +1 | — |
| کمک مستقیم به BallSeller | Time +1 | side service route | Trust +2 | Ball reward route |
| Trade نامناسب با NPC | کالا حفظ می‌شود | clue یا reaction | ممکن است NPC preference ثبت شود | اطلاعات جدید |
| جست‌وجوی مسیر فرعی | Time +1 | shortcut/item/clue | Explorer badge progress | optional stash |
| زیاد صبر کردن تا sunset | shop closed | مسیر سریع موقتاً بسته | beforeSunset bonus lost | next-day recovery |
| رساندن Ball قبل از sunset | Level solved | bonus XP | Baker Trust +2 | ending variant |
| رساندن Ball روز بعد | Level solved | no time bonus | Baker Trust +1 | ending variant |
| حل با Route A | سریع | Bread مصرف می‌شود | “efficient trader” evidence | مسیر کم‌Trust و کم‌Exploration |
| حل با Route B | کندتر | Bread حفظ می‌شود و Old Bike از Trust می‌آید | “resourceful helper” evidence | repair path باز می‌شود |
| حل با Route C | service exchange | no goods chain required | “creative solver” evidence | مفهوم ارزش خدمت |

## Consequence Rule
Decision معنادار است اگر حداقل دو مورد زیر را تغییر دهد:
- Inventory
- Time
- Trust
- Knowledge
- Opportunity availability
- Future NPC behavior
- Reward / badge evidence

## Choice Quality
Game Engine نباید Route خاصی را «جواب درست» بداند.

ارزیابی باید بر اساس Evidence باشد:
- آیا اطلاعات جمع کرد؟
- آیا Trade-off را دید؟
- آیا پس از اطلاعات جدید تصمیمش را اصلاح کرد؟
- آیا از بن‌بست Recovery پیدا کرد؟
- آیا مسیر جایگزین کشف کرد؟

## پایان‌های Level
همه پایان‌ها موفقیت محسوب می‌شوند اگر Ball به نانوا برسد، ولی Recap متفاوت است:

### پایان سریع
«خیلی زود راهی پیدا کردی، ولی برایش نان نانوا را خرج کردی.»

### پایان جست‌وجوگر
«راه طولانی‌تری رفتی، اما چند نفر را شناختی و چیزهای بیشتری کشف کردی.»

### پایان خدمت
«به‌جای عوض‌کردن کالاها، از کارت و کمکت برای معامله استفاده کردی.»

### پایان روز بعد
«راه‌حل پیدا شد؛ فقط بعضی فرصت‌ها با گذشت زمان عوض شدند.»

هیچ‌کدام با برچسب خوب/بد نمایش داده نمی‌شوند.
