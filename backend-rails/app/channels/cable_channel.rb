class CableChannel < ApplicationCable::Channel
  $dataarr = []
  $num = 1  # 实例变量，在整个实例的生命周期内有效
  $time = 300

  def actionfun
    if $time < 0
      ActionCable.server.broadcast("CableChannel", { message: "Hello, React!", type: "add_line", data: $dataarr })
      return
    end
    sleep(1)
    $time = $time - 1
    $num += 10
    $dataarr = $dataarr + [$num, $num + 3, $num - 4]
    ActionCable.server.broadcast("CableChannel", { message: "Hello, React!", type: "add_line", data: $dataarr })
    actionfun()
  end

  def subscribed
    stream_from "CableChannel"
    puts "==CableChannel subscribed"
    # 连接以后开始发消息
    actionfun()
  end

  def receive(data)
    puts "=========CableChannel receive"
    puts "-----------------------------"
    #  datalist = data["data"]
    # ActionCable.server.broadcast("CableChannel", data)
    begin
      if data["action"] == "receive" && data.is_a?(Hash) && data.key?("data") && data["data"].size < 100
        # actionfun(data["data"])
      end
    rescue ZeroDivisionError => e
      # 在这里处理捕获到的异常
      puts "Error: #{e.message}"
    ensure
      # 无论是否发生异常，ensure中的代码都会执行
      puts "Ensure block always runs"
    end
  end

  def unsubscribed
    puts "==CableChannel unsubscribed"
    # Any cleanup needed when channel is unsubscribed
  end
end
