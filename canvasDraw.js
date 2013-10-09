
var drawBall = function(ctx, x, y, radius, color)
{
	ctx.beginPath();
	ctx.arc(x,y,radius,0,2*Math.PI);
	ctx.stroke();
	ctx.fillStyle = color;
	ctx.fill();
}
var randomColor = function(number)
{
	var color = ['red', 'blue', 'green', 'black', 'yellow'];
	return color[number];
}

function checkBallToBallCollsion(ball1, ball2)
{
	var xDiffCenterPos = Math.abs(ball1.x - ball2.x);
    var yDiffCenterPos = Math.abs(ball1.y - ball2.y);
    var sumRadius = ball1.radius + ball2.radius;
    var radiusSqr = sumRadius * sumRadius;
    var distanceSqr = (xDiffCenterPos * xDiffCenterPos) + (yDiffCenterPos * yDiffCenterPos);
    // if the distance square is smaller than radius sqr than they are colliding
    if(distanceSqr < radiusSqr) 
    {
    	// change the pos of intersecting balls
    	var diff = Math.sqrt(radiusSqr) - Math.sqrt(distanceSqr);
    	ball1.x = ball1.x + (diff * Math.cos(Math.atan2(ball1.y-ball2.y, ball1.x - ball2.x)));
    	ball1.y = ball1.y + (diff * Math.sin(Math.atan2(ball1.y-ball2.y, ball1.x - ball2.x)));
     	return true;
	}
	return false;
}

function calculateBallsNewValue(ball1, ball2)
{
	var theta = (ball1.y - ball2.y, ball1.x - ball2.x);
    var gammaB1 = Math.atan2(ball1.dy, ball1.dx);
    var gammaB2 = Math.atan2(ball2.dy, ball2.dx);
    var v1 = Math.sqrt((ball1.dx * ball1.dx) + (ball1.dy * ball1.dy));
    var v2 = Math.sqrt((ball2.dx * ball2.dx) + (ball2.dy * ball2.dy));
    // derive the new x/y velocity in the rotated coordinate systems
    var v1x = v1 * Math.cos(gammaB1 - theta);
    var v1y = v1 * Math.sin(gammaB1 - theta);
    var v2x = v2 * Math.cos(gammaB2 - theta);
    var v2y = v2 * Math.sin(gammaB2 - theta);

    // derive the final x velocity of each ball
    var final1x = (((ball1.mass - ball2.mass) * v1x) + ((ball2.mass + ball2.mass) * v2x)) / (ball1.mass + ball2.mass);
    var final2x = (((ball1.mass + ball1.mass) * v1x) + ((ball2.mass - ball1.mass) * v2x)) / (ball1.mass + ball2.mass);
    // set the new values of the velocity
 	ball1.dx = (Math.cos(theta) * final1x) + (Math.cos(theta + Math.PI/2) * v1y);
    ball1.dy = (Math.sin(theta) * final1x) + (Math.sin(theta + Math.PI/2) * v1y);
    ball2.dx = (Math.cos(theta) * final2x) + (Math.cos(theta + Math.PI/2) * v2y);
    ball2.dy = (Math.sin(theta) * final2x) + (Math.sin(theta + Math.PI/2) * v2y);
}

function Ball(x, y, radius, dx, dy, color)
{
	this.x = x;
	this.y = y;
	this.radius = radius;
	this.dx = dx;
	this.dy = dy;
	this.mass = radius;
	this.color = color;
}

function draw(balls) {
	var friction = 0.001;
	var canvas = document.getElementById('myCanvas');
	var context = canvas.getContext("2d");
	context.clearRect(0,0,canvas.width, canvas.height);
	for(var i = 0; i < balls.length; i++)
	{
		balls[i].dx = (balls[i].dx > 0) ? balls[i].dx - friction : balls[i].dx + friction;
    	balls[i].dy = (balls[i].dy > 0) ? balls[i].dy - friction : balls[i].dy + friction;
		detectEdges(canvas, balls[i]);
		for(var j = i + 1; j < balls.length; j++)
		{
			if(checkBallToBallCollsion(balls[i], balls[j]))
				calculateBallsNewValue(balls[i], balls[j]);
		}
		balls[i].x += balls[i].dx;
		balls[i].y += balls[i].dy;
		// console.log("The ball " + i + " has " + balls[i].dx + " " + balls[i].dy)
		drawBall(context, balls[i].x, balls[i].y, balls[i].radius, balls[i].color);

	}

}

function detectEdges(canvas, ball) {
	if(ball.x - ball.radius < 0)
	{
		ball.dx *= -1;
		ball.x = ball.radius;
	}
	else if(ball.x + ball.radius > canvas.width)
	{
		ball.dx *= -1;
		ball.x = canvas.width - ball.radius;
	}
	if(ball.y - ball.radius < 0)
	{
		ball.dy *= -1;
		ball.y = ball.radius;
	}
	else if(ball.y + ball.radius > canvas.height)
	{
		ball.dy *= -1;
		ball.y = canvas.height - ball.radius;
	}
}


$(document).ready(function(){
	var canvas = document.getElementById('myCanvas');
	var balls = [];
	canvas.addEventListener("mousedown", function(evt){
		var test = document.getElementById('test');
		var colorRand = randomColor(Math.floor((Math.random() * 5)));
		balls.push(new Ball(evt.offsetX, evt.offsetY, Math.floor((Math.random() * 30) + 15), Math.floor((Math.random() * 8) -4), Math.floor((Math.random() * 8) - 4), colorRand));
		var timer = setInterval(function(){draw(balls)}, 10);
	});
	
});