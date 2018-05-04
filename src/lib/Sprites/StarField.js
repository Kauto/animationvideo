import ifNull from '../../func/ifnull';
import calc from '../../func/calc';
import Rect from './Rect';
// Sprite
// Draw a Circle
export default class StarField extends Rect {
	constructor( params ) {
		super( params );
		this.count = ifNull( calc( params.count ), 40 );
		this.moveX = ifNull( calc( params.moveX ), 0 );
		this.moveY = ifNull( calc( params.moveY ), 0 );
		this.moveZ = ifNull( calc( params.moveZ ), 0 );
		if ( this.width && this.height ) {
			this.init();
		}
	}

	init() {
		this.centerX = Math.floor( (this.width - this.x) / 2 ) + this.x;
		this.centerY = Math.floor( (this.height - this.y) / 2 ) + this.y;
		this.scaleZ = Math.max( this.width, this.height );
		this.starsX = new Array( this.count );
		this.starsY = new Array( this.count );
		this.starsZ = new Array( this.count );
		this.starsOldX = new Array( this.count );
		this.starsOldY = new Array( this.count );
		this.starsNewX = new Array( this.count );
		this.starsNewY = new Array( this.count );
		this.starsEnabled = new Array( this.count );
		this.starsLineWidth = new Array( this.count );
		for ( let i = 0; i < this.count; i++ ) {
			this.starsX[ i ] = Math.random() * this.width - this.centerX;
			this.starsY[ i ] = Math.random() * this.height - this.centerY;
			this.starsZ[ i ] = Math.random() * this.scaleZ;
		}
	}

	moveStar( i, scaled_timepassed, firstPass ) {
		if ( firstPass ) {
			this.starsEnabled[ i ] = true;
		}
		let
			x = this.starsX[ i ] + this.moveX * scaled_timepassed,
			y = this.starsY[ i ] + this.moveY * scaled_timepassed,
			z = this.starsZ[ i ] + this.moveZ * scaled_timepassed;
		if ( x < -this.centerX ) {
			x += this.width;
			y = Math.random() * this.height - this.centerY;
			this.starsEnabled[ i ] = false;
		} else {
			while ( x > this.width - this.centerX ) {
				x -= this.width;
				y = Math.random() * this.height - this.centerY;
				this.starsEnabled[ i ] = false;
			}
		}
		if ( y < -this.centerY ) {
			y += this.height;
			x = Math.random() * this.width - this.centerX;
			this.starsEnabled[ i ] = false;
		} else {
			while ( y > this.height - this.centerY ) {
				y -= this.height;
				x = Math.random() * this.width - this.centerX;
				this.starsEnabled[ i ] = false;
			}
		}
		if ( z <= 0 ) {
			z += this.scaleZ;
			x = Math.random() * this.width - this.centerX;
			y = Math.random() * this.height - this.centerY;
			this.starsEnabled[ i ] = false;
		} else {
			while ( z > this.scaleZ ) {
				z -= this.scaleZ;
				x = Math.random() * this.width - this.centerX;
				y = Math.random() * this.height - this.centerY;
				this.starsEnabled[ i ] = false;
			}
		}
		var projectX = ~~(this.centerX + (x / z) * this.scaleZ),
			projectY = ~~(this.centerY + (y / z) * this.scaleZ / 2);
		this.starsEnabled[ i ] = this.starsEnabled[ i ] && projectX >= this.x && projectY >= this.y && projectX < this.width && projectY < this.height;
		if ( firstPass ) {
			this.starsX[ i ] = x;
			this.starsY[ i ] = y;
			this.starsZ[ i ] = z;
			this.starsNewX[ i ] = projectX;
			this.starsNewY[ i ] = projectY;
		} else {
			this.starsOldX[ i ] = projectX;
			this.starsOldY[ i ] = projectY;
			this.starsLineWidth[ i ] = Math.round( (1 - this.starsZ[ i ] / this.scaleZ) * 2 + 1 );
		}
	}

	animate( timepassed ) {
		let ret = super.animate( timepassed );
		if ( this.enabled && this.width && this.height ) {
			let i = this.count;
			while ( i-- ) {
				this.moveStar( i, timepassed / 16, true );
				if ( this.starsEnabled[ i ] ) {
					this.moveStar( i, -3, false );
				}
			}
		}
		return ret;
	}

	// Draw-Funktion
	draw( context, additionalModifier ) {
		if ( this.enabled ) {
			if ( !this.width || !this.height ) {
				this.width = this.width || context.canvas.width;
				this.height = this.height || context.canvas.height;
				this.init();
				return;
			}
			let a = this.a;
			if ( additionalModifier ) {
				a *= additionalModifier.a;
			}
			context.globalCompositeOperation = this.alphaMode;
			context.globalAlpha = a;
			if ( this.moveY == 0 && this.moveZ == 0 && this.moveX < 0 ) {
				context.fillStyle = this.color;
				let i = this.count;
				while ( i-- ) {
					if ( this.starsEnabled[ i ] ) {
						context.fillRect( this.starsNewX[ i ], this.starsNewY[ i ] - (this.starsLineWidth[ i ] / 2), this.starsOldX[ i ] - this.starsNewX[ i ], this.starsLineWidth[ i ] );
					}
				}
			}
			else {
				context.strokeStyle = this.color;
				let lw = 4, i;
				while ( --lw ) {
					context.beginPath();
					context.lineWidth = lw;
					i = this.count;
					while ( i-- ) {
						if ( this.starsEnabled[ i ] && this.starsLineWidth[ i ] === lw ) {
							context.moveTo( this.starsOldX[ i ], this.starsOldY[ i ] );
							context.lineTo( this.starsNewX[ i ], this.starsNewY[ i ] );
						}
					}
					context.stroke();
					context.closePath();
				}
			}
		}
	};
}
