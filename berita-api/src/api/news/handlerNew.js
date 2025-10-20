import NewsService from "../../services/NewsService.js";
import newsValidator from "../../validator/newsValidator/newValidator.js";
const service = new NewsService();

export const postNewsHandler = async (req, res) => {
  try {
    newsValidator.validateNews(req.body);
    const filename = req.file.filename;
    const image = filename;
    const userId = req.userId;
    const { title, content } = req.body;
    const idNews = await service.addNews({ title, content, image, userId });
    res.status(201).json({
      status: "success",
      data: {
        idNews,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

export const gateNewsHandler = async (req, res) => {
  try {
    const news = await service.getNews();
    res.status(200).json({
      status: "success",
      data: {
        news,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

export const getNewsByIdHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const news = await service.getNewsById(id);
    res.status(200).json({
      status: "success",
      data: {
        news,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

export const putNewsByIdHandler = async (req, res) => {
  try {
    newsValidator.validateNews(req.body);
    const image = req.file ? req.file.filename : undefined;
    const userId = req.userId;
    const { id } = req.params;
    const { title, content } = req.body;

    await service.editNewsById(id, { title, content, image, userId });

    res.status(200).json({
      status: "success",
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

export const deleteNewsByIdHandler = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;
    const newsId = await service.deleteNewsById(id, { userId });
    res.status(200).json({
      status: "success",
      data: {
        newsId,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};
