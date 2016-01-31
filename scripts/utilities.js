var pointsElements = document.getElementsByClassName('point');

function forEach(aFunction) {
    for(i = 0; i < pointsElements.length; i++) {
    console.log("This is my " + i + " ")
    aFunction();
    }
}

function aFunction() {
   console.log(pointsElements[i].innerText)
}

forEach(aFunction);

    
    

        




