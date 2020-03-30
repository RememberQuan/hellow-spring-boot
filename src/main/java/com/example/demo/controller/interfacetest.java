package com.example.demo.controller;

import com.example.demo.pojo.ActionResult;
import com.example.demo.pojo.Resource;
import com.example.demo.pojo.User;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Date;

@RestController
@RequestMapping("/test")
public class interfacetest {

    @Autowired
    private Resource resource;

    @RequestMapping("/hello")
    public ActionResult hello() {
        ActionResult result = new ActionResult(true, "查询成功");

        try {
            User user = new User("s1", "123", 18, new Date(), null);
            result.put("data", user);
        } catch (Exception e) {
            return new ActionResult(false, "查询失败,失败原因: " + e);
        }

        return result;
    }

    @RequestMapping("/getResource")
    public ActionResult getResource() {
        ActionResult result = new ActionResult(true, "查询成功");

        try {
            Resource bean = new Resource();
            BeanUtils.copyProperties(resource, bean);
            result.put("data", bean);
        } catch (Exception e) {
            return new ActionResult(false, "查询失败,失败原因: " + e);
        }

        return result;
    }

}
