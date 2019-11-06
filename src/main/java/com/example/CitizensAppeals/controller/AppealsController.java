package com.example.CitizensAppeals.controller;

import com.example.CitizensAppeals.domain.Appeal;
import com.example.CitizensAppeals.repository.AppealRepository;
import com.example.CitizensAppeals.repository.CategoryAppealsRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("appeal")
public class AppealsController {

    private final AppealRepository appealRepository;

    private final CategoryAppealsRepository categoryAppealsRepository;

    public AppealsController(AppealRepository appealRepository, CategoryAppealsRepository categoryAppealsRepository) {
        this.appealRepository = appealRepository;
        this.categoryAppealsRepository = categoryAppealsRepository;
    }


    @GetMapping
    public List<Appeal> listAppeals(){
        for (Appeal appeal: appealRepository.findAll()){
            String idCategory = appeal.getIdCategory();
            appeal.setIdCategory(categoryAppealsRepository.findById(Long.parseLong(idCategory)).get().getTextCategory());
        }
        return appealRepository.findAll();
    }

    @GetMapping("{id}")
    public Appeal getOne (@PathVariable("id") Appeal appeal){
        return appeal;
    }

    @PostMapping
    public Appeal create (@RequestBody Appeal appeal){
        appeal.setCreationDate(LocalDateTime.now());
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        appeal.setUsername(authentication.getName());
        return appealRepository.save(appeal);
    }

    @PutMapping("{id}")
    public Appeal update (
            @PathVariable("id") Appeal appealFromDB,
            @RequestBody Appeal appeal
    ){
        BeanUtils.copyProperties(appeal, appealFromDB, "id", "creationDate", "username", "category");

        return appealRepository.save(appealFromDB);
    }

    @DeleteMapping("{id}")
    public void delete(@PathVariable("id") Appeal appeal){
        appealRepository.delete(appeal);
    }

}
