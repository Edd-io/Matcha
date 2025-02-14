class Ws
{
	private socket: any;

	constructor()
	{
		this.socket = new WebSocket("/ws");

		this.socket.onopen = function()
		{
			console.log("Connection established");
			this.socket.send("Hello");
		};

		this.socket.onmessage = function(event)
		{
			console.log("Message received: " + event.data);
		};

		this.socket.onclose = function()
		{
			console.log("Connection closed");
		};

		this.socket.onerror = function()
		{
			console.log("Error");
		};

	}
}

export default Ws;