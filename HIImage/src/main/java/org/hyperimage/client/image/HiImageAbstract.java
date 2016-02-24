package org.hyperimage.client.image;

import java.awt.Color;
import java.awt.Dimension;
import java.awt.Font;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.imageio.IIOException;
import javax.imageio.ImageIO;

import org.apache.batik.transcoder.Transcoder;
import org.apache.batik.transcoder.TranscoderException;
import org.apache.batik.transcoder.TranscoderInput;
import org.apache.batik.transcoder.TranscoderOutput;
import org.apache.batik.transcoder.image.JPEGTranscoder;
import org.apache.batik.transcoder.image.PNGTranscoder;

public abstract class HiImageAbstract implements HiImage {
	
	private static final Logger logger = Logger.getLogger(HiImageAbstract.class.getName());

	public BufferedImage createImageFromStream(InputStream stream) {
		logger.info("Ctreating image from stream");
		try {
			BufferedImage image = ImageIO.read(stream) ;
			return image;
		} catch (IOException e) {
			logger.log(Level.SEVERE, "Ctreating image from stream failed", e);
			throw new HiImageException("Ctreating image from stream failed", e);
		}
	}

	public BufferedImage createImageFromStream(InputStream stream, String mimeType) {
		if (mimeType != null && mimeType.equalsIgnoreCase("image/svg+xml")) {
			try {
				// Try to convert from SVG
				logger.info("Trying to transcode as SVG document");
				BufferedImage image = transcodeSVGDocument(new TranscoderInput( stream ));
				return image;
			} catch (IOException e) {
				logger.log(Level.SEVERE, "Ctreating image from SVG stream failed", e);
				throw new HiImageException("Ctreating image from SVG stream failed", e);
			} catch (TranscoderException e) {
				logger.log(Level.SEVERE, "Ctreating image from SVG stream failed", e);
				throw new HiImageException("Ctreating image from SVG stream failed", e);
			}
		} else {
			return createImageFromStream(stream);
		}
		
	}

	public BufferedImage createImageFromUrl(URL url) {
		logger.info("Ctreating image from url " + url.toString());
		try {
			BufferedImage image = ImageIO.read(url) ;
			
			if (image == null) {
				// Try to convert from SVG
				image = transcodeSVGDocument(new TranscoderInput( url.toString()));
			}
			return image;
		} catch (MalformedURLException e) {
			logger.log(Level.SEVERE, "Ctreating image from url failed", e);
			throw new HiImageException("Ctreating image from url failed", e);
		} catch (IOException e) {
			logger.log(Level.SEVERE, "Ctreating image from url failed", e);
			throw new HiImageException("Ctreating image from url failed", e);
		} catch (TranscoderException e) {
			logger.log(Level.SEVERE, "Ctreating image from url failed", e);
			throw new HiImageException("Ctreating image from url failed", e);
		}
	}

	private static BufferedImage transcodeSVGDocument( TranscoderInput input ) throws TranscoderException, IOException {
	    // Create a PNG transcoder.
	    Transcoder t = new JPEGTranscoder();

//	    // Set the transcoding hints.
//	    t.addTranscodingHint( PNGTranscoder.KEY_WIDTH,  new Float(x) );
//	    t.addTranscodingHint( PNGTranscoder.KEY_HEIGHT, new Float(y) );
	    
	    // Set the transcoding hints.
	    t.addTranscodingHint(JPEGTranscoder.KEY_QUALITY, new Float(.8));
//	    t.addTranscodingHint(PNGTranscoder.KEY_BACKGROUND_COLOR, Color.WHITE);
//	    t.addTranscodingHint(PNGTranscoder.KEY_FORCE_TRANSPARENT_WHITE, Boolean.TRUE);

	    ByteArrayOutputStream ostream = null;
        // Create the transcoder output.
        ostream = new ByteArrayOutputStream();
        TranscoderOutput output = new TranscoderOutput( ostream );

        // Save the image.
        t.transcode( input, output );

        // Flush and close the stream.
        ostream.flush();
        ostream.close();
	    
	    return ImageIO.read(new ByteArrayInputStream(ostream.toByteArray()));
	}
	
	public BufferedImage scaleImage(BufferedImage image, Float scale, String repositoryID) 
	{
		// sanity check
		if ( image == null ) {
			return null;
		}

		if ( scale == 1f  || scale == 0f ) {
			return image;
		}

		return scaleImage(image, new Dimension(Math.round(image.getWidth() * scale), Math.round(image.getHeight() * scale)), repositoryID);
	}

	public ByteArrayOutputStream convertToStream(BufferedImage image) {
		logger.info("Converting to stream");
		ByteArrayOutputStream baos = new ByteArrayOutputStream();
		try {
			ImageIO.write(image, "jpg", baos);
			baos.flush();
			return baos;
		} catch (IIOException e) {
			try {
				ImageIO.write(image, "png", baos);
				baos.flush();
				return baos;
			} catch (IOException e1) {
				logger.log(Level.SEVERE, "Converting to png failed", e);
				throw new HiImageException("Converting to png failed", e);
			}
		} catch (IOException e) {
			logger.log(Level.SEVERE, "Converting to Jpeg failed", e);
			throw new HiImageException("Converting to Jpeg failed", e);
		}
	}

}
