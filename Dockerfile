FROM elixir:1.3.4

ENV DEBIAN_FRONTEND=noninteractive

# Install hex
RUN mix local.hex --force

# Install rebar
RUN mix local.rebar --force

# Install the Phoenix framework itself
RUN mix archive.install --force https://github.com/phoenixframework/archives/raw/master/phoenix_new.ez

# Install NodeJS 6.x and the NPM
RUN curl -sL https://deb.nodesource.com/setup_6.x | bash -
RUN apt-get install -y -q nodejs

COPY . /app

# Not needed if you build locally into priv/static
# WORKDIR /app/client
# RUN npm install
# RUN npm run build

# Set /app as workdir
WORKDIR /app

RUN mix deps.get
RUN mix compile

CMD mix phoenix.server
