package com.klu.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.klu.service.CalcService;

@RestController
@RequestMapping("/calculator")
public class CalcController {

    @Autowired
    private CalcService service;

    // ADDITION - RequestParam
    // URL: http://localhost:8080/calculator/add?a=10&b=5
    @RequestMapping("/add")
    public int add(@RequestParam int a, @RequestParam int b) {
        return service.add(a, b);
    }

    // SUBTRACTION - PathVariable
    // URL: http://localhost:8080/calculator/subtract/20/5
    @RequestMapping("/subtract/{a}/{b}")
    public int subtract(@PathVariable int a, @PathVariable int b) {
        return service.subtract(a, b);
    }

    // MULTIPLICATION - RequestParam
    // URL: http://localhost:8080/calculator/multiply?a=6&b=2
    @RequestMapping("/multiply")
    public int multiply(@RequestParam int a, @RequestParam int b) {
        return service.multiply(a, b);
    }

    // DIVISION - PathVariable
    // URL: http://localhost:8080/calculator/division/4/2
    @RequestMapping("/division/{a}/{b}")
    public double division(@PathVariable int a, @PathVariable int b) {
        return service.division(a, b);
    }

    // MODULUS - PathVariable
    // URL: http://localhost:8080/calculator/modulus/6/4
    @RequestMapping("/modulus/{a}/{b}")
    public int modulus(@PathVariable int a, @PathVariable int b) {
        return service.modulus(a, b);
    }
}
