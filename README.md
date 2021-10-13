
# Signaling server for Nintendo-Switch-Remote-Control

This repository contains the signaling server implementation for my [Switch remote play](https://github.com/javmarina/Nintendo-Switch-Remote-Control) project.

In order to run locally, execute: `node server.js`. You most probably want to deploy this server to a cloud service.

It uses the [Socket.IO](https://socket.io/) library for communication with the WebRTC peers.

What is a signaling server? See [here](https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Signaling_and_video_calling#the_signaling_server).
