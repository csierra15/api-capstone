'use strict';

const SPOONACULAR_INGREDIENT_SEARCH_URL = "https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/findByIngredients";
const   SPOONACULAR_RECIPE_INFO_URL = "https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/informationBulk";

function getApiData(searchTerm, ids, callback) {
    const headers = {
      "X-Mashape-Key": "JsnpQNRGfymshHh9jahYd6uvMBnap11yi26jsnT4SP8OOkG2Vh",
      Accept: "application/json"};
      
    const searchQuery = {
      ingredients: `${searchTerm}`,
      number: 25
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
                data: ids.join(','),
                headers: headers
          }).done(callback)
        });
        
    console.log('getApiData ran');
}


function renderResults(result) {
  console.log('renderResults ran');
  return `
    <ul>
      <li>
        <img src="${result.image}" alt="Picture of ${result.title}">
        <p>${result.title}</p>
      </li>
    </ul>
    <div class="js-recipie-info">
      <p>by ${result.sourceName}</p>
      <a href="${result.sourceUrl}">See full recipe</a>
    </div>
  `;
}

function displayRecipes(data) {
  console.log('displayRecipes ran');
  const results = data.map((item, index) => renderResults(item));
    $('.js-search-results').html(results);
}

function watchSubmit() {
  console.log('watchSubmit ran');
    $('.js-search-form').submit(event => {
      event.preventDefault();
      const searchTarget = $(event.currentTarget).find('.js-search-bar');
      const search = searchTarget.val();
      searchTarget.val('');
      getApiData(search, displayRecipes);
    });
}

$(watchSubmit);