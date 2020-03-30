package com.example.demo.pojo;

import java.util.HashMap;

public class ActionResult extends HashMap<String, Object> {
    public ActionResult() {
    }

    public ActionResult(Boolean bool, String msg) {
        this.put("success", bool);
        this.put("msg", msg);
    }

    public ActionResult(String msg) {
        this.put("success", true);
        this.put("msg", msg);
    }

    public void setSuccess(Boolean bool) {
        this.put("success", bool);
    }

    public Boolean getSuccess() {
        Boolean success = (Boolean) this.get("success");
        if (success == null) {
            return false;
        }
        return success;
    }

    public void setMsg(String msg) {
        this.put("msg", msg);
    }
}
