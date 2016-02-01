var pointsElements = document.getElementsByClassName('point');

function forEach(aFunction, aArray) {
    for(i = 0; i < aArray.length; i++) {
        console.log("This is my " + i + " ")
        aFunction(i);
    }
}

function showPoints(aIndex) {   
   console.log(pointsElements[aIndex])
}

forEach(showPoints, pointsElements);

    
    

        




