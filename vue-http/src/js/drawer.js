export default {
    data() {
        return {
            ctx: null, canvas: null, pointsDraw: [], SCALE: 6.1,
            y_min :-5, y_max : 3,
            x_min : -5, x_max : 5,
            fraction : 4
        }
    }, methods: {
        areaCheck: function (x, y, R) {
            if (x >= 0 && y >= 0) {
                return x <= R && y <= R;
            } else if (x <= 0 && y >= 0) {
                return x * x + y * y <= R * R / 4;
            } else if (x <= 0 && y <= 0) {
                return y >= -2 * x - R;
            } else return false;
        }, drawPoint: function (x, y, text, ctx, good = true) {
            if (good) ctx.fillStyle = 'black'; else ctx.fillStyle = 'red'
            ctx.beginPath();
            ctx.arc(x, y, 2, 0, 2 * Math.PI, true);
            ctx.fill();
            ctx.fillText(text, x + 3, y - 6);
        },

        restorePoints: function (R) {

            let zero_x = document.getElementById('graph').offsetWidth / 2;
            let zero_y = document.getElementById('graph').offsetHeight / 2;
            let width = this.canvas.width;
            let height = this.canvas.height;

            for (let i = 0; i < this.pointsDraw.length; i++) {
                let x_pos = this.pointsDraw[i][0]
                let y_pos = this.pointsDraw[i][1]
                //let oldR = this.points[i][2]


                let y_cord = -1 * (y_pos - zero_y), x_cord = (x_pos - zero_x);

                x_cord = x_cord / width * this.SCALE;
                y_cord = y_cord / height * this.SCALE;

                let good = this.areaCheck(x_cord, y_cord, R)

                this.drawPoint(x_pos, y_pos, '', this.ctx, good)
            }

        }, draw: function (R = 1, withPoints = true) {
            this.canvas = document.querySelector('#graph');
            let width = this.canvas.width; //consider as 6.1?
            let height = this.canvas.height;

            //recalculation of R
            R = width * (R / this.SCALE)

            if (!this.canvas.getContext) {
                return;
            }
            this.ctx = this.canvas.getContext('2d');

            this.ctx.fillStyle = 'white';
            this.ctx.fillRect(0, 0, width, height);

            this.ctx.fillStyle = '#b945ee';
            this.ctx.strokeStyle = '#6e00b3';
            this.ctx.font = '12px serif';

            this.ctx.beginPath(); //I
            this.ctx.moveTo(width / 2 - R / 2, height / 2);
            this.ctx.lineTo(width / 2, height / 2);
            this.ctx.lineTo(width / 2, height / 2 - R / 2);
            this.ctx.fill();
            this.ctx.beginPath();
            this.ctx.arc(width / 2, height / 2, R / 2, Math.PI, -Math.PI / 2, false);
            this.ctx.fill();

            this.ctx.fillRect(width / 2, height / 2 - R, R, R); //II

            this.ctx.beginPath(); //IV
            this.ctx.moveTo(width / 2 - R / 2, height / 2);
            this.ctx.lineTo(width / 2, height / 2);
            this.ctx.lineTo(width / 2, height / 2 + R);
            this.ctx.fill();

            this.ctx.strokeStyle = 'black';
            this.ctx.lineWidth = 1.1;

            this.ctx.beginPath();
            this.ctx.moveTo(0, height / 2);
            this.ctx.lineTo(width, height / 2);
            this.ctx.stroke();

            this.ctx.beginPath();
            this.ctx.moveTo(width / 2, 0);
            this.ctx.lineTo(width / 2, height);
            this.ctx.stroke();

            this.drawPoint(width / 2, height / 2 - R, 'R', this.ctx);
            this.drawPoint(width / 2, height / 2 - R / 2, 'R/2', this.ctx);
            this.drawPoint(width / 2, height / 2 + R, '-R', this.ctx);
            this.drawPoint(width / 2, height / 2 + R / 2, '-R/2', this.ctx);
            this.drawPoint(width / 2 + R, height / 2, 'R', this.ctx);
            this.drawPoint(width / 2 + R / 2, height / 2, 'R/2', this.ctx);
            this.drawPoint(width / 2 - R, height / 2, '-R', this.ctx);
            this.drawPoint(width / 2 - R / 2, height / 2, '-R/2', this.ctx);

            if (withPoints) this.restorePoints(R * this.SCALE / width)


        }, restoreCanvas: function (R = 1, withPoints = true) {
            this.canvas = document.querySelector('#graph');
            this.ctx = this.canvas.getContext('2d');
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.draw(R, withPoints);
        }, checkValue: function (value, min, max, positive) {
            value = value.replace(",", ".");
            let ok = (value.search(/^-?\d.?\d{0,5}$/) !== -1 && Number(value) >= min && Number(value) <= max);
            if (positive && value.search("-") !== -1) ok = false;
            return ok;
        },

        processClick: function (e, R) {
            this.canvas = document.querySelector('#graph');
            let width = this.canvas.width;
            let height = this.canvas.height;

            let x_pos = e.pageX - document.getElementById('graph').offsetLeft;
            let y_pos = e.pageY - document.getElementById('graph').offsetTop;
            //console.log("you clicked to cord ", x_pos, y_pos, R);
            let zero_x = document.getElementById('graph').offsetWidth / 2;
            let zero_y = document.getElementById('graph').offsetHeight / 2;

            let y_cord = -1 * (y_pos - zero_y), x_cord = (x_pos - zero_x);
            //console.log("you put point in ", x_cord, y_cord, R);

            //non-rounded coordinates
            x_cord = x_cord / width * this.SCALE;
            y_cord = y_cord / height * this.SCALE;

            //4 digits after point
            let x_val = x_cord.toFixed(this.fraction);
            let y_val = y_cord.toFixed(this.fraction);

            if (!(this.checkValue(x_val, this.x_min, this.x_max, false) && this.checkValue(y_val, this.y_min, this.y_max, false))) {
                //console.log("you clicked to invalid point", x_cord.toFixed(fraction), y_cord.toFixed(fraction));
                return null;
            }

            //draw with non-rounded cords
            let good = this.areaCheck(x_val, y_val, R);
            this.pointsDraw.push([x_pos, y_pos, R, good])
            this.drawPoint(x_pos, y_pos, '', this.ctx, good);
            return [x_val, y_val];

        }

    }
}
