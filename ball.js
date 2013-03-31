//var gravity = 0.05;
//var mHeight = 100;

var square = function (x) { return x * x; }
function Ball() {
    this.radius = 10 + 10 * Math.random();
    this.x = this.radius + (mWidth - 2 * this.radius) * Math.random();

    this.y = (mHeight - this.radius) * Math.random();
    this.vx = 4 + 8 * Math.random();
    if (Math.random() > 0.5)
        this.vx *= -1;
    this.vy = 6 * (Math.random() - 0.5);
    //the energy, /m, h relative to the top level, without vx
    this.calcE();
    this.color = '#' + (Math.random() * 0xFFFFFF << 0).toString(16);
};

Ball.prototype.calcE = function () {
    /* calculate according to the formula:
    * E = 1/2 m v^2 + m g h
    * and h relative to the top of the page.
    */
    this.E = square(this.vy) / 2 - this.y * gravity;
}

Ball.prototype.setY = function (y) {
    this.y = y;
    this.calcE();
}

Ball.prototype.setVY = function (vy) {
    this.vy = vy;
    this.calcE();
}


Ball.prototype.draw = function (ctx) {
    ctx.fillStyle = this.color;
    ctx.beginPath();

    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.fill();
};

Ball.prototype.move = function () {
    var cc = false;
    if (this.x - this.radius < 0 || this.x + this.radius > mWidth) {
        //Bounce back from side
        this.vx *= -1;
        cc = true;
    }
    if (this.y + this.radius > mHeight && this.vy > 0) {
        //Bounce back from top
        this.vy *= -1;
        this.y = mHeight - this.radius;
        var counter = document.getElementById('jumpCounter');
        counter.innerHTML++;
        if (this.vy > -gravity)
        //it is too slow
            this.vy = (-5 - 25 * Math.random()) * gravity;
        else
            cc = true;
    }
    if (this.y - this.radius < 0 && this.vy < 0) {
        cc = true;
        //Bounce back from botton
        this.vy *= -1;
    }
    if (cc) {
        this.color = '#' + (Math.random() * 0xFFFFFF << 0).toString(16);
    }

    this.vy += gravity;

    this.x += this.vx;

    if (gravity != 0) {
        var Ep = this.E - square(this.vy) / 2;
        this.y = -Ep / gravity;
    } else this.y += this.vy;
};


Ball.prototype.crash = function (other) {
    var distance = Math.sqrt(square(this.x - other.x) + square(this.y - other.y));
    return distance <= this.radius + other.radius;
};
