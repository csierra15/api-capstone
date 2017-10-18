'use strict';

const SPOONACULAR_INGREDIENT_SEARCH_URL = "https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/findByIngredients";
const SPOONACULAR_RECIPE_INFO_URL = "https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/informationBulk";
let recipes = [];

function getApiData(ingredients, callback) {
  const headers = {
    "X-Mashape-Key": "JsnpQNRGfymshHh9jahYd6uvMBnap11yi26jsnT4SP8OOkG2Vh",
    Accept: "application/json"};
      
  const searchQuery = {
    ingredients: `${ingredients}`,
    number: 6
  };

  $.ajax({
    method: "GET",
    url: SPOONACULAR_INGREDIENT_SEARCH_URL,
    data: searchQuery,
    headers: headers
  }).done(function(data){
      let ids = data.map(r => r.id);
      if(ids.length){
        $.ajax({
            method: "GET",
            url: SPOONACULAR_RECIPE_INFO_URL,
            data: {ids:ids.join(',')},
            headers: headers
            }).done(function(data) {
                recipes = data;
                callback(data);
                for(var i = 0; i < recipes.length; i++) {
                  var obj = recipes[i];

                    console.log(obj.extendedIngredients);
}
            }).fail(function(){
              alert("Whoops! We couldn't get those results :(");
            });}else{
                console.log("no results");
                alert("Hmmm... We couldn't find any recipes with those terms. Check your spelling or try searching for something else.");
            }
  }).fail(function(){
        alert("Hmmm... We couldn't find any recipes with those terms. Check your spelling or try searching for something else.");
      });

    console.log('getApiData ran');
}


function renderRecipeInfo(result) {
  console.log('renderRecipeInfo ran');
  return `
    <div class="recipe-card" data-id="${result.id}">
      <div class="recipe-src-info">
        <img src="${result.image}" id="recipe-img" alt="Picture of ${result.title}">
        <p id="recipe-name" title="${result.title}">${result.title}</p>
        <div class="more-info">
            <p>Estimated Cooking Time: ${result.cookingMinutes} minutes</p>

        </div>
        <a href="${result.sourceUrl}" title="${result.sourceUrl}" target="_blank">See full recipe at ${result.sourceName}</a>
      </div>
    </div>`;
}


function displayRecipes(data) {
    $('#recipe-list').show();
    $('#top-btn').show();
    $('#help-text').hide();
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


    $('.js-search-results').on('click', function(event){
        let parent = $(event.target).closest('.recipe-card');
        parent.addClass('expanded');
        $('.overlay').show();
        $('.more-info').show();
    });

    $('.overlay').click(function(event) {
        $('.overlay').hide();
        $('.recipe-card').removeClass('expanded');
        $('.more-info').hide();
    });

    $('#top-btn').click(function(event) {
        event.preventDefault();
	    $('main').animate({scrollTop: 0}, 'fast', function(){
            $('.background-img').animate({scrollTop: 0}, 'fast');
                $('html').animate({scrollTop: 0}, 'fast');
        });
      });

      return false;
}

$(watchSubmitSearch);