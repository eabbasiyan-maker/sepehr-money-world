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
- Inventory
- World State
- یک Badge
- یک Unlock

### مأموریت‌ها
1. دنیا بدون پول
2. نیاز یا خواسته در Context واقعی
3. مقایسه دو خرید
4. هدف پس‌انداز + پیامد انتخاب قبلی

### AI
AI جزو Acceptance Criteria نسخه MVP نیست.

MVP باید بدون Model Call کاملاً قابل بازی باشد. اگر بعداً Playtest نشان دهد برای Hint یا تنوع دیالوگ ارزش واقعی ایجاد می‌کند، AI به‌صورت Optional Layer اضافه می‌شود.

### Supabase
- player profile
- wallet/state
- quest progress
- skills
- decisions
- inventory
- world state

## خارج از MVP
- AI تطبیقی اجباری
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
5. بازی بدون AI end-to-end قابل اجرا باشد.
6. Secret یا API key در Client نباشد.
7. سپهر حداقل یک Session 20 دقیقه‌ای را بدون کمک فنی طی کند.
8. بعد از Session، feedback واقعی ثبت شود.
