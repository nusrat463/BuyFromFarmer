package com.jwt.implementation.config;

import edu.stanford.nlp.pipeline.*;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Properties;

@Configuration
public class StanfordNLPConfig {

  @Bean
  public StanfordCoreNLP stanfordCoreNLP() {
    Properties props = new Properties();
    props.setProperty("annotators", "tokenize,ssplit,pos,lemma,ner,parse,sentiment");
    return new StanfordCoreNLP(props); // models auto-loaded from classpath
  }
}

