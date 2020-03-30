package com.example.demo.controller;

import com.example.demo.pojo.ActionResult;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.Map;

@RestController
@RequestMapping("/axios")
public class axiosController {
    protected static final Logger logger = LoggerFactory.getLogger(axiosController.class);

    @PostMapping("/test")
    public ActionResult post(@RequestBody Map params){
        ActionResult result = new ActionResult(true,"POST请求成功");


        return result;
    }

    @GetMapping("/test")
    public ActionResult get(String id){
        ActionResult result = new ActionResult(true,"GET请求成功");


        return result;
    }

    @PutMapping("/test")
    public ActionResult put(Map params){
        ActionResult result = new ActionResult(true,"PUT请求成功");


        return result;
    }

    @DeleteMapping("/test")
    public ActionResult delete(@RequestBody Map params, String id, HttpServletRequest request){
        ActionResult result = new ActionResult(true,"DELETE请求成功");

        logger.info(request.getHeader("token"));
        try {
            throw new Exception("错误");
            //Thread.sleep(10000);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return result;
    }

}
