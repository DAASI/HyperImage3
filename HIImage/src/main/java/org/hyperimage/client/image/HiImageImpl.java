package org.hyperimage.client.image;

import java.awt.Dimension;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.imageio.ImageIO;

import org.imgscalr.Scalr;
import org.imgscalr.Scalr.Mode;

public class HiImageImpl implements HiImage {
	
	private static final Logger logger = Logger.getLogger(HiImageImpl.class.getName());
	private static HiImageImpl hiImageImpl;
	
	private HiImageImpl() {
		
	}
	
	public static HiImageImpl geitInstance() {
		if (hiImageImpl == null) {
			synchronized (HiImageImpl.class) {
				if (hiImageImpl == null) {
					hiImageImpl = new HiImageImpl();
				}
			}
		}
		return hiImageImpl;
	}

	public BufferedImage createImageFromStream(InputStream stream) {
		logger.info("Ctreating image from stream");
		try {
			return ImageIO.read(stream) ;
		} catch (IOException e) {
			logger.log(Level.SEVERE, "Ctreating image from stream failed", e);
			throw new HiImageException(e);
		}
	}

	public BufferedImage createImageFromUrl(URL url) {
		logger.info("Ctreating image from url " + url.toString());
		try {
			return ImageIO.read(url) ;
		} catch (MalformedURLException e) {
			logger.log(Level.SEVERE, "Ctreating image from url failed", e);
			throw new HiImageException(e);
		} catch (IOException e) {
			logger.log(Level.SEVERE, "Ctreating image from url failed", e);
			throw new HiImageException(e);
		}
	}

	public BufferedImage scaleImage(BufferedImage image, Dimension dimension) {
		logger.info("Scaling image to " + dimension);
		return Scalr.resize(image, Scalr.Method.AUTOMATIC, Mode.FIT_EXACT, dimension.width, dimension.height);
	}

	public BufferedImage scaleImage(BufferedImage image, Float scale) 
	{
		// sanity check
		if ( image == null ) {
			return null;
		}

		if ( scale == 1f  || scale == 0f ) {
			return image;
		}

		return scaleImage(image, new Dimension(Math.round(image.getWidth() * scale), Math.round(image.getHeight() * scale)));
	}

	public ByteArrayOutputStream convertToJpeg(BufferedImage image) {
		logger.info("Converting to Jpeg");
		ByteArrayOutputStream baos = new ByteArrayOutputStream();
		try {
			ImageIO.write(image, "jpg", baos);
			baos.flush();
			return baos;
		} catch (IOException e) {
			logger.log(Level.SEVERE, "Converting to Jpeg failed", e);
			throw new HiImageException(e);
		}
	}

}
