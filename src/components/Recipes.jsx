import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { ref, onValue, update } from "firebase/database"; // Added 'update'

// Added filterFavorites prop (defaults to false)
const Recipes = ({ user, filterFavorites = false }) => {
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  useEffect(() => {
    if (!user) return;

    const recipesRef = ref(db, `users/${user.uid}/recipes`);

    const unsubscribe = onValue(recipesRef, (snapshot) => {
      const data = snapshot.val();
      
      if (data) {
        const recipeArray = Object.values(data).sort((a, b) => b.createdAt - a.createdAt);
        setRecipes(recipeArray);
      } else {
        setRecipes([]);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  // --- NEW: Toggle Favorite Logic ---
  const toggleFavorite = async (e, recipe) => {
    e.stopPropagation(); // Prevents click from bubbling up
    if (!user) return;
    try {
      const recipeRef = ref(db, `users/${user.uid}/recipes/${recipe.id}`);
      await update(recipeRef, { isFavorite: !recipe.isFavorite });
      
      // If we are currently viewing this recipe in detail view, update that state too
      if (selectedRecipe && selectedRecipe.id === recipe.id) {
        setSelectedRecipe({ ...selectedRecipe, isFavorite: !recipe.isFavorite });
      }
    } catch (error) {
      console.error("Error updating favorite status:", error);
    }
  };

  // --- NEW: Share Logic ---
 const handleShare = async (e, recipe) => {
    e.stopPropagation();
    
    // Format the recipe into clean text
    const ingredientText = recipe.ingredients?.map(i => `- ${i.quantity} ${i.unit !== 'piece' ? i.unit : ''} ${i.name}`).join('\n');
    const shareText = `*${recipe.title}*\n\nPrep time: ${recipe.prepTime || "N/A"}\n\n*Ingredients:*\n${ingredientText}\n\n*Instructions:*\n${recipe.instructions}\n\nShared via Me Chef`;
    const subject = `Recipe: ${recipe.title}`;

    // 1. Try Native Web Share API (Perfect for Mobile Android/iOS)
    if (navigator.share) {
      try {
        await navigator.share({
          title: subject,
          text: shareText,
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      // 2. Desktop Fallback: Ask the user which app they prefer
      const shareChoice = window.prompt(
        "Share via:\nType '1' for WhatsApp\nType '2' for Gmail\nType '3' for Default Email", 
        "1"
      );

      if (shareChoice === "1") {
        // Opens WhatsApp Web or the WhatsApp Desktop App
        window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, "_blank");
        
      } else if (shareChoice === "2") {
        // Opens Gmail directly in a new browser tab with subject and body pre-filled
        window.open(`https://mail.google.com/mail/?view=cm&fs=1&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(shareText)}`, "_blank");
        
      } else if (shareChoice === "3") {
        // Opens the system's default email client
        window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(shareText)}`;
      }
    }
  };

  // Apply the filter if we are on the Favorites tab
  const displayedRecipes = filterFavorites 
    ? recipes.filter((r) => r.isFavorite) 
    : recipes;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (displayedRecipes.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-3xl border border-indigo-50 shadow-sm mt-6">
        <span className="text-4xl block mb-4">{filterFavorites ? "⭐" : "📖"}</span>
        <h3 className="text-xl font-bold text-slate-800">
          {filterFavorites ? "No Favorites Yet" : "No Recipes Yet"}
        </h3>
        <p className="text-slate-500 mt-2">
          {filterFavorites 
            ? "Tap the heart icon on any recipe to save it here!" 
            : "Head back to the Dashboard to add your first ancestral recipe!"}
        </p>
      </div>
    );
  }

  // --- DETAIL VIEW ---
  if (selectedRecipe) {
    return (
      <div className="mt-6 bg-white rounded-[28px] border border-indigo-100 p-6 sm:p-8 shadow-sm animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center mb-6">
          <button 
            onClick={() => setSelectedRecipe(null)}
            className="text-indigo-500 font-semibold text-sm hover:text-indigo-700 flex items-center gap-2 transition bg-indigo-50 px-4 py-2 rounded-xl"
          >
            ← Back
          </button>

          {/* Detail View Action Buttons */}
          <div className="flex gap-2">
            <button onClick={(e) => handleShare(e, selectedRecipe)} className="p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl text-slate-600 transition" title="Share">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path></svg>
            </button>
            <button onClick={(e) => toggleFavorite(e, selectedRecipe)} className="p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl transition" title="Favorite">
              <svg className={`w-5 h-5 ${selectedRecipe.isFavorite ? 'fill-yellow-400 text-yellow-400' : 'fill-none text-slate-400'}`} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
            </button>
          </div>
        </div>

        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-4">{selectedRecipe.title}</h2>
        {selectedRecipe.prepTime && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-sm font-semibold mb-6">
            ⏱ {selectedRecipe.prepTime}
          </span>
        )}

        {selectedRecipe.story && (
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 mb-8">
            <p className="text-slate-600 italic leading-relaxed">"{selectedRecipe.story}"</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
          <div className="lg:col-span-1">
            <h3 className="text-xl font-bold text-slate-900 mb-4 border-b border-indigo-50 pb-3">Ingredients</h3>
            <ul className="space-y-3">
              {selectedRecipe.ingredients?.map((ing, idx) => (
                <li key={idx} className="flex items-start gap-3 text-slate-700 bg-white p-2 rounded-lg border border-slate-50 shadow-sm">
                  <span className="text-indigo-400 mt-0.5 font-bold">•</span>
                  <span>
                    <span className="font-bold text-indigo-900">
                      {ing.quantity} {ing.unit !== "piece" ? ing.unit : ""}
                    </span>{" "}
                    {ing.name}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-2">
            <h3 className="text-xl font-bold text-slate-900 mb-4 border-b border-indigo-50 pb-3">Instructions</h3>
            <div className="text-slate-700 whitespace-pre-wrap leading-relaxed text-base sm:text-lg">
              {selectedRecipe.instructions}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- GRID VIEW ---
  return (
    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {displayedRecipes.map((recipe) => (
        <div key={recipe.id} className="group flex flex-col bg-white rounded-[24px] border border-indigo-50 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 hover:border-indigo-100 transition-all duration-300 overflow-hidden">
          <div className="p-5 border-b border-slate-50 flex-1 relative">
            
            {/* Quick Action Buttons (Share & Favorite) */}
            <div className="absolute top-4 right-4 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 backdrop-blur-sm p-1.5 rounded-xl border border-slate-100 shadow-sm">
              <button onClick={(e) => handleShare(e, recipe)} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 transition" title="Share">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path></svg>
              </button>
              <button onClick={(e) => toggleFavorite(e, recipe)} className="p-1.5 hover:bg-slate-100 rounded-lg transition" title="Favorite">
                <svg className={`w-4 h-4 ${recipe.isFavorite ? 'fill-yellow-400 text-yellow-400' : 'fill-none text-slate-400'}`} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
              </button>
            </div>

            {/* Favorite Indicator (Always visible if favorited) */}
            {recipe.isFavorite && (
               <span className="absolute top-5 right-5 text-yellow-400 text-lg group-hover:hidden transition-opacity">⭐</span>
            )}

            <h3 className="font-bold text-lg text-slate-900 line-clamp-2 pr-8">{recipe.title}</h3>
            
            {recipe.prepTime && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 mt-3 rounded-full bg-indigo-50 text-indigo-600 text-xs font-semibold mb-3">
                ⏱ {recipe.prepTime}
              </span>
            )}
            
            {recipe.story && (
              <p className="text-sm text-slate-500 line-clamp-2 italic mt-2">
                "{recipe.story}"
              </p>
            )}
          </div>

          <div className="bg-slate-50/50 p-4 px-5 flex justify-between items-center text-xs font-semibold text-slate-500">
            <span>{recipe.ingredients ? recipe.ingredients.length : 0} Ingredients</span>
            <button onClick={() => setSelectedRecipe(recipe)} className="text-indigo-600 font-bold hover:text-indigo-800 transition">
              View Details →
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Recipes;