# Sepehr Money World — MVP / Vertical Slice Scope v0.1

## هدف
ساخت کوچک‌ترین نسخه‌ای که بتوان آن را واقعاً به سپهر داد و جذابیت Gameplay را سنجید.

## در محدوده MVP
### محیط
- یک نقشه کوچک شهر
- فروشگاه فعال
- بانک قفل/نیمه‌باز
- یک محل مأموریت

### شخصیت‌ها
- سپهر
- Money Bot
- Fox Merchant
- Banker

### سیستم‌ها
- Wallet
- Coin
- XP
- Quest State
- Save/Load
- یک Badge
- یک Unlock

### مأموریت‌ها
1. دنیا بدون پول
2. نیاز یا خواسته در Context واقعی
3. مقایسه دو خرید
4. هدف پس‌انداز + پیامد انتخاب قبلی

### AI
حداقل یک مسیر AI واقعی برای:
- دیالوگ تطبیقی NPC
- سؤال بازتابی بعد از تصمیم
- انتخاب یکی از Challenge Variantهای از قبل مجاز

### Supabase
- player profile
- wallet/state
- quest progress
- skills
- decisions
- ai interaction log حداقلی

## خارج از MVP
- چند کاربر عمومی
- Parent Dashboard کامل
- Login پیچیده
- Store واقعی
- Leaderboard
- Multiplayer
- Voice
- Campaign کامل 15–20 مرحله‌ای

## Definition of Done
MVP فقط وقتی Done است که:
1. از GitHub Pages باز شود.
2. State بعد از بستن و بازکردن حفظ شود.
3. حداقل چهار مأموریت متصل داشته باشد.
4. یک تصمیم روی مأموریت بعدی اثر واقعی بگذارد.
5. یک تعامل AI کنترل‌شده داشته باشد.
6. API key در Client نباشد.
7. سپهر حداقل یک Session 20 دقیقه‌ای را بدون کمک فنی طی کند.
8. بعد از Session، feedback واقعی ثبت شود.
