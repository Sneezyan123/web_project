"use server";

export async function askGroq(messages: { role: string; content: string }[]) {
  const systemPrompt = `Ти — розумний AI помічник для сайту "Ukrainians to Ukrainians" (U2U).
Твоє завдання — рекомендувати україномовні канали або тематичні добірки користувачам.
Відповідай виключно українською мовою. Будь дружнім, лаконічним та підтримуй українських контент-мейкерів!`;

  const payload = {
    messages: [
      { role: "system", content: systemPrompt },
      ...messages
    ]
  };

  try {
    const response = await fetch("https://text.pollinations.ai/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      return { error: `Pollinations API error: ${response.status}` };
    }

    const text = await response.text();
    // Remove HTML tags that sometimes appear from Pollinations
    const cleanedText = text.replace(/<\/?[^>]+(>|$)/g, "");
    return { reply: cleanedText };
  } catch (err: any) {
    return { error: "Failed to connect to AI API", details: err.message };
  }
}
