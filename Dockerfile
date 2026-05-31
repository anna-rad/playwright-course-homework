FROM mcr.microsoft.com/playwright:v1.58.2-noble

RUN mkdir /app
WORKDIR /app
COPY . /app

RUN npm install --force
RUN npx playwright install

CMD ["npm", "run", "tests-chrome"]