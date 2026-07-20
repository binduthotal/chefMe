import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { ref, onValue, update } from "firebase/database";

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

  const toggleFavorite = async (e, recipe) => {
    e.stopPropagation();
    if (!user) return;
    try {
      const recipeRef = ref(db, `users/${user.uid}/recipes/${recipe.id}`);
      await update(recipeRef, { isFavorite: !recipe.isFavorite });
      if (selectedRecipe && selectedRecipe.id === recipe.id) {
        setSelectedRecipe({ ...selectedRecipe, isFavorite: !recipe.isFavorite });
      }
    } catch (error) {
      console.error("Error updating favorite status:", error);
    }
  };

  const handleShare = async (e, recipe) => {
    e.stopPropagation();
    const ingredientText = recipe.ingredients?.map(i => `- ${i.quantity} ${i.unit !== 'piece' ? i.unit : ''} ${i.name}`).join('\n');
    const shareText = `*${recipe.title}*\n\nPrep time: ${recipe.prepTime || "N/A"}\n\n*Ingredients:*\n${ingredientText}\n\n*Instructions:*\n${recipe.instructions}\n\nShared via Me Chef`;
    const subject = `Recipe: ${recipe.title}`;

    if (navigator.share) {
      try {
        await navigator.share({ title: subject, text: shareText });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      const shareChoice = window.prompt("Share via:\nType '1' for WhatsApp\nType '2' for Gmail\nType '3' for Default Email", "1");
      if (shareChoice === "1") window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, "_blank");
      else if (shareChoice === "2") window.open(`https://mail.google.com/mail/?view=cm&fs=1&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(shareText)}`, "_blank");
      else if (shareChoice === "3") window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(shareText)}`;
    }
  };

  const displayedRecipes = filterFavorites ? recipes.filter((r) => r.isFavorite) : recipes;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#628141]"></div>
      </div>
    );
  }

  if (displayedRecipes.length === 0) {
    return (
      <div className="text-center py-12 bg-white/60 rounded-3xl border border-[#628141]/20 shadow-sm mt-6 backdrop-blur-sm">
        <span className="text-4xl block mb-4">{filterFavorites ? "⭐" : "📖"}</span>
        <h3 className="text-xl font-bold text-[#1B211A]">
          {filterFavorites ? "No Favorites Yet" : "No Recipes Yet"}
        </h3>
        <p className="text-[#1B211A]/60 mt-2">
          {filterFavorites ? "Tap the heart icon on any recipe to save it here!" : "Head back to the Dashboard to add your first ancestral recipe!"}
        </p>
      </div>
    );
  }

  // --- DETAIL VIEW ---
  if (selectedRecipe) {
    return (
      <div className="mt-6 bg-white rounded-[28px] border border-[#628141]/10 p-6 sm:p-8 shadow-xl shadow-[#628141]/5 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center mb-6">
          <button 
            onClick={() => setSelectedRecipe(null)}
            className="text-[#628141] font-semibold text-sm hover:text-[#1B211A] flex items-center gap-2 transition bg-[#EBD5AB]/30 hover:bg-[#EBD5AB]/60 px-4 py-2 rounded-xl"
          >
            ← Back
          </button>
          <div className="flex gap-2">
            <button onClick={(e) => handleShare(e, selectedRecipe)} className="p-2.5 bg-[#EBD5AB]/30 hover:bg-[#EBD5AB]/60 rounded-xl text-[#628141] transition" title="Share">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path></svg>
            </button>
            <button onClick={(e) => toggleFavorite(e, selectedRecipe)} className="p-2.5 bg-[#EBD5AB]/30 hover:bg-[#EBD5AB]/60 rounded-xl transition" title="Favorite">
              <svg className={`w-5 h-5 ${selectedRecipe.isFavorite ? 'fill-amber-400 text-amber-400' : 'fill-none text-[#628141]/50'}`} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
            </button>
          </div>
        </div>

        <h2 className="text-3xl sm:text-4xl font-black text-[#1B211A] mb-4">{selectedRecipe.title}</h2>
        {selectedRecipe.prepTime && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#8BAE66]/20 text-[#628141] text-sm font-bold mb-6">
            ⏱ {selectedRecipe.prepTime}
          </span>
        )}

        {selectedRecipe.story && (
          <div className="bg-[#EBD5AB]/30 p-5 rounded-2xl border border-[#628141]/10 mb-8">
            <p className="text-[#1B211A]/80 italic leading-relaxed">"{selectedRecipe.story}"</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
          <div className="lg:col-span-1">
            <h3 className="text-xl font-bold text-[#1B211A] mb-4 border-b border-[#1B211A]/10 pb-3">Ingredients</h3>
            <ul className="space-y-3">
              {selectedRecipe.ingredients?.map((ing, idx) => (
                <li key={idx} className="flex items-start gap-3 text-[#1B211A]/80 bg-white p-2 rounded-lg border border-[#628141]/10 shadow-sm">
                  <span className="text-[#8BAE66] mt-0.5 font-bold">•</span>
                  <span>
                    <span className="font-bold text-[#1B211A]">
                      {ing.quantity} {ing.unit !== "piece" ? ing.unit : ""}
                    </span>{" "}
                    {ing.name}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-2">
            <h3 className="text-xl font-bold text-[#1B211A] mb-4 border-b border-[#1B211A]/10 pb-3">Instructions</h3>
            <div className="text-[#1B211A]/80 whitespace-pre-wrap leading-relaxed text-base sm:text-lg">
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
        <div key={recipe.id} className="group flex flex-col bg-white rounded-[24px] border border-[#628141]/20 shadow-sm hover:shadow-xl hover:shadow-[#628141]/10 hover:-translate-y-1 transition-all duration-300 overflow-hidden">
          <div className="p-5 border-b border-[#1B211A]/5 flex-1 relative">
            <div className="absolute top-4 right-4 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 backdrop-blur-sm p-1.5 rounded-xl border border-[#628141]/10 shadow-sm">
              <button onClick={(e) => handleShare(e, recipe)} className="cursor-pointer p-1.5 hover:bg-[#EBD5AB]/50 rounded-lg text-[#628141] transition" title="Share">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path></svg>
              </button>
              <button onClick={(e) => toggleFavorite(e, recipe)} className="cursor-pointer p-1.5 hover:bg-[#EBD5AB]/50 rounded-lg transition" title="Favorite">
                <svg className={`w-4 h-4 ${recipe.isFavorite ? 'fill-amber-400 text-amber-400' : 'fill-none text-[#628141]/50'}`} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
              </button>
            </div>
            {recipe.isFavorite && (
               <span className="absolute top-5 right-5 text-amber-400 text-lg group-hover:hidden transition-opacity">⭐</span>
            )}

            <h3 className="font-bold text-lg text-[#1B211A] line-clamp-2 pr-8">{recipe.title}</h3>
            
            {recipe.prepTime && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 mt-3 rounded-full bg-[#8BAE66]/20 text-[#628141] text-xs font-bold mb-3">
                ⏱ {recipe.prepTime}
              </span>
            )}
            
            {recipe.story && (
              <p className="text-sm text-[#1B211A]/60 line-clamp-2 italic mt-2">
                "{recipe.story}"
              </p>
            )}
          </div>

          <div className="bg-[#EBD5AB]/20 p-4 px-5 flex justify-between items-center text-xs font-bold text-[#1B211A]/60">
            <span>{recipe.ingredients ? recipe.ingredients.length : 0} Ingredients</span>
            <button onClick={() => setSelectedRecipe(recipe)} className="cursor-pointer text-[#628141] hover:text-[#1B211A] transition">
              View Details →
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Recipes;