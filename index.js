const SPOONACULAR_INGREDIENT_SEARCH_URL = "https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/findByIngredients"

function getApiData(searchTerm, callback) {
    const searchQuery = {
        "X-Mashape-Key": "BBoWkCTDGBmshCZoX3ZR3kLWD1c7p11PDxljsnGpErhBJzHGm7",
        accept: application/json,
        ingredients: `${searchTerm}`,
        number: 25
    };
    $.getJSON(SPOONACULAR_INGREDIENT_SEARCH_URL,searchQuery, callback);
}

function renderResults(result) {
    return ''
};

function displayRecipes(data) {

};

function watchSubmit() {

};