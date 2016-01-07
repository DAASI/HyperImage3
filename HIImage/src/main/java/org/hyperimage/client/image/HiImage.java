package org.hyperimage.client.image;

import java.awt.Dimension;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.net.URL;

public interface HiImage {

	public BufferedImage createImageFromStream(InputStream stream);
	
	public BufferedImage createImageFromUrl(URL url);
	
	public BufferedImage scaleImage(BufferedImage image, Dimension dimension);
	
	public BufferedImage scaleImage(BufferedImage image, Float scale);
	
	public ByteArrayOutputStream convertToJpeg(BufferedImage image);
	
}
