package com.substring.chat.controllers;

import java.time.LocalDateTime;

import com.substring.chat.config.AppConstants;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestBody;

import com.substring.chat.entities.Message;
import com.substring.chat.entities.Room;
import com.substring.chat.payloads.MessageRequest;
import com.substring.chat.repositories.RoomRepository;

@Controller
@CrossOrigin(AppConstants.FRONT_END_BASE_URL)
public class ChatController {


	private RoomRepository roomRepository;
	
	public ChatController(RoomRepository roomRepository) {
		this.roomRepository=roomRepository;
	}
	
	//for sending and receiving messages
	@MessageMapping("/sendMessage/{roomId}") // /app/sendMessage/roomId
	@SendTo("/topic/room/{roomId}")  // subscribe
	public Message sendMessage(
			@DestinationVariable String roomId,
			@RequestBody MessageRequest request) {
		Room room = roomRepository.findByRoomId(request.getRoomId());
		Message message = new Message();
		message.setContent(request.getContent());
		message.setSender(request.getSender());
		message.setTimestamp(LocalDateTime.now());
		
		if(room!=null) {
			room.getMesseges().add(message);
			roomRepository.save(room);
			
		}else {
			throw new RuntimeException("room not found");
		}
		return message;
		
	}
	
}
