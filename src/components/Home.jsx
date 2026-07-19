import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebaseConfig";
import { signOut } from "firebase/auth";
import { ref, push, set } from "firebase/database";
import Recipes from "./Recipes";
import Profile from "./Profile";

const menuItems = [
  "Dashboard",
  "Recipes",
  "Shopping List",
  "Favorites",
  "Your Profile",
];

// Define the available units for easy rendering
const UNIT_OPTIONS = ["g", "ml", "cup", "tsp", "tbsp", "piece"];

const Home = () => {
  const navigate = useNavigate();
  const user = auth.currentUser;

  const displayName = user?.displayName || "Chef";
  const email = user?.email || "";

  // 2. ADD TAB STATE
  const [activeTab, setActiveTab] = useState("Dashboard");

  const [isAddingRecipe, setIsAddingRecipe] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Updated state: ingredients is now an array of objects
  const [recipeData, setRecipeData] = useState({
    title: "",
    story: "",
    ingredients: [{ name: "", quantity: "", unit: "cup" }],
    instructions: "",
    prepTime: "",
  });

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRecipeData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // --- Updated Dynamic Ingredient Handlers ---
  const handleIngredientChange = (index, field, value) => {
    const newIngredients = [...recipeData.ingredients];
    newIngredients[index][field] = value;
    setRecipeData({ ...recipeData, ingredients: newIngredients });
  };

  const addIngredient = () => {
    setRecipeData({
      ...recipeData,
      ingredients: [
        ...recipeData.ingredients,
        { name: "", quantity: "", unit: "cup" },
      ],
    });
  };

  const removeIngredient = (index) => {
    const newIngredients = recipeData.ingredients.filter((_, i) => i !== index);
    setRecipeData({ ...recipeData, ingredients: newIngredients });
  };
  // -------------------------------------------

  const handleSaveRecipe = async (e) => {
    e.preventDefault();
    if (!user) return;
    setIsSaving(true);

    try {
      const userRecipesRef = ref(db, `users/${user.uid}/recipes`);

      // 1. Generate the unique reference and ID
      const newRecipeRef = push(userRecipesRef);
      const uniqueRecipeId = newRecipeRef.key; // <-- This is the generated unique ID!

      const cleanIngredients = recipeData.ingredients.filter(
        (ing) => ing.name.trim() !== "",
      );

      // 2. Save the data, including the new ID
      await set(newRecipeRef, {
        id: uniqueRecipeId, // Save the ID directly inside the recipe object
        ...recipeData,
        ingredients: cleanIngredients,
        isFavorite: false,
        createdAt: Date.now(),
      });

      setRecipeData({
        title: "",
        story: "",
        ingredients: [{ name: "", quantity: "", unit: "cup" }],
        instructions: "",
        prepTime: "",
      });
      setIsAddingRecipe(false);
      alert("Recipe saved successfully!");
    } catch (error) {
      console.error("Error saving recipe:", error);
      alert("Failed to save recipe.");
    } finally {
      setIsSaving(false);
    }
  };
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#f5f3ff_0%,_#eef2ff_38%,_#fef9c3_100%)] px-4 py-5 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-2.5rem)] max-w-7xl flex-col overflow-hidden rounded-[32px] border border-violet-100 bg-white/85 shadow-[0_24px_80px_rgba(79,70,229,0.14)] backdrop-blur">
        {/* Header Section */}
        <header className="flex gap-4 border-b border-indigo-100 px-5 py-5 sm:px-8 sm:justify-between lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-violet-500 via-indigo-500 to-sky-400 shadow-lg shadow-indigo-200/70">
              <span className="text-lg font-black tracking-[0.28em] text-white">
                Me
              </span>
            </div>
            <div>
              <h1 className="text-xs font-semibold uppercase tracking-[0.32em] text-indigo-500">
                Me Chef
              </h1>
              <h1 className="text-2xl font-black tracking-tight text-slate-900">
                save your recipe
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-3 self-start rounded-2xl border border-indigo-100 bg-indigo-50/80 px-4 py-3 lg:self-auto">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-indigo-950 text-sm font-bold text-white uppercase">
              {displayName
                .split(" ")
                .map((part) => part[0])
                .join("")
                .slice(0, 2)}
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">
                {displayName}
              </p>
              <p className="text-xs text-slate-500">{email}</p>
            </div>
          </div>
        </header>

        <div className="flex flex-1 flex-col lg:flex-row">
          {/* Sidebar Section */}
          <aside className="flex flex-col justify-between border-b border-indigo-100 bg-slate-950 px-5 py-6 text-white lg:w-72 lg:border-r lg:border-b-0 lg:px-6">
            <div>
              <div className="rounded-3xl border border-white/10 bg-white/6 p-5">
                <p className="text-xs uppercase tracking-[0.28em] text-sky-300">
                  Hello
                </p>
                <h2 className="mt-1 text-xl font-bold truncate">
                  {displayName}
                </h2>
              </div>
              <nav className="mt-6">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
                  Menu
                </p>
                <div className="space-y-2">
                  {menuItems.map((item) => {
                    // CHANGE THIS LINE:
                    const isActive = item === activeTab;

                    return (
                      <button
                        key={item}
                        // ADD THIS LINE:
                        onClick={() => setActiveTab(item)}
                        type="button"
                        className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-sm font-medium transition ${
                          isActive
                            ? "bg-linear-to-r from-violet-500 via-indigo-500 to-sky-400 text-white shadow-lg shadow-indigo-500/25"
                            : "bg-white/5 text-slate-200 hover:bg-white/10"
                        }`}
                      >
                        <span>{item}</span>
                        <span
                          className={`h-2.5 w-2.5 rounded-full ${isActive ? "bg-yellow-300" : "bg-sky-300/60"}`}
                        />
                      </button>
                    );
                  })}
                </div>
              </nav>
            </div>
            <div className="mt-8">
              <button
                onClick={handleLogout}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-red-500/10 px-4 py-3 text-sm font-medium text-red-400 transition hover:bg-red-500/20"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                Logout
              </button>
            </div>
          </aside>

          {/* Main Content Section */}
          <section className="flex-1 px-5 py-6 sm:px-8 sm:py-8 overflow-y-auto max-h-[calc(100vh-10rem)]">
            {/* --- DASHBOARD TAB --- */}
            {activeTab === "Dashboard" && (
              <>
                <div className="flex flex-col gap-2">
                  <p className="text-lg font-semibold uppercase tracking-[0.26em] text-indigo-500">
                    Welcome
                  </p>
                  <p className="max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
                    Create, Add, Save and share your recipe with your loved
                    ones...
                  </p>
                </div>

                {!isAddingRecipe ? (
                  <div className="mt-8 flex min-h-[420px] items-center justify-center rounded-[28px] border-2 border-dashed border-indigo-200 bg-[linear-gradient(135deg,rgba(245,243,255,0.96),rgba(239,246,255,0.94),rgba(254,249,195,0.88))] p-8">
                    <div className="max-w-md text-center">
                      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-violet-500 via-indigo-500 to-sky-400 text-white shadow-xl shadow-indigo-500/20">
                        <svg
                          aria-hidden="true"
                          className="h-7 w-7"
                          fill="none"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.8"
                          viewBox="0 0 24 24"
                        >
                          <path d="M4 7h16" />
                          <path d="M7 4v6" />
                          <path d="M17 4v6" />
                          <path d="M5 11h14v8H5z" />
                        </svg>
                      </div>
                      <h3 className="mt-5 text-2xl font-bold tracking-tight text-slate-900">
                        Add Recipe
                      </h3>
                      <p className="mt-3 text-sm leading-6 text-slate-500 sm:text-base">
                        No cards or data have been added yet. This space is
                        prepared for your future dashboard content.
                      </p>
                      <button
                        onClick={() => setIsAddingRecipe(true)}
                        type="button"
                        className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-linear-to-r from-violet-500 via-indigo-500 to-sky-400 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:scale-[1.02] hover:shadow-xl hover:shadow-indigo-500/30"
                      >
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-yellow-300 text-xs font-bold text-indigo-950">
                          +
                        </span>
                        Add Recipe
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-8 rounded-[28px] border border-indigo-100 bg-white p-6 sm:p-8 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-2xl font-bold text-slate-900">
                        New Recipe
                      </h3>
                      <button
                        onClick={() => setIsAddingRecipe(false)}
                        className="text-slate-400 hover:text-slate-600 font-semibold"
                      >
                        Cancel
                      </button>
                    </div>

                    <form onSubmit={handleSaveRecipe} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-1">
                            Recipe Title *
                          </label>
                          <input
                            required
                            type="text"
                            name="title"
                            value={recipeData.title}
                            onChange={handleInputChange}
                            placeholder="E.g., Grandma's Mango Pickle"
                            className="w-full rounded-xl border border-indigo-100 px-4 py-2.5 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-1">
                            Prep/Cook Time
                          </label>
                          <input
                            type="text"
                            name="prepTime"
                            value={recipeData.prepTime}
                            onChange={handleInputChange}
                            placeholder="E.g., 45 mins"
                            className="w-full rounded-xl border border-indigo-100 px-4 py-2.5 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">
                          The Story / Origin
                        </label>
                        <input
                          type="text"
                          name="story"
                          value={recipeData.story}
                          onChange={handleInputChange}
                          placeholder="Where did this recipe come from?"
                          className="w-full rounded-xl border border-indigo-100 px-4 py-2.5 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition"
                        />
                      </div>

                      {/* Dynamic Ingredients Section with Quantity & Unit */}
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Ingredients *
                        </label>
                        <div className="space-y-4">
                          {recipeData.ingredients.map((ingredient, index) => (
                            <div
                              key={index}
                              className="flex flex-col gap-3 p-4 rounded-2xl border border-slate-100 bg-slate-50/50"
                            >
                              {/* Top Row: Name, Quantity, Remove Button */}
                              <div className="flex items-center gap-3">
                                <input
                                  required={index === 0}
                                  type="text"
                                  value={ingredient.name}
                                  onChange={(e) =>
                                    handleIngredientChange(
                                      index,
                                      "name",
                                      e.target.value,
                                    )
                                  }
                                  placeholder="Ingredient Name (e.g., Flour)"
                                  className="flex-1 rounded-xl border border-indigo-100 px-4 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition"
                                />
                                {/* Updated Quantity Input */}
                                <input
                                  required={index === 0}
                                  type="text"
                                  value={ingredient.quantity}
                                  onChange={(e) =>
                                    handleIngredientChange(
                                      index,
                                      "quantity",
                                      e.target.value,
                                    )
                                  }
                                  placeholder="Qty (e.g. 1/2)"
                                  className="w-28 rounded-xl border border-indigo-100 px-3 py-2 text-center focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition"
                                />
                                {recipeData.ingredients.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => removeIngredient(index)}
                                    className="p-2 text-red-400 hover:bg-red-50 hover:text-red-500 rounded-lg transition shrink-0"
                                    title="Remove ingredient"
                                  >
                                    <svg
                                      className="w-5 h-5"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                      ></path>
                                    </svg>
                                  </button>
                                )}
                              </div>

                              {/* Bottom Row: Styled Radio Buttons for Units */}
                              <div className="flex flex-wrap gap-2">
                                {UNIT_OPTIONS.map((unit) => (
                                  <label key={unit} className="cursor-pointer relative">
                                    {/* Actual radio input (hidden using sr-only) */}
                                    <input
                                      type="radio"
                                      name={`unit-${index}`}
                                      value={unit}
                                      checked={ingredient.unit === unit}
                                      onChange={(e) =>
                                        handleIngredientChange(
                                          index,
                                          "unit",
                                          e.target.value,
                                        )
                                      }
                                      className="peer absolute opacity-0 w-0 h-0"
                                    />
                                    {/* Styled visually as a tag/pill */}
                                    <span className="inline-block rounded-lg border border-indigo-100 bg-white px-3 py-1.5 text-xs font-medium text-slate-500 transition peer-checked:border-indigo-500 peer-checked:bg-indigo-50 peer-checked:text-indigo-700 hover:bg-slate-50">
                                      {unit}
                                    </span>
                                  </label>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>

                        <button
                          type="button"
                          onClick={addIngredient}
                          className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-indigo-500 hover:text-indigo-700 transition"
                        >
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 text-lg leading-none">
                            +
                          </span>
                          Add another ingredient
                        </button>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">
                          Instructions *
                        </label>
                        <textarea
                          required
                          name="instructions"
                          value={recipeData.instructions}
                          onChange={handleInputChange}
                          rows="5"
                          placeholder="Step-by-step instructions..."
                          className="w-full rounded-xl border border-indigo-100 px-4 py-2.5 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition resize-none"
                        ></textarea>
                      </div>

                      <div className="flex justify-end pt-4 border-t border-indigo-50">
                        <button
                          type="submit"
                          disabled={isSaving}
                          className={`inline-flex items-center gap-2 rounded-2xl px-6 py-3 text-sm font-semibold text-white shadow-lg transition ${isSaving ? "bg-indigo-300 cursor-not-allowed" : "bg-linear-to-r from-violet-500 via-indigo-500 to-sky-400 hover:scale-[1.02] hover:shadow-xl hover:shadow-indigo-500/30"}`}
                        >
                          {isSaving ? "Saving..." : "Save Recipe"}
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </>
            )}

            {/* --- RECIPES TAB --- */}
            {activeTab === "Recipes" && (
              <>
                <div className="flex justify-between items-end mb-2 mt-4">
                  <div>
                    <p className="text-lg font-semibold uppercase tracking-[0.26em] text-indigo-500">
                      Your Vault
                    </p>
                    <h2 className="text-3xl font-black tracking-tight text-slate-900 mt-1">
                      All Recipes
                    </h2>
                  </div>
                  <button
                    onClick={() => {
                      setActiveTab("Dashboard");
                      setIsAddingRecipe(true);
                    }}
                    className="inline-flex items-center gap-2 rounded-xl bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-600 hover:bg-indigo-100 transition"
                  >
                    + New Recipe
                  </button>
                </div>

                <Recipes user={user} />
              </>
            )}

            {/* -- Shopping List -- */}
            {activeTab === "Shopping List" && (
              <div className="mt-8 text-slate-500">
                Shopping List Coming Soon!
              </div>
            )}

            {/* --- FAVORITES TAB --- */}
            {activeTab === "Favorites" && (
              <>
                <div className="flex justify-between items-end mb-2 mt-4">
                  <div>
                    <p className="text-lg font-semibold uppercase tracking-[0.26em] text-indigo-500">
                      Your Best
                    </p>
                    <h2 className="text-3xl font-black tracking-tight text-slate-900 mt-1">
                      Favorite Recipes
                    </h2>
                  </div>
                </div>

                {/* Note the new filterFavorites prop here! */}
                <Recipes user={user} filterFavorites={true} />
              </>
            )}

            {/* --- PROFILE TAB --- */}
            {activeTab === "Your Profile" && (
              <>
                <div className="flex justify-between items-end mb-2 mt-4">
                  <div>
                    <p className="text-lg font-semibold uppercase tracking-[0.26em] text-indigo-500">
                      About You
                    </p>
                    <h2 className="text-3xl font-black tracking-tight text-slate-900 mt-1">
                      Your Profile
                    </h2>
                  </div>
                </div>

                <Profile user={user} />
              </>
            )}
          </section>
        </div>
      </div>
    </main>
  );
};

export default Home;
