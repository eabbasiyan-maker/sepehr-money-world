# Level 1 — World State Model v0.2

## هدف
World State حافظه واقعی بازی است. تصمیم‌ها، فرصت‌ها و پیامدها از State استخراج می‌شوند؛ نه از متن دیالوگ یا پاسخ AI.

## دسته‌های State

### Player
- position
- xp
- currentGoal
- inventory
- discoveredLocations

### Time
- phase: morning | noon | afternoon | sunset | next_day
- actionCount
- beforeSunsetBonus

### Inventory
آیتم‌ها quantity و metadata دارند.

نمونه:
```json
{
  "bread": 1,
  "carrot": 2,
  "wood": 0,
  "old_bike": 0,
  "repaired_bike": 0,
  "ball": 0
}
```

### Knowledge / Clues
- farmer_wants_bread
- carpenter_wants_carrot
- ball_seller_wants_bike
- mechanic_can_repair_bike
- ball_seller_side_task_known
- storage_shortcut_known

Knowledge خودش یک Resource است؛ بعضی گزینه‌ها فقط وقتی باز می‌شوند که بازیکن قبلاً اطلاعات مربوط را کشف کرده باشد.

### Trust
مقیاس نسخه اول: 0 تا 3

- baker
- farmer
- mechanic
- ballSeller
- carpenter

پیشنهاد:
- 0 = ناشناس
- 1 = آشنا
- 2 = قابل اعتماد
- 3 = رابطه قوی

### NPC State
هر NPC می‌تواند:
- available
- busy
- waiting
- satisfied
- closed

داشته باشد.

### World Flags
- bakeryBreadTaken
- farmerBoxesHelped
- farmerBikeTraded
- bikeRepaired
- ballSellerHelped
- marketClosed
- optionalStorageFound
- levelSolved

## قواعد زمان
فقط Actionهای معنی‌دار Time مصرف می‌کنند:
- انجام کار برای NPC
- رفتن به منطقه دور
- تعمیر
- Side Quest

صرفاً بازکردن دیالوگ یا نگاه‌کردن به Inventory زمان مصرف نمی‌کند.

## قواعد Trust
Trust با «جواب اخلاقی» افزایش پیدا نمی‌کند.

نمونه:
- انجام تعهد → +1
- کمک واقعی → +1
- برگشتن با چیزی که قول داده شده → +1
- لغو قول بعد از پذیرفتن → -1

## قواعد ارزش
NPCها Value ثابت مشترک ندارند.

مثلاً:
- Bread برای Farmer ارزش بالا دارد.
- Bread برای BallSeller ارزش پایین دارد.
- Repaired Bike برای BallSeller ارزش بالا دارد.

این تفاوت باید از رفتار NPC دیده شود، نه از یک عدد مالی روی UI.

## Opportunity Lock
برخی انتخاب‌ها State را واقعاً تغییر می‌دهند.

مثال:
اگر Bread به Farmer داده شود:
- bread = 0
- old_bike = 1
- farmerBikeTraded = true

بازیکن نمی‌تواند بدون دلیل آن را Undo کند.

## Soft Recovery
برای کودک نباید State به بن‌بست کامل برسد.

اگر همه مسیرهای اصلی بسته شوند، بازی یک Recovery Opportunity می‌سازد:
- کار کوچک
- سرنخ محیطی
- NPC کمکی

اما Recovery رایگان نیست؛ Time یا XP Bonus کمتر می‌شود.

## Save Model
State بعد از هر Meaningful Action ذخیره می‌شود:
- trade
- job completion
- item acquisition
- trust change
- time phase change
- quest completion

## Supabase Mapping پیشنهادی
- player_state: level, xp, coins, current_quest
- quest_progress.state: World State مخصوص Level
- decisions: تصمیم‌های معنی‌دار و payload
- wallet_transactions: فقط از زمانی که پول وارد Campaign می‌شود
- skills: Evidenceهای آموزشی
- ai_interactions: optional و در MVP استفاده نمی‌شود

## Event Contract
Game Engine بهتر است به‌جای دست‌کاری پراکنده State، Event ثبت کند.

نمونه:
```json
{
  "type": "TRADE_COMPLETED",
  "from": "farmer",
  "give": {"bread": 1},
  "receive": {"old_bike": 1},
  "timeCost": 0,
  "trustDelta": {"farmer": 1}
}
```

سپس Reducer/Rule Engine State جدید را محاسبه می‌کند.

این مدل بعداً تست‌پذیری و Replay تصمیم‌ها را ساده‌تر می‌کند.
