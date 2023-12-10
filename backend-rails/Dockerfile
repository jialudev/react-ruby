# syntax = docker/dockerfile:1

# 使用 Ruby 3.2.2 镜像
FROM registry.docker.com/library/ruby:3.2.2-slim as base

# 设置工作目录
WORKDIR /rails

# 设置环境变量
ENV RAILS_ENV="production" \
    BUNDLE_DEPLOYMENT="1" \
    BUNDLE_PATH="/usr/local/bundle" \
    BUNDLE_WITHOUT="development"

# 安装运行时依赖
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y curl libsqlite3-0 libvips && \
    rm -rf /var/lib/apt/lists /var/cache/apt/archives

# 复制构建阶段的 artifacts：gems 和应用代码
COPY --from=build /usr/local/bundle /usr/local/bundle
COPY --from=build /rails /rails

# 创建非根用户并设置文件所有者
RUN useradd rails --create-home --shell /bin/bash && \
    chown -R rails:rails db log storage tmp

# 切换到非根用户
USER rails:rails

# 启动 Rails 服务器
CMD ["./bin/rails", "server", "-b", "0.0.0.0"]
