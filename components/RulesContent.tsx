const sections = [
  {
    title: "Match Flow",
    items: [
      "Every active side starts with 3 lives.",
      "A side loses 1 life when the ball exits through that side.",
      "A side with 0 lives is disqualified and its paddle is disabled.",
      "The last active side wins the match.",
    ],
  },
  {
    title: "Modes",
    items: [
      "Player Mode keeps active paddles human-controlled where keyboard or touch input is available.",
      "Computer Mode gives you the left paddle and assigns all other active paddles to AI.",
      "Two sides uses left and right. Three sides adds top. Four sides adds bottom.",
    ],
  },
  {
    title: "Difficulty",
    items: [
      "Easy AI reacts slowly, tracks less accurately, and makes more mistakes.",
      "Medium AI is balanced for fair rallies.",
      "Hard AI moves faster, reacts quickly, and makes very few mistakes.",
    ],
  },
  {
    title: "Controls",
    items: [
      "Left paddle: W and S.",
      "Right paddle: Arrow Up and Arrow Down.",
      "Top paddle: A and D.",
      "Bottom paddle: J and L.",
      "Mobile gameplay includes touch controls for every human-controlled side.",
    ],
  },
];

export function RulesContent() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {sections.map((section) => (
        <section key={section.title} className="neon-card rounded-xl p-5">
          <h2 className="font-display text-xl font-bold text-white">{section.title}</h2>
          <ul className="mt-4 grid gap-3 text-sm font-medium leading-6 text-slate-300">
            {section.items.map((item) => (
              <li key={item} className="rounded-lg border border-white/10 bg-white/5 p-3">
                {item}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
