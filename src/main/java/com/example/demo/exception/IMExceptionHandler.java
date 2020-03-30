package com.example.demo.exception;

import com.example.demo.pojo.ActionResult;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/*@ControllerAdvice*/
public class IMExceptionHandler {

    public static final String ERROR_VIEW = "thymeleaf/error";

    /*@ExceptionHandler(value = Exception.class)*/
    public Object errorHandler(HttpServletRequest request, HttpServletResponse response, Exception e) {

        e.printStackTrace();

        if(isAjax(request)){
            return new ActionResult(false,"发生错误,错误信息为：" + e.getMessage());
        }else{
            ModelAndView mav = new ModelAndView();
            mav.addObject("exception",e);
            mav.addObject("url",request.getRequestURI());
            mav.setViewName(ERROR_VIEW);

            return mav;
        }
    }

    public static boolean isAjax(HttpServletRequest request){
        return (request.getHeader("X-Requested-With") !=null && "XMLHttpRequest".equals(request.getHeader("X-Requested-With").toString()));
    }

}
