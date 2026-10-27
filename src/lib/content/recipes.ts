export interface RecipeArticle {
  slug: string;
  category: string;
  categoryLabel: string;
  title: string;
  date: string;
  readTime: string;
  author: string;
  desc: string;
  content: string[];
  image: string;
}

export const RECIPE_CATEGORIES = [
  { id: 'all', label: 'All Articles' },
  { id: 'food-stories', label: 'Andhra Food Stories' },
  { id: 'serving-suggestions', label: 'Serving Suggestions' },
  { id: 'recipe-articles', label: 'Recipe Articles' },
  { id: 'behind-scenes', label: 'Behind-the-Scenes' },
  { id: 'kitchen-stories', label: 'Kitchen Stories' },
];

export const RECIPE_ARTICLES: RecipeArticle[] = [
  {
    slug: 'wood-pressed-sesame-oil-andhra-pickles',
    category: 'behind-scenes',
    categoryLabel: 'Behind-the-Scenes',
    title: 'The Secret Ingredient in Every NISA Jar: Wood-Pressed Sesame Oil (Nuvvula Nune)',
    date: 'Aug 18, 2026',
    readTime: '4 min read',
    author: 'NISA Kitchen Team',
    desc: 'Why cold wood-pressed sesame oil is the backbone of authentic Andhra non-veg pickling — and why most commercial brands skip it.',
    image: '/making.png',
    content: [
      "Most commercial pickle brands reach for refined vinegar or synthetic acidity regulators because they're cheap and shelf-stable. In Tenali home kitchens, including ours, the base has always been one thing: pure cold wood-pressed sesame oil — nuvvula nune in Telugu.",
      "Wood-pressing (ghani pressing) extracts the oil slowly at low temperature using a wooden churner, instead of the high-heat, high-speed extraction used for refined oils. That slower process keeps the oil's natural nuttiness and antioxidant compounds intact, which is partly why oil-based Andhra pickles have survived as a preservation method for generations without needing vinegar or chemical preservatives.",
      "When the oil coats cooked meat, it forms a seal that keeps air and moisture out — the same principle behind any oil-pickling tradition, from Mediterranean confit to Andhra avakaya. That's why our jars list 'wood-pressed sesame oil' and almost nothing else as the base, and why we don't add preservatives to the ingredient list.",
      "It also changes the taste. Refined oil is neutral by design; wood-pressed sesame oil carries a faint roasted, nutty note that becomes part of the pickle's flavor, not just its medium. If you've had a non-veg pickle that tasted mostly of vinegar and chili, and then try an oil-based Andhra one, the difference is usually immediate.",
      "For exact shelf life and storage instructions, always check the specific product page — it varies slightly by item and batch, and we'd rather point you to the real number than guess here.",
    ],
  },
  {
    slug: 'how-to-serve-chicken-podi-with-rice',
    category: 'serving-suggestions',
    categoryLabel: 'Serving Suggestions',
    title: 'How to Serve Chicken Podi With Hot Steamed Rice & Ghee',
    date: 'Aug 15, 2026',
    readTime: '3 min read',
    author: 'NISA Kitchen Team',
    desc: 'The classic Andhra way to turn plain steamed rice into a full meal with chicken podi, ghee, and nothing else.',
    image: '/making.png',
    content: [
      "This is the simplest, most common way chicken podi is eaten in Andhra households, and it's worth doing properly rather than just sprinkling it on as an afterthought.",
      "Start with rice that's genuinely hot — straight off the stove or out of the cooker, not reheated. Add a spoon of melted ghee (or wood-pressed sesame oil, if you prefer) directly into the rice first, and mix it through before adding the podi. The heat and fat help the podi release its flavor instead of sitting on top as dry powder.",
      "Add the chicken podi gradually — a spoon at a time — and mix with your hand or a spoon until the rice turns a uniform reddish-brown. Taste as you go; podi is concentrated, so it's easy to add more but harder to dial back.",
      "A thin slice of raw onion, a wedge of lime, and a fried papad on the side rounds this out into what most Telugu households would recognize as a proper weekday lunch, not a shortcut meal.",
      "The same podi works well mixed into curd rice for a milder version, or sprinkled dry over hot dosa or idli with a drizzle of ghee — see our recipe articles for more ways to use it beyond rice.",
    ],
  },
  {
    slug: 'gongura-meat-andhra-pickle-tradition',
    category: 'food-stories',
    categoryLabel: 'Andhra Food Stories',
    title: 'Gongura & Meat: The Timeless Andhra Flavor Pairing',
    date: 'Aug 10, 2026',
    readTime: '5 min read',
    author: 'NISA Kitchen Team',
    desc: "Why the tangy sorrel leaf, gongura, is paired with chicken and mutton across Andhra kitchens — and what it actually does to the dish.",
    image: '/making.png',
    content: [
      "Gongura — sorrel leaf — is often called the signature green of Andhra cuisine, and it shows up in everything from simple dals to the region's best-known non-veg pickles. Its defining trait is a sharp, sour tang that comes from naturally occurring oxalic acid in the leaf, closer to tamarind or raw mango than to any other leafy green used in Indian cooking.",
      "That sourness is exactly why it's paired with rich meats like chicken and mutton. Slow-cooked meat in an oil-based masala can taste heavy on its own; a reduction of gongura leaves cooked down into a thick, deep-green paste and folded through the meat cuts that richness and adds a sour edge that makes you want the next bite.",
      "Making a proper gongura reduction takes time — the leaves have to be cleaned, cooked down slowly until the water content evaporates and the paste thickens, then balanced against the chili and oil in the rest of the pickle. Rush it, and the gongura tastes raw and bitter instead of rounded and tangy.",
      "It's a pairing that's specific to Andhra and Telangana cooking in a way few other regional combinations are — you won't find gongura-meat pickle as a staple outside Telugu kitchens, which is part of why it's one of the dishes people from the region look for first when they're away from home.",
      "If you haven't tried gongura chicken or mutton pickle before, expect something noticeably more sour and complex than a standard chili-and-oil non-veg pickle — it's a different flavor profile, not just a hotter version of the same thing.",
    ],
  },
  {
    slug: 'small-batch-brass-uruli-cooking',
    category: 'kitchen-stories',
    categoryLabel: 'Kitchen Stories',
    title: 'Why We Cook in 5kg Batches, Not 500kg Vats',
    date: 'Aug 05, 2026',
    readTime: '4 min read',
    author: 'NISA Kitchen Team',
    desc: 'Inside the daily preparation cycle in Tenali, and why batch size changes how a pickle actually turns out.',
    image: '/making.png',
    content: [
      "Large commercial pickle manufacturing typically happens in steel vats that can hold several hundred kilograms at once. It's efficient, and it's how most mass-market pickle brands scale — but it changes the texture and consistency of the final product in ways that matter for meat-based pickles specifically.",
      "In a 500kg batch, heat distribution isn't even. Pieces at the bottom or near the heating element cook faster than pieces near the top or edges, which means some meat ends up overcooked and dry while other pieces are undercooked. Masala coating is also harder to distribute evenly at that scale — you end up with pockets that are over-spiced and others that are bland.",
      "We cook in roughly 5kg batches in brass Uruli vessels — the same type of wide, shallow vessel used in Andhra home kitchens for generations, not an industrial fryer or vat. At that size, every piece of meat gets roughly the same heat exposure and the same amount of time in contact with the oil and masala, which is what gives a consistent texture jar to jar.",
      "It also means someone is physically present and stirring through the whole cook, watching the meat and adjusting rather than running a timer on a machine. That's slower, and it caps how much we can produce in a day — which is a real tradeoff, not a marketing line. It's also the reason the texture stays closer to what you'd get cooking it yourself at home.",
    ],
  },
  {
    slug: 'three-ways-to-use-chicken-podi',
    category: 'recipe-articles',
    categoryLabel: 'Recipe Articles',
    title: '3 Ways to Use NISA Chicken Podi Beyond Plain Rice',
    date: 'Jul 30, 2026',
    readTime: '3 min read',
    author: 'NISA Kitchen Team',
    desc: 'Chicken podi mixed with rice and ghee is the classic, but it works in a few other everyday dishes too.',
    image: '/making.png',
    content: [
      "Chicken podi mixed with hot rice and ghee is the default way most people use it, and it's hard to beat. But as a dry, roasted spice powder, it adapts well to a few other everyday dishes if you want variety.",
      "1. Podi dosa: once your dosa is poured on the tawa and the edges start to crisp, sprinkle a thin, even layer of chicken podi over the surface before it fully sets, then drizzle a little ghee or sesame oil along the edges. Fold it over once the base is cooked through. The podi toasts slightly against the hot tawa, which brings out more of its roasted flavor than mixing it in raw.",
      "2. Podi idli: steam your idlis as usual, then while they're still hot, press a spoon of podi mixed with melted ghee into the center of each one, or serve it on the side as a dip alongside the usual chutney and sambar. Works especially well with slightly dry, day-old idlis that could use the extra moisture and fat from the ghee.",
      "3. Curd rice with podi: mix cooked rice with fresh curd, a pinch of salt, and a tempering of mustard seeds and curry leaves as you normally would, then stir through a spoon of chicken podi right before serving. The cooling curd and the roasted, spicy podi balance each other out — a common Andhra way to use leftover rice.",
      "In all three, start with less podi than you think you need. It's concentrated and roasted, and it's easy to oversalt or overspice a dish by treating it like a garnish rather than a seasoning.",
    ],
  },
];

export function getRecipeBySlug(slug: string): RecipeArticle | undefined {
  return RECIPE_ARTICLES.find((a) => a.slug === slug);
}
