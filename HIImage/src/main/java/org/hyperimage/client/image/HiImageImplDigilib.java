package org.hyperimage.client.image;

import java.awt.Dimension;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.logging.Level;
import java.util.logging.Logger;

import org.imgscalr.Scalr;
import org.imgscalr.Scalr.Mode;

public class HiImageImplDigilib extends HiImageAbstract {
	
	private static final Logger logger = Logger.getLogger(HiImageImplDigilib.class.getName());
	private static HiImageImplDigilib hiImageImpl;
	
	private HiImageImplDigilib() {
		
	}
	
	public static HiImageImplDigilib getInstance() {
		if (hiImageImpl == null) {
			synchronized (HiImageImplDigilib.class) {
				if (hiImageImpl == null) {
					hiImageImpl = new HiImageImplDigilib();
				}
			}
		}
		return hiImageImpl;
	}

	public BufferedImage scaleImage(BufferedImage image, Dimension dimension, String repositoryID) {
		logger.info("Scaling image to " + dimension);
		if (repositoryID == null) {
			logger.warning("No repositoryID provided. Trying to scale locally.");
			return Scalr.resize(image, Scalr.Method.AUTOMATIC, Mode.FIT_EXACT, dimension.width, dimension.height);
		} else {
			try {
				String restPath = repositoryID + "&dw=" + dimension.width + "&dh=" + dimension.height;
				logger.info("Trying to get image from " + restPath);
				URL url = new URL(restPath);
				HttpURLConnection conn = (HttpURLConnection) url.openConnection();
//				conn.setRequestMethod("GET");
//				conn.setRequestProperty("Accept", "image/jpeg");

				if (conn.getResponseCode() != 200) {
					logger.log(Level.SEVERE, "Failed to get data. HTTP error code : " + conn.getResponseCode() + ", " + conn.getResponseMessage());
					throw new HiImageException("Failed to get data. HTTP error code : " + conn.getResponseCode() + ", " + conn.getResponseMessage());
				}

				BufferedImage result = createImageFromStream(conn.getInputStream());
				conn.disconnect();
				return result;

			} catch (MalformedURLException e) {
				logger.log(Level.SEVERE, "Scaling failed", e);
				throw new HiImageException("Scaling failed", e);
			} catch (IOException e) {
				logger.log(Level.SEVERE, "Scaling failed", e);
				throw new HiImageException("Scaling failed", e);
			}
		}
	}

}
