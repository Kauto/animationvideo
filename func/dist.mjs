export default function dist(x1,y1,x2,y2) {
	x1=x1-x2;
	y1=y1-y2;
	return Math.sqrt(x1*x1 + y1*y1);
}
