'use strict';

const SPOONACULAR_INGREDIENT_SEARCH_URL = "https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/findByIngredients";
const SPOONACULAR_RECIPE_INFO_URL = "https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/informationBulk";

let recipes = [];

function getApiData(searchTerm, callback) {
    const headers = {
      "X-Mashape-Key": "JsnpQNRGfymshHh9jahYd6uvMBnap11yi26jsnT4SP8OOkG2Vh",
      Accept: "application/json"};
      
    const searchQuery = {
      ingredients: `${searchTerm}`,
      number: 5
    };

    $.ajax({
        method: "GET",
        url: SPOONACULAR_INGREDIENT_SEARCH_URL,
        data: searchQuery,
        headers: headers
    }).done(function(data){
        let ids = data.map(r => r.id);
        $.ajax({
            method: "GET",
            url: SPOONACULAR_RECIPE_INFO_URL,
            data: {ids:ids.join(',')},
            headers: headers
        }).done(function(data) {
            console.log(recipes);
            recipes = data;
            callback(data);
        });
    });

    console.log('getApiData ran');
}


function renderRecipeInfo(result) {
  console.log('renderRecipeInfo ran');
  return `
    <div class="recipe" data-id="${result.id}">
        <div>
            <img src="${result.image}" alt="Picture of ${result.title}">
            <p>${result.title}</p>
            <p>by ${result.sourceName}</p>
            <a href="${result.sourceUrl}" target="_blank">See full recipe</a>
        </div>
        <div class="js-more-recipe-info">
          <p>${result.extendedIngredients.originalString}</p>
          <button type="submit" class="exit-popup">x</button>
        </div>
    </div>`;
}

function displayRecipes(data) {
  console.log('displayRecipes ran');
  const results = data.map((item, index) => renderRecipeInfo(item));
    $('.js-search-results').html(results);
}

function watchSubmitSearch() {
  console.log('watchSubmitSearch ran');
    $('.js-search-form').submit(event => {
      event.preventDefault();
      const searchTarget = $(event.currentTarget).find('.js-search-bar');
      const search = searchTarget.val();
      searchTarget.val('');
      getApiData(search, displayRecipes);
    });

    $('.js-search-results').on('click', 'img', event => {
        let id = $(event.target).closest('.recipe').data('id');
        let recipe = recipes.find(r => r.id == id);
        
        $('.js-more-recipe-info').show();
          $('.exit-popup').on('click', event => {
            $('.js-more-recipe-info').hide();
          });
        //console.log(recipe);
    });
}

$(watchSubmitSearch);