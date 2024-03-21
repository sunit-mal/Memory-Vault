package com.spring.notestorebackend.Helper;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Date;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class ExceptionStore {
	private static final Logger logger = LoggerFactory.getLogger(ExceptionStore.class);
	@Value("${log.file.name}")
	private String fileString;

	public <T> void storeFile(Class<T> className, String method, String error) {
		try {
            File file = new File(fileString);
            if (!file.exists()) {
                file.createNewFile(); // Create the file if it doesn't exist
            }
            try (BufferedWriter writer = new BufferedWriter(new FileWriter(file, true))) {
                String formatTest = dateAndTime() + " ERROR --- [notestorebackend] " + className.getName() + " : " + method + " : "
                        + error;
                writer.write(formatTest);
                writer.newLine();
                logger.info("Store error : {}", error);
            } catch (IOException e) {
                logger.error("Error writing to file: {}", e.getMessage());
            }
        } catch (IOException e) {
            logger.error("Error creating file: {}", e.getMessage());
        }
	}

	private String dateAndTime() {
		LocalDateTime dateTime = LocalDateTime.now();
		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
		return dateTime.format(formatter);
	}
}
