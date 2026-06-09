package com.erp.system.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class WebController {

    @GetMapping("/login")
    public String login() {
        return "login";
    }

    @GetMapping("/")
    public String index() {
        return "redirect:/dashboard";
    }

    @GetMapping("/dashboard")
    public String dashboard() {
        return "dashboard";
    }

    @GetMapping("/products")
    public String products() {
        return "products/list";
    }

    @GetMapping("/customers")
    public String customers() {
        return "customers/list";
    }

    @GetMapping("/suppliers")
    public String suppliers() {
        return "suppliers/list";
    }

    @GetMapping("/sales")
    public String sales() {
        return "sales/list";
    }

    @GetMapping("/purchase")
    public String purchase() {
        return "purchase/list";
    }

    @GetMapping("/grn")
    public String grn() {
        return "grn/list";
    }

    @GetMapping("/invoices")
    public String invoices() {
        return "invoices/list";
    }

    @GetMapping("/reports")
    public String reports() {
        return "reports/summary";
    }
}
