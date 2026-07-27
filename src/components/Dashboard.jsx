import React, { useState } from "react";
import { db } from "../firebaseConfig";
import { ref, push, set } from "firebase/database";

import { useNavigate } from "react-router-dom";

const UNIT_OPTIONS = ["g", "ml", "cup", "tsp", "tbsp", "piece"];

const Dashboard = ({ user }) => {
  const navigate = useNavigate();
  const displayName = user?.displayName || "Chef";
  const [isAddingRecipe, setIsAddingRecipe] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [recipeData, setRecipeData] = useState({
    title: "",
    story: "",
    ingredients: [{ name: "", quantity: "", unit: "cup" }],
    instructions: "",
    prepTime: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRecipeData((prev) => ({ ...prev, [name]: value }));
  };

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

  const handleSaveRecipe = async (e) => {
    e.preventDefault();
    if (!user) return;
    setIsSaving(true);
    try {
      const userRecipesRef = ref(db, `users/${user.uid}/recipes`);
      const newRecipeRef = push(userRecipesRef);
      const uniqueRecipeId = newRecipeRef.key;
      const cleanIngredients = recipeData.ingredients.filter(
        (ing) => ing.name.trim() !== ""
      );

      await set(newRecipeRef, {
        id: uniqueRecipeId,
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
      
      // We trigger the tab change via the prop passed from Home.jsx
      navigate("/recipes");
      
    } catch (error) {
      console.error("Error saving recipe:", error);
      alert("Failed to save recipe.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="animate-in fade-in duration-300">
      <div className="mb-8">
        <h1 className="text-3xl sm:text-3xl font-black text-[#1B211A]">
          Hi, {displayName}
        </h1>
        <p className="mt-2 text-[#1B211A]/70 font-mono italic">
          A home for every recipe you love: the passed-down, the shared, and the deliciously experimental.
        </p>
      </div>

      {!isAddingRecipe ? (
        <div className="flex min-h-[400px] items-center justify-center rounded-[32px] border-2 border-dashed border-[#628141]/30 bg-white/50 p-8 backdrop-blur-sm">
          <div className="max-w-md text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#8BAE66] text-[#1B211A] shadow-xl shadow-[#8BAE66]/20">
              <svg className="h-8 w-8" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24">
                <path d="M4 7h16" />
                <path d="M7 4v6" />
                <path d="M17 4v6" />
                <path d="M5 11h14v8H5z" />
              </svg>
            </div>
            <h3 className="mt-6 text-2xl font-bold text-[#1B211A]">Add a New Recipe</h3>
            <p className="mt-3 text-[#1B211A]/70">Your vault is ready. Start documenting your favorite dishes.</p>
            <button
              onClick={() => setIsAddingRecipe(true)}
              className="cursor-pointer mt-8 inline-flex items-center gap-2 rounded-xl bg-[#628141] px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#628141]/30 transition hover:bg-[#1B211A] hover:scale-[1.02]"
            >
              <span className="text-lg leading-none">+</span> Create Recipe
            </button>
          </div>
        </div>
      ) : (
        <div className="rounded-[32px] border border-white bg-white p-6 sm:p-10 shadow-xl shadow-[#628141]/5">
          <div className="flex justify-between items-center mb-8 border-b border-[#1B211A]/10 pb-6">
            <h3 className="text-2xl font-black text-[#1B211A]">New Recipe</h3>
            <button
              onClick={() => setIsAddingRecipe(false)}
              className="cursor-pointer text-[#1B211A]/50 hover:text-[#1B211A] font-semibold transition"
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleSaveRecipe} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-[#1B211A]/90 mb-2">Recipe Title *</label>
                <input required type="text" name="title" value={recipeData.title} onChange={handleInputChange} placeholder="E.g., Grandma's Mango Pickle" className="w-full rounded-xl border border-[#628141]/20 bg-[#EBD5AB]/20 px-4 py-3 text-[#1B211A] focus:border-[#628141] focus:ring-2 focus:ring-[#628141]/20 outline-none transition placeholder:text-[#1B211A]/40" />
              </div>
              <div>
                <label className="block text-sm font-bold text-[#1B211A]/90 mb-2">Prep/Cook Time</label>
                <input type="text" name="prepTime" value={recipeData.prepTime} onChange={handleInputChange} placeholder="E.g., 45 mins" className="w-full rounded-xl border border-[#628141]/20 bg-[#EBD5AB]/20 px-4 py-3 text-[#1B211A] focus:border-[#628141] focus:ring-2 focus:ring-[#628141]/20 outline-none transition placeholder:text-[#1B211A]/40" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-[#1B211A]/90 mb-2">The Story / Origin</label>
              <input type="text" name="story" value={recipeData.story} onChange={handleInputChange} placeholder="Where did this recipe come from?" className="w-full rounded-xl border border-[#628141]/20 bg-[#EBD5AB]/20 px-4 py-3 text-[#1B211A] focus:border-[#628141] focus:ring-2 focus:ring-[#628141]/20 outline-none transition placeholder:text-[#1B211A]/40" />
            </div>

            <div>
              <label className="block text-sm font-bold text-[#1B211A]/90 mb-3">Ingredients *</label>
              <div className="space-y-4">
                {recipeData.ingredients.map((ingredient, index) => (
                  <div key={index} className="flex flex-col gap-4 p-5 rounded-2xl border border-[#628141]/20 bg-[#EBD5AB]/40">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                      <input required={index === 0} type="text" value={ingredient.name} onChange={(e) => handleIngredientChange(index, "name", e.target.value)} placeholder="Ingredient Name (e.g., Flour)" className="w-full sm:flex-1 rounded-xl border border-[#628141]/20 bg-white px-4 py-2.5 text-[#1B211A] focus:border-[#628141] focus:ring-2 focus:ring-[#628141]/20 outline-none transition placeholder:text-[#1B211A]/40" />
                      <div className="flex items-center gap-3 w-full sm:w-auto">
                        <input required={index === 0} type="text" value={ingredient.quantity} onChange={(e) => handleIngredientChange(index, "quantity", e.target.value)} placeholder="Qty (1/2)" className="flex-1 sm:w-28 rounded-xl border border-[#628141]/20 bg-white px-3 py-2.5 text-center text-[#1B211A] focus:border-[#628141] focus:ring-2 focus:ring-[#628141]/20 outline-none transition placeholder:text-[#1B211A]/40" />
                        {recipeData.ingredients.length > 1 && (
                          <button type="button" onClick={() => removeIngredient(index)} className="cursor-pointer p-2.5 text-[#1B211A]/40 hover:text-[#1B211A] hover:bg-[#1B211A]/10 rounded-xl transition shrink-0" title="Remove ingredient">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {UNIT_OPTIONS.map((unit) => (
                        <label key={unit} className="cursor-pointer relative">
                          <input type="radio" name={`unit-${index}`} value={unit} checked={ingredient.unit === unit} onChange={(e) => handleIngredientChange(index, "unit", e.target.value)} className="peer absolute opacity-0 w-0 h-0" />
                          <span className="inline-block rounded-lg border border-[#628141]/20 bg-white px-3.5 py-1.5 text-xs font-bold text-[#1B211A]/60 transition peer-checked:border-[#628141] peer-checked:bg-[#628141]/10 peer-checked:text-[#628141] hover:bg-[#EBD5AB]/50">{unit}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <button type="button" onClick={addIngredient} className="cursor-pointer mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#628141] hover:text-[#1B211A] transition">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#8BAE66]/30 text-[#628141] text-lg leading-none">+</span> Add another ingredient
              </button>
            </div>

            <div>
              <label className="block text-sm font-bold text-[#1B211A]/90 mb-2">Instructions *</label>
              <textarea required name="instructions" value={recipeData.instructions} onChange={handleInputChange} rows="6" placeholder="Step-by-step instructions..." className="w-full rounded-xl border border-[#628141]/20 bg-[#EBD5AB]/20 px-4 py-3 text-[#1B211A] focus:border-[#628141] focus:ring-2 focus:ring-[#628141]/20 outline-none transition resize-none placeholder:text-[#1B211A]/40"></textarea>
            </div>

            <div className="flex justify-end pt-6 border-t border-[#1B211A]/10">
              <button type="submit" disabled={isSaving} className={`cursor-pointer inline-flex items-center gap-2 rounded-xl px-8 py-3.5 text-sm font-bold text-white shadow-lg transition ${isSaving ? "bg-[#1B211A]/50 cursor-not-allowed" : "bg-[#628141] hover:bg-[#1B211A] hover:scale-[1.02] shadow-[#628141]/30"}`}>
                {isSaving ? "Saving..." : "Save Recipe"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Dashboard;