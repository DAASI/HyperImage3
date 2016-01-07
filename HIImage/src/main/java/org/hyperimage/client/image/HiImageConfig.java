package org.hyperimage.client.image;

public class HiImageConfig {

	private HiImageConfig() {
	}
	
	public static HiImage getHiImage() {
		return HiImageImpl.geitInstance();
	}

}
