package com.example.demo.controller;

import com.example.demo.pojo.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.ArrayList;
import java.util.Date;


@Controller
@RequestMapping("/th")
public class ThymeleafController {

    protected static final Logger logger = LoggerFactory.getLogger(ThymeleafController.class);

    @RequestMapping("/index")
    public String index(ModelMap map) {
        map.put("name", "你好thymeleaf");
        return "thymeleaf/index";
    }

    @RequestMapping("/center")
    public String center(ModelMap map) {
        User user = new User("superadmin", "123", 18, new Date(), "<h2 style=\"color: green\">这是描述</h2>");
        User user1 = new User("s2", "123", 18, new Date(), "<h2 style=\"color: green\">这是描述</h2>");
        User user2 = new User("s3", "123", 18, new Date(), "<h2 style=\"color: green\">这是描述</h2>");

        map.put("userList",new ArrayList<User>(){{add(user);add(user1);add(user2);}});
        map.put("user", user);
        return "thymeleaf/center/center";
    }

    @RequestMapping("/postform")
    public String postform(User u){
        logger.info(u.getName());
        return "redirect:/th/center";
    }

}
