package com.example.CitizensAppeals.domain;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.ToString;

import javax.persistence.*;

@Entity
@Getter
@Table(name = "Category")
@ToString(of = {"id", "textCategory"})
@EqualsAndHashCode(of = {"id"})
public class CategoryAppeals {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(updatable = false)
    private long id;

    @Column(updatable = false)
    private String textCategory;

    public String getTextCategory() {
        return textCategory;
    }
}