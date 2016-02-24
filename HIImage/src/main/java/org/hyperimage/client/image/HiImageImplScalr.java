package org.hyperimage.client.image;

import java.awt.Dimension;
import java.awt.image.BufferedImage;
import java.util.logging.Logger;

import org.imgscalr.Scalr;
import org.imgscalr.Scalr.Mode;

public class HiImageImplScalr extends HiImageAbstract {
	
	private static final Logger logger = Logger.getLogger(HiImageImplScalr.class.getName());
	private static HiImageImplScalr hiImageImpl;
	
	private HiImageImplScalr() {
		
	}
	
	public static HiImageImplScalr getInstance() {
		if (hiImageImpl == null) {
			synchronized (HiImageImplScalr.class) {
				if (hiImageImpl == null) {
					hiImageImpl = new HiImageImplScalr();
				}
			}
		}
		return hiImageImpl;
	}

	public BufferedImage scaleImage(BufferedImage image, Dimension dimension, String repositoryID) {
		logger.info("Scaling image to " + dimension);
		return Scalr.resize(image, Scalr.Method.AUTOMATIC, Mode.AUTOMATIC, dimension.width, dimension.height);
	}

}
