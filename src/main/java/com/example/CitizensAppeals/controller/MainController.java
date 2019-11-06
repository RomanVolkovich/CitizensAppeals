package com.example.CitizensAppeals.controller;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.User;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.HashMap;

@Controller
@RequestMapping("/")
public class MainController {

    @GetMapping
    public String main (Model model, @AuthenticationPrincipal User user){
        HashMap<Object, Object> data = new HashMap<>();

        data.put("profile", null);
        data.put("appeals", null);

        model.addAttribute("frontendData", data);
        return "index";
    }
}
