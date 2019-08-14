## doclerchat

### Docker containers and microservice details

-  **doclerchat_io_node** 
	- Web application to serve websocket chat and frontend client
	- ***Language:** EcmaScript6*
	- ***Techs:** Node + SocketIO + ExpressJS + Mongoose*

-  **doclerchat_mongo** 
	- Database to save chat conversations
	- ***Works with:** ./db/*
	- ***Techs:** MongoDB*

-  **public** 
	- Frontend part
	- ***Works with:** ./public/*
	- ***Techs:** VueJS, Bootstrap4*

---

### Setting up and running
#### Docker build and init containers
```docker-compose up```

*This may take a bit, regarding dependencies downloading, etc.*

*If you found some issues related to node dependencies, try to run `npm install` outside docker*

#### Navigate
*Once containers are running, enter*
```http://localhost:6860```
