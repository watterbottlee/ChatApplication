package com.substring.chat.entities;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;



@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Message {
    private String sender;
    private String content;
    
    private LocalDateTime timestamp;
    

    public Message(String sender, String content){
        this.sender=sender;
        this.content=content;
        this.timestamp=LocalDateTime.now();
        
    }




}
