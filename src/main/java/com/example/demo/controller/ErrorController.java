package com.example.demo.controller;

import com.example.demo.pojo.ActionResult;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequestMapping("/err")
public class ErrorController {

    @RequestMapping("/error")
    public String error() {

        int a = 1 / 0;

        return "thymeleaf/error";
    }

    @RequestMapping("/errorAjax")
    public String errorAjax() {
        return "thymeleaf/ajaxRe";
    }

    @RequestMapping("/getAjaxerror")
    @ResponseBody
    public ActionResult getAjaxerror() {
        ActionResult result = new ActionResult(true,"查询成功");

        try {
            int i = 1/0;
        }catch (Exception e){
            e.printStackTrace();
            result = new ActionResult(false,e.getMessage());
        }

        return result;
    }


}
