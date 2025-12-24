import { useState } from 'react';
import { ChevronDown, Plus, Trash2, Edit2, Calendar, Flame, Droplet, Zap } from 'lucide-react';
import "../../styles/nutrition.css"
export default function NutritionPlan() {
  const [activeTab, setActiveTab] = useState('plan');
  const [meals, setMeals] = useState([
    { id: 1, day: 'Lundi', meal: 'Petit-déjeuner', food: 'Œufs & pain complet', calories: 350, protein: 20, carbs: 45, fat: 12 },
    { id: 2, day: 'Lundi', meal: 'Déjeuner', food: 'Poulet & riz brun', calories: 550, protein: 40, carbs: 60, fat: 15 },
    { id: 3, day: 'Lundi', meal: 'Dîner', food: 'Saumon & légumes', calories: 480, protein: 35, carbs: 40, fat: 18 },
  ]);

  const [plans, setPlans] = useState([
    {
      id: 1,
      name: 'Prise de masse',
      duration: '12 semaines',
      meals: 4,
      calories: 3200,
      description: 'Programme intensif pour développer la musculature',
      color: 'from-orange-500 to-red-500'
    },
    {
      id: 2,
      name: 'Perte de poids',
      duration: '8 semaines',
      meals: 3,
      calories: 1800,
      description: 'Programme de définition musculaire',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 3,
      name: 'Maintenance',
      duration: 'Continu',
      meals: 3,
      calories: 2500,
      description: 'Équilibre nutritionnel optimal',
      color: 'from-green-500 to-emerald-500'
    },
  ]);

  const [editingMeal, setEditingMeal] = useState(null);
  const [showMealForm, setShowMealForm] = useState(false);

  const totalCalories = meals.reduce((sum, meal) => sum + meal.calories, 0);
  const totalProtein = meals.reduce((sum, meal) => sum + meal.protein, 0);
  const totalCarbs = meals.reduce((sum, meal) => sum + meal.carbs, 0);
  const totalFat = meals.reduce((sum, meal) => sum + meal.fat, 0);

  const deleteMeal = (id) => {
    setMeals(meals.filter(meal => meal.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
          <span className="text-4xl">🥗</span> Plan Nutritionnel
        </h1>
        <p className="text-gray-400">Gérez votre alimentation et vos plans nutritionnels</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setActiveTab('plan')}
          className={`px-6 py-3 rounded-lg font-semibold transition-all ${
            activeTab === 'plan'
              ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          📋 Plans Nutritionnels
        </button>
        <button
          onClick={() => setActiveTab('daily')}
          className={`px-6 py-3 rounded-lg font-semibold transition-all ${
            activeTab === 'daily'
              ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          📅 Repas Quotidiens
        </button>
      </div>

      {/* Plans Tab */}
      {activeTab === 'plan' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map(plan => (
            <div
              key={plan.id}
              className="group bg-gray-700/50 backdrop-blur border border-gray-600 rounded-2xl p-6 hover:border-blue-500 transition-all hover:shadow-2xl hover:shadow-blue-500/20 cursor-pointer"
            >
              <div className={`bg-gradient-to-r ${plan.color} h-24 rounded-xl mb-4 group-hover:scale-105 transition-transform`}></div>
              
              <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
              <p className="text-gray-400 text-sm mb-4">{plan.description}</p>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-gray-300">
                  <Calendar className="w-5 h-5 text-blue-400" />
                  <span className="text-sm">{plan.duration}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <Flame className="w-5 h-5 text-orange-400" />
                  <span className="text-sm">{plan.calories} kcal/jour</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <Utensils className="w-5 h-5 text-green-400" />
                  <span className="text-sm">{plan.meals} repas/jour</span>
                </div>
              </div>

              <button className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold py-2 rounded-lg transition-all">
                Choisir ce plan
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Daily Meals Tab */}
      {activeTab === 'daily' && (
        <div>
          {/* Macro Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-500/30 rounded-xl p-6 backdrop-blur">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm font-semibold">CALORIES</span>
                <Flame className="w-5 h-5 text-orange-400" />
              </div>
              <p className="text-3xl font-bold text-orange-400">{totalCalories}</p>
              <p className="text-gray-500 text-xs mt-2">Objectif: 2500 kcal</p>
            </div>

            <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-xl p-6 backdrop-blur">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm font-semibold">PROTÉINES</span>
                <Zap className="w-5 h-5 text-blue-400" />
              </div>
              <p className="text-3xl font-bold text-blue-400">{totalProtein}g</p>
              <p className="text-gray-500 text-xs mt-2">Objectif: 150g</p>
            </div>

            <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl p-6 backdrop-blur">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm font-semibold">GLUCIDES</span>
                <Droplet className="w-5 h-5 text-green-400" />
              </div>
              <p className="text-3xl font-bold text-green-400">{totalCarbs}g</p>
              <p className="text-gray-500 text-xs mt-2">Objectif: 300g</p>
            </div>

            <div className="bg-gradient-to-br from-yellow-500/20 to-amber-500/20 border border-yellow-500/30 rounded-xl p-6 backdrop-blur">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm font-semibold">LIPIDES</span>
                <Flame className="w-5 h-5 text-yellow-400" />
              </div>
              <p className="text-3xl font-bold text-yellow-400">{totalFat}g</p>
              <p className="text-gray-500 text-xs mt-2">Objectif: 80g</p>
            </div>
          </div>

          {/* Add Meal Button */}
          <button
            onClick={() => setShowMealForm(!showMealForm)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-semibold rounded-lg mb-6 transition-all"
          >
            <Plus className="w-5 h-5" /> Ajouter un repas
          </button>

          {/* Meals List */}
          <div className="space-y-4">
            {meals.map(meal => (
              <div
                key={meal.id}
                className="bg-gray-700/50 backdrop-blur border border-gray-600 rounded-xl p-6 hover:border-blue-500 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-2xl">🍽️</span>
                      <h3 className="text-xl font-bold text-white">{meal.meal}</h3>
                      <span className="text-gray-400 text-sm">({meal.day})</span>
                    </div>
                    <p className="text-gray-300">{meal.food}</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 rounded-lg transition-all">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteMeal(meal.id)}
                      className="p-2 bg-red-600/20 hover:bg-red-600/40 text-red-400 rounded-lg transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4">
                  <div className="bg-orange-500/10 rounded-lg p-3 text-center">
                    <p className="text-gray-400 text-xs font-semibold mb-1">CALORIES</p>
                    <p className="text-orange-400 font-bold text-lg">{meal.calories}</p>
                  </div>
                  <div className="bg-blue-500/10 rounded-lg p-3 text-center">
                    <p className="text-gray-400 text-xs font-semibold mb-1">PROTÉINES</p>
                    <p className="text-blue-400 font-bold text-lg">{meal.protein}g</p>
                  </div>
                  <div className="bg-green-500/10 rounded-lg p-3 text-center">
                    <p className="text-gray-400 text-xs font-semibold mb-1">GLUCIDES</p>
                    <p className="text-green-400 font-bold text-lg">{meal.carbs}g</p>
                  </div>
                  <div className="bg-yellow-500/10 rounded-lg p-3 text-center">
                    <p className="text-gray-400 text-xs font-semibold mb-1">LIPIDES</p>
                    <p className="text-yellow-400 font-bold text-lg">{meal.fat}g</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Helper component for Utensils icon
function Utensils(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 2v7c0 1.1.9 2 2 2h4c1.1 0 2-.9 2-2V2" />
      <path d="M7 19H4c-1.1 0-2 .9-2 2v1" />
      <path d="M21 2v7c0 1.1-.9 2-2 2h-4c-1.1 0-2-.9-2-2V2" />
      <path d="M17 19h3c1.1 0 2 .9 2 2v1" />
      <path d="M12 2v12" />
      <path d="M12 19h1" />
    </svg>
  );
}