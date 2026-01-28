package com.klu.controller;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
@RestController
public class DemoController {
 
 @GetMapping("/hello")
           public String sayHello() {
            return "Spring Boot Demo Application";
           }
}