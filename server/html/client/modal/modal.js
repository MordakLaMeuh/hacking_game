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

	let tutoImgGroup = document.getElementById("imgList");
	var images = tutoImgGroup.getElementsByTagName("img");

	var leftArrowTuto = document.getElementById("left_arrow_tuto");
	var rightArrowTuto = document.getElementById("right_arrow_tuto");
	var okButtonTuto = document.getElementById("ok_button_tuto");
	var tutoImg = document.getElementById("tuto_img");
	var tutoDotContainer = document.getElementById("tuto_dot_container");
	var activeColorDot = "#4a7fa4";
	var nonActiveColorDot = "#8ea2b1";

	var idx = 0;

	(function()
	{
		for (let i = 0; i < images.length; i++)
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

			for (let i = 0; i < images.length; i++) {
				if (i == idx)
					images[i].classList.remove("hiddenImg");
				else
					images[i].classList.add("hiddenImg");
			}
			if (idx == 0)
				leftArrowTuto.style.display = "none";
			rightArrowTuto.style.display = "";
			okButtonTuto.style.display = "none";
			tutoDotContainer.children[idx].style.backgroundColor = activeColorDot;
		}
	}, false);

	rightArrowTuto.addEventListener("mousedown", function()
	{
		if (idx < images.length - 1)
		{
			tutoDotContainer.children[idx].style.backgroundColor = nonActiveColorDot;
			idx++;

			for (let i = 0; i < images.length; i++) {
				if (i == idx)
					images[i].classList.remove("hiddenImg");
				else
					images[i].classList.add("hiddenImg");
			}

			if (idx == images.length - 1)
			{
				rightArrowTuto.style.display = "none";
				okButtonTuto.style.display = "flex";
			}
			leftArrowTuto.style.display = "";
			tutoDotContainer.children[idx].style.backgroundColor = activeColorDot;
		}
	}, false);
}
