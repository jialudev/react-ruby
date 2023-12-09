# app/controllers/api_controller.rb
class ApiController < ApplicationController
    def get_data
      # 处理获取数据的逻辑，可以从数据库中获取数据等
      data = {code:200, message: 'good',result:[1,2,4] }
  
      # 将数据转为 JSON 并返回
      render json: data
    end
  end
  