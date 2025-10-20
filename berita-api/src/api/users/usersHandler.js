import UsersService from "../../services/UsersService.js";
import usersValidator from "../../validator/usersValidator/usersValidator.js";
const service = new UsersService();

export const postUserHandler = async (req, res) => {
  try {
    usersValidator.usersValidate(req.body);
    const { username, password } = req.body;
    const iduser = await service.addUsers({ username, password });

    res.status(201).json({
      status: "success",
      data: {
        iduser,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

export const LoginUsershandler = async (req, res) => {
  try {
    usersValidator.usersValidate(req.body);
    const { username, password } = req.body;

    const token = await service.loginUsers({ username, password });
    res.cookie("refreshToken", token.refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.status(200).json({
      status: "success",
      data: {
        accessToken: token.accessToken,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

export const refreshTokenHandler = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    const token = await service.refreshToken({ refreshToken });
    res.status(200).json({
      status: "success",
      data: {
        accessToken: token.accessToken,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

export const LogoutUsersHandler = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    await service.logoutUser({ refreshToken });
    res.clearCookie("refresToken");
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
