/*-*-mode:typescript-*-*/
var canvas: any = document.getElementById("gameCanvas");
var ctx = canvas.getContext("2d");

var LASTCLICK = Vector.random();
// How can I write this one with the fat arrow?
canvas.onclick = function updateLastClick(event) {
    var mPos = getMousePos(canvas, event)
    LASTCLICK = new Vector(mPos.x, mPos.y);
};

var getMousePos = (canvas, evt) => {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

/** Functions for the menu making that is to be done.
 */

function openCity(evt, cityName) {
    // Declare all variables
    var tabcontent, tablinks;

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (let i = 0; i < tabcontent.length; i++)
        tabcontent[i].style.display = "none";

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (let i = 0; i < tablinks.length; i++)
        tablinks[i].className = tablinks[i].className.replace(" active", "");

    // Show the current tab, and add an "active" class to the link that opened
    // the tab
    document.getElementById(cityName).style.display = "block";
    evt.currentTarget.className += " active";
}

function initCity(evt, cityName) {
    // Declare all variables
    var i, tabcontent, tablinks;

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");

}
