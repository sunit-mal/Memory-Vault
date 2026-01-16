package com.spring.notestorebackend;

import org.modelmapper.ModelMapper;
import org.modelmapper.convention.MatchingStrategies;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class NotestorebackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(NotestorebackendApplication.class, args);
	}

	@Bean
	public ModelMapper modelMapper() {
		ModelMapper modelMapper = new ModelMapper();
		modelMapper.getConfiguration()
				.setMatchingStrategy(MatchingStrategies.STRICT)
				.setAmbiguityIgnored(true);

		return modelMapper;
	}

	@Bean
	public org.springframework.web.servlet.config.annotation.WebMvcConfigurer webMvcConfigurer() {
		return new org.springframework.web.servlet.config.annotation.WebMvcConfigurer() {
			@Override
			public void addResourceHandlers(
					org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry registry) {
				registry.addResourceHandler("/media/**")
						.addResourceLocations("file:./media/");
			}
		};
	}

}
