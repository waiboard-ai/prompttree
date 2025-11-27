# 🌳 Promptree

**Stop prompt engineering. Start prompt farming.**  

Cultivate ideas → evolve prompts → harvest creativity.

Promptree is an open-source framework for **growing AI prompts like a tree**, inspired by nature.  
Instead of manually iterating, you plant a **seed prompt**, define **growth conditions**,  
and the system evolves new branches until you harvest **fruit-level prompts**.

---

## 🍃 Core Concepts

| 🌿 Tree Metaphor | Promptree Meaning                          |
| ---------------- | --------------------------------------------- |
| 🌱 **Seed**      | Your idea / starting prompt                |
| ☀️ **Light**     | Direction, tone, purpose                   |
| 🏞 **Soil**      | Constraints + scoring rules                |
| 🌿 **Growth**    | Generative mutation + branching            |
| 🌸 **Flowers**   | High-potential prompts (promising branches) |
| 🍎 **Fruits**    | Final yield → surprising, useful outputs   |


---

## 🌱 How it Works

1. `seed` → Provide a base idea or starting prompt  
2. `light` → Define direction (style, tone, goals)  
3. `soil` → Add constraints + scoring metrics  
4. `grow` → System mutates + generates branches  
5. `select` → Good branches survive, weak ones die  
6. `harvest` → Flowers = strong candidates,  
   Fruits = polished prompt outputs ready to use

> Evolutionary prompting — but fun.

---

## 🧪 Example

```ts
const seed = "Write a product pitch for an AI toothbrush";

const light = {
  tone: "playful but professional",
  audience: "VC investors",
};

const soil = {
  score: (out) => semanticQuality(out) + humor(out) - fluff(out),
  threshold: 0.75
};

grow(seed, light, soil).then(tree => harvest(tree, "fruits"));
````

Output may include:

🍒 *"Your mouth has version control now."*
🍎 *"Plaque has met its match — and it's powered by transformers."*

---

## 🌼 Why Promptree?

* prompts evolve automatically
* encourages exploration, not trial-and-error
* yields unexpected creative outcomes
* visual + tree structured
* gardening metaphor is **fun + intuitive**

This is prompting for humans, not machines.

---

## 🍇 Roadmap

* [ ] Web UI prompt orchard 🌾
* [ ] Prompt evolution visualizer 🌿
* [ ] Automatic genetic mutation modes 🍀
* [ ] Plug-in scoring models + fitness functions
* [ ] Open prompt marketplace: trade your fruits 🍎

---

## 🤝 Contributing

Pull requests welcome.
Bring your seeds. Bring your sunlight. 🌞
Together we'll grow a forest.

---

### License: MIT

**🌳 promptree – prompt grows, mind expands.**
