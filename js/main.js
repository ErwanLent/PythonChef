
/*=====================================================================================
	Loading Animation
=======================================================================================*/

// Start loading animation
$('html').addClass('hide-overflow');
NProgress.start();
NProgress.set(0.3);
setTimeout(function() 
	{
		location.href = "#cooking";
	}, 600);
NProgress.set(0.6);

/*=====================================================================================
	Page Logic
=======================================================================================*/

var addIngredientContent;
var isRecipeProposed = false;

// Page loaded - show content
$(document).ready(function() 
{
	showContent();

	$('#discover').on('click', 
		function()
		{
			scroll('.dishes');
		}
	);

	// Add another ingredient input box
	addIngredientContent = $('#ingredient-input')[0].outerHTML;;
	$('#add-ingredient.active').click(addIngredient);

	// Submit propose recipe form
	$('#propose-recipe').submit(
		function(event)
		{
			event.preventDefault();
			proposeRecipe();
		});

	$('#error').click(proposeRecipe);

	var recipeButton;
	$('.info').click(
		function()
		{
			recipeButton = $(this);
		});

/*=====================================================================================
	Lightbox Logic
=======================================================================================*/


	$('#propose').magnificPopup(
	{
		type: 'inline',
		preloader: false,
		focus: '#name',
		fixedContentPos: false,
		fixedBgPos: true,
		overflowY: 'auto',
		closeBtnInside: true,
		midClick: true,
		removalDelay: 300,
		mainClass: 'my-mfp-zoom-in',
		// When elemened is focused, some mobile browsers (ie: chrome in android) in some cases zoom in
		callbacks: {
			beforeOpen: 
			function() 
			{
				if($(window).width() < 700) 
				{
					this.st.focus = false;
				} 
				else 
				{
					this.st.focus = '#name';
				}
			},
			close:
			function()
			{
				if (isRecipeProposed)
					scroll(".proposals");
			}
		}
	});

	$('.info').magnificPopup(
	{
		type: 'inline',
		preloader: true,
		fixedContentPos: false,
		fixedBgPos: true,
		overflowY: 'auto',
		closeBtnInside: true,
		preloader: true,
		midClick: true,
		removalDelay: 300,
		mainClass: 'my-mfp-zoom-in',
		callbacks: 
		{
			beforeOpen: 
			function()
			{
				var recipeName = $(recipeButton).attr("name");
				$("#view-recipe h1" ).html(recipeName);

			},
			open: 
			function() 
			{
				
			}
		}
	});


});

/*=====================================================================================
	Functions
=======================================================================================*/

function showContent()
{
	setTimeout(function() {
		$('html').removeClass('hide-overflow');
	    NProgress.done();
	    $(".cooking").removeClass('turn-animation');

	    location.href = "#";
	    $("#loader").fadeOut();

    }, 3000);
}

function scroll(anchorName)
{
	$('html, body').stop().animate(
	 {
        scrollTop: $(anchorName).offset().top
     }, 2000, 'easeInSine');
}

function addIngredient()
{
	$('#add-ingredient.active').remove();
	$("#ingredients").append($(addIngredientContent).fadeIn('slow'));
	$('#ingredients #ingredient-input #add-ingredient').addClass('active');
	$('#add-ingredient.active').click(addIngredient);
}

function proposeRecipe()
{
	if($('#propose-recipe').valid()) 
	{
		$("#propose-recipe fieldset").slideToggle('slow').promise().done(
			function()
			{
				var name = $("#propose-recipe #name").val();
				var recipeName = $("#propose-recipe #recipe-name").val();
				var instructions = $("#propose-recipe #instructions").val();

				// Get all ingredients
				var ingredients = new Array();
				var ingredientSelectors = $("#propose-recipe #ingredients :input");
				for (var i = ingredientSelectors.length - 1; i >= 0; i--) 
				{
					var ingredient = $(ingredientSelectors[i]).val();
					if (ingredient.length)
						ingredients.push(ingredient);
				};

				$.post('propose.py', {'name': name, 'recipe_name': recipeName, 'ingredients': ingredients.join(","), 'instructions': instructions}).done(
					function(response)
					{
						if(response.indexOf('TRUE') != -1)
						{
							$("#propose-recipe #description").html("Thank you for submitting your recipe. It has been successfully received and will be reviewed by the Py Chef.");
							$("#propose-recipe ul").remove();
							$("#propose-recipe fieldset").slideToggle();
							isRecipeProposed = true;
						}
						else
						{
							$("#propose-recipe #description").html("An error occurred while trying to submit the data. Please click the button below to try again.");
							$("#propose-recipe ul").hide();
							$("#error").show();
							$("#propose-recipe fieldset").slideToggle();
						}
					});
			});
	}
}