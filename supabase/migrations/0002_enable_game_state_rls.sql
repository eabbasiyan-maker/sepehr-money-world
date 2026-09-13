alter table public.profiles enable row level security;
alter table public.player_state enable row level security;
alter table public.skills enable row level security;
alter table public.quest_progress enable row level security;
alter table public.decisions enable row level security;
alter table public.wallet_transactions enable row level security;
alter table public.ai_interactions enable row level security;

create policy "profiles_own_rows" on public.profiles
for all using (auth.uid() = id) with check (auth.uid() = id);

create policy "player_state_own_rows" on public.player_state
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "skills_own_rows" on public.skills
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "quest_progress_own_rows" on public.quest_progress
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "decisions_own_rows" on public.decisions
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "wallet_transactions_own_rows" on public.wallet_transactions
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "ai_interactions_own_rows" on public.ai_interactions
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
