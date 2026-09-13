import "jsr:@supabase/functions-js/edge-runtime.d.ts";

Deno.serve(async (req: Request) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "method_not_allowed" }), {
      status: 405,
      headers: { "content-type": "application/json" }
    });
  }

  const body = await req.json();

  const response = {
    npcDialogue: body?.action === "ask_hint"
      ? "به چیزی فکر کن که همه آدم‌های شهر حاضر باشند در معامله قبولش کنند."
      : "تصمیمت جالبه؛ فکر می‌کنی چه چیزی ممکنه بعداً تغییرش بده؟",
    event: "dialogue",
    learningSignal: "observe",
    xp: 0,
    nextChallenge: null
  };

  return new Response(JSON.stringify(response), {
    status: 200,
    headers: { "content-type": "application/json" }
  });
});
