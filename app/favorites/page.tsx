import React from "react";

export default function FavoritesPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-paradisePink via-paradiseGold to-paradiseWhite p-4">
      <div className="bg-white bg-opacity-80 rounded-xl shadow-lg p-8 max-w-xl w-full text-center">
        <h1 className="text-3xl font-bold text-paradisePink mb-4">Your Favorites</h1>
        <p className="text-lg text-paradiseBlack">You haven't added any favorites yet. Start exploring and add items to your favorites!</p>
      </div>
    </div>
  );
} 