const express = require("express");
const cors = require("cors");
const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.status(200).json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  const newRepository = {
    title,
    url,
    techs,
    id: uuid(),
    likes: 0
  }
  repositories.push(newRepository);
  return response.status(200).json(newRepository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repositoryIndex = repositories.findIndex(repo => repo.id == id);

  if (repositoryIndex === -1) {
    return response.status(400).json({ message: "Repository not found" });
  }
  const updatedRepository = { ...repositories[repositoryIndex], title, url, techs }
  repositories[repositoryIndex] = updatedRepository;
  return response.status(200).json(updatedRepository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const repositoryIndex = repositories.findIndex(repo => repo.id == id);
  if (repositoryIndex === -1) {
    return response.status(400).json({ message: "Repository not found" });
  }
  repositories.splice(repositoryIndex, 1);
  return response.status(204).json();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
  const repositoryIndex = repositories.findIndex(repo => repo.id == id);
  if (repositoryIndex === -1) {
    return response.status(400).json({ message: "Repository not found" });
  }
  const updatedRepository = repositories[repositoryIndex];
  updatedRepository.likes++;
  repositories[repositoryIndex] = updatedRepository;
  return response.status(200).json(updatedRepository);
});

module.exports = app;
