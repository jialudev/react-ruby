class ArticlesController < ApplicationController
  def articles
    puts '===== test'
    # CableChannel.broadcast_to("CableChannel", message: "Hello, WebSocket!")
    ActionCable.server.broadcast('CableChannel', { message: 'Hello, client!' })
    # 将数据转为 JSON 并返回
    render json: 123
  end
end
