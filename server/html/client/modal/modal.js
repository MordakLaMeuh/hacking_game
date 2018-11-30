// Get the modal
var modal = document.getElementById('myModal');


// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "none";
}

var path = "medias/tuto/";
var allTutoImg = ["macaron.jpg", "fb.jpg", "ft.jpg"];
var left_arrow = document.getElementById("left_arrow_tuto");
var right_arrow = document.getElementById("right_arrow_tuto");
var tutoImg = document.getElementById("tuto_img");
var i = 0;

left_arrow.addEventListener("mousedown", function(e){
	if (i > 0)
	{
		i--;
		tutoImg.src = path + allTutoImg[i];
	}
}, false);

right_arrow.addEventListener("mousedown", function()
{
	if (i < allTutoImg.length - 1)
	{
		i++;
		tutoImg.src = path + allTutoImg[i];
	}
});
