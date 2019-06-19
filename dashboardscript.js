function activeRed(light) {
        document.getElementById(light).style.backgroundColor = "red";
        document.getElementById(light).style.boxShadow = "0px 0px 70px red";
}

function activeGreen(light) {
        document.getElementById(light).style.backgroundColor = "rgb(51, 255, 51)";
        document.getElementById(light).style.boxShadow = "0px 0px 70px rgb(51, 255, 51)";
}

function openModal(modal) {
        var modal = document.getElementById(modal);
        modal.style.display = "block";

        var span = document.getElementsByClassName("closemodal")[0];
        span.onclick = function() {
                modal.style.display = "none";
        }

        var span1 = document.getElementsByClassName("closemodal")[1];
        span1.onclick = function() {
                activeGreen('light-1');
		            modal.style.display = "none";
        }

        var span2 = document.getElementsByClassName("closemodal")[2];
        span2.onclick = function() {
                modal.style.display = "none";
        }

        var span3 = document.getElementsByClassName("closemodal")[3];
        span3.onclick = function() {
		            activeGreen('light-2');
                modal.style.display = "none";
        }

        var span4 = document.getElementsByClassName("closemodal")[4];
          span4.onclick = function() {
                modal.style.display = "none";
        }

        var span5 = document.getElementsByClassName("closemodal")[5];
        span5.onclick = function() {
		            activeGreen('light-3');
                modal.style.display = "none";
        }

        window.onclick = function(event){
                if(event.target == modal) {
                        modal.style.display = "none";
                }
        }
}

