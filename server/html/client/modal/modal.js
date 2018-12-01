'use strict';

var MODAL = function()
{

	// Get the modal
	var modal = document.getElementById('myModal');


	// Get the <span> element that closes the modal
	var closeButton = document.getElementsByClassName("close")[0];

	// When the user clicks on <span> (x), close the modal
	closeButton.onclick = function() {
	    modal.style.display = "none";
	}

	var pathTutoImg = "medias/tuto/";
	if (IS_MOBILE == false)
		var allTutoImg = ["desktop_01.jpg", "desktop_02.jpg", "desktop_03.jpg"];
	else
		var allTutoImg = ["mobile_01.jpg", "mobile_02.jpg", "mobile_03.jpg"];
	var leftArrowTuto = document.getElementById("left_arrow_tuto");
	var rightArrowTuto = document.getElementById("right_arrow_tuto");
	var tutoImg = document.getElementById("tuto_img");
	var tutoDotContainer = document.getElementById("tuto_dot_container");

	var i = 0;

	(function()
	{
		tutoImg.src = pathTutoImg + allTutoImg[0];
		for (let i = 0; i < allTutoImg.length; i++)
		{
			tutoDotContainer.appendChild(document.createElement("li"));
		}
		leftArrowTuto.style.display = "none";
	}());

	leftArrowTuto.addEventListener("mousedown", function(e)
	{
		if (i > 0)
		{
			tutoDotContainer.children[i].style.backgroundColor = "#9a9aea";
			i--;
			tutoImg.src = pathTutoImg + allTutoImg[i];
			if (i == 0)
				leftArrowTuto.style.display = "none";
			rightArrowTuto.style.display = "";
			tutoDotContainer.children[i].style.backgroundColor = "blue";
		}
	}, false);

	rightArrowTuto.addEventListener("mousedown", function()
	{
		if (i < allTutoImg.length - 1)
		{
			tutoDotContainer.children[i].style.backgroundColor = "#9a9aea";
			i++;
			tutoImg.src = pathTutoImg + allTutoImg[i];
			if (i == allTutoImg.length - 1)
				rightArrowTuto.style.display = "none";
			leftArrowTuto.style.display = "";
			tutoDotContainer.children[i].style.backgroundColor = "blue";
		}
	});

}
