package com.krishagni.catissueplus.core.biospecimen.events;

import java.io.InputStream;

public class SopDocumentDetail {
	private String fileName;

	private InputStream inputStream;

	public String getFileName() {
		return fileName;
	}

	public void setFileName(String fileName) {
		this.fileName = fileName;
	}

	public InputStream getInputStream() {
		return inputStream;
	}

	public void setInputStream(InputStream inputStream) {
		this.inputStream = inputStream;
	}
}
