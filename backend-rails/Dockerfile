# syntax = docker/dockerfile:1

# 第一个阶段：构建依赖
FROM registry.docker.com/library/ruby:3.2.2-slim as builder

# 设置工作目录
WORKDIR /rails

# 设置环境变量
ENV RAILS_ENV="production" \
    BUNDLE_DEPLOYMENT="1" \
    BUNDLE_PATH="/usr/local/bundle" \
    BUNDLE_WITHOUT="development"

# 安装构建时的依赖（例如 node、yarn 等）
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y curl libsqlite3-0 libvips && \
    rm -rf /var/lib/apt/lists /var/cache/apt/archives

# 其他构建步骤，比如 bundle install、assets 编译等

# 第二个阶段：最终镜像
ARG RUBY_VERSION=3.2.2
FROM registry.docker.com/library/ruby:${RUBY_VERSION}-slim as base

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
COPY --from=builder /usr/local/bundle /usr/local/bundle
COPY . /rails

# 创建非根用户并设置文件所有者
RUN useradd rails --create-home --shell /bin/bash && \
    chown -R rails:rails db log storage tmp

# 切换到非根用户
USER rails:rails

# 启动 Rails 服务器
CMD ["./bin/rails", "server", "-b", "0.0.0.0"]
