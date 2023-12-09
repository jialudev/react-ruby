class DateDataController < ApplicationController
    def date_data
        # 处理获取数据的逻辑，可以从数据库中获取数据等
        data = {code:200, message: 'good',result:{tableData:[['类型1','50%',10,'吨'],['类型1','50%',10,'吨'],['类型2','50%',10,'吨'],['类型3','50%',10,'吨'],['类型4','50%',90,'吨']]} }

        # 将数据转为 JSON 并返回
        render json: data
    end
end