package org.hyperimage.client.xmlimportexport;

import java.util.ArrayList;
import java.util.List;

import org.apache.batik.parser.ParseException;
import org.apache.batik.parser.PathHandler;

public class SVGPathHandler implements PathHandler {
	
	private class Point {
		
		private float x;
		private float y;
		
		public Point(float x, float y) {
			
		}

		public Point(Point point) {
			this.x = point.getX();
			this.y = point.getY();
		}

		public float getX() {
			return x;
		}

		public float getY() {
			return y;
		}

		public void setLocation(float x, float y) {
			this.x = x;
			this.y = y;
		}

		@Override
		public String toString() {
			return " " + x + "," + y;
		}
		
	}
	
	Point lastPoint;
	
	List<Point> points = new ArrayList<Point>();


	public String getSimplifiedPath() {
		String path = "M";
		
		for (Point point : points) {
			path += point;
		}
		
		path += " z";
		
		return path;
	}
	
	@Override
	public void startPath() throws ParseException {
		lastPoint = new Point(0, 0);
		points = new ArrayList<Point>();
	}

	@Override
	public void endPath() throws ParseException {
	}

	@Override
	public void movetoRel(float x, float y) throws ParseException {
		lastPoint.setLocation(lastPoint.getX() + x, lastPoint.getY() + y);
		points.add(new Point(lastPoint));
	}

	@Override
	public void movetoAbs(float x, float y) throws ParseException {
		lastPoint.setLocation(x, y);
		points.add(new Point(lastPoint));
	}

	@Override
	public void closePath() throws ParseException {
	}

	@Override
	public void linetoRel(float x, float y) throws ParseException {
		lastPoint.setLocation(lastPoint.getX() + x, lastPoint.getY() + y);
		points.add(new Point(lastPoint));
	}

	@Override
	public void linetoAbs(float x, float y) throws ParseException {
		lastPoint.setLocation(x, y);
		points.add(new Point(lastPoint));
	}

	@Override
	public void linetoHorizontalRel(float x) throws ParseException {
		lastPoint.setLocation(lastPoint.getX() + x, lastPoint.getY());
		points.add(new Point(lastPoint));
	}

	@Override
	public void linetoHorizontalAbs(float x) throws ParseException {
		lastPoint.setLocation(x, lastPoint.getY());
		points.add(new Point(lastPoint));
	}

	@Override
	public void linetoVerticalRel(float y) throws ParseException {
		lastPoint.setLocation(lastPoint.getX(), lastPoint.getY() + y);
		points.add(new Point(lastPoint));
	}

	@Override
	public void linetoVerticalAbs(float y) throws ParseException {
		lastPoint.setLocation(lastPoint.getX(), y);
		points.add(new Point(lastPoint));
	}

	@Override
	public void curvetoCubicRel(float x1, float y1, float x2, float y2, float x, float y) throws ParseException {
//		throw new ParseException("Unsupported command curvetoCubicRel found.", null);
		lastPoint.setLocation(lastPoint.getX() + x, lastPoint.getY() + y);
		points.add(new Point(lastPoint));
	}

	@Override
	public void curvetoCubicAbs(float x1, float y1, float x2, float y2, float x, float y) throws ParseException {
//		throw new ParseException("Unsupported command curvetoCubicAbs found.", null);
		lastPoint.setLocation(x, y);
		points.add(new Point(lastPoint));
	}

	@Override
	public void curvetoCubicSmoothRel(float x2, float y2, float x, float y) throws ParseException {
//		throw new ParseException("Unsupported command curvetoCubicSmoothRel found.", null);
		lastPoint.setLocation(lastPoint.getX() + x, lastPoint.getY() + y);
		points.add(new Point(lastPoint));
	}

	@Override
	public void curvetoCubicSmoothAbs(float x2, float y2, float x, float y) throws ParseException {
//		throw new ParseException("Unsupported command curvetoCubicSmoothAbs found.", null);
		lastPoint.setLocation(x, y);
		points.add(new Point(lastPoint));
	}

	@Override
	public void curvetoQuadraticRel(float x1, float y1, float x, float y) throws ParseException {
//		throw new ParseException("Unsupported command curvetoQuadraticRel found.", null);
		lastPoint.setLocation(lastPoint.getX() + x, lastPoint.getY() + y);
		points.add(new Point(lastPoint));
	}

	@Override
	public void curvetoQuadraticAbs(float x1, float y1, float x, float y) throws ParseException {
//		throw new ParseException("Unsupported command curvetoQuadraticAbs found.", null);
		lastPoint.setLocation(x, y);
		points.add(new Point(lastPoint));
	}

	@Override
	public void curvetoQuadraticSmoothRel(float x, float y) throws ParseException {
		lastPoint.setLocation(lastPoint.getX() + x, lastPoint.getY() + y);
		points.add(new Point(lastPoint));
	}

	@Override
	public void curvetoQuadraticSmoothAbs(float x, float y) throws ParseException {
		lastPoint.setLocation(x, y);
		points.add(new Point(lastPoint));
	}

	@Override
	public void arcRel(float rx, float ry, float xAxisRotation, boolean largeArcFlag, boolean sweepFlag, float x,
			float y) throws ParseException {
//		throw new ParseException("Unsupported command arcRel found.", null);
		lastPoint.setLocation(lastPoint.getX() + x, lastPoint.getY() + y);
		points.add(new Point(lastPoint));
	}

	@Override
	public void arcAbs(float rx, float ry, float xAxisRotation, boolean largeArcFlag, boolean sweepFlag, float x,
			float y) throws ParseException {
//		throw new ParseException("Unsupported command arcAbs found.", null);
		lastPoint.setLocation(x, y);
		points.add(new Point(lastPoint));
	}

}
