package com.example.demo.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

@Controller
public class pageForward {

    private final static String PREFIX_URL = "thymeleaf/Vue/";

    /**
     * 页面跳转
     *
     * @param model
     * @param page
     * @return
     */
    @RequestMapping("/forword/{page}")
    public ModelAndView pageJump(ModelAndView model, @PathVariable String page) {
        model.setViewName(PREFIX_URL + page);
        return model;
    }

}
