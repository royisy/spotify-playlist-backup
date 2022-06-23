FROM node:18-alpine

WORKDIR /app

RUN npm install -g @google/clasp
RUN npm install @types/google-apps-script

CMD ["node"]
