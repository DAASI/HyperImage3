package org.hyperimage.client.image;

import java.awt.Dimension;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.net.URL;

public interface HiImage {

	public BufferedImage createImageFromStream(InputStream stream);
	
	public BufferedImage createImageFromStream(InputStream stream, String mimeType);
	
	public BufferedImage createImageFromUrl(URL url);
	
	public BufferedImage scaleImage(BufferedImage image, Dimension dimension, String repositoryID);
	
	public BufferedImage scaleImage(BufferedImage image, Float scale, String repositoryID);
	
	public ByteArrayOutputStream convertToStream(BufferedImage image);
	
}
