FROM node:lts-slim

RUN npm install -g npm

RUN echo "PS1='\[\033[01;32m\]valawai-docs@dev\[\033[00m\]:\[\033[01;34m\]\w\[\033[00m\] \$ '" >> /root/.bashrc
RUN echo "/app/checkUpdate.sh" >> /root/.bashrc

WORKDIR /app
CMD ["bash"]