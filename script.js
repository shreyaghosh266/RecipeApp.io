// Accessing elements
const searchBox = document.querySelector('.searchBox');
const searchBtn = document.querySelector('.searchBtn');
const recipeContainer = document.querySelector('.recipe-container');
const recipeDetailsContent = document.querySelector('.recipe-details-content');
const recipeCloseBtn = document.querySelector('.recipe-close-btn');

// Function to fetch recipes
const fetchRecipes = async (query) => {
    recipeContainer.innerHTML = "<h2>Fetching Recipes...</h2>";
    try {
        const data = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
        const response = await data.json();
        recipeContainer.innerHTML = "";
        if (response.meals) {
            response.meals.forEach(meal => {
                const recipeDiv = document.createElement('div');
                recipeDiv.classList.add('recipe');
                recipeDiv.innerHTML = `
                    <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                    <h3>${meal.strMeal}</h3>
                    <p><span>${meal.strArea}</span> Dish</p>
                    <p>Belongs to <span>${meal.strCategory}</span></p>
                `;
                const button = document.createElement('button');
                button.textContent = "View Recipe";
                recipeDiv.appendChild(button);
                button.addEventListener('click', () => {
                    openRecipePopup(meal);
                });
                recipeContainer.appendChild(recipeDiv);
            });
        } else {
            recipeContainer.innerHTML = "<h2>No recipes found.</h2>";
        }
    } catch (error) {
        recipeContainer.innerHTML = "<h2>Error in Fetching Recipes...</h2>";
    }
};

// Function to fetch ingredients and measurements
const fetchIngredients = (meal) => {
    let ingredientsList = "";
    for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        const measure = meal[`strMeasure${i}`];
        if (ingredient && measure) {
            ingredientsList += `<li>${measure} ${ingredient}</li>`;
        } else if (ingredient) {
            ingredientsList += `<li>${ingredient}</li>`;
        } else {
            break;
        }
    }
    return ingredientsList;
};

// Function to display recipe details
const openRecipePopup = (meal) => {
    recipeDetailsContent.innerHTML = `
        <h2 class="recipeName">${meal.strMeal}</h2>
        <h3>Ingredients:</h3>
        <ul class="ingredientList">${fetchIngredients(meal)}</ul>
        <div>
            <h3>Instructions:</h3>
            <p class="recipeInstructions">${meal.strInstructions}</p>
        </div>
    `;
    recipeDetailsContent.parentElement.style.display = "block";
};

// Event listener to close the recipe popup
recipeCloseBtn.addEventListener('click', () => {
    recipeDetailsContent.parentElement.style.display = "none";
});

// Event listener for the search button
searchBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const searchInput = searchBox.value.trim();
    if (!searchInput) {
        recipeContainer.innerHTML = `<h2>Type the meal in the search box.</h2>`;
        return;
    }
    fetchRecipes(searchInput);
});
