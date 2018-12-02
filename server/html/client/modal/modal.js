'use strict';

var MODAL = function()
{

	// Get the modal
	var modal = document.getElementById('myModal');


	// Get the <span> element that closes the modal
	var closeButton = document.getElementsByClassName("close")[0];

	// When the user clicks on <span> (x), close the modal
	closeButton.addEventListener("mousedown", function()
	{
	    modal.style.display = "none";
	}, false);

	var pathTutoImg = "medias/tuto/";
	if (IS_MOBILE == false)
		var allTutoImg = ["desktop_01.jpg", "desktop_02.jpg", "desktop_03.jpg"];
	else
		var allTutoImg = ["mobile_01.jpg", "mobile_02.jpg", "mobile_03.jpg"];
	var leftArrowTuto = document.getElementById("left_arrow_tuto");
	var rightArrowTuto = document.getElementById("right_arrow_tuto");
	var okButtonTuto = document.getElementById("ok_button_tuto");
	var tutoImg = document.getElementById("tuto_img");
	var tutoDotContainer = document.getElementById("tuto_dot_container");
	var activeColorDot = "blue";
	var nonActiveColorDot = "#9a9aea";

	var idx = 0;

	(function()
	{
		tutoImg.src = pathTutoImg + allTutoImg[0];
		for (let i = 0; i < allTutoImg.length; i++)
		{
			tutoDotContainer.appendChild(document.createElement("li"));
		}
		leftArrowTuto.style.display = "none";
	}());

	okButtonTuto.addEventListener("mousedown", function()
	{
		modal.style.display = "none";
	}, false);

	leftArrowTuto.addEventListener("mousedown", function()
	{
		if (idx > 0)
		{
			tutoDotContainer.children[idx].style.backgroundColor = nonActiveColorDot;
			idx--;
			tutoImg.src = pathTutoImg + allTutoImg[idx];
			if (idx == 0)
				leftArrowTuto.style.display = "none";
			rightArrowTuto.style.display = "";
			okButtonTuto.style.display = "none";
			tutoDotContainer.children[idx].style.backgroundColor = activeColorDot;
		}
	}, false);

	rightArrowTuto.addEventListener("mousedown", function()
	{
		if (idx < allTutoImg.length - 1)
		{
			tutoDotContainer.children[idx].style.backgroundColor = nonActiveColorDot;
			idx++;
			tutoImg.src = pathTutoImg + allTutoImg[idx];
			if (idx == allTutoImg.length - 1)
			{
				rightArrowTuto.style.display = "none";
				okButtonTuto.style.display = "flex";
			}
			leftArrowTuto.style.display = "";
			tutoDotContainer.children[idx].style.backgroundColor = activeColorDot;
		}
	}, false);

}
