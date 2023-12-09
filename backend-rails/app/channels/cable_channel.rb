class CableChannel < ApplicationCable::Channel
  def subscribed
    stream_from "CableChannel"
  end

  def receive(data)
    puts "This is a log message"

    ActionCable.server.broadcast("CableChannel", data)
  end


  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end
end
