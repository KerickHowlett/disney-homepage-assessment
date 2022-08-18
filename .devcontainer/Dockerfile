ARG VARIANT=18-bullseye
FROM mcr.microsoft.com/vscode/devcontainers/javascript-node:0-${VARIANT}

ARG NODE_OPTIONS="--max_old_space_size=20480"
ENV NODE_OPTIONS ${NODE_OPTIONS}

ARG EXTRA_NODE_VERSION=18
ARG NODE_MODULES="npm@latest pnpm@latest yarn@latest"
RUN su node -c "source /usr/local/share/nvm/nvm.sh && nvm install ${EXTRA_NODE_VERSION}" \
    su node -c "umask 0002 && npm install -g ${NODE_MODULES}" \
    && npm cache clean --force > /dev/null 2>&1
