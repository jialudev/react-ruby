# syntax = docker/dockerfile:1
# 使用 Ruby 3.1 镜像
FROM ruby:3.2.2

# 设置工作目录
WORKDIR /app

# 设置环境变量
ENV RAILS_ENV="development" \
    BUNDLE_DEPLOYMENT="1" \
    BUNDLE_PATH="/usr/local/bundle" \
    BUNDLE_WITHOUT="development"

# 安装运行时依赖
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y nodejs && \
    rm -rf /var/lib/apt/lists /var/cache/apt/archives

# 复制 Gemfile 和 Gemfile.lock 到容器
COPY Gemfile Gemfile.lock ./

# 安装 Gems
RUN bundle install

# 复制应用程序代码到容器
COPY . .

# 创建非根用户并设置文件所有者
RUN useradd rails --create-home --shell /bin/bash && \
    chown -R rails:rails /app

# 切换到非根用户
USER rails:rails

# 启动 Rails 服务器
CMD ["bundle", "exec", "rails", "server", "-b", "0.0.0.0", "-p", "13000"]

