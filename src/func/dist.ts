export default function dist(x1:number,y1:number,x2:number,y2:number):number {
	x1=x1-x2;
	y1=y1-y2;
	return Math.sqrt(x1*x1 + y1*y1);
}
