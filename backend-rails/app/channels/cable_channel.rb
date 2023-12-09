

class CableChannel < ApplicationCable::Channel
  num=1
  def actionfun(data)
    puts '=========actionfun'
    ActionCable.server.broadcast('CableChannel', { message: 'Hello, React!',type:'add_line',data:[num+1,num+1] })
  end
  def subscribed
    stream_from "CableChannel"
    puts "==CableChannel subscribed"
  end

  def receive(data)
    puts "==CableChannel receive"
    # ActionCable.server.broadcast("CableChannel", data)
    begin
      if data.data.length < 100
        puts data
        actionfun(data)
    end
  end


  def unsubscribed
    puts "==CableChannel unsubscribed"
    # Any cleanup needed when channel is unsubscribed
  end
end
