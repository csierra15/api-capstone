'use strict';

const SPOONACULAR_INGREDIENT_SEARCH_URL = "https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/findByIngredients";
const SPOONACULAR_RECIPE_INFO_URL = "https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/informationBulk";
let recipes = [];

function getApiData(ingredients, callback) {

  const headers = {
    "X-Mashape-Key": "JsnpQNRGfymshHh9jahYd6uvMBnap11yi26jsnT4SP8OOkG2Vh",
    "X-Mashape-Host": "spoonacular-recipe-food-nutrition-v1.p.mashape.com"
  };

  const searchQuery = {
    ingredients: `${ingredients}`,
    number: 6
  };

  $.ajax({
    method: "GET",
    url: SPOONACULAR_INGREDIENT_SEARCH_URL,
    data: searchQuery,
    beforeSend: () => {$('.loader').show()},
    complete: () => {
      $('.loader').hide()
      $('html, body').animate({
        scrollTop: ($('.recipe-list-title').offset().top)
      },1000);
    },
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
}


function renderRecipeInfo(result) {
  const ingredients = result.extendedIngredients.map(ingredient => `<li>${ingredient.originalString}</li>`).join('');
  const cookingTime = result.cookingMinutes?`<p>Estimated Cooking Time: ${result.cookingMinutes} minutes</p>`:'';

  return `
    <div class="recipe-card" data-id="${result.id}">
      <div class="recipe-src-info">
        <img src="${result.image}" id="recipe-img" alt="Picture of ${result.title}">
        <p id="recipe-name" title="${result.title}">${result.title}</p>
        <div class="more-info">
            ${cookingTime}
            <ul>${ingredients}</ul>
            <div class="close-btn">X</div>
            <a href="${result.sourceUrl}" title="${result.sourceUrl}" target="_blank">See full recipe at ${result.sourceName}</a>
        </div>
      </div>
    </div>`;
}

function displayRecipes(data) {
  $('#recipe-list-title').show();
  $('#top-btn').show();
  $('#help-text').hide();
  const results = data.map((item, index) => renderRecipeInfo(item));
      $('.js-search-results').html(results);
}

function watchSubmitSearch() {
  //hide loader until user submits form
  $('.loader').hide();
  //submit ajax request
  $('.js-search-form').submit(event => {
    event.preventDefault();
    const searchTarget = $(event.currentTarget).find('.js-search-bar');
    const search = searchTarget.val();
    searchTarget.val('');
    getApiData(search, displayRecipes);
  });

  //scrolls
  $('.name').click(() => {
    $('html, body').animate({
      scrollTop: ($('html').offset().top)
    },1000);
  });

  $('#chevron-down').click(() => {
    $('html, body').animate({
      scrollTop: ($('.js-search-results').offset().top)
    },1000);
  });

  //search results

  $('.js-search-results').on('click', function(event){
      let parent = $(event.target).closest('.recipe-card');
      parent.addClass('expanded');
      $('.overlay').show();
  });

  $('.overlay').click(function(event) {
      $('.overlay').hide();
      $('.recipe-card').removeClass('expanded');
  });

  $('.js-search-results').on('click', '.close-btn', function(event) {
      $('.overlay').hide();
      $('.recipe-card').removeClass('expanded');
      event.stopPropagation();
  });

    return false;
}

$(watchSubmitSearch);
