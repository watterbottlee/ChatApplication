package com.substring.chat.controllers;

import com.substring.chat.entities.Message;
import com.substring.chat.entities.Room;
import com.substring.chat.repositories.RoomRepository;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/v1/rooms")
@CrossOrigin(
		origins="http://localhost:5173",
		allowedHeaders = "*",
methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE})
public class RoomController {

    private RoomRepository roomRepository;

    public RoomController(RoomRepository roomRepository){
        this.roomRepository=roomRepository;
    }
    //create room
    @PostMapping
    public ResponseEntity<?> creteRoom(@RequestBody String roomId){
        if(roomRepository.findByRoomId(roomId) != null){
            //room is already there.
            return ResponseEntity.badRequest().body("room already exists");
        }
        //create new room
        Room room = new Room();
        room.setRoomId(roomId);

        Room savedRoom = roomRepository.save(room);
        return ResponseEntity.status(HttpStatus.CREATED).body(room);

        }
    @GetMapping("/{roomId}")
    public ResponseEntity<?> joinRoom(@PathVariable String roomId){
    	Room room = roomRepository.findByRoomId(roomId);
    	if(room==null) {
    		return ResponseEntity.badRequest().body("room not found");
    	}
    	return ResponseEntity.ok(room);
    }
    //get messages of room
    @GetMapping("/{roomId}/messages")
    public ResponseEntity<List<Message>> getMessages(
    		@PathVariable String roomId,
    		@RequestParam(value="page",defaultValue	="0", required = false) int page,
    		@RequestParam(value="size",defaultValue ="20", required = false) int size){
    	Room room = roomRepository.findByRoomId(roomId);
    	if(room == null) {
    		return ResponseEntity.badRequest().build();
    	}
    	//get messages:
    	//pagination
    	List<Message> messages	= room.getMesseges();
    	int start=Math.max(0, messages.size()-(page+1)*size);
    	int end =Math.min(messages.size(), start+size);
    	
    	List<Message> paginatedMessages=messages.subList(start,end);
    	return ResponseEntity.ok(paginatedMessages);
    		
    }
    		
    

}
